import * as sdk from "microsoft-cognitiveservices-speech-sdk"

export type Language = "en" | "ne"

export interface SpeechConfig {
  subscriptionKey?: string
  region?: string
}

export class SpeechService {
  private speechConfig: sdk.SpeechConfig | null = null
  private recognizer: sdk.SpeechRecognizer | null = null
  private synthesizer: sdk.SpeechSynthesizer | null = null
  private region = ""
  private isCurrentlySpeaking = false
  private audioContext: AudioContext | null = null
  private currentAudioSource: AudioBufferSourceNode | null = null

  constructor(config: SpeechConfig) {
    if (config.subscriptionKey && config.region) {
      this.speechConfig = sdk.SpeechConfig.fromSubscription(config.subscriptionKey, config.region)
      this.region = config.region
    }
  }

  updateToken(token: string, region: string) {
    this.speechConfig = sdk.SpeechConfig.fromAuthorizationToken(token, region)
    this.region = region
  }

  // Speech-to-Text (STT)
  async recognizeSpeech(
    language: Language,
    onResult: (text: string) => void,
    onError: (error: string) => void,
  ): Promise<void> {
    if (!this.speechConfig) {
      onError("Speech service not initialized")
      return Promise.reject(new Error("Speech service not initialized"))
    }

    return new Promise((resolve, reject) => {
      // Set language
      const languageCode = language === "en" ? "en-US" : "ne-NP"
      this.speechConfig!.speechRecognitionLanguage = languageCode

      const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput()
      this.recognizer = new sdk.SpeechRecognizer(this.speechConfig!, audioConfig)

      this.recognizer.recognizeOnceAsync(
        (result) => {
          if (result.reason === sdk.ResultReason.RecognizedSpeech) {
            onResult(result.text)
            resolve()
          } else if (result.reason === sdk.ResultReason.NoMatch) {
            onError("No speech could be recognized")
            reject(new Error("No speech recognized"))
          } else if (result.reason === sdk.ResultReason.Canceled) {
            const cancellation = sdk.CancellationDetails.fromResult(result)
            onError(`Recognition canceled: ${cancellation.errorDetails}`)
            reject(new Error(cancellation.errorDetails))
          }
          this.recognizer?.close()
          this.recognizer = null
        },
        (error) => {
          onError(`Recognition error: ${error}`)
          reject(error)
          this.recognizer?.close()
          this.recognizer = null
        },
      )
    })
  }

  stopRecognition() {
    if (this.recognizer) {
      this.recognizer.stopContinuousRecognitionAsync()
      this.recognizer.close()
      this.recognizer = null
    }
  }

