import { useCallback, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useCandidateContext } from '../CandidateApp'

const QUESTIONS = [
  {
    id: 1,
    text: 'Explain the difference between SQL and NoSQL databases.',
    description: 'Please describe the key differences, advantages, and use cases.',
    timeLimit: 2,
  },
  {
    id: 2,
    text: 'What are the core principles of Object-Oriented Programming?',
    description: 'Explain encapsulation, inheritance, polymorphism, and abstraction with examples.',
    timeLimit: 3,
  },
  {
    id: 3,
    text: "How does React's virtual DOM improve performance?",
    description: 'Explain the reconciliation algorithm and when component re-renders occur.',
    timeLimit: 2,
  },
  {
    id: 4,
    text: 'Describe the SOLID principles in software engineering.',
    description: 'Explain each principle and provide a practical example for each.',
    timeLimit: 3,
  },
  {
    id: 5,
    text: 'How would you design a scalable REST API for a user management system?',
    description: 'Consider authentication, pagination, error handling, and API versioning.',
    timeLimit: 4,
  },
]

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
  const [showInstructions, setShowInstructions] = useState(true)
  const [currentQ, setCurrentQ] = useState(0)
  const [answering, setAnswering] = useState(false)
  const [answered, setAnswered] = useState(new Set())
  const [timeLeft, setTimeLeft] = useState(2385)
  const [fsWarning, setFsWarning] = useState(false)
  const videoRef = useRef(null)
  const roomRef = useRef(null)

  const enterFullscreen = useCallback(() => {
    const el = document.documentElement
    if (el.requestFullscreen) el.requestFullscreen()
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen()
    else if (el.mozRequestFullScreen) el.mozRequestFullScreen()
  }, [])

  const exitFullscreen = useCallback(() => {
    if (document.exitFullscreen) document.exitFullscreen()
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen()
    else if (document.mozCancelFullScreen) document.mozCancelFullScreen()
  }, [])

  // Enter fullscreen when interview starts
  const handleStartInterview = () => {
    setShowInstructions(false)
    enterFullscreen()
  }

  // If user presses Escape and exits fullscreen, show warning and re-enter
  useEffect(() => {
    if (showInstructions) return

    const handleFsChange = () => {
      const isFs =
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement

      if (!isFs) {
        setFsWarning(true)
        // Re-enter fullscreen after a short delay (browser requires user gesture workaround)
        setTimeout(() => {
          enterFullscreen()
          setFsWarning(false)
        }, 1500)
      }
    }

    document.addEventListener('fullscreenchange', handleFsChange)
    document.addEventListener('webkitfullscreenchange', handleFsChange)
    document.addEventListener('mozfullscreenchange', handleFsChange)

    return () => {
      document.removeEventListener('fullscreenchange', handleFsChange)
      document.removeEventListener('webkitfullscreenchange', handleFsChange)
      document.removeEventListener('mozfullscreenchange', handleFsChange)
    }
  }, [showInstructions, enterFullscreen])

  // Countdown timer
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

  const fmt = (secs) => {
    const m = Math.floor(secs / 60)
    const s = secs % 60
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  const handleEndInterview = () => {
    exitFullscreen()
    clearCandidate()
    navigate('/candidate/login')
  }

  const handleEndAnswer = () => {
    setAnswered((prev) => new Set([...prev, currentQ]))
    setAnswering(false)
  }

  const question = QUESTIONS[currentQ]
  const isAnswered = answered.has(currentQ)

  /* ── Instructions overlay ── */
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
                <li key={item.icon}>
                  <InstrIcon type={item.icon} />
                  {item.text}
                </li>
              ))}
            </ul>
            <button
              type="button"
              className="c-btn c-btn--primary c-btn--full"
              onClick={handleStartInterview}
            >
              Start Interview
            </button>
          </div>
        </div>
      </div>
    )
  }

  /* ── Full interview screen ── */
  return (
    <div className="c-interview" ref={roomRef}>

      {/* Fullscreen exit warning */}
      {fsWarning && (
        <div className="c-fs-warning" role="alert">
          ⚠️ Please stay in fullscreen mode during the interview. Returning to fullscreen...
        </div>
      )}

      {/* Header */}
      <header className="c-interview-header">
        <div className="c-interview-header__brand">
          <svg viewBox="0 0 24 24" fill="currentColor" width="20" height="20" aria-hidden="true" style={{ color: '#2563eb' }}>
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
          </svg>
          Interview Platform
        </div>
        <div className="c-interview-header__title">Interview Room</div>
        <div className="c-interview-header__actions">
          <button type="button" className="c-leave-btn" onClick={handleEndInterview}>
            End Interview
          </button>
        </div>
      </header>

      {/* Candidate info bar */}
      <div className="c-candidate-bar" aria-label="Candidate information">
        {[
          { label: 'Candidate ID', value: candidate?.candidateId },
          { label: 'Name',         value: candidate?.name },
          { label: 'Role',         value: candidate?.role },
          { label: 'Interview ID', value: candidate?.interviewId },
        ].map(({ label, value }) => (
          <div key={label} className="c-candidate-bar__item">
            <span className="c-candidate-bar__label">{label}</span>
            <span className="c-candidate-bar__value">{value}</span>
          </div>
        ))}
        <div className="c-candidate-bar__item c-candidate-bar__timer">
          <span className="c-candidate-bar__label">Time Remaining</span>
          <span className="c-candidate-bar__value" aria-live="polite" aria-label={`Time remaining: ${fmt(timeLeft)}`}>
            {fmt(timeLeft)}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="c-interview-body">
        {/* Left: Video */}
        <div className="c-video-panel">
          <p className="c-video-label">Your Video</p>
          <div className="c-video-feed" aria-label="Your camera feed">
            <video ref={videoRef} autoPlay muted playsInline style={{ display: 'block', width: '100%', height: '100%', objectFit: 'cover' }} />
            <div className="c-video-placeholder" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
              </svg>
              <p>Camera not available</p>
            </div>
          </div>
        </div>

        {/* Right: Questions + Transcript */}
        <div className="c-question-panel">
          <div className="c-question-panel-header">
            <h3>Questions</h3>
            <div className="c-question-nav">
              <span>Question {currentQ + 1} of {QUESTIONS.length}</span>
              <button type="button" className="c-qnav-btn" onClick={() => setCurrentQ((q) => q - 1)} disabled={currentQ === 0} aria-label="Previous question">‹</button>
              <button type="button" className="c-qnav-btn" onClick={() => setCurrentQ((q) => q + 1)} disabled={currentQ === QUESTIONS.length - 1} aria-label="Next question">›</button>
            </div>
          </div>

          <div className="c-question-card">
            <div className="c-question-card__meta">
              <span className="c-badge c-badge--blue">Question {currentQ + 1}</span>
              <span className="c-badge c-badge--time">{question.timeLimit} mins</span>
            </div>
            <h4>{question.text}</h4>
            <p>{question.description}</p>
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
          </div>

          <div className="c-transcript" aria-live="polite" aria-label="Speech transcript">
            <h4>Transcript</h4>
            <p className="c-transcript__placeholder">
              <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
                <path d="M12 14c1.66 0 2.99-1.34 2.99-3L15 5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3zm5.3-3c0 3-2.54 5.1-5.3 5.1S6.7 14 6.7 11H5c0 3.41 2.72 6.23 6 6.72V21h2v-3.28c3.28-.48 6-3.3 6-6.72h-1.7z" />
              </svg>
              Transcript will appear here in real-time as you speak...
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

