import React, { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'

interface Candidate {
  id: number
  name: string
  position: string
  experience: string
  email: string
  phone: string
}

// נתוני מועמדים לדוגמה
const mockCandidates: Candidate[] = [
  {
    id: 1,
    name: 'דן כהן',
    position: 'מפתח Full Stack',
    experience: '5 שנות ניסיון',
    email: 'dan.cohen@example.com',
    phone: '054-123-4567'
  },
  {
    id: 2,  
    name: 'שרה לוי',
    position: 'מעצבת UX/UI',
    experience: '3 שנות ניסיון',
    email: 'sara.levi@example.com',
    phone: '052-987-6543'
  },
  {
    id: 3,
    name: 'מיכל רוזנברג',
    position: 'מנהלת פרודקט',
    experience: '7 שנות ניסיון', 
    email: 'michal.r@example.com',
    phone: '050-555-1234'
  },
  {
    id: 4,
    name: 'יוסי אברהם',
    position: 'מפתח Frontend',
    experience: '4 שנות ניסיון',
    email: 'yossi.a@example.com', 
    phone: '053-777-8888'
  }
]

export function ResultsPage() {
  console.log('ResultsPage component is rendering...')
  const { t, language } = useLanguage()
  const [candidates] = useState<Candidate[]>(mockCandidates)
  
  console.log('Current language:', language)
  const isHebrew = language === 'he'

  return (
    <div className={`container mx-auto px-3 sm:px-4 py-4 sm:py-8 ${isHebrew ? 'rtl' : 'ltr'}`}>
      <header className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-4">
          {t('candidates')}
        </h2>
        <p className="text-muted-foreground text-sm sm:text-base">
          {isHebrew ? `נמצאו ${candidates.length} מועמדים` : `Found ${candidates.length} candidates`}
        </p>
      </header>

      <div className="grid gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-3">
        {candidates.map((candidate) => (
          <Card key={candidate.id} className="w-full bg-card border-border shadow-lg hover:shadow-xl transition-all duration-200">
            <CardHeader className="pb-3 sm:pb-4">
              <CardTitle className="text-lg sm:text-xl text-foreground">
                {candidate.name}
              </CardTitle>
              <CardDescription className="text-sm text-muted-foreground">
                {candidate.position}
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex flex-col gap-1 text-sm">
                  <span className="font-medium text-muted-foreground">
                    {t('experience')}:
                  </span>
                  <span className="text-foreground">
                    {candidate.experience}
                  </span>
                </div>
                
                <div className="flex flex-col gap-1 text-sm">
                  <span className="font-medium text-muted-foreground">
                    אימייל:
                  </span>
                  <a 
                    href={`mailto:${candidate.email}`} 
                    className="text-primary hover:underline cursor-pointer break-all"
                  >
                    {candidate.email}
                  </a>
                </div>
                
                <div className="flex flex-col gap-1 text-sm">
                  <span className="font-medium text-muted-foreground">
                    טלפון:
                  </span>
                  <a 
                    href={`tel:${candidate.phone}`} 
                    className="text-primary hover:underline cursor-pointer"
                  >
                    {candidate.phone}
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}