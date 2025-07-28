'use client'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { InfoIcon, MicIcon } from 'lucide-react'
import { ExamplePosts } from './ExamplePosts'

export default function Home() {
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:p-8">
        <div>
          <h2>Blog idea</h2>
          <p className="leading-7 mt-4">
            Describe your idea in voice or writing or both.
          </p>

          <div className="grid w-full gap-3 mt-4">
            <Label className="font-semibold" htmlFor="ideaVoice">
              Your Idea in voice
            </Label>

            <Button>
              <MicIcon /> Record Audio
            </Button>
          </div>

          <div className="grid w-full gap-3 mt-4">
            <Label className="font-semibold" htmlFor="ideaTextarea">
              Your Idea in writing
            </Label>
            <Textarea
              placeholder="Type your ideas or paste a draft here."
              id="ideaTextarea"
            />
          </div>

          {/* End Writing Idea */}

          <div className="mt-8">
            <ExamplePosts
              onExamplesChange={(examples) => console.log(examples)}
            />
          </div>
        </div>

        {/* From here right */}
        <div>right</div>
      </div>
    </div>
  )
}
