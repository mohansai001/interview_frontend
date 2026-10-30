import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { env } from '../../config/env'

function extractL1Result(data) {
  if (data == null) return ''

  if (Array.isArray(data)) {
    for (const item of data) {
      const nested = extractL1Result(item)
      if (nested) return nested
    }
    return ''
  }

  if (typeof data !== 'object') {
    return typeof data === 'string' && data.trim() ? data.trim() : ''
  }

  const directCandidateKeys = ['l1_result', 'l1Result', 'l1_feedback', 'l1Feedback', 'result', 'feedback']
  for (const key of directCandidateKeys) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      const value = data[key]
      if (typeof value === 'string' && value.trim()) return value.trim()
      if (typeof value === 'number' || typeof value === 'boolean') return String(value)
      if (value && typeof value === 'object') {
        const nested = extractL1Result(value)
        if (nested) return nested
      }
    }
  }

  for (const value of Object.values(data)) {
    if (value && typeof value === 'object') {
      const nested = extractL1Result(value)
      if (nested) return nested
    }
  }

  return ''
}

async function fetchL1Feedback(interviewId) {
  const baseUrl = env.apiBaseUrl.replace(/\/$/, '')
  const endpoint = `${baseUrl}/interview/get-interview-details/${encodeURIComponent(interviewId)}`

  const response = await fetch(endpoint, {
    method: 'GET',
    headers: { Accept: 'application/json' },
  })

  if (!response.ok) {
    throw new Error('Unable to load L1 feedback for this interview.')
  }

  const payload = await response.json()
  const interview = payload?.data?.interview ?? payload?.interview ?? payload
  const result =
    interview?.l1_result ??
    interview?.l1Result ??
    interview?.l1_feedback ??
    interview?.l1Feedback ??
    payload?.data?.l1_result ??
    payload?.l1_result ??
    ''

  if (typeof result === 'string' && result.trim()) {
    return { result: result.trim(), payload }
  }

  if (typeof result === 'number' || typeof result === 'boolean') {
    return { result: String(result), payload }
  }

  return {
    result: 'No L1 feedback result is currently available for this interview.',
    payload,
  }
}

export default function L1FeedbackPage() {
  const { interviewId } = useParams()
  const [l1Result, setL1Result] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadL1Feedback() {
      setLoading(true)
      setError('')

      try {
        const response = await fetchL1Feedback(interviewId)
        if (!isMounted) return
        setL1Result(response.result)
      } catch (loadError) {
        if (!isMounted) return
        setError(loadError.message || 'Unable to load L1 feedback.')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    if (interviewId) {
      loadL1Feedback()
    }

    return () => {
      isMounted = false
    }
  }, [interviewId])

  return (
    <div className="l1-feedback-page">
      <div className="l1-feedback-card">
        <div className="l1-feedback-header">
          <div>
            <p className="l1-feedback-kicker">L1 Feedback Review</p>
            <h1 className="l1-feedback-title">Interview {interviewId}</h1>
          </div>
          <Link to="/dashboard" className="back-link">← Back to dashboard</Link>
        </div>

        <div className="l1-feedback-meta" aria-label="L1 review metadata">
          <div className="l1-feedback-meta__item">
            <span className="l1-feedback-meta__label">Review Type</span>
            <strong>L1 Technical Screening</strong>
          </div>
          <div className="l1-feedback-meta__item">
            <span className="l1-feedback-meta__label">Status</span>
            <strong>{loading ? 'Loading' : error ? 'Unavailable' : 'Available'}</strong>
          </div>
        </div>

        {loading ? (
          <div className="l1-feedback-state" aria-live="polite">Loading L1 feedback…</div>
        ) : error ? (
          <div className="l1-feedback-state l1-feedback-state--error" aria-live="polite">{error}</div>
        ) : (
          <>
            <p className="l1-feedback-label">L1 Result</p>
            <div className="l1-feedback-result" aria-live="polite">
              {l1Result || 'No L1 result available for this interview.'}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
