import React from 'react'
import { useLanguage } from '../../context/LanguageContext'

export function NavBar() {
  const { t } = useLanguage()

  return (
    <nav className="bg-primary text-primary-foreground shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-bold">
              {t('candidates')}
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm">
              {t('search')}
            </span>
          </div>
        </div>
      </div>
    </nav>
  )
}