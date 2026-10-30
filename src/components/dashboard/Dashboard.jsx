import { useEffect, useMemo, useState } from 'react'
import { env } from '../../config/env'

const iconMap = {
  'Total Interviews': (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" /></svg>
  ),
  Completed: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>
  ),
  Pending: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" /></svg>
  ),
  Active: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" /></svg>
  ),
}

const STATUS_CLASS = {
  Completed: 'badge--accepted',
  Active:    'badge--review',
  Pending:   'badge--review',
  Rejected:  'badge--rejected',
}

function getPageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 4) return [1, 2, 3, 4, 5, '...', total]
  if (current >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total]
  return [1, '...', current - 1, current, current + 1, '...', total]
}

export default function Dashboard() {
  const [interviews, setInterviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [selectedFeedback, setSelectedFeedback] = useState(null)

  useEffect(() => {
    fetch(`${env.apiBaseUrl.replace(/\/$/, '')}/get-all-interviews/`)
      .then((r) => r.json())
      .then((json) => setInterviews(json?.interviews ?? []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const stats = useMemo(() => {
    const total = interviews.length
    const completed = interviews.filter((i) => i.status === 'Completed').length
    const active = interviews.filter((i) => i.status === 'Active').length
    const pending = interviews.filter((i) => i.l1_status === 'Pending').length
    return [
      { label: 'Total Interviews', value: total,     colorClass: 'stat-card--blue' },
      { label: 'Completed',        value: completed,  colorClass: 'stat-card--green' },
      { label: 'Active',           value: active,     colorClass: 'stat-card--yellow' },
      { label: 'Pending',          value: pending,    colorClass: 'stat-card--red' },
    ]
  }, [interviews])

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return interviews
    return interviews.filter(
      (r) =>
        r.candidate_name?.toLowerCase().includes(q) ||
        r.candidate_email?.toLowerCase().includes(q) ||
        r.role?.toLowerCase().includes(q) ||
        r.interview_id?.toLowerCase().includes(q)
    )
  }, [search, interviews])

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const safePage = Math.min(page, totalPages)
  const pageData = filtered.slice((safePage - 1) * perPage, safePage * perPage)
  const startEntry = filtered.length === 0 ? 0 : (safePage - 1) * perPage + 1
  const endEntry = Math.min(safePage * perPage, filtered.length)

  const openFeedback = (row) => setSelectedFeedback(row)
  const closeFeedback = () => setSelectedFeedback(null)

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <h2 className="dashboard__title">Dashboard</h2>
        <p className="dashboard__subtitle">Overview of all interview activities</p>
      </div>

      <div className="stats-row" role="list" aria-label="Summary statistics">
        {stats.map((stat) => (
          <div key={stat.label} className={`stat-card ${stat.colorClass}`} role="listitem">
            <div className="stat-card__top">
              <div className="stat-card__icon-wrap" aria-hidden="true">{iconMap[stat.label]}</div>
              <div>
                <p className="stat-card__label">{stat.label}</p>
                <p className="stat-card__value">{stat.value.toLocaleString()}</p>
              </div>
            </div>
            <hr className="stat-card__divider" />
            <button type="button" className="stat-card__view-all">View all <span aria-hidden="true">→</span></button>
          </div>
        ))}
      </div>

      <section className="panel dash-table-panel" aria-labelledby="recent-interviews-heading">
        <div className="dash-table-toolbar">
          <h3 id="recent-interviews-heading" className="dash-table-title">Recent Interviews</h3>
          <div className="dash-table-controls">
            <div className="search-field">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" className="search-icon">
                <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
              </svg>
              <input
                type="search"
                className="search-input"
                placeholder="Search by name, email, role or ID"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                aria-label="Search interviews"
              />
            </div>
          </div>
        </div>

        <div className="table-scroll-wrap">
          <table className="interviews-table">
            <thead>
              <tr>
                <th scope="col">Interview ID</th>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Role</th>
                <th scope="col">Level</th>
                <th scope="col">TSC</th>
                <th scope="col">L1 Status</th>
                <th scope="col">Feedback</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="table-empty">Loading...</td></tr>
              ) : pageData.length === 0 ? (
                <tr><td colSpan={8} className="table-empty">No interviews found.</td></tr>
              ) : (
                pageData.map((row) => (
                  <tr key={row.interview_id}>
                    <td className="td-name">{row.interview_id ?? '—'}</td>
                    <td>{row.candidate_name ?? '—'}</td>
                    <td className="td-email">{row.candidate_email ?? '—'}</td>
                    <td>{row.role ?? '—'}</td>
                    <td>{row.level ?? '—'}</td>
                    <td>{row.tsc ?? '—'}</td>
                    <td><span className={`status-badge ${STATUS_CLASS[row.l1_status] ?? ''}`}>{row.l1_status ?? '—'}</span></td>
                    <td>
                      <button type="button" className="feedback-btn" onClick={() => openFeedback(row)}>
                        Feedback
                      </button>
                    </td>
                    <td><span className={`status-badge ${STATUS_CLASS[row.status] ?? ''}`}>{row.status ?? '—'}</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination-bar">
          <p className="pagination-info">Showing {startEntry} to {endEntry} of {filtered.length} entries</p>

          <div className="per-page-wrap">
            <label htmlFor="per-page-select" className="visually-hidden">Rows per page</label>
            <select id="per-page-select" className="per-page-select form-input" value={perPage}
              onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1) }} aria-label="Rows per page">
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>

          <nav className="page-nav" aria-label="Table pagination">
            <button type="button" className="page-nav__btn" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage === 1} aria-label="Previous page">‹</button>
            {getPageNumbers(safePage, totalPages).map((p, i) =>
              p === '...' ? (
                <span key={`ellipsis-${i}`} className="page-nav__ellipsis">…</span>
              ) : (
                <button key={p} type="button" className={`page-nav__btn${safePage === p ? ' is-active' : ''}`}
                  onClick={() => setPage(p)} aria-label={`Page ${p}`} aria-current={safePage === p ? 'page' : undefined}>{p}</button>
              )
            )}
            <button type="button" className="page-nav__btn" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage === totalPages} aria-label="Next page">›</button>
          </nav>
        </div>
      </section>

      {selectedFeedback && (
        <div className="feedback-modal-backdrop" onClick={closeFeedback}>
          <div
            className="feedback-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="feedback-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="feedback-modal__header">
              <div>
                <p className="feedback-modal__eyebrow">L1 Feedback Review</p>
                <h3 id="feedback-modal-title">Interview {selectedFeedback.interview_id ?? '—'}</h3>
              </div>
              <button type="button" className="feedback-modal__close" onClick={closeFeedback} aria-label="Close feedback dialog">
                ×
              </button>
            </div>

            <div className="feedback-modal__content">
              {selectedFeedback.l1_result || 'No L1 feedback available for this interview.'}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
