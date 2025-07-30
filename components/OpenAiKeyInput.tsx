import React, { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { InfoIcon, TrashIcon } from 'lucide-react'

type OpenAiKeyInputProps = {
  openAiKey: string | null
  rememberKey: boolean
  setOpenAiKey: (key: string, remember: boolean) => void
  setRememberKey: (remember: boolean) => void
}

export const OpenAiKeyInput: React.FC<OpenAiKeyInputProps> = ({
  openAiKey,
  rememberKey,
  setOpenAiKey,
  setRememberKey,
}) => {
  const [inputValue, setInputValue] = useState('')

  const handleKeySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setOpenAiKey(inputValue, rememberKey)
    setInputValue('')
  }

  const removeKey = () => {
    setOpenAiKey('', rememberKey)
    setInputValue('')
  }

  return (
    <div>
      <h3>OpenAI API Key</h3>

      {openAiKey && (
        <>
          <div className="flex items-center gap-2 ">
            <p>Key: </p>
            <pre>
              *******
              {openAiKey.substring(openAiKey.length - 4)}
            </pre>
            <div className="flex-grow"></div>
            <Button variant="ghost" onClick={removeKey}>
              <TrashIcon />
              Remove key
            </Button>
          </div>
        </>
      )}

      {!openAiKey && (
        <>
          <p className="mb-2">
            We need you to provide an API key for OpenAI. This application runs
            entirely client side!
          </p>
          <Label
            htmlFor="openai-key-input"
            className="block mb-2 font-semibold mt-4"
          >
            OpenAI API key
          </Label>
          <form onSubmit={handleKeySubmit}>
            <Input
              id="openai-key-input"
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter OpenAI API key"
              className="w-full"
              autoComplete="off"
            />
            <div className="flex items-center ">
              <Checkbox
                checked={rememberKey}
                onCheckedChange={(checked) => setRememberKey(!!checked)}
                id="remember-key-checkbox"
              />
              <Label htmlFor="remember-key-checkbox" className="mb-0 ml-2">
                Remember key{' '}
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button size="icon" variant="ghost">
                      <InfoIcon />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <span>
                      This will store you key
                      <br />
                      in localstorage.
                    </span>
                  </TooltipContent>
                </Tooltip>
              </Label>
            </div>
            <Button type="submit">Save Key</Button>
          </form>
        </>
      )}
    </div>
  )
}
