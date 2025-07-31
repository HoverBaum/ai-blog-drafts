'use client'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { InfoIcon } from 'lucide-react'
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

  return (
    <div className="p-4">
      <hgroup className="text-center">
        <h1 className="mt-8">AI Blog Drafts</h1>
        <p className="mt-0">Generate drafts for your blog posts using AI.</p>
      </hgroup>
      <div className="my-4 flex justify-center">
        <Alert className="max-w-prose">
          <InfoIcon />
          <AlertTitle>This is a Fluss-Vis Demo</AlertTitle>
          <AlertDescription>
            Learn more about how Fluss Vis powers this application and what it
            can do for you at: LINK COMING SOON
          </AlertDescription>
        </Alert>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:p-8">
        <div>
          <h3>Blog idea</h3>
          <p className="leading-7 mt-4">
            Describe your idea in voice or writing or both.
          </p>

          <div className="mt-4">
            <AudioRecorder onAudioChange={(audio) => setAudioBlob(audio)} />
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

          {/* End Writing Idea */}

          <div className="mt-8">
            <ExamplePosts onExamplesChange={setExamples} />
          </div>
        </div>

        {/* From here right */}
        <div>
          <DraftCreator
            examples={examples}
            ideaText={ideaText}
            audioBlob={audioBlob}
          />
        </div>
      </div>
    </div>
  )
}
