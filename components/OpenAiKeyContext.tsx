'use client'
import React, { createContext, useContext, useState, ReactNode } from 'react'

// Define the context type
interface OpenAiKeyContextType {
  openAiKey: string
  setOpenAiKey: (key: string) => void
}

// Create the context with default values
const OpenAiKeyContext = createContext<OpenAiKeyContextType | undefined>(
  undefined
)

// Provider component
export const OpenAiKeyProvider = ({ children }: { children: ReactNode }) => {
  const [openAiKey, setOpenAiKey] = useState('')
  return (
    <OpenAiKeyContext.Provider value={{ openAiKey, setOpenAiKey }}>
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
