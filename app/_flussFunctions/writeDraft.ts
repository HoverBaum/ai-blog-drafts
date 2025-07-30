import OpenAI from 'openai'
import { WriteDraftStepFunction } from '../blogpostDraft.fluss'

export const writeDraft =
  (client: OpenAI): WriteDraftStepFunction =>
  async (args) => {
    const { usersIdeas, blogStyle } = args

    const response = await client.responses.create({
      model: 'gpt-4.1',
      input: `Write a blogpost draft based on the following idea and style.
Return only the draft and not other text.

## Idea
${usersIdeas}

## Style
${blogStyle}`,
    })

    const responseText = response.output_text
    return responseText
  }
