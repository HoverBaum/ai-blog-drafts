import React, { useState, useEffect } from 'react'
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
// Checkbox import removed; now handled in OpenAiKeyInput
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

import { OpenAiKeyInput } from '../components/OpenAiKeyInput'

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
  const [inputValue, setInputValue] = useState('')

  if (loading) {
    return null // or a spinner/loading UI if desired
  }

  const handleKeySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setOpenAiKey(inputValue, rememberKey)
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

  return (
    <div>
      <OpenAiKeyInput
        openAiKey={openAiKey}
        rememberKey={rememberKey}
        setOpenAiKey={setOpenAiKey}
        setRememberKey={setRememberKey}
      />
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
