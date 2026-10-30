import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CandidateHeader from '../CandidateHeader'
import { useCandidateContext } from '../CandidateApp'

const CONSENT_ITEMS = [
  { id: 'camera',    text: 'I allow the platform to access my camera, microphone and screen', detail: 'This is required for the interview process.' },
  { id: 'recording', text: 'I understand that this interview may be recorded',                detail: 'The recording will be used for evaluation purposes only.' },
  { id: 'data',      text: 'I agree to the collection and processing of my data',             detail: 'Your data will be handled as per the privacy policy.' },
  { id: 'nohelp',    text: 'I confirm that I will not seek external help during the interview', detail: 'Any violation may result in disqualification.' },
  { id: 'terms',     text: 'I have read and agree to the terms and conditions',               detail: 'Please read the terms and conditions carefully.' },
]

const SELFIE = { idle: 'idle', streaming: 'streaming', captured: 'captured', error: 'error' }

export default function ConsentPage() {
  const navigate = useNavigate()
  const { saveCandidate, candidate } = useCandidateContext()
  const [checked, setChecked] = useState({})
  const [selfieStatus, setSelfieStatus] = useState(SELFIE.idle)
  const [photo, setPhoto] = useState(null)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)

  const allChecked = CONSENT_ITEMS.every((item) => checked[item.id])
  const canProceed = allChecked && photo

  // Stop stream on unmount
  useEffect(() => {
    return () => streamRef.current?.getTracks().forEach((t) => t.stop())
  }, [])

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true })
      streamRef.current = stream
      setSelfieStatus(SELFIE.streaming)
    } catch {
      setSelfieStatus(SELFIE.error)
    }
  }

  // Attach stream to video element after status changes to streaming
  useEffect(() => {
    if (selfieStatus === SELFIE.streaming && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current
      videoRef.current.play().catch(() => {})
    }
  }, [selfieStatus])

  const capturePhoto = () => {
    const video = videoRef.current
    const canvas = canvasRef.current
    if (!video || !canvas) return
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d').drawImage(video, 0, 0)
    const dataUrl = canvas.toDataURL('image/jpeg', 0.9)
    setPhoto(dataUrl)
    setSelfieStatus(SELFIE.captured)
    streamRef.current?.getTracks().forEach((t) => t.stop())
  }

  const retake = () => {
    setPhoto(null)
    setSelfieStatus(SELFIE.idle)
    startCamera()
  }

  const handleNext = () => {
    const interviewId = candidate?.interviewId ?? candidate?.interview_id ?? ''
    const nextCandidate = photo ? { ...candidate, photo } : candidate
    if (nextCandidate) saveCandidate(nextCandidate)
    navigate('/candidate/calibration', {
      state: { interviewId },
    })
  }

  return (
    <div className="c-page">
      <CandidateHeader title="Consent" />

      <div className="c-container c-container--narrow">
        {/* Header */}
        <div className="c-consent-header">
          <div className="c-consent-header__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
            </svg>
          </div>
          <h2>Consent and Agreement</h2>
          <p>Please read and accept all the terms, then take a selfie to continue</p>
        </div>

        {/* Consent checkboxes */}
        <div className="c-consent-items" role="group" aria-label="Consent items">
          {CONSENT_ITEMS.map((item) => (
            <label key={item.id} className="c-consent-item">
              <input
                type="checkbox"
                className="c-checkbox"
                checked={Boolean(checked[item.id])}
                onChange={() => setChecked((prev) => ({ ...prev, [item.id]: !prev[item.id] }))}
                aria-required="true"
              />
              <div>
                <p className="c-consent-item__text">{item.text}<span aria-hidden="true"> *</span></p>
                <p className="c-consent-item__detail">{item.detail}</p>
              </div>
            </label>
          ))}
        </div>

        {/* Selfie section */}
        <div className="c-selfie-section">
          <div className="c-selfie-header">
            <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" aria-hidden="true">
              <path d="M12 15.2A3.2 3.2 0 0 1 8.8 12 3.2 3.2 0 0 1 12 8.8 3.2 3.2 0 0 1 15.2 12 3.2 3.2 0 0 1 12 15.2M12 7a5 5 0 0 0-5 5 5 5 0 0 0 5 5 5 5 0 0 0 5-5 5 5 0 0 0-5-5m-7 2H3V7H1v10h2v-2h2v2h2V9H5m4-6v2h6V3h-6M9 5V3H7v4h2V5m8 0V3h-2v2h-2v2h2v2h2V7h2V5h-2z" />
            </svg>
            <h3>Identity Verification</h3>
            {photo && (
              <span className="c-badge c-badge--success" style={{ marginLeft: 'auto' }}>
                <svg viewBox="0 0 24 24" fill="currentColor" width="12" height="12" aria-hidden="true">
                  <path d="M9 16.2l-3.5-3.5-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
                </svg>
                Photo Captured
              </span>
            )}
          </div>
          <p className="c-selfie-desc">Take a clear selfie for identity verification before the interview.</p>

          <div className="c-selfie-preview">
            {/* Always in DOM — visibility controlled by CSS */}
            <video
              ref={videoRef}
              className="c-selfie-video"
              muted
              playsInline
              aria-label="Camera preview"
              style={{ display: selfieStatus === SELFIE.streaming ? 'block' : 'none' }}
            />

            {/* Captured photo */}
            {selfieStatus === SELFIE.captured && photo && (
              <img src={photo} alt="Your selfie" className="c-selfie-img" />
            )}

            {/* Idle placeholder */}
            {selfieStatus === SELFIE.idle && (
              <div className="c-selfie-placeholder" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="currentColor" width="40" height="40">
                  <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                </svg>
                <p>Camera preview will appear here</p>
              </div>
            )}

            {/* Error */}
            {selfieStatus === SELFIE.error && (
              <div className="c-selfie-placeholder c-selfie-placeholder--error" aria-live="polite">
                <svg viewBox="0 0 24 24" fill="currentColor" width="36" height="36">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
                </svg>
                <p>Camera access denied. Please allow camera permissions.</p>
              </div>
            )}
          </div>

          {/* Hidden canvas for capture */}
          <canvas ref={canvasRef} className="c-selfie-canvas" aria-hidden="true" />

          {/* Camera controls */}
          <div className="c-selfie-controls">
            {selfieStatus === SELFIE.idle && (
              <button type="button" className="c-btn c-btn--outline" onClick={startCamera}>
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
                  <path d="M12 15.2A3.2 3.2 0 0 1 8.8 12 3.2 3.2 0 0 1 12 8.8 3.2 3.2 0 0 1 15.2 12 3.2 3.2 0 0 1 12 15.2M12 7a5 5 0 0 0-5 5 5 5 0 0 0 5 5 5 5 0 0 0 5-5 5 5 0 0 0-5-5m-7 2H3V7H1v10h2v-2h2v2h2V9H5m4-6v2h6V3h-6M9 5V3H7v4h2V5m8 0V3h-2v2h-2v2h2v2h2V7h2V5h-2z" />
                </svg>
                Open Camera
              </button>
            )}

            {selfieStatus === SELFIE.streaming && (
              <button type="button" className="c-btn c-btn--primary" onClick={capturePhoto}>
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
                  <path d="M12 15.2A3.2 3.2 0 0 1 8.8 12 3.2 3.2 0 0 1 12 8.8 3.2 3.2 0 0 1 15.2 12 3.2 3.2 0 0 1 12 15.2M12 7a5 5 0 0 0-5 5 5 5 0 0 0 5 5 5 5 0 0 0 5-5 5 5 0 0 0-5-5m-7 2H3V7H1v10h2v-2h2v2h2V9H5m4-6v2h6V3h-6M9 5V3H7v4h2V5m8 0V3h-2v2h-2v2h2v2h2V7h2V5h-2z" />
                </svg>
                Take Selfie
              </button>
            )}

            {selfieStatus === SELFIE.captured && (
              <button type="button" className="c-btn c-btn--outline" onClick={retake}>
                <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
                  <path d="M17.65 6.35A7.958 7.958 0 0 0 12 4c-4.42 0-7.99 3.58-7.99 8s3.57 8 7.99 8c3.73 0 6.84-2.55 7.73-6h-2.08A5.99 5.99 0 0 1 12 18c-3.31 0-6-2.69-6-6s2.69-6 6-6c1.66 0 3.14.69 4.22 1.78L13 11h7V4l-2.35 2.35z" />
                </svg>
                Retake
              </button>
            )}

            {selfieStatus === SELFIE.error && (
              <button type="button" className="c-btn c-btn--outline" onClick={startCamera}>
                Try Again
              </button>
            )}
          </div>
        </div>

        {/* Next button */}
        <div className="c-actions">
          <button
            type="button"
            className="c-btn c-btn--primary"
            disabled={!canProceed}
            aria-disabled={!canProceed}
            onClick={handleNext}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  )
}
