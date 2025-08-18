import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import { CandidatesPage } from './pages/CandidatesPage'

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="min-h-screen">
          <Routes>
            <Route path="/" element={<CandidatesPage />} />
          </Routes>
        </div>
      </Router>
    </LanguageProvider>
  )
}

export default App