import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import CandidateHeader from '../CandidateHeader'

const STATUS = { idle: 'idle', testing: 'testing', success: 'success', error: 'error' }

function StatusBadge({ status }) {
  if (status === STATUS.idle) return null
  if (status === STATUS.testing)
    return <span className="c-badge c-badge--info">Testing...</span>
  if (status === STATUS.success)
    return (
      <span className="c-badge c-badge--success">
        <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12" aria-hidden="true">
          <path d="M9 16.2l-3.5-3.5-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
        </svg>
        Success
      </span>
    )
  return (
    <span className="c-badge c-badge--error">
      <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12" aria-hidden="true">
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
      </svg>
      Failed
    </span>
  )
}

StatusBadge.propTypes = { status: PropTypes.string.isRequired }

function CameraCard({ status, onTest }) {
  const videoRef = useRef(null)
  const streamRef = useRef(null)

  useEffect(() => {
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop())
    }
  }, [])

  const handleTest = async () => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    await onTest(async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
    })
  }

  return (
    <div className="c-check-card">
      <div className="c-check-card__header">
        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
          <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
        </svg>
        <span>Camera</span>
        <StatusBadge status={status} />
      </div>
      <div className="c-check-card__preview">
        {status === STATUS.success ? (
          <video ref={videoRef} className="c-preview-video" muted playsInline aria-label="Camera preview" />
        ) : (
          <div className="c-preview-placeholder" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
              <path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z" />
            </svg>
          </div>
        )}
      </div>
      {status === STATUS.error && (
        <p className="c-check-card__error">Camera access denied or not available.</p>
      )}
      <button type="button" className="c-btn c-btn--outline c-btn--sm" onClick={handleTest} disabled={status === STATUS.testing}>
        {status === STATUS.testing ? 'Testing...' : status === STATUS.success ? 'Re-test' : 'Test Camera'}
      </button>
    </div>
  )
}

CameraCard.propTypes = { status: PropTypes.string.isRequired, onTest: PropTypes.func.isRequired }

function MicCard({ status, onTest }) {
  const [volume, setVolume] = useState(0)
  const animRef = useRef(null)
  const analyserRef = useRef(null)
  const streamRef = useRef(null)

  useEffect(() => {
    return () => {
      cancelAnimationFrame(animRef.current)
      streamRef.current?.getTracks().forEach((t) => t.stop())
    }
  }, [])

  const handleTest = async () => {
    cancelAnimationFrame(animRef.current)
    streamRef.current?.getTracks().forEach((t) => t.stop())
    setVolume(0)

    await onTest(async () => {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      const ctx = new AudioContext()
      const source = ctx.createMediaStreamSource(stream)
      const analyser = ctx.createAnalyser()
      analyser.fftSize = 256
      source.connect(analyser)
      analyserRef.current = analyser

      const data = new Uint8Array(analyser.frequencyBinCount)
      const tick = () => {
        analyser.getByteFrequencyData(data)
        const avg = data.reduce((a, b) => a + b, 0) / data.length
        setVolume(Math.min(100, Math.round((avg / 128) * 100)))
        animRef.current = requestAnimationFrame(tick)
      }
      tick()
    })
  }

  return (
    <div className="c-check-card">
      <div className="c-check-card__header">
        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
          <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" />
        </svg>
        <span>Microphone</span>
        <StatusBadge status={status} />
      </div>
      <div className="c-check-card__preview">
        <div className="c-preview-mic" aria-label={`Microphone volume: ${volume}%`}>
          <div className="c-mic-bar-wrap">
            {Array.from({ length: 12 }, (_, i) => (
              <div
                key={i}
                className="c-waveform-bar"
                style={{ opacity: status === STATUS.success && volume > (i * 8) ? 1 : 0.15 }}
                aria-hidden="true"
              />
            ))}
          </div>
          {status === STATUS.success && (
            <p className="c-mic-volume">Volume: {volume}%</p>
          )}
        </div>
      </div>
      {status === STATUS.error && (
        <p className="c-check-card__error">Microphone access denied or not available.</p>
      )}
      <button type="button" className="c-btn c-btn--outline c-btn--sm" onClick={handleTest} disabled={status === STATUS.testing}>
        {status === STATUS.testing ? 'Testing...' : status === STATUS.success ? 'Re-test' : 'Test Microphone'}
      </button>
    </div>
  )
}

MicCard.propTypes = { status: PropTypes.string.isRequired, onTest: PropTypes.func.isRequired }

function SpeakerCard({ status, onTest }) {
  const audioRef = useRef(null)

  const handleTest = async () => {
    await onTest(async () => {
      const ctx = new AudioContext()
      const oscillator = ctx.createOscillator()
      const gain = ctx.createGain()
      oscillator.connect(gain)
      gain.connect(ctx.destination)
      oscillator.frequency.value = 440
      gain.gain.value = 0.3
      oscillator.start()
      await new Promise((res) => setTimeout(res, 800))
      oscillator.stop()
      await ctx.close()
    })
  }

  return (
    <div className="c-check-card">
      <div className="c-check-card__header">
        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
          <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
        </svg>
        <span>Speaker</span>
        <StatusBadge status={status} />
      </div>
      <div className="c-check-card__preview">
        <div className="c-preview-placeholder" aria-hidden="true">
          <svg viewBox="0 0 24 24" fill="currentColor" width="32" height="32">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" />
          </svg>
        </div>
      </div>
      {status === STATUS.error && (
        <p className="c-check-card__error">Could not play audio. Check your speaker settings.</p>
      )}
      <button type="button" className="c-btn c-btn--outline c-btn--sm" onClick={handleTest} disabled={status === STATUS.testing}>
        {status === STATUS.testing ? 'Playing...' : status === STATUS.success ? 'Play Again' : 'Test Speaker'}
      </button>
      <audio ref={audioRef} />
    </div>
  )
}

SpeakerCard.propTypes = { status: PropTypes.string.isRequired, onTest: PropTypes.func.isRequired }

export default function SystemCheck() {
  const navigate = useNavigate()
  const [statuses, setStatuses] = useState({
    camera: STATUS.idle,
    mic: STATUS.idle,
    speaker: STATUS.idle,
  })

  const runTest = (device) => async (testFn) => {
    setStatuses((prev) => ({ ...prev, [device]: STATUS.testing }))
    try {
      await testFn()
      setStatuses((prev) => ({ ...prev, [device]: STATUS.success }))
    } catch {
      setStatuses((prev) => ({ ...prev, [device]: STATUS.error }))
    }
  }

  const allPassed = Object.values(statuses).every((s) => s === STATUS.success)

  return (
    <div className="c-page">
      <CandidateHeader title="System Check" />

      <div className="c-container">
        <div className="c-page-header">
          <h2>Let&apos;s make sure your system is ready for the interview</h2>
          <p>Test your camera, microphone and speaker before proceeding</p>
        </div>

        <div className="c-check-grid">
          <CameraCard status={statuses.camera} onTest={runTest('camera')} />
          <MicCard status={statuses.mic} onTest={runTest('mic')} />
          <SpeakerCard status={statuses.speaker} onTest={runTest('speaker')} />
        </div>

        {allPassed && (
          <div className="c-all-pass" role="status">
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
            </svg>
            All systems are working properly
          </div>
        )}

        <div className="c-actions">
          <button
            type="button"
            className="c-btn c-btn--primary"
            onClick={() => navigate('/candidate/consent')}
            disabled={!allPassed}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  )
}

