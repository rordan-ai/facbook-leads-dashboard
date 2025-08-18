import React, { useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog'

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

// נתוני מועמדים מדומים בהתאם לתמונה
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
  },
  {
    id: 4,
    name: 'Ayala Nazukaro Herman',
    phone: '972543302003',
    email: 'nazukaro@walla.com',
    date: '26/05/2025',
    time: '14:05',
    status: 'unchecked',
    tags: ['יעקב פאר'],
    source: 'הגיע מקליקפין',
    notes: 'הקלק להחלפת הערה...'
  },
  {
    id: 5,
    name: 'דרין חוג',
    phone: '972507755216',
    email: 'darink1612@gmail.com',
    date: '26/05/2025',
    time: '11:34',
    status: 'unchecked', 
    tags: ['חיפה ק', 'ים פאי קמפיין'],
    source: 'הגיע מקליקפין',
    notes: 'הקלק להחלפת הערה...'
  },
  {
    id: 6,
    name: 'TAIR AMOS',
    phone: '972527430380',
    email: 'Amostair@gmail.com',
    date: '08/18/2025',
    time: '8:49am',
    status: 'relevant',
    tags: ['תל אביב'],
    source: 'הגיע מקליקפין',
    notes: 'הערות'
  }
]

const statusLabels = {
  he: {
    unchecked: 'לא נבדק',
    relevant: 'רלוונטי',
    irrelevant: 'לא רלוונטי', 
    interview: 'ראיון',
    hired: 'התקבל',
    selectStatus: 'בחר סטטוס',
    notes: 'הערות',
    updateStatus: 'עדכן סטטוס',
    viewChat: 'צפה בצ\'אט'
  },
  en: {
    unchecked: 'Unchecked',
    relevant: 'Relevant',
    irrelevant: 'Irrelevant',
    interview: 'Interview', 
    hired: 'Hired',
    selectStatus: 'Select Status',
    notes: 'Notes',
    updateStatus: 'Update Status',
    viewChat: 'View Chat'
  }
}

export function ResultsPage() {
  const { language } = useLanguage()
  const [candidates, setCandidates] = useState<Candidate[]>(mockCandidates)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCandidate, setSelectedCandidate] = useState<number | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  const isHebrew = language === 'he'
  const labels = statusLabels[isHebrew ? 'he' : 'en']

  // Filter candidates based on search term
  const filteredCandidates = candidates.filter(candidate =>
    candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    candidate.phone.includes(searchTerm)
  )

  const updateCandidateStatus = (index: number, status: Candidate['status']) => {
    setCandidates(prev => prev.map((candidate, i) => 
      i === index ? { ...candidate, status } : candidate
    ))
    setIsDialogOpen(false)
    setSelectedCandidate(null)
  }

  const openStatusDialog = (candidateIndex: number) => {
    setSelectedCandidate(candidateIndex)
    setIsDialogOpen(true)
  }

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
          {filteredCandidates.map((candidate, index) => (
            <Card key={candidate.id} className="bg-slate-800 border-slate-700 text-white">
              <CardHeader className="pb-2">
                {/* Name and timestamp */}
                <div className="text-center mb-2">
                  <h3 className="text-lg font-semibold">{candidate.name}</h3>
                  <div className="bg-slate-700 rounded px-2 py-1 text-sm text-slate-300 mt-1">
                    {candidate.date} {candidate.time}
                  </div>
                </div>

                {/* Status tags */}
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
                {/* Contact Info */}
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

                {/* Blue info section */}
                <div className="bg-blue-600 text-white p-3 rounded mb-4 text-center text-sm">
                  <div className="font-medium">{labels.notes}:</div>
                  <div>{candidate.notes}</div>
                </div>

                {/* Action buttons */}
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 bg-white text-black border-white hover:bg-gray-100"
                    onClick={() => openStatusDialog(index)}
                  >
                    {labels.updateStatus}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="flex-1 bg-slate-700 text-white border-slate-600 hover:bg-slate-600"
                  >
                    💬 {labels.viewChat}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Status Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-slate-800 border-slate-700 text-white max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-center">
              {labels.selectStatus}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => selectedCandidate !== null && updateCandidateStatus(selectedCandidate, 'unchecked')}
              className="justify-start bg-gray-600/20 border-gray-600/30 text-gray-300 hover:bg-gray-600/30"
            >
              {labels.unchecked}
            </Button>
            <Button
              variant="outline"
              onClick={() => selectedCandidate !== null && updateCandidateStatus(selectedCandidate, 'relevant')}
              className="justify-start bg-blue-600/20 border-blue-600/30 text-blue-300 hover:bg-blue-600/30"
            >
              ✓ {labels.relevant}
            </Button>
            <Button
              variant="outline"
              onClick={() => selectedCandidate !== null && updateCandidateStatus(selectedCandidate, 'interview')}
              className="justify-start bg-orange-600/20 border-orange-600/30 text-orange-300 hover:bg-orange-600/30"
            >
              👥 {labels.interview}
            </Button>
            <Button
              variant="outline"
              onClick={() => selectedCandidate !== null && updateCandidateStatus(selectedCandidate, 'hired')}
              className="justify-start bg-green-600/20 border-green-600/30 text-green-300 hover:bg-green-600/30"
            >
              ✅ {labels.hired}
            </Button>
            <Button
              variant="outline"
              onClick={() => selectedCandidate !== null && updateCandidateStatus(selectedCandidate, 'irrelevant')}
              className="justify-start bg-red-600/20 border-red-600/30 text-red-300 hover:bg-red-600/30"
            >
              ✗ {labels.irrelevant}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}