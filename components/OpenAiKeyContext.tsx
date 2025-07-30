'use client'
import React, { createContext, useContext, useState, ReactNode } from 'react'

// Define the context type
interface OpenAiKeyContextType {
  openAiKey: string
  rememberKey: boolean
  loading: boolean
  setOpenAiKey: (key: string, remember?: boolean) => void
  setRememberKey: (remember: boolean) => void
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
  }

  const setRememberKey = (remember: boolean) => {
    setRememberKeyState(remember)
    localStorage.setItem(
      'abd-openai-api-key-remember',
      remember ? 'true' : 'false'
    )
    if (!remember) {
      localStorage.removeItem('abd-openai-api-key')
    }
  }

  return (
    <OpenAiKeyContext.Provider
      value={{ openAiKey, rememberKey, loading, setOpenAiKey, setRememberKey }}
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
