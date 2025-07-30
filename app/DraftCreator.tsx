import React from 'react'

export type DraftCreatorProps = {
  examples: any[]
  ideaText: string
  audioBlob: Blob | null
}

export const DraftCreator = ({
  examples,
  ideaText,
  audioBlob,
}: DraftCreatorProps) => {
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
