import PropTypes from 'prop-types'

export default function GenerationResult({ result, onCopyLink, onGenerateAnother, copyStatus }) {
  return (
    <section className="panel" aria-live="polite">
      <div className="panel__header">
        <h2>Interview Link Generated</h2>
      </div>

      <dl className="result-grid">
        <div>
          <dt>Candidate Name</dt>
          <dd>{result.candidateName}</dd>
        </div>
        <div>
          <dt>Candidate Email</dt>
          <dd>{result.candidateEmail}</dd>
        </div>
        <div>
          <dt>Role</dt>
          <dd>{result.role}</dd>
        </div>
        <div>
          <dt>TSC</dt>
          <dd>{result.tsc}</dd>
        </div>
        <div>
          <dt>Resume Name</dt>
          <dd>{result.resumeName}</dd>
        </div>
        <div>
          <dt>Generated Interview Link</dt>
          <dd>
            <a href={result.interviewLink}>{result.interviewLink}</a>
          </dd>
        </div>
      </dl>

      <div className="result-actions">
        <button type="button" className="btn btn-primary" onClick={onCopyLink}>
          Copy Link
        </button>
        <button type="button" className="btn btn-secondary" onClick={onGenerateAnother}>
          Generate Another
        </button>
      </div>

      {copyStatus ? <p className="helper-text">{copyStatus}</p> : null}
    </section>
  )
}

GenerationResult.propTypes = {
  result: PropTypes.shape({
    candidateName: PropTypes.string.isRequired,
    candidateEmail: PropTypes.string.isRequired,
    role: PropTypes.string.isRequired,
    tsc: PropTypes.string.isRequired,
    resumeName: PropTypes.string.isRequired,
    interviewLink: PropTypes.string.isRequired,
  }).isRequired,
  onCopyLink: PropTypes.func.isRequired,
  onGenerateAnother: PropTypes.func.isRequired,
  copyStatus: PropTypes.string,
}

GenerationResult.defaultProps = {
  copyStatus: '',
}
