import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import SelectField from '../forms/SelectField'
import FormInputField from '../forms/FormInputField'
import { DEFAULT_ROLE_OPTIONS } from '../../constants/tscOptions'
import { getTscOptions, getJdOptions } from '../../services/interviewService'
import { env } from '../../config/env'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function CandidateRowsInput({ candidates, onChange }) {
  const [draftName, setDraftName] = useState('')
  const [draftEmail, setDraftEmail] = useState('')
  const [draftError, setDraftError] = useState('')

  const commit = () => {
    const name = draftName.trim()
    const email = draftEmail.trim()
    if (!name) { setDraftError('Name is required.'); return false }
    if (!EMAIL_RE.test(email)) { setDraftError('Invalid email address.'); return false }
    if (candidates.some((c) => c.candidate_email === email)) { setDraftError('Email already added.'); return false }
    onChange([...candidates, { candidate_name: name, candidate_email: email }])
    setDraftName('')
    setDraftEmail('')
    setDraftError('')
    return true
  }

  return (
    <>
      {candidates.length > 0 && (
        <div className="candidate-rows">
          {candidates.map((c, i) => (
            <div key={c.candidate_email} className="candidate-row">
              <span className="candidate-row__name">{c.candidate_name}</span>
              <span className="candidate-row__email">{c.candidate_email}</span>
              <button type="button" className="candidate-row__remove"
                onClick={() => onChange(candidates.filter((_, j) => j !== i))}
                aria-label={`Remove ${c.candidate_email}`}>×</button>
            </div>
          ))}
        </div>
      )}
      <div className="candidate-add-row">
        <input type="text" className="candidate-add-row__input" placeholder="Candidate name"
          value={draftName} onChange={(e) => { setDraftName(e.target.value); setDraftError('') }} />
        <input type="email" className="candidate-add-row__input" placeholder="Candidate email"
          value={draftEmail} onChange={(e) => { setDraftEmail(e.target.value); setDraftError('') }}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), commit())} />
        <button type="button" className="candidate-add-row__btn" onClick={commit} aria-label="Add candidate">
          <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" /></svg>
          Add
        </button>
      </div>
      {draftError && <p className="field-error">{draftError}</p>}
    </>
  )
}

CandidateRowsInput.propTypes = {
  candidates: PropTypes.arrayOf(PropTypes.shape({ candidate_name: PropTypes.string, candidate_email: PropTypes.string })).isRequired,
  onChange: PropTypes.func.isRequired,
}

const INIT = {
  l2_panel: '', l2_email: '', level: '', jd_name: '', jd_url: '', role: '', tsc: '',
}

