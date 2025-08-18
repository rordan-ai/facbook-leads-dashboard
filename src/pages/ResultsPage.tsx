import React, { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { Card, CardContent, CardHeader } from '../components/ui/card'
import { Button } from '../components/ui/button'

interface Candidate {
  id: number
  name: string
  phone: string
  email: string
  date: string
  time: string
  status: 'unchecked' | 'relevant' | 'irrelevant' | 'interview' | 'hired'
  notes?: string
  tags: string[]
  source: string
}

const mockCandidates: Candidate[] = [
  {
    id: 1,
    name: 'סינה כהן',
    phone: '972544886569',
    email: 'sinayac@gmail.com',
    date: '08/18/2025',
    time: '9:29am',
    status: 'interview',
    tags: ['השקפה'],
    source: 'הגיע מקליקפין',
    notes: 'ריאשון לציון'
  },
  {
    id: 2,
    name: 'Gilat Amon',
    phone: '972523300420',
    email: 'gilatam40@gmail.com',
    date: '08/18/2025', 
    time: '9:51am',
    status: 'relevant',
    tags: ['תל אביב'],
    source: 'הגיע מקליקפין',
    notes: 'פתח תקווה'
  },
  {
    id: 3,
    name: 'Almaz Almaz',
    phone: '972534283788',
    email: 'lmzl60008@gamil.com',
    date: '08/18/2025',
    time: '10:32am', 
    status: 'relevant',
    tags: ['תל אביב'],
    source: 'הגיע מקליקפין',
    notes: 'קיום מגורים כאן שנרע בדעדעדעדעדעד'
  }
]

export function ResultsPage() {
  const { language } = useLanguage()
  const [searchTerm, setSearchTerm] = useState('')
  
  const isHebrew = language === 'he'

  const filteredCandidates = mockCandidates.filter(candidate =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.phone.includes(searchTerm)
  )

  return (
    <div className={`min-h-screen bg-slate-900 ${isHebrew ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 p-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-white mb-4">
            שבלולי - אוטומציה למיוס עובדים
          </h1>
          
          {/* Search Bar */}
          <div className="bg-slate-700 p-3 rounded-lg">
            <input
              type="text"
              placeholder="חפש לפי שם, אימייל, טל"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-600 border border-slate-500 text-white placeholder-slate-400 rounded px-3 py-2"
            />
          </div>
          
          <div className="mt-2 text-slate-300 text-sm">
            מועמדים ({filteredCandidates.length})
          </div>
        </div>
      </div>

      {/* Candidates Grid */}
      <div className="max-w-7xl mx-auto p-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredCandidates.map((candidate) => (
            <Card key={candidate.id} className="bg-slate-800 border-slate-700 text-white">
              <CardHeader className="pb-2">
                <div className="text-center mb-2">
                  <h3 className="text-lg font-semibold">{candidate.name}</h3>
                  <div className="bg-slate-700 rounded px-2 py-1 text-sm text-slate-300 mt-1">
                    {candidate.date} {candidate.time}
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 justify-center mb-2">
                  {candidate.tags.map((tag, tagIndex) => (
                    <span 
                      key={tagIndex}
                      className="bg-orange-500/20 text-orange-300 border border-orange-500/30 px-2 py-1 rounded-full text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <span>📧</span>
                    <a href={`mailto:${candidate.email}`} className="text-blue-400 hover:underline break-all">
                      {candidate.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span>📞</span>
                    <a href={`tel:${candidate.phone}`} className="text-blue-400 hover:underline">
                      {candidate.phone}
                    </a>
                  </div>
                </div>

                <div className="bg-blue-600 text-white p-3 rounded mb-4 text-center text-sm">
                  <div className="font-medium">הערות:</div>
                  <div>{candidate.notes}</div>
                </div>

                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 bg-white text-black border-white hover:bg-gray-100"
                  >
                    עדכן סטטוס
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex-1 bg-slate-700 text-white border-slate-600 hover:bg-slate-600"
                  >
                    💬 צפה בצ'אט
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}