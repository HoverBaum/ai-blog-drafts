import React, { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import {
  MicIcon,
  StopCircle,
  Trash2,
  PauseCircleIcon,
  PlayCircleIcon,
} from 'lucide-react'

type AudioRecorderProps = {
  onAudioChange: (audio: Blob | null) => void
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
  const recordingStartTime = useRef<number | null>(null)
  const recordingInterval = useRef<NodeJS.Timeout | null>(null)

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
        // Set duration to the recorded duration
        if (recordingStartTime.current !== null) {
          const recordedSecs = Math.round(
            (Date.now() - recordingStartTime.current) / 1000
          )
          setDuration(recordedSecs)
        }
        // Clear timer
        if (recordingInterval.current) {
          clearInterval(recordingInterval.current)
          recordingInterval.current = null
        }
        recordingStartTime.current = null
      }
      mediaRecorder.start()
      setRecording(true)
      // Start timer for recording duration
      recordingStartTime.current = Date.now()
      setDuration(0)
      if (recordingInterval.current) clearInterval(recordingInterval.current)
      recordingInterval.current = setInterval(() => {
        if (recordingStartTime.current !== null) {
          setDuration(
            Math.round((Date.now() - recordingStartTime.current) / 1000)
          )
        }
      }, 200)
    } catch (err) {
      alert('Could not access microphone.')
    }
  }

  const stopRecording = () => {
    mediaRecorderRef.current?.stop()
    setRecording(false)
    // Timer cleanup will be handled in onstop
  }

  const handlePlay = () => {
    if (audioRef.current) {
      audioRef.current.play()
      setIsPlaying(true)
      audioRef.current.onended = () => setIsPlaying(false)
    }
  }

  React.useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateCurrentTime = () => setCurrentTime(audio.currentTime || 0)

    audio.addEventListener('timeupdate', updateCurrentTime)
    audio.addEventListener('ended', () => setCurrentTime(0))

    return () => {
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
    // Clear timer if deleting during recording
    if (recordingInterval.current) {
      clearInterval(recordingInterval.current)
      recordingInterval.current = null
    }
    recordingStartTime.current = null
  }

  function handlePause(): void {
    if (audioRef.current) {
      audioRef.current.pause()
      setIsPlaying(false)
    }
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
          <StopCircle className="mr-2 text-white" />
          Stop Recording
          <span className="ml-2 text-sm text-white tabular-nums w-12 inline-block text-right">
            {formatTime(duration)}
          </span>
        </Button>
      )}
      {audioUrl && !recording && (
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2">
            {!isPlaying && (
              <Button onClick={handlePlay}>
                <PlayCircleIcon className="mr-2" /> Play
              </Button>
            )}
            {isPlaying && (
              <Button onClick={handlePause}>
                <PauseCircleIcon className="mr-2" /> Pause
              </Button>
            )}

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
