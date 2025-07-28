import React, { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { MicIcon, StopCircle, PlayCircle, Trash2 } from 'lucide-react'

type AudioRecorderProps = {
  onAudioChange?: (audio: Blob | null) => void
}

export const AudioRecorder: React.FC<AudioRecorderProps> = ({
  onAudioChange,
}) => {
  const [recording, setRecording] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [duration, setDuration] = useState<number>(0)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunks = useRef<Blob[]>([])
  const audioRef = useRef<HTMLAudioElement | null>(null)

  const startRecording = async () => {
    setAudioUrl(null)
    setAudioBlob(null)
    setDuration(0)
    setCurrentTime(0)
    if (onAudioChange) onAudioChange(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new window.MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunks.current = []
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.current.push(event.data)
        }
      }
      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunks.current, { type: 'audio/webm' })
        setAudioBlob(blob)
        const url = URL.createObjectURL(blob)
        setAudioUrl(url)
        if (onAudioChange) onAudioChange(blob)
        stream.getTracks().forEach((track) => track.stop())
      }
      mediaRecorder.start()
      setRecording(true)
    } catch (err) {
      alert('Could not access microphone.')
    }
  }

  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
    setRecording(false)
  }

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.currentTime = 0
      audioRef.current.play()
      setIsPlaying(true)
      audioRef.current.onended = () => setIsPlaying(false)
    }
  }

  React.useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateDuration = () => {
      // Wait for metadata and readyState to be HAVE_METADATA or more
      if (
        audio.duration &&
        isFinite(audio.duration) &&
        audio.duration > 0 &&
        audio.readyState >= 1
      ) {
        setDuration(audio.duration)
      }
    }
    const updateCurrentTime = () => setCurrentTime(audio.currentTime || 0)

    // Try to force metadata load if not already loaded
    if (audioUrl && audio.readyState < 1) {
      audio.load()
    }

    audio.addEventListener('loadedmetadata', updateDuration)
    audio.addEventListener('durationchange', updateDuration)
    audio.addEventListener('timeupdate', updateCurrentTime)
    audio.addEventListener('ended', () => setCurrentTime(0))

    // If metadata is already loaded, set duration immediately
    if (audio.duration && isFinite(audio.duration) && audio.duration > 0) {
      setDuration(audio.duration)
    }

    return () => {
      audio.removeEventListener('loadedmetadata', updateDuration)
      audio.removeEventListener('durationchange', updateDuration)
      audio.removeEventListener('timeupdate', updateCurrentTime)
      audio.removeEventListener('ended', () => setCurrentTime(0))
    }
  }, [audioUrl])

  // Helper to format seconds as mm:ss
  const formatTime = (secs: number) => {
    if (!isFinite(secs) || isNaN(secs) || secs < 0) return '0:00'
    const m = Math.floor(secs / 60)
    const s = Math.floor(secs % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  const handleDelete = () => {
    setAudioUrl(null)
    setAudioBlob(null)
    setDuration(0)
    setCurrentTime(0)
    if (onAudioChange) onAudioChange(null)
    setIsPlaying(false)
  }

  return (
    <div className="grid w-full gap-3">
      <Label className="font-semibold" htmlFor="ideaVoice">
        Your Idea in voice
      </Label>
      {!audioUrl && !recording && (
        <Button onClick={startRecording}>
          <MicIcon className="mr-2" /> Record Audio
        </Button>
      )}
      {recording && (
        <Button variant="destructive" onClick={stopRecording}>
          <StopCircle className="mr-2 animate-pulse text-red-600" /> Stop
          Recording
        </Button>
      )}
      {audioUrl && !recording && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            <Button onClick={handlePlay} disabled={isPlaying}>
              <PlayCircle className="mr-2" />{' '}
              {isPlaying ? 'Playing...' : 'Play'}
            </Button>
            <Button variant="ghost" onClick={handleDelete}>
              <Trash2 className="mr-2" /> Delete
            </Button>
            <span className="text-sm text-muted-foreground">
              {formatTime(duration)}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs tabular-nums w-10 text-right">
              {formatTime(currentTime)}
            </span>
            <input
              type="range"
              min={0}
              max={duration || 0}
              value={currentTime}
              readOnly
              className="flex-1 accent-blue-600 h-1"
              style={{ pointerEvents: 'none' }}
            />
            <span className="text-xs tabular-nums w-10 text-left">
              {formatTime(duration)}
            </span>
          </div>
          <audio ref={audioRef} src={audioUrl} hidden />
        </div>
      )}
    </div>
  )
}
