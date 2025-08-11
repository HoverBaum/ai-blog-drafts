'use client'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { ChevronsUpDownIcon, InfoIcon } from 'lucide-react'
import { ExamplePosts } from './ExamplePosts'
import { useState } from 'react'
import { AudioRecorder } from './AudioRecorder'
import { DraftCreator } from './DraftCreator'
import {
  ExamplePost,
  OptionalAudio,
  OptionalString,
} from './blogpostDraft.fluss'

export default function Home() {
  const [examples, setExamples] = useState<ExamplePost[]>([])
  const [ideaText, setIdeaText] = useState<OptionalString>('')
  const [audioBlob, setAudioBlob] = useState<OptionalAudio>(undefined)
  const [step1Open, setStep1Open] = useState(true)
  const [step2Open, setStep2Open] = useState(true)

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <hgroup className="text-center">
        <h1 className="mt-8">AI Blog Drafts</h1>
        <p className="mt-0">Generate drafts for your blog posts using AI.</p>
      </hgroup>
      <div className="my-4 flex justify-center">
        <Alert className="max-w-prose">
          <InfoIcon />
          <AlertTitle>This is a Fluss Vis Demo</AlertTitle>
          <AlertDescription>
            <p>
              Learn more about how Fluss Vis powers this application and what it
              can do for you at:{' '}
              <a
                href="https://github.com/HoverBaum/fluss-vis"
                className="underline"
              >
                GitHub - HoverBaum/fluss-vis
              </a>{' '}
              and use it yourself at:{' '}
              <a href="https://flussvis.dev" className="underline">
                FlussVis.dev
              </a>
              .
            </p>
          </AlertDescription>
        </Alert>
      </div>

      <div className="flex flex-col gap-6 md:p-8">
        {/* Step 1: Idea */}
        <Collapsible open={step1Open} onOpenChange={setStep1Open}>
          <Card>
            <CardHeader>
              <CardTitle>Step 1: Provide a blogpost idea</CardTitle>
              <CardAction>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    {step1Open ? 'Collapse' : 'Expand'}
                    <ChevronsUpDownIcon className="h-4 w-4" />
                    <span className="sr-only">
                      {step1Open ? 'Collapse step 1' : 'Expand step 1'}
                    </span>
                  </Button>
                </CollapsibleTrigger>
              </CardAction>
              <CardDescription>
                Describe your idea in voice or writing or both.
              </CardDescription>
            </CardHeader>
            <CollapsibleContent>
              <CardContent>
                <div className="mt-2">
                  <AudioRecorder
                    onAudioChange={(audio) => setAudioBlob(audio)}
                  />
                </div>
                <div className="grid w-full gap-3 mt-4">
                  <Label className="font-semibold" htmlFor="ideaTextarea">
                    Your Idea in writing
                  </Label>
                  <Textarea
                    className="h-32 overflow-auto resize-none"
                    placeholder="Type your ideas or paste a draft here."
                    id="ideaTextarea"
                    value={ideaText}
                    onChange={(e) => setIdeaText(e.target.value)}
                  />
                </div>
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Step 2: Examples */}
        <Collapsible open={step2Open} onOpenChange={setStep2Open}>
          <Card>
            <CardHeader>
              <CardTitle>Step 2: Provide examples</CardTitle>
              <CardAction>
                <CollapsibleTrigger asChild>
                  <Button variant="ghost" size="sm" className="gap-2">
                    {step2Open ? 'Collapse' : 'Expand'}
                    <ChevronsUpDownIcon className="h-4 w-4" />
                    <span className="sr-only">
                      {step2Open ? 'Collapse step 2' : 'Expand step 2'}
                    </span>
                  </Button>
                </CollapsibleTrigger>
              </CardAction>
              <CardDescription>
                Add example blog posts to guide the writing style.
              </CardDescription>
            </CardHeader>
            <CollapsibleContent>
              <CardContent>
                <ExamplePosts onExamplesChange={setExamples} hideHeader />
              </CardContent>
            </CollapsibleContent>
          </Card>
        </Collapsible>

        {/* Step 3: Generate Draft */}
        <Card>
          <CardHeader>
            <CardTitle>Step 3: Generate the draft</CardTitle>
            <CardDescription>
              Use your inputs to generate a first draft.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DraftCreator
              examples={examples}
              ideaText={ideaText}
              audioBlob={audioBlob}
              hideHeader
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
