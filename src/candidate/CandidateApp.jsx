import { createContext, useContext, useState } from 'react'
import { Outlet } from 'react-router-dom'

export const CandidateContext = createContext(null)
export const useCandidateContext = () => useContext(CandidateContext)

export default function CandidateProvider({ children }) {
  const [candidate, setCandidate] = useState(() => {
    try {
      const saved = sessionStorage.getItem('candidate')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  const saveCandidate = (data) => {
    setCandidate(data)
    sessionStorage.setItem('candidate', JSON.stringify(data))
  }

  const clearCandidate = () => {
    setCandidate(null)
    sessionStorage.removeItem('candidate')
  }

  return (
    <CandidateContext.Provider value={{ candidate, saveCandidate, clearCandidate }}>
      <div className="c-shell"><Outlet /></div>
    </CandidateContext.Provider>
  )
}
