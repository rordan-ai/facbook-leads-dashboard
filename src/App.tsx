import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './context/LanguageContext'
import { NavBar } from './components/layout/NavBar'

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="min-h-screen">
          <NavBar />
            <Routes>
              <Route path="/" element={<div className="p-8 text-white">Hello World</div>} />
            </Routes>
        </div>
      </Router>
    </LanguageProvider>
  )
}

export default App