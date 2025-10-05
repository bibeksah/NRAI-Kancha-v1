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

    return new Promise((resolve, reject) => {
      // Set voice based on language
      const voiceName = language === "en" ? "en-US-AvaMultilingualNeural" : "ne-NP-HemkalaNeural"
      this.speechConfig!.speechSynthesisVoiceName = voiceName

      const audioConfig = sdk.AudioConfig.fromDefaultSpeakerOutput()
      this.synthesizer = new sdk.SpeechSynthesizer(this.speechConfig!, audioConfig)

      this.synthesizer.speakTextAsync(
        text,
        (result) => {
          if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
            if (onAudioData && result.audioData) {
              onAudioData(result.audioData)
            }
            resolve()
          } else if (result.reason === sdk.ResultReason.Canceled) {
            const cancellation = sdk.CancellationDetails.fromResult(result)
            reject(new Error(`Synthesis canceled: ${cancellation.errorDetails}`))
          }
          this.synthesizer?.close()
          this.synthesizer = null
        },
        (error) => {
          reject(error)
          this.synthesizer?.close()
          this.synthesizer = null
        },
      )
    })
  }

  stopSynthesis() {
    if (this.synthesizer) {
      this.synthesizer.close()
      this.synthesizer = null
    }
  }
}
