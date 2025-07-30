import OpenAI from 'openai'
import { WriteDraftStepFunction } from '../blogpostDraft.fluss'

export const writeDraft =
  (client: OpenAI): WriteDraftStepFunction =>
  async (args) => {
    const { usersIdeas, examplePosts } = args

    const response = await client.responses.create({
      model: 'gpt-4.1-mini',
      input: `Write a blogpost draft based on the following users ideas and example posts.
Match the tone, format and overall style of the example posts in your draft.
return only the draft and not other text.

## User ideas
${usersIdeas}

## Example posts
${examplePosts.map((post) => `- ${post}`).join('\n')}`,
    })

    const responseText = response.output_text
    return responseText
  }
