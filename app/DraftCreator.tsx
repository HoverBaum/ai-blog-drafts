import React, { useState } from 'react'
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
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'

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
  const { openAiKey, setOpenAiKey } = useOpenAiKey()
  const [inputValue, setInputValue] = useState('')

  const handleKeySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setOpenAiKey(inputValue)
    setInputValue('')
  }

  const createDeraft = async () => {
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

  if (!openAiKey) {
    return (
      <div className="mx-auto mt-8">
        <Label htmlFor="openai-key-input" className="block mb-2 font-semibold">
          OpenAI API key
        </Label>
        <form onSubmit={handleKeySubmit} className="flex gap-2 items-end">
          <Input
            id="openai-key-input"
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter OpenAI API key"
            className="flex-1"
            autoComplete="off"
          />
          <Button type="submit">Save Key</Button>
        </form>
      </div>
    )
  }

  return (
    <div>
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
