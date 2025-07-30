import { VoiceNoteToStringStepFunction } from '../blogpostDraft.fluss'

export const voiceNoteToString: VoiceNoteToStringStepFunction = async (
  args
) => {
  // Artificiallly simulate a delay.
  await new Promise((resolve) => setTimeout(resolve, 500))

  const { postVoiceNote } = args
  if (!postVoiceNote) return undefined

  return 'wow, much audio, very string' // Placeholder for actual audio processing logic
}
