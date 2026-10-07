import { useMemo, useState } from 'react'
import dashboardData from '../../data/mockData.json'

const MOCK_INTERVIEWS = dashboardData.interviews

const iconMap = {
  'Total Interviews': (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" /></svg>
  ),
  'L2 Count': (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16 11c1.66 0 2.99-1.34 2.99-3S17.66 5 16 5c-1.66 0-3 1.34-3 3s1.34 3 3 3zm-8 0c1.66 0 2.99-1.34 2.99-3S9.66 5 8 5C6.34 5 5 6.34 5 8s1.34 3 3 3zm0 2c-2.33 0-7 1.17-7 3.5V19h14v-2.5c0-2.33-4.67-3.5-7-3.5zm8 0c-.29 0-.62.02-.97.05 1.16.84 1.97 1.97 1.97 3.45V19h6v-2.5c0-2.33-4.67-3.5-7-3.5z" /></svg>
  ),
  Accepted: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" /></svg>
  ),
  Rejected: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z" /></svg>
  ),
}

const STATS = dashboardData.stats.map((stat) => ({
  ...stat,
  icon: iconMap[stat.label],
}))

const STATUS_CLASS = {
  'Accepted': 'badge--accepted',
  'Rejected': 'badge--rejected',
  'In Review': 'badge--review',
}

function getPageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 4) return [1, 2, 3, 4, 5, '...', total]
  if (current >= total - 3) return [1, '...', total - 4, total - 3, total - 2, total - 1, total]
  return [1, '...', current - 1, current, current + 1, '...', total]
}

export default function Dashboard() {
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return MOCK_INTERVIEWS
    return MOCK_INTERVIEWS.filter(
      (r) => r.name.toLowerCase().includes(q) || r.email.toLowerCase().includes(q) || r.role.toLowerCase().includes(q)
    )
  }, [search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage))
  const safePage = Math.min(page, totalPages)
  const pageData = filtered.slice((safePage - 1) * perPage, safePage * perPage)
  const startEntry = filtered.length === 0 ? 0 : (safePage - 1) * perPage + 1
  const endEntry = Math.min(safePage * perPage, filtered.length)

  const handleSearch = (e) => {
    setSearch(e.target.value)
    setPage(1)
  }

  const handlePerPage = (e) => {
    setPerPage(Number(e.target.value))
    setPage(1)
  }

  return (
    <div className="dashboard">
      <div className="dashboard__header">
        <h2 className="dashboard__title">Dashboard</h2>
        <p className="dashboard__subtitle">Overview of all interview activities</p>
      </div>

      <div className="stats-row" role="list" aria-label="Summary statistics">
        {STATS.map((stat) => (
          <div key={stat.label} className={`stat-card ${stat.colorClass}`} role="listitem">
            <div className="stat-card__top">
              <div className="stat-card__icon-wrap" aria-hidden="true">{stat.icon}</div>
              <div>
                <p className="stat-card__label">{stat.label}</p>
                <p className="stat-card__value">{stat.value.toLocaleString()}</p>
              </div>
            </div>
            <hr className="stat-card__divider" />
            <button type="button" className="stat-card__view-all">
              View all <span aria-hidden="true">→</span>
            </button>
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
                placeholder="Search by name, email or role"
                value={search}
                onChange={handleSearch}
                aria-label="Search interviews"
              />
            </div>
            <button type="button" className="btn btn-secondary filter-btn" aria-label="Filter interviews">
              <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                <path d="M4.25 5.61C6.27 8.2 10 13 10 13v6c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-6s3.72-4.8 5.74-7.39A1 1 0 0 0 18.95 4H5.04a1 1 0 0 0-.79 1.61z" />
              </svg>
              Filter
            </button>
          </div>
        </div>

        <div className="table-scroll-wrap">
          <table className="interviews-table">
            <thead>
              <tr>
                <th scope="col">Name</th>
                <th scope="col">Email</th>
                <th scope="col">Role</th>
                <th scope="col">L1 Score</th>
                <th scope="col">Status</th>
                <th scope="col"><span className="visually-hidden">Action</span></th>
              </tr>
            </thead>
            <tbody>
              {pageData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="table-empty">No interviews match your search.</td>
                </tr>
              ) : (
                pageData.map((row) => (
                  <tr key={row.id}>
                    <td className="td-name">{row.name}</td>
                    <td className="td-email">{row.email}</td>
                    <td>{row.role}</td>
                    <td className="td-score">{row.l1Score}%</td>
                    <td>
                      <span className={`status-badge ${STATUS_CLASS[row.status]}`}>{row.status}</span>
                    </td>
                    <td className="td-action">
                      <button type="button" className="action-dots-btn" aria-label={`Actions for ${row.name}`}>⋮</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination-bar">
          <p className="pagination-info">
            Showing {startEntry} to {endEntry} of {filtered.length} entries
          </p>

          <div className="per-page-wrap">
            <label htmlFor="per-page-select" className="visually-hidden">Rows per page</label>
            <select id="per-page-select" className="per-page-select form-input" value={perPage} onChange={handlePerPage} aria-label="Rows per page">
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
            </select>
          </div>

          <nav className="page-nav" aria-label="Table pagination">
            <button
              type="button"
              className="page-nav__btn"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              aria-label="Previous page"
            >‹</button>

            {getPageNumbers(safePage, totalPages).map((p, i) =>
              p === '...' ? (
                <span key={`ellipsis-${i}`} className="page-nav__ellipsis">…</span>
              ) : (
                <button
                  key={p}
                  type="button"
                  className={`page-nav__btn${safePage === p ? ' is-active' : ''}`}
                  onClick={() => setPage(p)}
                  aria-label={`Page ${p}`}
                  aria-current={safePage === p ? 'page' : undefined}
                >
                  {p}
                </button>
              )
            )}

            <button
              type="button"
              className="page-nav__btn"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              aria-label="Next page"
            >›</button>
          </nav>
        </div>
      </section>
    </div>
  )
}
