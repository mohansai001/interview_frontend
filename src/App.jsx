import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppHeader from './components/layout/AppHeader'
import Dashboard from './components/dashboard/Dashboard'
import BulkInterviewTab from './components/interview/BulkInterviewTab'
import FormInputField from './components/forms/FormInputField'
import SelectField from './components/forms/SelectField'
import ResumeUploadField from './components/forms/ResumeUploadField'
import { env } from './config/env'
import { generateInterviewLink, getJdOptions, getTscOptions } from './services/interviewService'
import { validateCandidateForm, validateResumeFile } from './utils/validation'
import { DEFAULT_JD_OPTIONS, DEFAULT_ROLE_OPTIONS } from './constants/tscOptions'

const INITIAL_FORM_DATA = {
  candidateName: '',
  candidateEmail: '',
  role: '',
  tsc: '',
  jd: '',
  level: '',
  panelname: '',
  panelemail: '',
}

const SIDEBAR_ITEMS = [
  { key: 'dashboard',   label: 'Dashboard',               icon: 'M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z',                                                                                                                                                                    active: true  },
  { key: 'generate',   label: 'Generate Interview Link',  icon: 'M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z', active: true  },
  { key: 'interviews', label: 'Interviews',                icon: 'M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z',                                                active: false },
  { key: 'candidates', label: 'Candidates',                icon: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',                                                                                  active: false },
  { key: 'reports',    label: 'Reports',                   icon: 'M5 9.2h3V19H5zM10.6 5h2.8v14h-2.8zm5.6 8H19v6h-2.8z',                                                                                                                                             active: false },
  { key: 'settings',   label: 'Settings',                  icon: 'M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z', active: false },
]

export default function App({ page = 'dashboard' }) {
  const navigate = useNavigate()
  const [userName] = useState('John Doe')
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activePage, setActivePage] = useState(page)
  const [activeTab, setActiveTab] = useState('single')
  const [formData, setFormData] = useState(INITIAL_FORM_DATA)
  const [formErrors, setFormErrors] = useState({})
  const [resumeFile, setResumeFile] = useState(null)
  const [resumeError, setResumeError] = useState('')
  const [tscOptions, setTscOptions] = useState([])
  const [jdOptions, setJdOptions] = useState([])
  const [isLoadingTsc, setIsLoadingTsc] = useState(true)
  const [isLoadingJd, setIsLoadingJd] = useState(true)
  const [isGenerating, setIsGenerating] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  const [generalError, setGeneralError] = useState('')

  useEffect(() => {
    document.title = 'Interview Generation - TAG Team Portal'
  }, [])

  useEffect(() => {
    let mounted = true
    async function loadTscOptions() {
      try {
        const options = await getTscOptions()
        if (mounted) setTscOptions(options)
      } catch {
        if (mounted) setGeneralError('Unable to load TSC options. Please refresh the page.')
      } finally {
        if (mounted) setIsLoadingTsc(false)
      }
    }

    loadTscOptions()
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    let mounted = true
    async function loadJdOptions() {
      try {
        const options = await getJdOptions()
        if (mounted) setJdOptions(options.length > 0 ? options : DEFAULT_JD_OPTIONS)
      } catch {
        if (mounted) setJdOptions(DEFAULT_JD_OPTIONS)
      } finally {
        if (mounted) setIsLoadingJd(false)
      }
    }
    loadJdOptions()
    return () => { mounted = false }
  }, [])

  const isFormComplete = useMemo(() => {
    const hasRequiredText =
      formData.candidateName.trim() &&
      formData.candidateEmail.trim() &&
      formData.role.trim() &&
      formData.tsc.trim() &&
      formData.level.trim() &&
      formData.panelname.trim() &&
      formData.panelemail.trim() &&
      formData.jd.trim()
    return Boolean(hasRequiredText && resumeFile)
  }, [formData, resumeFile])

  const handleFieldChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setGeneralError('')
    if (formErrors[name]) setFormErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const validateForm = () => {
    const candidateErrors = validateCandidateForm(formData)
    const resumeValidationError = validateResumeFile(resumeFile, env.maxResumeSizeBytes)
    setFormErrors(candidateErrors)
    setResumeError(resumeValidationError)
    return Object.keys(candidateErrors).length === 0 && !resumeValidationError
  }

  const handleFieldBlur = (event) => {
    const { name } = event.target
    const candidateErrors = validateCandidateForm(formData)
    setFormErrors((prev) => ({ ...prev, [name]: candidateErrors[name] || '' }))
  }

  const handleResumeSelected = (file) => {
    setResumeFile(file)
    setSuccessMessage('')
    setGeneralError('')
    setResumeError(validateResumeFile(file, env.maxResumeSizeBytes))
  }

  const handleGenerate = async (event) => {
    event.preventDefault()
    if (isGenerating) return
    if (!validateForm()) return
    setIsGenerating(true)
    setGeneralError('')
    setSuccessMessage('')
    try {
      await generateInterviewLink({
        user_id: 1,
        candidate_name: formData.candidateName.trim(),
        candidate_email: formData.candidateEmail.trim(),
        l2_panel: formData.panelname.trim(),
        l2_email: formData.panelemail.trim(),
        level: formData.level.trim(),
        jd_name: formData.jd.trim(),
        role: formData.role.trim(),
        tsc: formData.tsc.trim(),
        file: resumeFile,
      })
      // Reset form and show confirmation — no result panel
      setFormData(INITIAL_FORM_DATA)
      setFormErrors({})
      setResumeFile(null)
      setResumeError('')
      setSuccessMessage(`Interview email sent to ${formData.candidateEmail.trim()}.`)
    } catch {
      setGeneralError('Unable to send the interview email. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleLogout = () => {
    setFormData(INITIAL_FORM_DATA)
    setFormErrors({})
    setResumeFile(null)
    setResumeError('')
    setGeneralError('')
    setSuccessMessage('')
  }

  return (
    <div className="app-shell">
      <a href="#maincontent" className="skip-link">Skip to main content</a>

      <AppHeader
        pageTitle={SIDEBAR_ITEMS.find((i) => i.key === activePage)?.label ?? 'Portal'}
        userName={userName}
        notificationCount={3}
        onToggleSidebar={() => setSidebarOpen((v) => !v)}
        onLogout={handleLogout}
      />

      <div className="app-body">
        <aside className={`app-sidebar ${sidebarOpen ? 'is-open' : 'is-collapsed'}`} aria-label="Application navigation">
          {sidebarOpen && (
            <div className="sidebar-brand">
              <div className="sidebar-brand__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22">
                  <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                </svg>
              </div>
              <div>
                <p className="sidebar-brand__name">Interview Generation</p>
                <p className="sidebar-brand__portal">TAG Team Portal</p>
              </div>
            </div>
          )}

          <nav>
            {sidebarOpen && <p className="sidebar-title">TAG Workspace</p>}
            <ul className="sidebar-menu">
              {SIDEBAR_ITEMS.map((item) => (
                <li key={item.key}>
                  <button
                    type="button"
                    className={`sidebar-item ${activePage === item.key ? 'is-active' : ''}`}
                    aria-current={activePage === item.key ? 'page' : undefined}
                    disabled={!item.active}
                    title={!sidebarOpen ? item.label : undefined}
                    onClick={item.active ? () => { setActivePage(item.key); navigate(`/${item.key}`) } : undefined}
                  >
                    <span className="sidebar-item__icon" aria-hidden="true">
                      <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                        <path d={item.icon} />
                      </svg>
                    </span>
                    {sidebarOpen && <span className="sidebar-item__label">{item.label}</span>}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <div className="sidebar-footer">
            <button type="button" className="sidebar-item" disabled>
              <span className="sidebar-item__icon" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
                </svg>
              </span>
              {sidebarOpen && <span className="sidebar-item__label">Help &amp; Support</span>}
            </button>
          </div>
        </aside>

        <main id="maincontent" className="app-main">
          <div className="page-container">
            {activePage === 'dashboard' ? (
              <Dashboard />
            ) : (
            <>
            <div className="tab-bar" role="tablist" aria-label="Interview generation mode">
              <button
                type="button"
                role="tab"
                className={`tab-btn${activeTab === 'single' ? ' is-active' : ''}`}
                aria-selected={activeTab === 'single'}
                onClick={() => setActiveTab('single')}
              >
                Single Interview
              </button>
              <button
                type="button"
                role="tab"
                className={`tab-btn${activeTab === 'bulk' ? ' is-active' : ''}`}
                aria-selected={activeTab === 'bulk'}
                onClick={() => setActiveTab('bulk')}
              >
                Multiple Interviews
              </button>
            </div>

            {activeTab === 'bulk' ? (
              <BulkInterviewTab />
            ) : (
              <>
            <form onSubmit={handleGenerate} noValidate>
              <section className="panel" aria-labelledby="form-heading">
                <div className="panel__header">
                  <div className="panel__title-row">
                    <svg aria-hidden="true" viewBox="0 0 24 24" className="panel__title-icon" focusable="false" fill="currentColor">
                      <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
                    </svg>
                    <h2 id="form-heading">Generate Interview Link</h2>
                  </div>
                  <p>Enter candidate details and upload the resume to generate an interview link.</p>
                  <hr className="panel__divider" aria-hidden="true" />
                </div>

                <div className="fields-grid">
                  <FormInputField
                    id="candidateName"
                    name="candidateName"
                    label="Candidate Name"
                    placeholder="Enter candidate name"
                    value={formData.candidateName}
                    onChange={handleFieldChange}
                    onBlur={handleFieldBlur}
                    required
                    error={formErrors.candidateName}
                  />
                  <FormInputField
                    id="candidateEmail"
                    name="candidateEmail"
                    type="email"
                    label="Candidate Email"
                    placeholder="Enter candidate email"
                    value={formData.candidateEmail}
                    onChange={handleFieldChange}
                    onBlur={handleFieldBlur}
                    required
                    error={formErrors.candidateEmail}
                  />
                  <SelectField
                    id="role"
                    name="role"
                    label="Role"
                    value={formData.role}
                    onChange={handleFieldChange}
                    onBlur={handleFieldBlur}
                    options={DEFAULT_ROLE_OPTIONS}
                    placeholder="Select or enter role"
                    required
                    error={formErrors.role}
                  />
                  <SelectField
                    id="tsc"
                    name="tsc"
                    label="TSC"
                    value={formData.tsc}
                    onChange={handleFieldChange}
                    onBlur={handleFieldBlur}
                    options={tscOptions}
                    placeholder={isLoadingTsc ? 'Loading TSC options...' : 'Select TSC'}
                    required
                    error={formErrors.tsc}
                  />
                  <FormInputField
                    id="level"
                    name="level"
                    type="text"
                    label="Level"
                    placeholder="Enter level"
                    value={formData.level}
                    onChange={handleFieldChange}
                    onBlur={handleFieldBlur}
                    required
                    error={formErrors.level}
                  />

                  
                  <FormInputField
                    id="panelname"
                    name="panelname"
                    type="text"
                    label="Panel Name"
                    placeholder="Enter panel name"
                    value={formData.panelname}
                    onChange={handleFieldChange}
                    onBlur={handleFieldBlur}
                    required
                    error={formErrors.panelname}
                  />
                  <FormInputField
                    id="panelemail"
                    name="panelemail"
                    type="text"
                    label="Panel Email"
                    placeholder="Enter panel email"
                    value={formData.panelemail}
                    onChange={handleFieldChange}
                    onBlur={handleFieldBlur}
                    required
                    error={formErrors.panelemail}
                  />
                    
                    <SelectField
                    id="jd"
                    name="jd"
                    label="JD"
                    value={formData.jd}
                    onChange={handleFieldChange}
                    onBlur={handleFieldBlur}
                    options={jdOptions}
                    placeholder={isLoadingJd ? 'Loading JD options...' : 'Select JD'}
                    required
                    searchable
                    error={formErrors.jd}
                  />

                </div>

                <div id="resume-upload-focus-target" tabIndex={-1} />
                <ResumeUploadField
                  file={resumeFile}
                  error={resumeError}
                  onFileSelected={handleResumeSelected}
                  onRemove={() => handleResumeSelected(null)}
                  helperText={`PDF files only. Max size ${Math.round(env.maxResumeSizeBytes / (1024 * 1024))} MB.`}
                />

                {generalError && (
                  <p className="form-level-error" role="alert">{generalError}</p>
                )}

                <div className="panel__footer">
                  <button
                    type="submit"
                    className="btn btn-primary btn-generate"
                    disabled={!isFormComplete || isGenerating || isLoadingTsc}
                    aria-disabled={!isFormComplete || isGenerating || isLoadingTsc}
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      className="btn-generate__icon"
                      focusable="false"
                      fill="currentColor"
                    >
                      <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z" />
                    </svg>
                    {isGenerating ? 'Generating...' : 'Generate Interview Link'}
                  </button>
                </div>
              </section>

            {successMessage && (
              <p className="form-success" role="status">{successMessage}</p>
            )}
            </form>
              </>
            )}
            </>
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
