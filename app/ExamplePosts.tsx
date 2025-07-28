'use client'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { useEffect, useState } from 'react'
import { PlusIcon, TrashIcon } from 'lucide-react'

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

      {examples.map((example, idx) => (
        <div key={example.id} className="my-4 p-4 border rounded ">
          <div className="mb-3">
            <Label
              className="font-semibold"
              htmlFor={`example-title-${example.id}`}
            >
              Title
            </Label>
            <Input
              id={`example-title-${example.id}`}
              className="mt-1"
              value={example.title}
              onChange={(e) => {
                const newTitle = e.target.value
                setExamples((exs) =>
                  exs.map((ex, i) =>
                    i === idx ? { ...ex, title: newTitle } : ex
                  )
                )
              }}
              placeholder="Enter example post title"
            />
          </div>
          <div>
            <Label
              className="font-semibold"
              htmlFor={`example-content-${example.id}`}
            >
              Content
            </Label>
            <Textarea
              id={`example-content-${example.id}`}
              className="mt-1 h-32 overflow-auto resize-none"
              value={example.content}
              onChange={(e) => {
                const newContent = e.target.value
                setExamples((exs) =>
                  exs.map((ex, i) =>
                    i === idx ? { ...ex, content: newContent } : ex
                  )
                )
              }}
              placeholder="Enter example post content"
            />
          </div>
          <div className="mt-3 flex justify-end">
            <Button
              variant="destructive"
              size="sm"
              onClick={() => {
                setExamples((exs) => exs.filter((_, i) => i !== idx))
              }}
              type="button"
            >
              <TrashIcon /> Remove
            </Button>
          </div>
        </div>
      ))}

      <Button
        className="mt-6"
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
        <PlusIcon /> Add Example Post
      </Button>
    </div>
  )
}
