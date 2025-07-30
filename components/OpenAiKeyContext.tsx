'use client'
import React, { createContext, useContext, useState, ReactNode } from 'react'

// Define the context type
import OpenAI from 'openai'

interface OpenAiKeyContextType {
  openAiKey: string
  rememberKey: boolean
  loading: boolean
  setOpenAiKey: (key: string, remember?: boolean) => void
  setRememberKey: (remember: boolean) => void
  client: OpenAI | null
}

// Create the context with default values
const OpenAiKeyContext = createContext<OpenAiKeyContextType | undefined>(
  undefined
)

// Provider component
export const OpenAiKeyProvider = ({ children }: { children: ReactNode }) => {
  const [openAiKey, setOpenAiKeyState] = useState('')
  const [rememberKey, setRememberKeyState] = useState(false)
  const [loading, setLoading] = useState(true)
  const [client, setClient] = useState<OpenAI | null>(null)

  // On mount, load from localStorage if present
  React.useEffect(() => {
    const storedKey = localStorage.getItem('abd-openai-api-key')
    const storedRemember = localStorage.getItem('abd-openai-api-key-remember')
    if (storedKey && storedRemember === 'true') {
      setOpenAiKeyState(storedKey)
      setRememberKeyState(true)
    }
    setLoading(false)
  }, [])

  // Create/destroy OpenAI client when openAiKey changes
  React.useEffect(() => {
    if (openAiKey) {
      setClient(
        new OpenAI({ apiKey: openAiKey, dangerouslyAllowBrowser: true })
      )
    } else {
      setClient(null)
    }
  }, [openAiKey])

  const setOpenAiKey = (key: string, remember?: boolean) => {
    setOpenAiKeyState(key)
    if (remember ?? rememberKey) {
      localStorage.setItem('abd-openai-api-key', key)
      localStorage.setItem('abd-openai-api-key-remember', 'true')
      setRememberKeyState(true)
    } else {
      localStorage.removeItem('abd-openai-api-key')
      localStorage.setItem('abd-openai-api-key-remember', 'false')
      setRememberKeyState(false)
    }
    // client will be created/destroyed by useEffect
  }

  const setRememberKey = (remember: boolean) => {
    setRememberKeyState(remember)
    localStorage.setItem(
      'abd-openai-api-key-remember',
      remember ? 'true' : 'false'
    )
    if (!remember) {
      localStorage.removeItem('abd-openai-api-key')
      setOpenAiKeyState('') // This will also destroy the client
    }
  }

  return (
    <OpenAiKeyContext.Provider
      value={{
        openAiKey,
        rememberKey,
        loading,
        setOpenAiKey,
        setRememberKey,
        client,
      }}
    >
      {children}
    </OpenAiKeyContext.Provider>
  )
}

// Custom hook for consuming the context
export const useOpenAiKey = () => {
  const context = useContext(OpenAiKeyContext)
  if (!context) {
    throw new Error('useOpenAiKey must be used within an OpenAiKeyProvider')
  }
  return context
}
