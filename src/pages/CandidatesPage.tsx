import React, { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardContent, CardHeader } from '../components/ui/card'

interface Candidate {
  id: number
  name: string
  phone: string
  email: string
  date: string
  time: string
  status: string
  notes: string
  tags: { text: string; color: string }[]
  source: string
}

const mockCandidates: Candidate[] = [
  {
    id: 1,
    name: 'סינה כהן',
    phone: '972544886569',
    email: 'sinayac8@gmail.com',
    date: '08/18/2025',
    time: '9:29am',
    status: 'interview',
    notes: 'ראשון לציון',
    tags: [{ text: 'השקפה', color: 'orange' }],
    source: 'הגיע מקליקפין'
  },
  {
    id: 2,
    name: 'Gilat Amon',
    phone: '972523300420',
    email: 'gilatam40@gmail.com',
    date: '08/18/2025',
    time: '9:51am',
    status: 'relevant',
    notes: 'פתח תקווה',
    tags: [{ text: 'תל אביב', color: 'orange' }],
    source: 'הגיע מקליקפין'
  },
  {
    id: 3,
    name: 'Almaz Almaz',
    phone: '972534283788',
    email: 'lmzl60008@gamil.com',
    date: '08/18/2025',
    time: '10:32am',
    status: 'relevant',
    notes: 'קיום מגורים באר שבע',
    tags: [{ text: 'תל אביב', color: 'orange' }],
    source: 'הגיע מקליקפין'
  },
  {
    id: 4,
    name: 'Ayala Nazukaro Herman',
    phone: '972543302003',
    email: 'nazukaro@walla.com',
    date: '26/05/2025',
    time: '14:05',
    status: 'unchecked',
    notes: 'הקליק להחלפת הערה...',
    tags: [{ text: 'יעקב פאר', color: 'gray' }],
    source: 'הגיע מקליקפין'
  },
  {
    id: 5,
    name: 'דרין חוג',
    phone: '972507755216',
    email: 'darink1612@gmail.com',
    date: '26/05/2025',
    time: '11:34',
    status: 'unchecked',
    notes: 'הקליק להחלפת הערה...',
    tags: [
      { text: 'חיפה ק', color: 'gray' },
      { text: 'ים פאי קמפיין', color: 'gray' }
    ],
    source: 'הגיע מקליקפין'
  },
  {
    id: 6,
    name: 'TAIR AMOS',
    phone: '972527430380',
    email: 'Amostair@gmail.com',
    date: '08/18/2025',
    time: '8:49am',
    status: 'relevant',
    notes: 'הערות',
    tags: [{ text: 'תל אביב', color: 'orange' }],
    source: 'הגיע מקליקפין'
  }
]

export function CandidatesPage() {
  const { language } = useLanguage()
  const [searchTerm, setSearchTerm] = useState('')

  const isHebrew = language === 'he'

  const filteredCandidates = mockCandidates.filter(candidate =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.phone.includes(searchTerm)
  )

  const getTagColor = (color: string) => {
    switch(color) {
      case 'orange': return 'bg-orange-500/20 text-orange-300 border-orange-500/30'
      case 'gray': return 'bg-gray-500/20 text-gray-300 border-gray-500/30'
      default: return 'bg-blue-500/20 text-blue-300 border-blue-500/30'
    }
  }

  return (
    <div className={`min-h-screen bg-slate-900 text-white ${isHebrew ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-6">
            <button className="text-white hover:text-gray-300">Settings</button>
            <button className="text-white hover:text-gray-300">Results</button>
            <button className="text-white hover:text-gray-300 font-semibold">Candidates (57)</button>
          </div>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">
              שבלולי - אוטומציה לגיוס עובדים
            </h1>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-slate-700 p-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <label className="text-white font-medium whitespace-nowrap">
            חיפוש מועמד:
          </label>
          <Input
            type="text"
            placeholder="חפש לפי שם, אימייל, טלפון..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-slate-600 border-slate-500 text-white placeholder:text-slate-400"
          />
        </div>
      </div>

      {/* Candidates Grid */}
      <div className="max-w-7xl mx-auto p-6">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCandidates.map((candidate) => (
            <Card key={candidate.id} className="bg-slate-800 border-slate-700 text-white">
              <CardHeader className="pb-2">
                <div className="text-center mb-3">
                  <h3 className="text-xl font-bold mb-2">{candidate.name}</h3>
                  <div className="bg-slate-600 rounded px-3 py-1 text-sm text-slate-300 inline-block">
                    {candidate.date} {candidate.time}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 justify-center mb-3">
                  {candidate.tags.map((tag, tagIndex) => (
                    <span 
                      key={tagIndex}
                      className={`${getTagColor(tag.color)} px-3 py-1 rounded-full text-sm border`}
                    >
                      {tag.text}
                    </span>
                  ))}
                </div>

                <div className="text-center text-slate-300 text-sm mb-3">
                  {candidate.source}
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <span>Email:</span>
                    <a href={`mailto:${candidate.email}`} className="text-blue-400 hover:underline break-all">
                      {candidate.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span>Phone:</span>
                    <a href={`tel:${candidate.phone}`} className="text-blue-400 hover:underline">
                      {candidate.phone}
                    </a>
                  </div>
                </div>

                <div className="bg-blue-600 text-white p-3 rounded mb-4 text-center">
                  <div className="font-medium text-sm mb-1">הערות:</div>
                  <div className="text-sm">{candidate.notes}</div>
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
                    צפה בצ'אט
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