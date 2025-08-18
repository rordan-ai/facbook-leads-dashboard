import React, { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'

export function CandidatesPage() {
  const { language, setLanguage } = useLanguage()
  const [searchTerm, setSearchTerm] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(false) // התחל במצב בהיר

  const isHebrew = language === 'he'

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} ${isHebrew ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 bg-white">
        {/* Logo */}
        <div className="flex items-center">
          <div className="text-6xl mr-4">🐌</div>
        </div>

        {/* Title and Controls */}
        <div className="flex flex-col items-end gap-4">
          <h1 className="text-2xl font-bold text-black">
            שבלולי - אוטומציה לגיוס עובדים
          </h1>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLanguage(language === 'he' ? 'en' : 'he')}
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              {language === 'he' ? 'English' : 'עברית'}
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              onClick={toggleTheme}
              className="border-gray-300 text-gray-700 hover:bg-gray-100"
            >
              🌙 החלף ערכת נושא
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-6">
        {/* Search Section */}
        <div className="mb-8">
          <label className="block text-lg font-medium mb-2 text-black">
            חיפוש מועמד:
          </label>
          <Input
            type="text"
            placeholder="שם, אימייל, טלפון"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border-gray-300 text-gray-900 placeholder:text-gray-500"
          />
        </div>

        {/* Results Area */}
        <div className="text-center">
          <p className="text-lg text-gray-700">
            לא נמצאו מועמדים התואמים לחיפוש שלך.
          </p>
        </div>
      </div>
    </div>
  )
}