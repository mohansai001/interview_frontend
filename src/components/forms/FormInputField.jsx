import PropTypes from 'prop-types'

export default function FormInputField({
  id,
  name,
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  type = 'text',
  required = false,
  error = '',
}) {
  const errorId = error ? `${id}-error` : undefined

  return (
    <div className="form-group">
      <label htmlFor={id} className="form-label">
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
      </label>

      <input
        id={id}
        name={name}
        className="form-input"
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        placeholder={placeholder}
        required={required}
        aria-required={required}
        aria-invalid={Boolean(error)}
        aria-describedby={errorId}
      />

      {error ? (
        <p id={errorId} className="field-error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}

FormInputField.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  onBlur: PropTypes.func,
  placeholder: PropTypes.string,
  type: PropTypes.string,
  required: PropTypes.bool,
  error: PropTypes.string,
}
