import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import { env } from '../../config/env'
import { useCandidateContext } from '../CandidateApp'

const INSTRUCTIONS = [
  { icon: 'book',   text: 'Read each question carefully before answering.' },
  { icon: 'timer',  text: 'You will have limited time to answer each question.' },
  { icon: 'person', text: 'Make sure your face is clearly visible in the camera.' },
  { icon: 'block',  text: 'Do not switch tabs or open other applications.' },
  { icon: 'quiet',  text: 'Ensure a quiet environment for the best experience.' },
]

function InstrIcon({ type }) {
  const paths = {
    book:   'M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM6 4h5v8l-2.5-1.5L6 12V4z',
    timer:  'M15 1H9v2h6V1zm-4 13h2V8h-2v6zm8.03-6.61l1.42-1.42c-.43-.51-.9-.99-1.41-1.41l-1.42 1.42A7.012 7.012 0 0 0 12 5a7 7 0 1 0 7 7c0-1.97-.8-3.74-2.07-5.03l.1-.58zM12 19c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5z',
    person: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',
    block:  'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9A7.902 7.902 0 0 1 4 12zm8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1A7.902 7.902 0 0 1 20 12c0 4.42-3.58 8-8 8z',
    quiet:  'M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z',
  }
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
      <path d={paths[type]} />
    </svg>
  )
}
InstrIcon.propTypes = { type: PropTypes.string.isRequired }

