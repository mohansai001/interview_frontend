import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import App from './App.jsx'
import CandidateProvider from './candidate/CandidateApp.jsx'
import CandidateLogin from './candidate/pages/CandidateLogin.jsx'
import SystemCheck from './candidate/pages/SystemCheck.jsx'
import ConsentPage from './candidate/pages/ConsentPage.jsx'
import InterviewRoom from './candidate/pages/InterviewRoom.jsx'
import TagLogin from './components/auth/TagLogin.jsx'
import './styles/index.css'
import './index.css'
import './candidate/candidate.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>

        {/* ── Default entry: TAG login page for now ── */}
        <Route path="/" element={<TagLogin />} />
        <Route path="/tag/login" element={<TagLogin />} />

        {/* ── Admin / TAG Team routes ── */}
        <Route path="/dashboard"   element={<App page="dashboard" />} />
        <Route path="/generate"    element={<App page="generate" />} />
        <Route path="/interviews"  element={<App page="interviews" />} />
        <Route path="/candidates"  element={<App page="candidates" />} />
        <Route path="/reports"     element={<App page="reports" />} />
        <Route path="/settings"    element={<App page="settings" />} />

        {/* ── Candidate routes (shared CandidateProvider context) ── */}
        <Route element={<CandidateProvider />}>
          <Route path="/candidate/login"         element={<CandidateLogin />} />
          <Route path="/candidate/system-check"  element={<SystemCheck />} />
          <Route path="/candidate/consent"       element={<ConsentPage />} />
          <Route path="/candidate/interview"     element={<InterviewRoom />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/tag/login" replace />} />

      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
