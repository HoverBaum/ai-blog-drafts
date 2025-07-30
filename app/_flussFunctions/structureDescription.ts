import OpenAI from 'openai'
import { StructureDescriptionStepFunction } from '../blogpostDraft.fluss'

export const structureDescription = (
  client: OpenAI
): StructureDescriptionStepFunction => {
  return async (args) => {
    const { blogNotes } = args

    const response = await client.responses.create({
      model: 'gpt-4.1-mini',
      input: `Take the notes below that are a users thoughts about a blogpost and structure them. Make sure to include everything from the original in the structured version. 
Reply only with the structured version, no other text.

${blogNotes}`,
    })

    const responseText = response.output_text
    return responseText
  }
}
