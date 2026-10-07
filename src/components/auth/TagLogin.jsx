import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

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
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
          </svg>
        </div>
        <p className="c-login__welcome">Welcome to</p>
        <h1 className="c-login__platform-name">TAG Team Portal</h1>
        <p className="c-login__sub">Sign in with your organizational account</p>
      </div>

      <div className="c-login__right">
        <div className="c-login__form-wrap">
          <h2>TAG Login</h2>
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

          <p className="c-login__secure">
            <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14" aria-hidden="true">
              <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
            </svg>
            Secure access for TAG team members
          </p>
        </div>
      </div>
    </div>
  )
}
