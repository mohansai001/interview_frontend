import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import CandidateHeader from '../CandidateHeader'

const CONSENT_ITEMS = [
  {
    id: 'camera',
    text: 'I allow the platform to access my camera, microphone and screen',
    detail: 'This is required for the interview process.',
  },
  {
    id: 'recording',
    text: 'I understand that this interview may be recorded',
    detail: 'The recording will be used for evaluation purposes only.',
  },
  {
    id: 'data',
    text: 'I agree to the collection and processing of my data',
    detail: 'Your data will be handled as per the privacy policy.',
  },
  {
    id: 'nohelp',
    text: 'I confirm that I will not seek external help during the interview',
    detail: 'Any violation may result in disqualification.',
  },
  {
    id: 'terms',
    text: 'I have read and agree to the terms and conditions',
    detail: 'Please read the terms and conditions carefully.',
  },
]

export default function ConsentPage() {
  const navigate = useNavigate()
  const [checked, setChecked] = useState({})

  const allChecked = CONSENT_ITEMS.every((item) => checked[item.id])

  const toggle = (id) =>
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }))

  return (
    <div className="c-page">
      <CandidateHeader title="Consent" />

      <div className="c-container c-container--narrow">
        <div className="c-consent-header">
          <div className="c-consent-header__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor" width="26" height="26">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
            </svg>
          </div>
          <h2>Consent and Agreement</h2>
          <p>Please read and accept all the terms to continue</p>
        </div>

        <div className="c-consent-items" role="group" aria-label="Consent items">
          {CONSENT_ITEMS.map((item) => (
            <label key={item.id} className="c-consent-item">
              <input
                type="checkbox"
                className="c-checkbox"
                checked={Boolean(checked[item.id])}
                onChange={() => toggle(item.id)}
                aria-required="true"
              />
              <div>
                <p className="c-consent-item__text">
                  {item.text}
                  <span aria-hidden="true"> *</span>
                </p>
                <p className="c-consent-item__detail">{item.detail}</p>
              </div>
            </label>
          ))}
        </div>

        <div className="c-actions">
          <button
            type="button"
            className="c-btn c-btn--primary"
            disabled={!allChecked}
            aria-disabled={!allChecked}
            onClick={() => navigate('/candidate/interview')}
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  )
}