export default function InterviewRoom() {
  const navigate = useNavigate()
  const { candidate, clearCandidate } = useCandidateContext()

  const [questions, setQuestions] = useState([])
  const [candidateDetails, setCandidateDetails] = useState(null)
  const [showInstructions, setShowInstructions] = useState(true)
  const [currentQ, setCurrentQ] = useState(0)
  const [answering, setAnswering] = useState(false)
  const [answered, setAnswered] = useState(new Set())
  const [timeLeft, setTimeLeft] = useState(2385)
  const [fsWarning, setFsWarning] = useState(false)
  const [liveTranscript, setLiveTranscript] = useState('')
  const [questionTranscripts, setQuestionTranscripts] = useState({})
  const [transcriptConnected, setTranscriptConnected] = useState(false)
  const [faceStatus, setFaceStatus] = useState('Face detection idle')
  const [faceConnected, setFaceConnected] = useState(false)

  const videoRef = useRef(null)
  const roomRef = useRef(null)
  const transcriptWsRef = useRef(null)
  const faceWsRef = useRef(null)
  const recorderRef = useRef(null)
  const audioStreamRef = useRef(null)
  const faceFrameTimerRef = useRef(null)
  const currentQRef = useRef(currentQ)

  // Fetch candidate details
  useEffect(() => {
    const id = candidate?.interviewId || candidate?.candidateId
    if (!id) return
    fetch(`${env.apiBaseUrl.replace(/\/$/, '')}/interview/get-interview-details/${id}`)
      .then((r) => r.json())
      .then((json) => setCandidateDetails(json?.data ?? json))
      .catch(() => {})
  }, [candidate?.interviewId, candidate?.candidateId])

  // Fetch questions
  useEffect(() => {
    const id = candidate?.interviewId || candidate?.candidateId
    if (!id) return
    fetch(`${env.apiBaseUrl.replace(/\/$/, '')}/interview/get_questions/${id}`, { method: 'POST' })
      .then((r) => r.json())
      .then((json) => {
        const entry = json?.questions?.find((q) => q.key === 'questions')
        if (!entry) return
        const parsed = JSON.parse(entry.value)
        setQuestions(parsed.questions ?? [])
      })
      .catch(() => {})
  }, [candidate?.interviewId, candidate?.candidateId])

  // Keep ref in sync so WS callbacks always have latest question index
  useEffect(() => { currentQRef.current = currentQ }, [currentQ])

  // ── Append incoming transcript text ──────────────────────────────────────
  const appendTranscript = useCallback((text) => {
    if (!text || !String(text).trim()) return
    const normalized = String(text).trim()
    setLiveTranscript((prev) => prev ? `${prev} ${normalized}` : normalized)
  }, [])

  // Sync liveTranscript → questionTranscripts while answering
  useEffect(() => {
    if (!answering || !liveTranscript) return
    const qId = questions[currentQRef.current]?.question_number
    if (!qId) return
    setQuestionTranscripts((prev) => ({ ...prev, [qId]: liveTranscript }))
  }, [liveTranscript, answering, questions])

  // ── Stop all capture ──────────────────────────────────────────────────────
  const stopAnswerCapture = useCallback(() => {
    audioStreamRef.current?.getTracks().forEach((t) => t.stop())
    audioStreamRef.current = null

    if (recorderRef.current) {
      try { recorderRef.current.stop() } catch { /* ignore */ }
    }
    recorderRef.current = null

    transcriptWsRef.current?.close()
    transcriptWsRef.current = null
    setTranscriptConnected(false)

    if (faceFrameTimerRef.current) {
      clearInterval(faceFrameTimerRef.current)
      faceFrameTimerRef.current = null
    }
    faceWsRef.current?.close()
    faceWsRef.current = null
    setFaceConnected(false)
    setFaceStatus('Face detection idle')
  }, [])

  // Parse transcript payloads returned by Azure Speech / backend WebSocket.
  const extractTranscriptText = useCallback((payload) => {
    if (!payload) return ''
    const raw = typeof payload === 'string' ? payload.trim() : ''
    if (!raw) return ''

    try {
      const msg = JSON.parse(raw)
      const value = msg?.transcript ?? msg?.text ?? msg?.message ?? msg?.value ?? msg?.final ?? msg?.partial ?? msg?.data
      if (typeof value === 'string' && value.trim()) return value.trim()
      if (typeof value === 'object' && value !== null) {
        const nested = value.transcript ?? value.text ?? value.message ?? value.value
        if (typeof nested === 'string' && nested.trim()) return nested.trim()
      }
    } catch {
      // Raw text, keep as-is.
    }

    return raw
  }, [])

  // ── Start capture when answering ─────────────────────────────────────────
  const startAnswerCapture = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia) return

    try {
      const audioStream = await navigator.mediaDevices.getUserMedia({ audio: true })
      audioStreamRef.current = audioStream

      const sessionId = candidate?.interviewId || 'candidate-session'
      const tWs = new WebSocket(`${env.wsBaseUrl.replace(/\/$/, '')}/transcript/ws/azure-transcript/?session_id=${sessionId}`)
      transcriptWsRef.current = tWs

      tWs.onopen = () => setTranscriptConnected(true)
      tWs.onclose = () => setTranscriptConnected(false)
      tWs.onerror = () => setTranscriptConnected(false)
      tWs.onmessage = (event) => {
        const raw = event.data
        if (typeof raw === 'string') {
          try {
            const msg = JSON.parse(raw)
            const text = msg?.transcript
            if (text && text.trim()) appendTranscript(text.trim())
          } catch { /* ignore */ }
        }
      }

      const fWs = new WebSocket(`${env.wsBaseUrl.replace(/\/$/, '')}/face/ws/interview`)
      faceWsRef.current = fWs
      fWs.onopen = () => setFaceConnected(true)
      fWs.onclose = () => setFaceConnected(false)
      fWs.onerror = () => setFaceConnected(false)
      fWs.onmessage = (e) => {
        try {
          const msg = JSON.parse(e.data)
          if (msg?.face_count !== undefined || msg?.gaze_direction) {
            setFaceStatus(`Face: ${msg.face_count ?? 0} • Gaze: ${msg.gaze_direction || 'unknown'}`)
          }
        } catch { /* ignore */ }
      }

      // 16kHz AudioContext — required for Azure Speech
      const audioContext = new AudioContext({ sampleRate: 16000 })
      const source = audioContext.createMediaStreamSource(audioStream)

      const CHUNK_SIZE = 16000 * 3 // 3 seconds of float32 samples
      let buffer = []

      const workletCode = `
        class PCMProcessor extends AudioWorkletProcessor {
          process(inputs) {
            const input = inputs[0]
            if (input && input.length && input[0].length) {
              this.port.postMessage(input[0])
            }
            return true
          }
        }
        registerProcessor('pcm-processor', PCMProcessor)
      `
      const workletBlob = new Blob([workletCode], { type: 'application/javascript' })
      const workletUrl = URL.createObjectURL(workletBlob)
      try {
        await audioContext.audioWorklet.addModule(workletUrl)
      } finally {
        URL.revokeObjectURL(workletUrl)
      }

      const workletNode = new AudioWorkletNode(audioContext, 'pcm-processor')
      workletNode.port.onmessage = (event) => {
        if (tWs.readyState !== WebSocket.OPEN) return
        buffer.push(...event.data)
        if (buffer.length >= CHUNK_SIZE) {
          const chunk = new Float32Array(buffer.splice(0, CHUNK_SIZE))
          tWs.send(chunk.buffer)
        }
      }

      source.connect(workletNode)
      workletNode.connect(audioContext.destination)
      recorderRef.current = {
        stop: () => {
          try { workletNode.disconnect() } catch { /* ignore */ }
          try { source.disconnect() } catch { /* ignore */ }
          try { audioContext.close() } catch { /* ignore */ }
          buffer = []
        },
        state: 'recording',
      }

      faceFrameTimerRef.current = setInterval(() => {
        const video = videoRef.current
        if (!video || fWs.readyState !== WebSocket.OPEN) return
        const canvas = document.createElement('canvas')
        canvas.width = video.videoWidth || 640
        canvas.height = video.videoHeight || 360
        canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height)
        canvas.toBlob((blob) => {
          if (blob && fWs.readyState === WebSocket.OPEN) fWs.send(blob)
        }, 'image/jpeg', 0.75)
      }, 1000)

    } catch (err) {
      console.error('[startAnswerCapture] Failed:', err)
      setFaceStatus('Microphone access denied.')
      setTranscriptConnected(false)
    }
  }, [appendTranscript, candidate?.interviewId, extractTranscriptText])

  // Start/stop capture based on answering state
  useEffect(() => {
    if (answering) {
      setLiveTranscript('')
      startAnswerCapture()
    } else {
      stopAnswerCapture()
    }
    return () => stopAnswerCapture()
  }, [answering]) // eslint-disable-line react-hooks/exhaustive-deps

  // Fullscreen helpers
  const enterFullscreen = useCallback(() => {
    const el = document.documentElement
    if (el.requestFullscreen) el.requestFullscreen()
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen()
  }, [])

  const exitFullscreen = useCallback(() => {
    if (document.exitFullscreen) document.exitFullscreen()
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen()
  }, [])

  const handleStartInterview = () => { setShowInstructions(false); enterFullscreen() }

  useEffect(() => {
    if (showInstructions) return
    const handler = () => {
      const isFs = document.fullscreenElement || document.webkitFullscreenElement
      if (!isFs) {
        setFsWarning(true)
        // Must be triggered by user gesture — show warning only, don't auto re-enter
        setTimeout(() => setFsWarning(false), 3000)
      }
    }
    document.addEventListener('fullscreenchange', handler)
    document.addEventListener('webkitfullscreenchange', handler)
    return () => {
      document.removeEventListener('fullscreenchange', handler)
      document.removeEventListener('webkitfullscreenchange', handler)
    }
  }, [showInstructions])

  // Countdown
  useEffect(() => {
    if (showInstructions) return
    const id = setInterval(() => setTimeLeft((t) => Math.max(0, t - 1)), 1000)
    return () => clearInterval(id)
  }, [showInstructions])

  // Camera feed
  useEffect(() => {
    if (showInstructions || !videoRef.current) return
    let stream
    navigator.mediaDevices?.getUserMedia({ video: true, audio: false })
      .then((s) => { stream = s; if (videoRef.current) videoRef.current.srcObject = s })
      .catch(() => {})
    return () => stream?.getTracks().forEach((t) => t.stop())
  }, [showInstructions])

  const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

  const handleEndAnswer = () => {
    const qId = questions[currentQ]?.question_number
    if (qId && liveTranscript) {
      setQuestionTranscripts((prev) => ({ ...prev, [qId]: liveTranscript }))
    }
    setAnswered((prev) => new Set([...prev, currentQ]))
    setAnswering(false)
  }

  const handleQuestionChange = (nextIndex) => {
    if (nextIndex < 0 || nextIndex >= questions.length) return
    setAnswering(false)
    setCurrentQ(nextIndex)
    setLiveTranscript(questionTranscripts[questions[nextIndex]?.question_number] || '')
  }

  const handleEndInterview = () => {
    stopAnswerCapture()
    exitFullscreen()
    clearCandidate()
    navigate('/candidate/login')
  }

  const question = questions[currentQ]
  const isAnswered = answered.has(currentQ)
  const displayTranscript = questionTranscripts[question?.question_number] || liveTranscript || ''

  if (!question && questions.length === 0) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, background: '#f8fafc' }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: 'spin 1s linear infinite' }}>
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        </svg>
        <p style={{ margin: 0, fontSize: 16, fontWeight: 600, color: '#1e293b' }}>Generating your questions...</p>
        <p style={{ margin: 0, fontSize: 13, color: '#6b7280' }}>Please wait while we prepare your interview.</p>
        <style>{`@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }`}</style>
      </div>
    )
  }

  // ── Instructions overlay ──────────────────────────────────────────────────
  if (showInstructions) {
    return (
      <div className="c-room-shell" aria-label="Interview room">
        <div className="c-instructions-overlay" role="dialog" aria-modal="true" aria-labelledby="instr-heading">
          <div className="c-instructions-modal">
            <div className="c-instructions-modal__icon" aria-hidden="true">i</div>
            <h2 id="instr-heading">Interview Instructions</h2>
            <p>Please read the instructions carefully before starting the interview.</p>
            <ul className="c-instructions-list">
              {INSTRUCTIONS.map((item) => (
                <li key={item.icon}><InstrIcon type={item.icon} />{item.text}</li>
              ))}
            </ul>
            <button type="button" className="c-btn c-btn--primary c-btn--full" onClick={handleStartInterview}>
              Start Interview
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ── Interview screen ──────────────────────────────────────────────────────
  return (
    <div className="c-interview" ref={roomRef}>
      {fsWarning && (
        <div className="c-fs-warning" role="alert" style={{ cursor: 'pointer' }} onClick={enterFullscreen}>
          ⚠️ You exited fullscreen. Click here to return to fullscreen mode.
        </div>
      )}

      <header className="c-interview-header">
        <div className="c-interview-header__brand">
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true" style={{ color: '#2563eb' }}>
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
          </svg>
          Interview Platform
        </div>
        <div className="c-interview-header__title">Interview Room</div>
        <div className="c-interview-header__actions">
          <button type="button" className="c-leave-btn" onClick={handleEndInterview}>End Interview</button>
        </div>
      </header>

      <div className="c-candidate-bar" aria-label="Candidate information">
        {[
          { label: 'Interview ID', value: candidateDetails?.interview_id },
          { label: 'Name',         value: candidateDetails?.candidate_name },
          { label: 'Role',         value: candidateDetails?.role },
          { label: 'Level',        value: candidateDetails?.level },
          { label: 'TSC',          value: candidateDetails?.tsc },
          { label: 'JD',           value: candidateDetails?.jd_name },
        ].map(({ label, value }) => (
          <div key={label} className="c-candidate-bar__item">
            <span className="c-candidate-bar__label">{label}</span>
            <span className="c-candidate-bar__value">{value ?? '—'}</span>
          </div>
        ))}
        <div className="c-candidate-bar__item c-candidate-bar__timer">
          <span className="c-candidate-bar__label">Time Remaining</span>
          <span className="c-candidate-bar__value" aria-live="polite">{fmt(timeLeft)}</span>
        </div>
      </div>

      <div className="c-interview-body">
        {/* Video */}
        <div className="c-video-panel">
          <p className="c-video-label">Your Video</p>
          <div className="c-video-feed" aria-label="Your camera feed">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }}
            />
            <div className="c-video-placeholder" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
              <p>Camera not available</p>
            </div>
          </div>
        </div>

        {/* Questions + Transcript */}
        <div className="c-question-panel">
          <div className="c-question-panel-header">
            <h3>Questions</h3>
            <div className="c-question-nav">
              <span>Question {currentQ + 1} of {questions.length}</span>
              <button type="button" className="c-qnav-btn" onClick={() => handleQuestionChange(currentQ - 1)} disabled={currentQ === 0} aria-label="Previous question">‹</button>
              <button type="button" className="c-qnav-btn" onClick={() => handleQuestionChange(currentQ + 1)} disabled={currentQ === questions.length - 1} aria-label="Next question">›</button>
            </div>
          </div>

          <div className="c-question-card">
            <div className="c-question-card__meta">
              <span className="c-badge c-badge--blue">Question {currentQ + 1}</span>
              <span className="c-badge c-badge--time">{question?.difficulty}</span>
              <span className="c-badge c-badge--time">{question?.question_type}</span>
              <span className="c-badge c-badge--time">{question?.source}</span>
            </div>
            <h4>{question?.question}</h4>
            <div className="c-question-card__actions">
              {!isAnswered && (
                answering
                  ? <button type="button" className="c-end-btn" onClick={handleEndAnswer}>End Answer</button>
                  : <button type="button" className="c-start-btn" onClick={() => setAnswering(true)}>Start Answer</button>
              )}
              {isAnswered && (
                <span className="c-answered-badge" role="status">
                  <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14" aria-hidden="true">
                    <path d="M9 16.2l-3.5-3.5-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
                  </svg>
                  Answered
                </span>
              )}
            </div>
            <div className="c-face-monitor" aria-live="polite">
              <span className={`c-face-dot ${faceConnected ? 'is-live' : ''}`} aria-hidden="true" />
              {faceStatus}
            </div>
          </div>

          <div className="c-transcript" aria-live="polite" aria-label="Speech transcript">
            <div className="c-transcript__header">
              <h4>Transcript</h4>
              <span className={`c-transcript__status ${transcriptConnected ? 'is-live' : ''}`}>
                {transcriptConnected ? '● Live' : '○ Idle'}
              </span>
            </div>
            {displayTranscript ? (
              <p className="c-transcript__content">{displayTranscript}</p>
            ) : (
              <p className="c-transcript__placeholder">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
                  <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" />
                </svg>
                {answering ? 'Listening... speak now.' : 'Click "Start Answer" to begin transcription.'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
