'use client'
import { Button } from '@/components/ui/button'
import { useEffect, useState } from 'react'

const LOCAL_STORAGE_KEY = 'ai_draft_examples'

type ExamplePost = {
  id: string
  title: string
  content: string
}

type ExamplePostsProps = {
  onExamplesChange: (examples: ExamplePost[]) => void
}

export const ExamplePosts = ({ onExamplesChange }: ExamplePostsProps) => {
  const [examples, setExamples] = useState<ExamplePost[]>([])

  // Initially load examples from local storage, if any are present.
  useEffect(() => {
    const storedExamples = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (storedExamples) {
      setExamples(JSON.parse(storedExamples))
    }
  }, [])

  // Call onExamplesChange whenever examples change.
  useEffect(() => {
    onExamplesChange(examples)
    // Also store examples in local storage
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(examples))
  }, [examples, onExamplesChange])

  return (
    <div>
      <h2>Example posts</h2>
      <p className="mt-4">
        Add example of Blogposts your wrote yourself and are proud of or would
        like the AI to use the style of. These posts will be analyzed to help
        generate better drafts.
      </p>

      {examples.map((example) => (
        <div key={example.id} className="my-4 p-4 border rounded shadow-sm">
          <h3 className="text-lg font-semibold">{example.title}</h3>
          <p className="mt-2">{example.content}</p>
        </div>
      ))}

      <Button
        onClick={() =>
          setExamples((current) =>
            current.concat([
              {
                id: Date.now().toString(),
                title: '',
                content: '',
              },
            ])
          )
        }
      >
        Add Example Post
      </Button>
    </div>
  )
}
