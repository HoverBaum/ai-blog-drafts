import { VoiceNoteToStringStepFunction } from '../blogpostDraft.fluss'

export const voiceNoteToString: VoiceNoteToStringStepFunction = async (
  args
) => {
  const { postVoiceNote } = args
  if (!postVoiceNote) return undefined

  return 'wow, much audio, very string' // Placeholder for actual audio processing logic
}
