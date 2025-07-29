'use client'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { useEffect, useState } from 'react'
import { PlusIcon, TrashIcon } from 'lucide-react'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const LOCAL_STORAGE_KEY = 'ai_draft_examples'

export type ExamplePost = {
  id: string
  title: string
  content: string
}

type ExamplePostsProps = {
  onExamplesChange: (examples: ExamplePost[]) => void
}

export const ExamplePosts = ({ onExamplesChange }: ExamplePostsProps) => {
  const [examples, setExamples] = useState<ExamplePost[]>([])
  const [loading, setLoading] = useState(true)

  // Initially load examples from local storage, if any are present.
  useEffect(() => {
    const storedExamples = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (storedExamples) {
      setExamples(JSON.parse(storedExamples))
    }
    setLoading(false)
  }, [])

  // Call onExamplesChange whenever examples change.
  useEffect(() => {
    if (loading) return
    onExamplesChange(examples)
  }, [examples, onExamplesChange, loading])

  // Save examples to local storage whenever they change.
  useEffect(() => {
    if (loading) return
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(examples))
  }, [examples, loading])

  return (
    <div>
      <h2>Example posts {examples.length > 0 && `(${examples.length})`}</h2>
      <p className="mt-4">
        Add example of Blogposts your wrote yourself and are proud of or would
        like the AI to use the style of. These posts will be analyzed to help
        generate better drafts.
        <br />
        We recommend adding at least 3 examples.
      </p>

      {examples.map((example, idx) => (
        <Card key={example.id} className="my-8">
          <CardHeader>
            <CardTitle>{example.title || 'Untitled'} </CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
          <CardFooter className="flex justify-end">
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
          </CardFooter>
        </Card>
      ))}

      <Button
        className={`${examples.length === 0 ? 'mt-6' : ''}`}
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
