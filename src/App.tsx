import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import { NavBar } from './components/layout/NavBar'
import { ResultsPage } from './pages/ResultsPage'

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="min-h-screen">
          <NavBar />
          <Routes>
            <Route path="/" element={<ResultsPage />} />
          </Routes>
        </div>
      </Router>
    </LanguageProvider>
  )
}

export default App