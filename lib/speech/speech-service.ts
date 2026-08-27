import * as sdk from "microsoft-cognitiveservices-speech-sdk"
import { stripMarkdownForSpeech, isNepaliText } from "./audio-helpers"

export type SpeechLanguage = "en" | "ne"

export interface SpeechServiceConfig {
  subscriptionKey?: string
  region?: string
  token?: string
}

export class UnifiedSpeechService {
  private azureConfig: sdk.SpeechConfig | null = null
  private azureRecognizer: sdk.SpeechRecognizer | null = null
  private azureSynthesizer: sdk.SpeechSynthesizer | null = null
  private activeUtterance: SpeechSynthesisUtterance | null = null
  private isSpeakingInternal = false

  constructor(config?: SpeechServiceConfig) {
    if (config?.token && config?.region) {
      this.azureConfig = sdk.SpeechConfig.fromAuthorizationToken(config.token, config.region)
    } else if (config?.subscriptionKey && config?.region) {
      this.azureConfig = sdk.SpeechConfig.fromSubscription(config.subscriptionKey, config.region)
    }
  }

  updateAzureToken(token: string, region: string) {
    this.azureConfig = sdk.SpeechConfig.fromAuthorizationToken(token, region)
  }

  isSpeaking(): boolean {
    return this.isSpeakingInternal || (typeof window !== "undefined" && window.speechSynthesis?.speaking)
  }

