import { useId, useRef, useState } from 'react'
import PropTypes from 'prop-types'
import { bytesToSize } from '../../utils/validation'

export default function ResumeUploadField({
  file = null,
  error = '',
  onFileSelected,
  onRemove,
  disabled = false,
  helperText = 'PDF files only',
}) {
  const [isDragging, setIsDragging] = useState(false)
  const inputId = useId()
  const inputRef = useRef(null)
  const errorId = error ? `${inputId}-error` : undefined

  const handleInputChange = (event) => {
    const [selectedFile] = event.target.files || []
    onFileSelected(selectedFile || null)
  }

  const handleDrop = (event) => {
    event.preventDefault()
    event.stopPropagation()
    setIsDragging(false)

    if (disabled) return
    const [selectedFile] = event.dataTransfer.files || []
    onFileSelected(selectedFile || null)
  }

  const openFileDialog = () => {
    if (!disabled) {
      inputRef.current?.click()
    }
  }

  return (
    <div className="form-group">
      <label htmlFor={inputId} className="form-label">
        Candidate Resume <span className="form-label__meta">(PDF only)</span> <span aria-hidden="true">*</span>
      </label>

      <div
        className={`upload-dropzone ${isDragging ? 'is-dragging' : ''} ${error ? 'is-error' : ''}`}
        onDragOver={(event) => {
          event.preventDefault()
          if (!disabled) setIsDragging(true)
        }}
        onDragLeave={(event) => {
          event.preventDefault()
          setIsDragging(false)
        }}
        onDrop={handleDrop}
        role="button"
        tabIndex={disabled ? -1 : 0}
        onKeyDown={(event) => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            openFileDialog()
          }
        }}
        aria-label="Resume upload area"
        aria-invalid={Boolean(error)}
        aria-describedby={errorId}
      >
        <svg viewBox="0 0 24 24" className="upload-dropzone__icon" fill="currentColor" aria-hidden="true">
          <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm4 18H6V4h7v5h5v11zM8 15.01l1.41 1.41L11 14.84V19h2v-4.16l1.59 1.59L16 15.01 12.01 11 8 15.01z" />
        </svg>
        <span className="upload-dropzone__text">
          Drag &amp; drop or{' '}
          <button type="button" className="link-button" onClick={openFileDialog} disabled={disabled}>
            browse
          </button>
          <span className="upload-dropzone__hint"> — {helperText}</span>
        </span>

        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept=".pdf,application/pdf"
          onChange={handleInputChange}
          className="visually-hidden"
          tabIndex={-1}
        />
      </div>

      {file ? (
        <div className="file-meta" aria-live="polite">
          <p>
            <strong>{file.name}</strong>
          </p>
          <p>{bytesToSize(file.size)}</p>
          <div className="file-meta__actions">
            <button type="button" className="btn btn-secondary" onClick={openFileDialog}>
              Replace
            </button>
            <button type="button" className="btn btn-ghost" onClick={onRemove}>
              Remove
            </button>
          </div>
        </div>
      ) : null}

      {error ? (
        <p id={errorId} className="field-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

ResumeUploadField.propTypes = {
  file: PropTypes.shape({
    name: PropTypes.string.isRequired,
    size: PropTypes.number.isRequired,
  }),
  error: PropTypes.string,
  onFileSelected: PropTypes.func.isRequired,
  onRemove: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  helperText: PropTypes.string,
}

