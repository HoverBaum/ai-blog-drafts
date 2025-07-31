import OpenAI from 'openai'
import { VoiceNoteToStringStepFunction } from '../blogpostDraft.fluss'

export const voiceNoteToString =
  (client: OpenAI): VoiceNoteToStringStepFunction =>
  async (args) => {
    const { postVoiceNote } = args
    if (!postVoiceNote) return undefined

    const audiofile = new File([postVoiceNote], 'audiofile', {
      type: 'audio/webm',
    })

    const transcription = await client.audio.transcriptions.create({
      file: audiofile,
      model: 'gpt-4o-mini-transcribe',
      response_format: 'text',
    })
    const transcribedText = transcription

    return transcribedText
  }
