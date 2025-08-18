import React from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { Button } from '../ui/button'

export function NavBar() {
  console.log('NavBar rendering...')
  const { language, setLanguage, t } = useLanguage()

  return (
    <nav className="bg-primary text-primary-foreground shadow-lg">
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
              className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10"
            >
              {language === 'he' ? 'English' : 'עברית'}
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}