  /**
   * Stop all active speech playback
   */
  stopSpeaking() {
    this.isSpeakingInternal = false
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel()
    }
    if (this.azureSynthesizer) {
      try {
        this.azureSynthesizer.close()
        this.azureSynthesizer = null
      } catch (e) {
        // ignore close errors
      }
    }
  }

  /**
   * Text-to-Speech playback with auto language detection & dual Azure/WebSpeech engine
   */
  async speak(
    text: string,
    options?: {
      language?: SpeechLanguage
      rate?: number
      onStart?: () => void
      onEnd?: () => void
      onError?: (err: string) => void
    }
  ): Promise<void> {
    this.stopSpeaking()

    const cleanText = stripMarkdownForSpeech(text)
    if (!cleanText) return

    const detectedLang: SpeechLanguage = options?.language || (isNepaliText(cleanText) ? "ne" : "en")

    // 1. Try Azure Speech if configured
    if (this.azureConfig) {
      try {
        this.isSpeakingInternal = true
        options?.onStart?.()

        const voice = detectedLang === "ne" ? "ne-NP-HemkalaNeural" : "en-US-JennyNeural"
        this.azureConfig.speechSynthesisVoiceName = voice
        this.azureSynthesizer = new sdk.SpeechSynthesizer(this.azureConfig)

        return new Promise((resolve, reject) => {
          this.azureSynthesizer!.speakTextAsync(
            cleanText,
            result => {
              this.isSpeakingInternal = false
              if (result.reason === sdk.ResultReason.SynthesizingAudioCompleted) {
                options?.onEnd?.()
                resolve()
              } else {
                const err = `Azure TTS failed: ${result.errorDetails}`
                options?.onError?.(err)
                // Fallback to Web Speech API
                this.speakViaWebSpeech(cleanText, detectedLang, options).then(resolve).catch(reject)
              }
            },
            err => {
              this.isSpeakingInternal = false
              options?.onError?.(String(err))
              this.speakViaWebSpeech(cleanText, detectedLang, options).then(resolve).catch(reject)
            }
          )
        })
      } catch (e) {
        console.warn("[Speech] Azure TTS initialization failed, falling back to Web Speech API", e)
      }
    }

    // 2. Web Speech API Fallback
    return this.speakViaWebSpeech(cleanText, detectedLang, options)
  }

  private speakViaWebSpeech(
    text: string,
    lang: SpeechLanguage,
    options?: { rate?: number; onStart?: () => void; onEnd?: () => void; onError?: (err: string) => void }
  ): Promise<void> {
    return new Promise((resolve) => {
      if (typeof window === "undefined" || !window.speechSynthesis) {
        options?.onError?.("Speech synthesis is not supported on this browser.")
        resolve()
        return
      }

      window.speechSynthesis.cancel()

      const utterance = new SpeechSynthesisUtterance(text)
      utterance.rate = options?.rate || 1.0
      utterance.lang = lang === "ne" ? "ne-NP" : "en-US"

      // Attempt to pick a matching voice
      const voices = window.speechSynthesis.getVoices()
      const matchingVoice = voices.find(v => v.lang.startsWith(lang === "ne" ? "ne" : "en"))
      if (matchingVoice) {
        utterance.voice = matchingVoice
      }

      utterance.onstart = () => {
        this.isSpeakingInternal = true
        options?.onStart?.()
      }

      utterance.onend = () => {
        this.isSpeakingInternal = false
        options?.onEnd?.()
        resolve()
      }

      utterance.onerror = (e) => {
        this.isSpeakingInternal = false
        options?.onError?.(e.error)
        resolve()
      }

      this.activeUtterance = utterance
      window.speechSynthesis.speak(utterance)
    })
  }

  /**
   * Speech-to-Text with Azure or Browser Web Speech API
   */
  async startRecognition(
    callbacks: {
      onResult: (text: string) => void
      onError: (err: string) => void
      onEnd?: () => void
    },
    preferredLang: SpeechLanguage = "ne"
  ): Promise<() => void> {
    // 1. Try Azure Speech SDK if configured
    if (this.azureConfig) {
      try {
        const sourceConfigs = [
          sdk.SourceLanguageConfig.fromLanguage("ne-NP"),
          sdk.SourceLanguageConfig.fromLanguage("en-US")
        ]
        const autoDetectConfig = sdk.AutoDetectSourceLanguageConfig.fromSourceLanguageConfigs(sourceConfigs)
        const audioConfig = sdk.AudioConfig.fromDefaultMicrophoneInput()

        this.azureRecognizer = sdk.SpeechRecognizer.FromConfig(
          this.azureConfig,
          autoDetectConfig,
          audioConfig
        )

        this.azureRecognizer.recognizeOnceAsync(
          result => {
            if (result.reason === sdk.ResultReason.RecognizedSpeech) {
              callbacks.onResult(result.text)
            } else if (result.reason === sdk.ResultReason.NoMatch) {
              callbacks.onError("No speech could be recognized.")
            } else {
              callbacks.onError(result.errorDetails || "Recognition stopped.")
            }
            callbacks.onEnd?.()
          },
          err => {
            callbacks.onError(String(err))
            callbacks.onEnd?.()
          }
        )

        return () => {
          if (this.azureRecognizer) {
            this.azureRecognizer.close()
            this.azureRecognizer = null
          }
        }
      } catch (e) {
        console.warn("[Speech] Azure STT failed, switching to Web Speech API", e)
      }
    }

    // 2. Web Speech API Fallback
    if (typeof window !== "undefined") {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

      if (!SpeechRecognition) {
        callbacks.onError("Microphone recognition not supported on this browser.")
        callbacks.onEnd?.()
        return () => {}
      }

      const recognition = new SpeechRecognition()
      recognition.lang = preferredLang === "ne" ? "ne-NP" : "en-US"
      recognition.interimResults = true
      recognition.continuous = false

      recognition.onresult = (event: any) => {
        let transcript = ""
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript
        }
        callbacks.onResult(transcript)
      }

      recognition.onerror = (event: any) => {
        callbacks.onError(event.error)
        callbacks.onEnd?.()
      }

      recognition.onend = () => {
        callbacks.onEnd?.()
      }

      recognition.start()

      return () => {
        try {
          recognition.stop()
        } catch (e) {
          // ignore
        }
      }
    }

    return () => {}
  }
}

export const defaultSpeechService = new UnifiedSpeechService()
