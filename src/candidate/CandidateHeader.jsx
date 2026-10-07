import PropTypes from 'prop-types'

export default function CandidateHeader({ title, onHelp }) {
  return (
    <header className="c-header">
      <div className="c-header__brand">
        <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22" aria-hidden="true">
          <path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" />
        </svg>
        Interview Platform
      </div>

      <div className="c-header__title">{title}</div>

      <button type="button" className="c-header__help" onClick={onHelp} aria-label="Get help">
        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z" />
        </svg>
        Need Help?
      </button>
    </header>
  )
}

CandidateHeader.propTypes = {
  title: PropTypes.string.isRequired,
  onHelp: PropTypes.func,
}

CandidateHeader.defaultProps = {
  onHelp: () => {},
}
