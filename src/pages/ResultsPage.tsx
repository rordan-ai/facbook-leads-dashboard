import React from 'react'
import { useLanguage } from '../context/LanguageContext'

export function ResultsPage() {
  const { t } = useLanguage()

  return (
    <div className="container mx-auto px-4 py-8">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          {t('results')}
        </h2>
        <p className="text-muted-foreground">
          רשימת מועמדים זמינים
        </p>
      </header>

      <div className="bg-card rounded-lg shadow-md p-6">
        <div className="text-center text-muted-foreground">
          <p>אין תוצאות להצגה כרגע</p>
          <p className="text-sm mt-2">הוסף מועמדים חדשים למערכת</p>
        </div>
      </div>
    </div>
  )
}