import React, { useMemo } from 'react'
import {
  ExampleArray,
  OptionalAudio,
  OptionalString,
  runFluss,
} from './blogpostDraft.fluss'
import { useOpenAiKey } from '../components/OpenAiKeyContext'
import { voiceNoteToString } from './_flussFunctions/voiceNoteToString'
import { structureDescription } from './_flussFunctions/structureDescription'
import { writeDraft } from './_flussFunctions/writeDraft'

import { OpenAiKeyInput } from '../components/OpenAiKeyInput'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { LightbulbIcon, RocketIcon, SparkleIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export type DraftCreatorProps = {
  examples: ExampleArray
  ideaText: OptionalString
  audioBlob: OptionalAudio
}

export const DraftCreator = ({
  examples,
  ideaText,
  audioBlob,
}: DraftCreatorProps) => {
  const { openAiKey, rememberKey, loading, setOpenAiKey, setRememberKey } =
    useOpenAiKey()

  const providedAllInputs = useMemo(() => {
    return !!ideaText || !!audioBlob
  }, [ideaText, audioBlob])

  const canCreateDraft = useMemo(() => {
    return providedAllInputs && openAiKey && !loading
  }, [providedAllInputs, openAiKey, loading])

  const createDraft = async () => {
    runFluss({
      inputs: {
        postVoiceNote: audioBlob,
        blogNotes: ideaText,
        examplePosts: examples,
      },
      stepFunctions: {
        voiceNoteToString: voiceNoteToString,
        structureDescription: structureDescription,
        writeDraft: writeDraft,
      },
    })
  }

  if (loading) {
    return null
  }

  return (
    <div>
      <OpenAiKeyInput
        openAiKey={openAiKey}
        rememberKey={rememberKey}
        setOpenAiKey={setOpenAiKey}
        setRememberKey={setRememberKey}
      />

      <section className="mt-6">
        <h3>Create Draft</h3>
        {!providedAllInputs && (
          <Alert className="my-2">
            <LightbulbIcon />
            <AlertTitle>Idea missing</AlertTitle>
            <AlertDescription>
              Please provide at least a written idea for your post or recode a
              voice note.
            </AlertDescription>
          </Alert>
        )}

        {!openAiKey && (
          <Alert className="my-2">
            <SparkleIcon />
            <AlertTitle>API Key missing</AlertTitle>
            <AlertDescription>
              Please provide an OpenAI API key.
            </AlertDescription>
          </Alert>
        )}

        {canCreateDraft && (
          <p className="flex gap-4 items-center px-2">
            <RocketIcon />
            <span>
              You are good to go. The AI will create a draft based on your idea
              and the provided examples. Just hit the button.
            </span>
          </p>
        )}

        <Button
          disabled={!canCreateDraft}
          onClick={createDraft}
          className="w-full mt-4"
        >
          <SparkleIcon />
          Create Draft <SparkleIcon />
        </Button>
      </section>

      <p>Examples</p>
      <pre>{JSON.stringify(examples, null, 2)}</pre>
      <p>Idea</p>
      <pre>{ideaText}</pre>
      <p>Audio</p>
      {audioBlob ? (
        <audio controls>
          <source src={URL.createObjectURL(audioBlob)} type="audio/wav" />
          Your browser does not support the audio element.
        </audio>
      ) : (
        <p>No audio recorded yet.</p>
      )}
    </div>
  )
}