export default function BulkInterviewTab() {
  const [candidates, setCandidates] = useState([])
  const [form, setForm] = useState(INIT)
  const [errors, setErrors] = useState({})
  const [tscOptions, setTscOptions] = useState([])
  const [jdOptions, setJdOptions] = useState([])
  const [isLoadingTsc, setIsLoadingTsc] = useState(true)
  const [isLoadingJd, setIsLoadingJd] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [generalError, setGeneralError] = useState('')

  useEffect(() => {
    getTscOptions()
      .then(setTscOptions)
      .catch(() => {})
      .finally(() => setIsLoadingTsc(false))
    getJdOptions()
      .then((opts) => setJdOptions(opts))
      .catch(() => {})
      .finally(() => setIsLoadingJd(false))
  }, [])

  const setField = (name, value) => {
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
    setGeneralError('')
    setSuccessMessage('')
  }

  const validate = () => {
    const e = {}
    if (candidates.length === 0) e.emails = 'At least one candidate is required.'
    if (!form.l2_panel.trim()) e.l2_panel = 'Panel name is required.'
    if (!form.l2_email.trim()) e.l2_email = 'Panel email is required.'
    else if (!EMAIL_RE.test(form.l2_email.trim())) e.l2_email = 'Invalid email address.'
    if (!form.level.trim()) e.level = 'Level is required.'
    if (!form.jd_name.trim()) e.jd_name = 'JD is required.'
    if (!form.role.trim()) e.role = 'Role is required.'
    if (!form.tsc.trim()) e.tsc = 'TSC is required.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleGenerate = async (e) => {
    e.preventDefault()
    if (isGenerating || !validate()) return
    setIsGenerating(true)
    setGeneralError('')
    setSuccessMessage('')
    try {
      const fd = new FormData()
      fd.append('user_id', Number(localStorage.getItem('user_id') ?? 1))
      fd.append('candidates', JSON.stringify(candidates))
      fd.append('l2_panel', form.l2_panel.trim())
      fd.append('l2_email', form.l2_email.trim())
      fd.append('level', form.level.trim())
      fd.append('jd_name', form.jd_name.trim())
      fd.append('jd_url', form.jd_url.trim())
      fd.append('role', form.role.trim())
      fd.append('tsc', form.tsc.trim())
      const res = await fetch(`${env.apiBaseUrl.replace(/\/$/, '')}/bulk/interviews`, {
        method: 'POST',
        body: fd,
      })
      if (!res.ok) throw new Error(await res.text())
      const count = candidates.length
      setCandidates([])
      setForm(INIT)
      setErrors({})
      setSuccessMessage(`Bulk interviews created for ${count} candidate${count !== 1 ? 's' : ''}.`)
    } catch {
      setGeneralError('Unable to create bulk interviews. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const isFormComplete = candidates.length > 0 && form.l2_panel && form.l2_email && form.level && form.jd_name && form.role && form.tsc

  return (
    <form onSubmit={handleGenerate} noValidate>
      <section className="panel" aria-labelledby="bulk-heading">
        <div className="panel__header">
          <div className="panel__title-row">
            <svg aria-hidden="true" viewBox="0 0 24 24" className="panel__title-icon" focusable="false" fill="currentColor">
              <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
            </svg>
            <h2 id="bulk-heading">Bulk Interview Generation</h2>
          </div>
          <p>Enter candidate details and shared interview information.</p>
          <hr className="panel__divider" aria-hidden="true" />
        </div>

        <div className="fields-grid">
          <div className="form-group fields-grid__full">
            <label className="form-label">Candidates <span aria-hidden="true">*</span></label>
            <CandidateRowsInput
              candidates={candidates}
              onChange={(next) => { setCandidates(next); if (errors.emails) setErrors((p) => ({ ...p, emails: '' })) }}
            />
            {errors.emails && <p className="field-error" role="alert">{errors.emails}</p>}
          </div>

          <SelectField
            id="bulk-role" name="bulk-role" label="Role"
            value={form.role} onChange={(e) => setField('role', e.target.value)}
            options={DEFAULT_ROLE_OPTIONS} placeholder="Select or enter role" required error={errors.role}
          />
          <SelectField
            id="bulk-tsc" name="bulk-tsc" label="TSC"
            value={form.tsc} onChange={(e) => setField('tsc', e.target.value)}
            options={tscOptions} placeholder={isLoadingTsc ? 'Loading…' : 'Select TSC'} required error={errors.tsc}
          />
          <FormInputField
            id="bulk-level" name="level" label="Level"
            placeholder="e.g. SE, SSE, TL" value={form.level}
            onChange={(e) => setField('level', e.target.value)} required error={errors.level}
          />
          <SelectField
            id="bulk-jd" name="bulk-jd" label="JD"
            value={form.jd_name}
            onChange={(e) => {
              const selected = jdOptions.find((o) => o.name === e.target.value)
              setForm((prev) => ({ ...prev, jd_name: e.target.value, jd_url: selected?.url ?? '' }))
              if (errors.jd_name) setErrors((p) => ({ ...p, jd_name: '' }))
            }}
            options={jdOptions.map((o) => o.name)}
            placeholder={isLoadingJd ? 'Loading…' : 'Select JD'} required searchable error={errors.jd_name}
          />
          <FormInputField
            id="bulk-l2-panel" name="l2_panel" label="Panel Name"
            placeholder="Enter panel name" value={form.l2_panel}
            onChange={(e) => setField('l2_panel', e.target.value)} required error={errors.l2_panel}
          />
          <FormInputField
            id="bulk-l2-email" name="l2_email" label="Panel Email" type="email"
            placeholder="Enter panel email" value={form.l2_email}
            onChange={(e) => setField('l2_email', e.target.value)} required error={errors.l2_email}
          />
        </div>

        {generalError && <p className="form-level-error" role="alert">{generalError}</p>}
        {successMessage && <p className="form-success" role="status">{successMessage}</p>}
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
            ? `Creating ${candidates.length} interview${candidates.length !== 1 ? 's' : ''}…`
            : `Create${candidates.length > 0 ? ` ${candidates.length}` : ''} Bulk Interview${candidates.length !== 1 ? 's' : ''}`}
        </button>
      </section>
    </form>
  )
}
