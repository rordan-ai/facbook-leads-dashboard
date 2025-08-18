import React from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { Button } from '../ui/button'

export function NavBar() {
  const { language, setLanguage, t } = useLanguage()

  return (
    <nav className="bg-slate-800 border-b border-slate-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold">
              {t('candidates')}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLanguage(language === 'he' ? 'en' : 'he')}
              className="border-slate-600 text-white hover:bg-slate-700"
            >
              {language === 'he' ? 'English' : 'עברית'}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}