  // Text-to-Speech (TTS)
  async synthesizeSpeech(text: string, language: Language, onAudioData?: (audio: ArrayBuffer) => void): Promise<void> {
    if (!this.speechConfig) {
      return Promise.reject(new Error("Speech service not initialized"))
    }

    // Stop any ongoing synthesis
    this.stopSynthesis()

    return new Promise((resolve, reject) => {
      // Set voice based on language
      const voiceName = language === "en" ? "en-US-AvaMultilingualNeural" : "ne-NP-HemkalaNeural"
      this.speechConfig!.speechSynthesisVoiceName = voiceName

      // Create a push audio output stream to prevent auto-playback
      const pushStream = sdk.AudioOutputStream.createPullStream()
      const audioConfig = sdk.AudioConfig.fromStreamOutput(pushStream)
      
      this.synthesizer = new sdk.SpeechSynthesizer(this.speechConfig!, audioConfig)
      this.isCurrentlySpeaking = true

      let hasResolved = false
      let audioDataChunks: Uint8Array[] = []

      this.synthesizer.speakTextAsync(
        text,
        async (result) => {
          if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
            if (onAudioData && result.audioData) {
              onAudioData(result.audioData)
            }
            
            try {
              // Play audio using Web Audio API for better control
              await this.playAudioData(result.audioData)
              
              if (!hasResolved) {
                hasResolved = true
                this.isCurrentlySpeaking = false
                this.synthesizer?.close()
                this.synthesizer = null
                resolve()
              }
            } catch (error) {
              if (!hasResolved) {
                hasResolved = true
                this.isCurrentlySpeaking = false
                this.synthesizer?.close()
                this.synthesizer = null
                reject(error)
              }
            }
            
          } else if (result.reason === sdk.ResultReason.Canceled) {
            const cancellation = sdk.CancellationDetails.fromResult(result)
            if (!hasResolved) {
              hasResolved = true
              this.isCurrentlySpeaking = false
              this.synthesizer?.close()
              this.synthesizer = null
              reject(new Error(`Synthesis canceled: ${cancellation.errorDetails}`))
            }
          }
        },
        (error) => {
          if (!hasResolved) {
            hasResolved = true
            this.isCurrentlySpeaking = false
            this.synthesizer?.close()
            this.synthesizer = null
            reject(error)
          }
        },
      )
    })
  }

  private async playAudioData(audioData: ArrayBuffer): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        // Initialize audio context if needed
        if (!this.audioContext) {
          this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        }

        // Convert raw audio data to proper format
        // Azure TTS returns raw PCM data, we need to convert it
        const wavBuffer = this.addWavHeader(audioData)
        
        this.audioContext.decodeAudioData(
          wavBuffer,
          (audioBuffer) => {
            // Create and play audio source
            this.currentAudioSource = this.audioContext!.createBufferSource()
            this.currentAudioSource.buffer = audioBuffer
            this.currentAudioSource.connect(this.audioContext!.destination)
            
            // Resolve when playback ends
            this.currentAudioSource.onended = () => {
              this.currentAudioSource = null
              resolve()
            }
            
            this.currentAudioSource.start(0)
          },
          (error) => {
            reject(error)
          }
        )
      } catch (error) {
        reject(error)
      }
    })
  }

  private addWavHeader(audioData: ArrayBuffer): ArrayBuffer {
    const wavHeader = new ArrayBuffer(44)
    const view = new DataView(wavHeader)
    
    const sampleRate = 16000 // Azure TTS default
    const numChannels = 1 // Mono
    const bitsPerSample = 16
    const byteRate = sampleRate * numChannels * bitsPerSample / 8
    const blockAlign = numChannels * bitsPerSample / 8
    const dataSize = audioData.byteLength
    
    // "RIFF" chunk descriptor
    view.setUint32(0, 0x52494646, false) // "RIFF"
    view.setUint32(4, 36 + dataSize, true) // File size - 8
    view.setUint32(8, 0x57415645, false) // "WAVE"
    
    // "fmt" sub-chunk
    view.setUint32(12, 0x666d7420, false) // "fmt "
    view.setUint32(16, 16, true) // Subchunk1Size (16 for PCM)
    view.setUint16(20, 1, true) // AudioFormat (1 for PCM)
    view.setUint16(22, numChannels, true) // NumChannels
    view.setUint32(24, sampleRate, true) // SampleRate
    view.setUint32(28, byteRate, true) // ByteRate
    view.setUint16(32, blockAlign, true) // BlockAlign
    view.setUint16(34, bitsPerSample, true) // BitsPerSample
    
    // "data" sub-chunk
    view.setUint32(36, 0x64617461, false) // "data"
    view.setUint32(40, dataSize, true) // Subchunk2Size
    
    // Combine header and audio data
    const wavFile = new Uint8Array(44 + dataSize)
    wavFile.set(new Uint8Array(wavHeader), 0)
    wavFile.set(new Uint8Array(audioData), 44)
    
    return wavFile.buffer
  }

  stopSynthesis() {
    this.isCurrentlySpeaking = false
    
    if (this.currentAudioSource) {
      try {
        this.currentAudioSource.stop()
        this.currentAudioSource.disconnect()
      } catch (e) {
        // Ignore errors if already stopped
      }
      this.currentAudioSource = null
    }
    
    if (this.synthesizer) {
      try {
        this.synthesizer.close()
      } catch (e) {
        // Ignore errors
      }
      this.synthesizer = null
    }
  }

  isSpeaking(): boolean {
    return this.isCurrentlySpeaking
  }
}
