/**
 * ThankYouPage.jsx - Candidate completion confirmation after finishing an interview.
 *
 * Purpose: Displays the final acknowledgement screen once the candidate ends or completes the interview.
 * Props: None
 * Context: None
 * Key Behavior: Shows a success acknowledgement with a clear call to action to return to the login page.
 * Accessibility: Uses semantic heading and main landmark; keeps actions keyboard-focusable and readable.
 */
import { useNavigate } from 'react-router-dom'

export default function ThankYouPage() {
  const navigate = useNavigate()

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
        background: '#f8fafc',
        padding: 24,
      }}
      aria-labelledby="thank-you-heading"
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          background: '#dcfce7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        aria-hidden="true"
      >
        <svg viewBox="0 0 24 24" fill="#16a34a" width="36" height="36" aria-hidden="true">
          <path d="M9 16.2l-3.5-3.5-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
        </svg>
      </div>

      <h1 id="thank-you-heading" style={{ margin: 0, fontSize: 28, fontWeight: 700, color: '#1e293b' }}>
        Thank you for attending the interview
      </h1>

      <p style={{ margin: 0, fontSize: 15, color: '#475569', textAlign: 'center', maxWidth: 420, lineHeight: 1.6 }}>
        Your interview has been submitted successfully. Our team will review your responses and get back to you soon.
      </p>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: '#fff',
          border: '1px solid #e2e8f0',
          borderRadius: 10,
          padding: '14px 24px',
          boxShadow: '0 1px 2px rgba(15, 23, 42, 0.04)',
        }}
      >
        <span style={{ fontSize: 13, color: '#64748b', fontWeight: 500 }}>Feedback Status</span>
        <span
          style={{
            background: '#fef9c3',
            color: '#854d0e',
            fontSize: 12,
            fontWeight: 600,
            padding: '3px 10px',
            borderRadius: 20,
          }}
        >
          Pending
        </span>
      </div>

      <button
        type="button"
        className="c-btn c-btn--outline"
        onClick={() => navigate('/candidate/login')}
      >
        Back to Login
      </button>
    </main>
  )
}
