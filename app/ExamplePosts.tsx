'use client'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { useEffect, useState } from 'react'
import { ChevronDown, PlusIcon, TrashIcon } from 'lucide-react'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { ExamplePost } from './blogpostDraft.fluss'

const LOCAL_STORAGE_KEY = 'ai_draft_examples'
const LOCAL_STORAGE_OPEN_KEY = 'ai_draft_examples_open'

type ExamplePostsProps = {
  onExamplesChange: (examples: ExamplePost[]) => void
  hideHeader?: boolean
}

export const ExamplePosts = ({
  onExamplesChange,
  hideHeader = false,
}: ExamplePostsProps) => {
  const [examples, setExamples] = useState<ExamplePost[]>([])
  const [loading, setLoading] = useState(true)
  const [openMap, setOpenMap] = useState<Record<string, boolean>>({})

  // Initially load examples from local storage, if any are present.
  useEffect(() => {
    const storedExamples = localStorage.getItem(LOCAL_STORAGE_KEY)
    if (storedExamples) {
      setExamples(JSON.parse(storedExamples))
    }
    const storedOpenMap = localStorage.getItem(LOCAL_STORAGE_OPEN_KEY)
    if (storedOpenMap) {
      try {
        setOpenMap(JSON.parse(storedOpenMap))
      } catch {}
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

  // Save collapsible open state to local storage whenever it changes.
  useEffect(() => {
    if (loading) return
    localStorage.setItem(LOCAL_STORAGE_OPEN_KEY, JSON.stringify(openMap))
  }, [openMap, loading])

  return (
    <div>
      {!hideHeader && (
        <>
          <h3>Example posts {examples.length > 0 && `(${examples.length})`}</h3>
          <p className="mt-4">
            Add example of Blogposts your wrote yourself and are proud of or
            would like the AI to use the style of. These posts will be analyzed
            to help generate better drafts.
            <br />
            We recommend adding at least 3 examples.
          </p>
        </>
      )}

      <div className="mt-6 divide-y divide-border">
        {examples.map((example, idx) => (
          <div key={example.id} className="py-4">
            <Collapsible
              open={openMap[example.id] ?? true}
              onOpenChange={(open) =>
                setOpenMap((m) => ({ ...m, [example.id]: open }))
              }
            >
              <div className="flex items-center justify-between gap-2">
                <CollapsibleTrigger className="group inline-flex items-center gap-2 text-left outline-none">
                  <ChevronDown className="h-4 w-4 shrink-0 transition-transform group-data-[state=open]:rotate-180" />
                  <span className="font-medium">
                    Example {idx + 1}: {example.title || 'Untitled'}
                  </span>
                </CollapsibleTrigger>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setExamples((exs) => exs.filter((_, i) => i !== idx))
                    setOpenMap((m) => {
                      const { [example.id]: _removed, ...rest } = m
                      return rest
                    })
                  }}
                  type="button"
                >
                  <TrashIcon className="mr-1 h-4 w-4" /> Remove
                </Button>
              </div>

              <CollapsibleContent className="mt-4 space-y-4">
                <div>
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
              </CollapsibleContent>
            </Collapsible>
          </div>
        ))}
      </div>

      <Button
        className={`${examples.length === 0 ? 'mt-6' : ''}`}
        onClick={() => {
          const newId = Date.now().toString()
          setExamples((current) =>
            current.concat([
              {
                id: newId,
                title: '',
                content: '',
              },
            ])
          )
          setOpenMap((m) => ({ ...m, [newId]: true }))
        }}
      >
        <PlusIcon /> Add Example Post
      </Button>
    </div>
  )
}
