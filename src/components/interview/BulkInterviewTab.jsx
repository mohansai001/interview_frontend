// ────────────────────────────────────────────────────────────────────────────
// NOTE: This file is fully replaced below. The implementation now matches the
// single-interview form layout: multi-email chip input, Role, TSC, Resume.
// Candidate name is not collected (emails identify each candidate).
// ────────────────────────────────────────────────────────────────────────────
import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import SelectField from '../forms/SelectField'
import ResumeUploadField from '../forms/ResumeUploadField'
import { DEFAULT_ROLE_OPTIONS } from '../../constants/tscOptions'
import { getTscOptions, generateInterviewLink, uploadResume } from '../../services/interviewService'
import { validateResumeFile } from '../../utils/validation'
import { env } from '../../config/env'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function EmailChipsInput({ emails, onChange }) {
  const [draft, setDraft] = useState('')
  const [draftError, setDraftError] = useState('')
  const inputRef = useRef(null)

  const commitDraft = (raw = draft) => {
    const trimmed = raw.trim().replace(/[,;]+$/, '').trim()
    if (!trimmed) return
    if (!EMAIL_RE.test(trimmed)) { setDraftError('Invalid email address.'); return }
    if (emails.includes(trimmed)) { setDraftError('Email already added.'); return }
    onChange([...emails, trimmed])
    setDraft('')
    setDraftError('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',' || e.key === ';') {
      e.preventDefault()
      commitDraft()
    } else if (e.key === 'Backspace' && !draft && emails.length > 0) {
      onChange(emails.slice(0, -1))
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const added = e.clipboardData.getData('text')
      .split(/[\n,;]+/).map((s) => s.trim()).filter(Boolean)
      .filter((p) => EMAIL_RE.test(p) && !emails.includes(p))
    if (added.length) onChange([...emails, ...added])
  }

  return (
    <>
      <div
        className="email-chips-wrap"
        role="group"
        aria-label="Candidate emails"
        onClick={() => inputRef.current?.focus()}
      >
        {emails.map((email, i) => (
          <span key={email} className="email-chip">
            {email}
            <button
              type="button"
              className="email-chip__remove"
              onClick={(e) => { e.stopPropagation(); onChange(emails.filter((_, j) => j !== i)) }}
              aria-label={`Remove ${email}`}
            >×</button>
          </span>
        ))}
        <input
          ref={inputRef}
          type="text"
          className="email-chips-input"
          value={draft}
          onChange={(e) => { setDraft(e.target.value); setDraftError('') }}
          onKeyDown={handleKeyDown}
          onBlur={() => commitDraft()}
          onPaste={handlePaste}
          placeholder={emails.length === 0 ? 'Type email and press Enter or comma' : 'Add another…'}
          aria-label="Type a candidate email"
        />
      </div>
      {draftError && <p className="field-error">{draftError}</p>}
    </>
  )
}

EmailChipsInput.propTypes = {
  emails: PropTypes.arrayOf(PropTypes.string).isRequired,
  onChange: PropTypes.func.isRequired,
}

export default function BulkInterviewTab() {
  const [emails, setEmails] = useState([])
  const [emailError, setEmailError] = useState('')
  const [role, setRole] = useState('')
  const [roleError, setRoleError] = useState('')
  const [tsc, setTsc] = useState('')
  const [tscError, setTscError] = useState('')
  const [resumeFile, setResumeFile] = useState(null)
  const [resumeError, setResumeError] = useState('')
  const [tscOptions, setTscOptions] = useState([])
  const [isLoadingTsc, setIsLoadingTsc] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [results, setResults] = useState(null)
  const [generalError, setGeneralError] = useState('')
  const [copyStatuses, setCopyStatuses] = useState({})

  useEffect(() => {
    let mounted = true
    getTscOptions()
      .then((opts) => { if (mounted) setTscOptions(opts) })
      .catch(() => { if (mounted) setGeneralError('Unable to load TSC options.') })
      .finally(() => { if (mounted) setIsLoadingTsc(false) })
    return () => { mounted = false }
  }, [])

  const validate = () => {
    let valid = true
    if (emails.length === 0) { setEmailError('At least one email is required.'); valid = false }
    else setEmailError('')
    if (!role) { setRoleError('Role is required.'); valid = false }
    else setRoleError('')
    if (!tsc) { setTscError('TSC is required.'); valid = false }
    else setTscError('')
    const rErr = validateResumeFile(resumeFile, env.maxResumeSizeBytes)
    setResumeError(rErr)
    if (rErr) valid = false
    return valid
  }

  const handleGenerate = async (event) => {
    event.preventDefault()
    if (isGenerating || !validate()) return
    setIsGenerating(true)
    setGeneralError('')
    setResults(null)
    try {
      const uploaded = await uploadResume(resumeFile)
      const generated = await Promise.all(
        emails.map((email) =>
          generateInterviewLink({ candidateName: email, candidateEmail: email, role, tsc, resumeName: uploaded.name })
        )
      )
      setResults(generated)
    } catch {
      setGeneralError('Unable to generate interview links. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopy = async (link, index) => {
    try {
      await navigator.clipboard.writeText(link)
      setCopyStatuses((prev) => ({ ...prev, [index]: 'Copied!' }))
      setTimeout(() => setCopyStatuses((prev) => ({ ...prev, [index]: '' })), 2000)
    } catch {
      setCopyStatuses((prev) => ({ ...prev, [index]: 'Copy failed' }))
    }
  }

  const handleReset = () => {
    setEmails([]); setEmailError('')
    setRole(''); setRoleError('')
    setTsc(''); setTscError('')
    setResumeFile(null); setResumeError('')
    setResults(null); setGeneralError('')
    setCopyStatuses({})
  }

  const isFormComplete = emails.length > 0 && role && tsc && resumeFile

  if (results) {
    return (
      <section className="panel" aria-labelledby="bulk-results-heading">
        <div className="panel__header">
          <div className="panel__title-row">
            <h2 id="bulk-results-heading">Interview Links Generated</h2>
          </div>
          <p>{results.length} link{results.length !== 1 ? 's' : ''} created successfully.</p>
          <hr className="panel__divider" aria-hidden="true" />
        </div>
        <div className="bulk-results">
          {results.map((r, i) => (
            <div key={i} className="bulk-result-row">
              <div className="bulk-result-row__info">
                <span className="bulk-result-row__email">{r.candidateEmail}</span>
                <span className="bulk-result-row__meta">{r.role} · {r.tsc}</span>
              </div>
              <div className="bulk-result-row__link">
                <a href={r.interviewLink} className="bulk-result-row__url">{r.interviewLink}</a>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => handleCopy(r.interviewLink, i)}
                  aria-label={`Copy link for ${r.candidateEmail}`}
                >{copyStatuses[i] || 'Copy'}</button>
              </div>
            </div>
          ))}
        </div>
        <div className="result-actions">
          <button type="button" className="btn btn-primary" onClick={handleReset}>Generate More</button>
        </div>
      </section>
    )
  }

  return (
    <form onSubmit={handleGenerate} noValidate>
      <section className="panel" aria-labelledby="bulk-heading">
        <div className="panel__header">
          <div className="panel__title-row">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="panel__title-icon" focusable="false" fill="currentColor">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
            </svg>
            <h2 id="bulk-heading">Generate Interview Links</h2>
          </div>
          <p>Enter multiple candidate emails with a shared role and TSC.</p>
          <hr className="panel__divider" aria-hidden="true" />
        </div>

        <div className="fields-grid">
          <div className="form-group fields-grid__full">
            <label className="form-label">
              Candidate Emails <span aria-hidden="true">*</span>
              <span className="form-label__meta"> — press Enter or comma after each email</span>
            </label>
            <EmailChipsInput emails={emails} onChange={(next) => { setEmails(next); setEmailError('') }} />
            {emailError && <p className="field-error" role="alert">{emailError}</p>}
          </div>

          <SelectField
            id="bulk-role" name="bulk-role" label="Role"
            value={role} onChange={(e) => { setRole(e.target.value); setRoleError('') }}
            options={DEFAULT_ROLE_OPTIONS} placeholder="Select or enter role" required error={roleError}
          />
          <SelectField
            id="bulk-tsc" name="bulk-tsc" label="TSC"
            value={tsc} onChange={(e) => { setTsc(e.target.value); setTscError('') }}
            options={tscOptions} placeholder={isLoadingTsc ? 'Loading TSC options...' : 'Select TSC'} required error={tscError}
          />
        </div>

        <div id="bulk-resume-focus-target" tabIndex={-1} />
        <ResumeUploadField
          file={resumeFile}
          error={resumeError}
          onFileSelected={(f) => { setResumeFile(f); setResumeError(validateResumeFile(f, env.maxResumeSizeBytes)) }}
          onRemove={() => { setResumeFile(null); setResumeError('') }}
          helperText={`PDF files only. Max size ${Math.round(env.maxResumeSizeBytes / (1024 * 1024))} MB.`}
        />
        {generalError && <p className="form-level-error" role="alert">{generalError}</p>}
      </section>

      <section className="panel panel--action">
        <button
          type="submit"
          className="btn btn-primary btn-generate"
          disabled={!isFormComplete || isGenerating || isLoadingTsc}
          aria-disabled={!isFormComplete || isGenerating || isLoadingTsc}
        >
          <svg aria-hidden="true" viewBox="0 0 24 24" className="btn-generate__icon" focusable="false" fill="currentColor">
            <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
          </svg>
          {isGenerating
            ? `Generating ${emails.length} link${emails.length !== 1 ? 's' : ''}…`
            : `Generate${emails.length > 0 ? ` ${emails.length}` : ''} Interview Link${emails.length !== 1 ? 's' : ''}`}
        </button>
      </section>
    </form>
  )
}

