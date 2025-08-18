import React from 'react'
import { useLanguage } from '../context/LanguageContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'

export function ResultsPage() {
  const { t, language } = useLanguage()

  const isHebrew = language === 'he'

  return (
    <div className={`container mx-auto px-4 py-8 ${isHebrew ? 'rtl' : 'ltr'}`}>
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-2">
          {t('results')}
        </h2>
        <p className="text-muted-foreground">
          {isHebrew ? 'רשימת מועמדים זמינים' : 'Available candidates list'}
        </p>
      </header>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              {isHebrew ? 'אין תוצאות' : 'No Results'}
            </CardTitle>
            <CardDescription>
              {isHebrew ? 'אין מועמדים זמינים כרגע' : 'No candidates available at the moment'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {isHebrew ? 'הוסף מועמדים חדשים למערכת' : 'Add new candidates to the system'}
            </p>
            <Button className="w-full">
              {isHebrew ? 'הוסף מועמד' : 'Add Candidate'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              {isHebrew ? 'חיפוש מתקדם' : 'Advanced Search'}
            </CardTitle>
            <CardDescription>
              {isHebrew ? 'חפש מועמדים לפי קריטריונים' : 'Search candidates by criteria'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" className="w-full">
              {isHebrew ? 'פתח חיפוש' : 'Open Search'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              {isHebrew ? 'דוחות' : 'Reports'}
            </CardTitle>
            <CardDescription>
              {isHebrew ? 'צפה בסטטיסטיקות ודוחות' : 'View statistics and reports'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="secondary" className="w-full">
              {isHebrew ? 'צפה בדוחות' : 'View Reports'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}