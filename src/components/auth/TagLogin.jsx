import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import valueMomentumLogo from '../../assets/ValueMomentum_logo.png'

export default function TagLogin() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    email: 'tag@valuemomentum.com',
    password: 'password123',
  })
  const [error, setError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (error) setError('')
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    const email = form.email.trim().toLowerCase()
    const password = form.password

    if (!email || !password) {
      setError('Please enter your email and password.')
      return
    }

    const isValid = email === 'tag@valuemomentum.com' && password === 'password123'

    if (!isValid) {
      setError('Invalid credentials. Use the demo TAG account.')
      return
    }

    setError('')
    navigate('/dashboard')
  }

  return (
    <div className="c-login">
      <div className="c-login__left" aria-hidden="true">
        <div className="c-login__brand-icon">
          <img src={valueMomentumLogo} alt="ValueMomentum logo" className="c-login__brand-logo" />
        </div>
        <p className="c-login__welcome">Welcome to</p>
        <h1 className="c-login__platform-name">ValueMomentum Interview Portal</h1>
        <p className="c-login__sub">Sign in with your organizational account</p>
      </div>

      <div className="c-login__right">
        <div className="c-login__form-wrap">
          <h2>Sign in</h2>
          <p className="c-login__form-desc">Use your demo credentials to continue</p>

          <form onSubmit={handleSubmit} noValidate>
            <div className="c-form-group">
              <label htmlFor="tag-email" className="c-form-label">
                Email address <span aria-hidden="true">*</span>
              </label>
              <input
                id="tag-email"
                name="email"
                type="email"
                className="c-form-input"
                placeholder="tag@valuemomentum.com"
                value={form.email}
                onChange={handleChange}
                aria-required="true"
                autoComplete="email"
              />
            </div>

            <div className="c-form-group">
              <label htmlFor="tag-password" className="c-form-label">
                Password <span aria-hidden="true">*</span>
              </label>
              <input
                id="tag-password"
                name="password"
                type="password"
                className="c-form-input"
                placeholder="Enter password"
                value={form.password}
                onChange={handleChange}
                aria-required="true"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <p className="c-field-error" role="alert">
                {error}
              </p>
            )}

            <button type="submit" className="c-btn c-btn--primary c-btn--full">
              Sign in →
            </button>
          </form>

          <p style={{ textAlign: 'center', marginTop: 16, fontSize: 13, color: '#64748b' }}>
            Are you a candidate?{' '}
            <a href="/candidate/login" style={{ color: '#2563eb', fontWeight: 500, textDecoration: 'none' }}>Login here</a>
          </p>

          <p className="c-login__secure">
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14" aria-hidden="true">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
            </svg>
            Secure access for ValueMomentum interview team
          </p>
        </div>
      </div>
    </div>
  )
}
