import OpenAI from 'openai'
import { UnderstandStyleStepFunction } from '../blogpostDraft.fluss'

export const understandStyle = (
  client: OpenAI
): UnderstandStyleStepFunction => {
  return async (args) => {
    const { examplePosts } = args
    if (examplePosts.length === 0) {
      return undefined
    }

    const response = await client.responses.create({
      model: 'gpt-4.1-mini',
      input: `Analyze the following blog posts and identify the writing style. Take a look at the following aspects:
1. Vocabulary & Word Choice: Common words, formality, jargon.
2. Sentence Structure: Typical length, complexity, punctuation habits.
3. Paragraph & Formatting Style: Paragraph length, use of headings/lists, formatting choices.
4. Tone & Voice: Overall mood, point of view, directness.
5. Rhythm & Flow: Repetition, cadence, pacing.
6. Storytelling Techniques: Anecdotes, dialogue, imagery.
7. Structural Patterns: Article structure, transitions.
8. Use of Questions & Calls to Action: Engagement tactics.
9. Recurring Themes & Motifs: Topics, analogies, cultural references.
10. Humor & Playfulness: Use of jokes, puns, or self-deprecation.

Reply only with a description of the style, no other text.

Here are the examples:
${examplePosts
  .map(
    (post, index) =>
      `Post ${index + 1}\nTitle: ${post.title}\nContent: ${post.content}`
  )
  .join('\n\n')}
`,
    })

    const responseText = response.output_text
    return responseText
  }
}
