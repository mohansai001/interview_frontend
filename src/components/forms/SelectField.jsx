import { useEffect, useRef, useState } from 'react'
import PropTypes from 'prop-types'

function SearchableSelect({ id, name, label, value, onChange, onBlur, options, placeholder, required, error }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const containerRef = useRef(null)
  const searchRef = useRef(null)
  const errorId = error ? `${id}-error` : undefined

  const filtered = options.filter((o) => o.toLowerCase().includes(search.toLowerCase()))
  const displayValue = value || ''

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  // Focus search input when opened
  useEffect(() => {
    if (open) searchRef.current?.focus()
  }, [open])

  const handleSelect = (option) => {
    onChange({ target: { name, value: option } })
    setOpen(false)
    setSearch('')
  }

  const handleClear = (e) => {
    e.stopPropagation()
    onChange({ target: { name, value: '' } })
    setSearch('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') { setOpen(false); setSearch('') }
  }

  return (
    <div className="form-group">
      <label htmlFor={`${id}-btn`} className="form-label">
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>

      <div
        ref={containerRef}
        className="searchable-select"
        onKeyDown={handleKeyDown}
      >
        {/* Trigger button */}
        <button
          type="button"
          id={`${id}-btn`}
          className={`form-input searchable-select__trigger ${error ? 'is-error' : ''}`}
          onClick={() => setOpen((v) => !v)}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          onBlur={!open ? onBlur : undefined}
        >
          <span className={displayValue ? '' : 'searchable-select__placeholder'}>
            {displayValue || placeholder}
          </span>
          <span className="searchable-select__icons">
            {displayValue && (
              <span
                role="button"
                tabIndex={0}
                className="searchable-select__clear"
                onClick={handleClear}
                onKeyDown={(e) => e.key === 'Enter' && handleClear(e)}
                aria-label="Clear selection"
              >
                ×
              </span>
            )}
            <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true"
              style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}>
              <path d="M7 10l5 5 5-5z" />
            </svg>
          </span>
        </button>

        {/* Dropdown */}
        {open && (
          <div className="searchable-select__dropdown" role="listbox" aria-label={label}>
            <div className="searchable-select__search-wrap">
              <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14" aria-hidden="true">
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
              <input
                ref={searchRef}
                type="text"
                className="searchable-select__search"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                aria-label={`Search ${label}`}
              />
            </div>

            <ul className="searchable-select__list">
              {filtered.length > 0 ? (
                filtered.map((option) => (
                  <li
                    key={option}
                    role="option"
                    aria-selected={option === value}
                    className={`searchable-select__option ${option === value ? 'is-selected' : ''}`}
                    onMouseDown={() => handleSelect(option)}
                  >
                    {option}
                    {option === value && (
                      <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14" aria-hidden="true">
                        <path d="M9 16.2l-3.5-3.5-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z" />
                      </svg>
                    )}
                  </li>
                ))
              ) : (
                <li className="searchable-select__empty">No results found</li>
              )}
            </ul>
          </div>
        )}
      </div>

      {/* Hidden input for form submission */}
      <input type="hidden" id={id} name={name} value={value} />

      {error && (
        <p id={errorId} className="field-error" role="alert">{error}</p>
      )}
    </div>
  )
}

SearchableSelect.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  error: PropTypes.string,
}

export default function SelectField({
  id, name, label, value, onChange, onBlur, onFocus,
  options, placeholder, required = false, error = '', searchable = false,
}) {
  if (searchable) {
    return (
      <SearchableSelect
        id={id} name={name} label={label} value={value}
        onChange={onChange} onBlur={onBlur}
        options={options} placeholder={placeholder}
        required={required} error={error}
      />
    )
  }

  const errorId = error ? `${id}-error` : undefined
  return (
    <div className="form-group">
      <label htmlFor={id} className="form-label">
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </label>
      <select
        id={id} name={name} className="form-input"
        value={value} onChange={onChange} onBlur={onBlur} onFocus={onFocus}
        required={required} aria-required={required}
        aria-invalid={Boolean(error)} aria-describedby={errorId}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
      {error && <p id={errorId} className="field-error" role="alert">{error}</p>}
    </div>
  )
}

SelectField.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  onFocus: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  error: PropTypes.string,
  searchable: PropTypes.bool,
}
