import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { env } from '../../config/env'

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

export default function CalibrationPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const sessionId = location.state?.sessionId ?? 'default-session'

  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)
  const wsRef = useRef(null)

  const [captured, setCaptured] = useState(new Set())
  const [status, setStatus] = useState('Starting camera...')
  const [wsConnected, setWsConnected] = useState(false)
  const [cameraReady, setCameraReady] = useState(false)

  const allCaptured = captured.size === POINTS.length

  // ── Start camera first, then open WS ─────────────────────────────────────
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

  // ── Open WS only after camera is ready ───────────────────────────────────
  useEffect(() => {
    if (!cameraReady) return

    const wsUrl = `${env.wsBaseUrl}/face/ws/calibration?session_id=${sessionId}`
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
  }, [cameraReady, sessionId])

  // ── Capture frame + send over WS ─────────────────────────────────────────
  const handleDotClick = useCallback((point) => {
    if (captured.has(point.id)) return

    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return

    // Draw 640×360 frame
    canvas.width = 640
    canvas.height = 360
    const ctx = canvas.getContext('2d')
    // Mirror to match display
    ctx.translate(640, 0)
    ctx.scale(-1, 1)
    ctx.drawImage(video, 0, 0, 640, 360)

    canvas.toBlob((blob) => {
      const ws = wsRef.current
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        setStatus('Not connected — frame not sent.')
        return
      }

      // Send JSON metadata first
      ws.send(JSON.stringify({
        type: 'calibration_point',
        point: point.id,
        label: point.label,
      }))

      // Then send the JPEG blob
      ws.send(blob)

      setCaptured((prev) => new Set([...prev, point.id]))
      setStatus(`${captured.size + 1} / ${POINTS.length} captured — keep looking at the dots.`)
    }, 'image/jpeg', 0.85)
  }, [captured])

  return (
    <div className="gaze-shell" aria-label="Gaze calibration screen">

      {/* Hidden canvas for frame capture */}
      <canvas ref={canvasRef} style={{ display: 'none' }} aria-hidden="true" />

      {/* ── Back button ── */}
      <button
        type="button"
        className="gaze-back-btn"
        onClick={() => navigate('/candidate/consent')}
        aria-label="Go back to consent page"
      >
        ← Back
      </button>

      {/* ── Status bar ── */}
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

      {/* ── 9 calibration dots ── */}
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

      {/* ── PiP camera preview ── */}
      <div className="gaze-pip" aria-label="Camera preview">
        <video
          ref={videoRef}
          className="gaze-pip-video"
          muted
          playsInline
          aria-label="Live camera feed"
        />
      </div>

      {/* ── Finish button ── */}
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
