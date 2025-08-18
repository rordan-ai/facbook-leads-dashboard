import React, { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import shabluliLogo from '../assets/shabluli-logo.png'

export function CandidatesPage() {
  const { language, setLanguage } = useLanguage()
  const [searchTerm, setSearchTerm] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(true)

  const isHebrew = language === 'he'

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-slate-900' : 'bg-white'} ${isHebrew ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-gray-200'} border-b px-6 py-4`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center gap-4">
            <img 
              src={shabluliLogo} 
              alt="שבלולי" 
              className="h-12 w-12"
            />
            <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              שבלולי - אוטומציה לגיוס עובדים
            </h1>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4">
            {/* Theme Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className={isDarkMode ? 'border-slate-600 text-white hover:bg-slate-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}
            >
              {isDarkMode ? '🌙' : '☀️'} החלף ערכת נושא
            </Button>

            {/* Language Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLanguage(language === 'he' ? 'en' : 'he')}
              className={isDarkMode ? 'border-slate-600 text-white hover:bg-slate-700' : 'border-gray-300 text-gray-700 hover:bg-gray-100'}
            >
              {language === 'he' ? 'English' : 'עברית'}
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6">
        {/* Search Section */}
        <div className="mb-8">
          <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-blue-50 border-blue-200'} border rounded-lg p-6`}>
            <label className={`block text-lg font-semibold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              חיפוש מועמד:
            </label>
            <Input
              type="text"
              placeholder="שם, אימייל, טלפון"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full ${isDarkMode ? 'bg-slate-700 border-slate-600 text-white placeholder:text-slate-400' : 'bg-white border-gray-300 text-gray-900'}`}
            />
          </div>
        </div>

        {/* Results Area */}
        <div className={`${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-gray-50 border-gray-200'} border-2 border-dashed rounded-lg p-12 text-center`}>
          <p className={`text-lg ${isDarkMode ? 'text-slate-300' : 'text-gray-600'}`}>
            לא נמצאו מועמדים התואמים לחיפוש שלך.
          </p>
        </div>
      </div>
    </div>
  )
}