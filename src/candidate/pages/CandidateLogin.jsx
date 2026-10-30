import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCandidateContext } from '../CandidateApp'

export default function CandidateLogin() {
  const navigate = useNavigate()
  const { saveCandidate } = useCandidateContext()
  const [candidateId, setCandidateId] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!candidateId.trim()) {
      setError('Please enter your Interview ID.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const base = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
      const res = await fetch(`${base}/interview/start-interview/${candidateId.trim()}`, { method: 'POST' })
      if (!res.ok) throw new Error('Invalid Interview ID or interview not found.')
      const detailsRes = await fetch(`${base}/interview/get-interview-details/${candidateId.trim()}`)
      const detailsJson = detailsRes.ok ? await detailsRes.json() : {}
      const interview = detailsJson?.data?.interview ?? {}
      const interviewId = interview?.interview_id ?? candidateId.trim()
      saveCandidate({
        candidateId: candidateId.trim(),
        interviewId,
        interview_id: interviewId,
        name: interview.candidate_name,
        email: interview.candidate_email,
        role: interview.role,
        level: interview.level,
        tsc: interview.tsc,
        jdName: interview.jd_name,
      })
      navigate('/candidate/system-check')
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="c-login">
      {/* Left decorative panel */}
      <div className="c-login__left" aria-hidden="true">
        <div className="c-login__brand-icon">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
          </svg>
        </div>
        <p className="c-login__welcome">Welcome to</p>
        <h1 className="c-login__platform-name">Interview Platform</h1>
        <p className="c-login__sub">Please login using your Interview ID</p>
      </div>

      {/* Right form panel */}
      <div className="c-login__right">
        <div className="c-login__form-wrap">
          <h2>Candidate Login</h2>
          <p className="c-login__form-desc">Enter your Interview ID to continue</p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="c-form-group">
              <label htmlFor="candidateId" className="c-form-label">
                Interview ID <span aria-hidden="true">*</span>
              </label>
              <input
                id="candidateId"
                type="text"
                className={`c-form-input${error ? ' is-error' : ''}`}
                placeholder="Enter Interview ID"
                value={candidateId}
                onChange={(e) => { setCandidateId(e.target.value); setError('') }}
                aria-required="true"
                aria-invalid={Boolean(error)}
                aria-describedby={error ? 'cid-error' : undefined}
                autoFocus
              />
              {error && <p id="cid-error" className="c-field-error" role="alert">{error}</p>}
            </div>

            <button type="submit" className="c-btn c-btn--primary c-btn--full" disabled={loading}>
              {loading ? 'Verifying...' : 'Continue →'}
            </button>
          </form>

          <p className="c-login__secure">
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14" aria-hidden="true">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
            </svg>
            Your data is secure and confidential
          </p>
        </div>
      </div>
    </div>
  )
}

