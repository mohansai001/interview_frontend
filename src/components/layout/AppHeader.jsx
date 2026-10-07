import PropTypes from 'prop-types'

function HamburgerIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" width="20" height="20" focusable="false">
      <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z" />
    </svg>
  )
}

function BellIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="currentColor" width="20" height="20" focusable="false">
      <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.63-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.64 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" />
    </svg>
  )
}

function UserCircleIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="header-user-icon" focusable="false" fill="currentColor">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
    </svg>
  )
}

function ChevronDownIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="header-chevron-icon" focusable="false" fill="currentColor">
      <path d="M7 10l5 5 5-5z" />
    </svg>
  )
}

function LogoutIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="header-logout-icon" focusable="false" fill="currentColor">
      <path d="M17 7l-1.41 1.41L18.17 11H8v2h10.17l-2.58 2.58L17 17l5-5zM4 5h8V3H4c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h8v-2H4V5z" />
    </svg>
  )
}

export default function AppHeader({
  pageTitle,
  userName,
  notificationCount = 0,
  onToggleSidebar,
  onLogout,
}) {
  return (
    <header className="app-header">
      <div className="app-header__left">
        <button type="button" className="header-toggle-btn" onClick={onToggleSidebar} aria-label="Toggle navigation">
          <HamburgerIcon />
        </button>
        <span className="app-header__page-title">{pageTitle}</span>
      </div>

      <div className="app-header__right" aria-label="User account actions">
        <button type="button" className="header-bell-btn" aria-label={`${notificationCount} notification${notificationCount !== 1 ? 's' : ''}`}>
          <BellIcon />
          {notificationCount > 0 && (
            <span className="notification-badge" aria-hidden="true">{notificationCount}</span>
          )}
        </button>

        <div className="app-header__user" aria-label={`Logged in as ${userName}`}>
          <UserCircleIcon />
          <div className="app-header__user-info">
            <span className="app-header__user-name">{userName}</span>
            <span className="app-header__user-role">TAG Team</span>
          </div>
          <ChevronDownIcon />
        </div>

        <span className="app-header__sep" aria-hidden="true" />

        <button type="button" className="app-header__logout-btn" onClick={onLogout}>
          <LogoutIcon />
          <span>Logout</span>
        </button>
      </div>
    </header>
  )
}

AppHeader.propTypes = {
  pageTitle: PropTypes.string.isRequired,
  userName: PropTypes.string.isRequired,
  notificationCount: PropTypes.number,
  onToggleSidebar: PropTypes.func.isRequired,
  onLogout: PropTypes.func.isRequired,
}


