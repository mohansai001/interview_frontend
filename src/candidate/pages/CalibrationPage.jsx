import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { env } from '../../config/env'
import { useCandidateContext } from '../CandidateApp'

const POINTS = [
  { id: 'tl', label: 'Top Left',       x: 10, y: 10 },
  { id: 'tc', label: 'Top Center',     x: 50, y:  5 },
  { id: 'tr', label: 'Top Right',      x: 90, y: 10 },
  { id: 'ml', label: 'Mid Left',       x:  5, y: 50 },
  { id: 'cc', label: 'Center',         x: 50, y: 50 },
  { id: 'mr', label: 'Mid Right',      x: 95, y: 50 },
  { id: 'bl', label: 'Bottom Left',    x: 20, y: 80 },
  { id: 'bc', label: 'Bottom Center',  x: 50, y: 85 },
  { id: 'br', label: 'Bottom Right',   x: 80, y: 80 },
]

function resolveInterviewId(locationState, candidate) {
  if (locationState?.interviewId) return locationState.interviewId
  if (candidate?.interviewId) return candidate.interviewId
  if (candidate?.interview_id) return candidate.interview_id
  if (candidate?.candidateId) return candidate.candidateId
  try {
    const stored = JSON.parse(sessionStorage.getItem('candidate') || '{}')
    return stored?.interviewId || stored?.interview_id || stored?.candidateId || ''
  } catch {
    return ''
  }
}

export default function CalibrationPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { candidate } = useCandidateContext()
  const interviewId = resolveInterviewId(location.state, candidate)

  console.log('[CalibrationPage] location.state:', location.state)
  console.log('[CalibrationPage] candidate:', candidate)
  console.log('[CalibrationPage] interviewId resolved:', interviewId)

  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const wsRef = useRef(null)

  const [captured, setCaptured] = useState(new Set())
  const [status, setStatus] = useState('Starting camera...')
  const [wsConnected, setWsConnected] = useState(false)
  const [cameraReady, setCameraReady] = useState(false)

  const allCaptured = captured.size === POINTS.length

  useEffect(() => {
    let mounted = true
    navigator.mediaDevices
      .getUserMedia({ video: { width: 640, height: 360, facingMode: 'user' }, audio: false })
      .then((stream) => {
        if (!mounted) { stream.getTracks().forEach((t) => t.stop()); return }
        streamRef.current = stream
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.play().catch(() => {})
        }
        setCameraReady(true)
        setStatus('Camera ready. Connecting to calibration server...')
      })
      .catch(() => setStatus('Camera access denied. Please allow camera permissions.'))

    return () => {
      mounted = false
      streamRef.current?.getTracks().forEach((t) => t.stop())
    }
  }, [])

  useEffect(() => {
    if (!cameraReady) return
    if (!interviewId) {
      setStatus('Error: interview ID missing. Please go back and login again.')
      return
    }

    const wsUrl = `${env.wsBaseUrl}/face/ws/calibration?interview_id=${interviewId}`
    console.log('[CalibrationPage] connecting WS:', wsUrl)
    const ws = new WebSocket(wsUrl)
    wsRef.current = ws

    ws.onopen = () => {
      setWsConnected(true)
      setStatus('Connected. Click each dot while looking directly at it.')
    }
    ws.onclose = () => {
      setWsConnected(false)
      setStatus('Disconnected from calibration server.')
    }
    ws.onerror = () => {
      setWsConnected(false)
      setStatus('Connection error. Check that the backend is running.')
    }
    ws.onmessage = (e) => {
      try { const msg = JSON.parse(e.data); if (msg?.status) setStatus(msg.status) } catch { /* ignore */ }
    }

    return () => ws.close()
  }, [cameraReady, interviewId])

  const handleDotClick = useCallback((point) => {
    if (captured.has(point.id)) return

    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    canvas.width = 640
    canvas.height = 360
    const ctx = canvas.getContext('2d')
    ctx.translate(640, 0)
    ctx.scale(-1, 1)
    ctx.drawImage(video, 0, 0, 640, 360)

    canvas.toBlob((blob) => {
      const ws = wsRef.current
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        setStatus('Not connected — frame not sent.')
        return
      }

      ws.send(JSON.stringify({
        type: 'calibration_point',
        point: point.id,
        label: point.label,
        interview_id: interviewId,
      }))

      ws.send(blob)

      setCaptured((prev) => new Set([...prev, point.id]))
      setStatus(`${captured.size + 1} / ${POINTS.length} captured — keep looking at the dots.`)
    }, 'image/jpeg', 0.85)
  }, [captured, interviewId])

  return (
    <div className="gaze-shell" aria-label="Gaze calibration screen">

      <canvas ref={canvasRef} style={{ display: 'none' }} aria-hidden="true" />

      <button
        type="button"
        className="gaze-back-btn"
        onClick={() => navigate('/candidate/consent')}
        aria-label="Go back to consent page"
      >
        ← Back
      </button>

      <div className="gaze-status-bar" role="status" aria-live="polite">
        <span className={`gaze-ws-dot ${wsConnected ? 'gaze-ws-dot--on' : 'gaze-ws-dot--off'}`} aria-hidden="true" />
        <span className="gaze-ws-label">{wsConnected ? 'Connected' : 'Disconnected'}</span>
        <span className="gaze-status-sep" aria-hidden="true">|</span>
        <span className="gaze-status-msg">{status}</span>
        <span className="gaze-status-sep" aria-hidden="true">|</span>
        <span className="gaze-count">
          <strong>{captured.size}</strong> / {POINTS.length} captured
        </span>
      </div>

      {POINTS.map((point) => {
        const done = captured.has(point.id)
        return (
          <button
            key={point.id}
            type="button"
            className={`gaze-dot ${done ? 'gaze-dot--done' : ''}`}
            style={{ left: `${point.x}%`, top: `${point.y}%` }}
            onClick={() => handleDotClick(point)}
            aria-label={`${point.label}${done ? ' — captured' : ' — click while looking here'}`}
            aria-pressed={done}
          >
            {done ? '✓' : '●'}
          </button>
        )
      })}

      <div className="gaze-pip" aria-label="Camera preview">
        <video
          ref={videoRef}
          className="gaze-pip-video"
          muted
          playsInline
          aria-label="Live camera feed"
        />
      </div>

      {allCaptured && (
        <button
          type="button"
          className="gaze-finish-btn"
          onClick={() => navigate('/candidate/interview')}
        >
          Finish Calibration →
        </button>
      )}
    </div>
  )
}
