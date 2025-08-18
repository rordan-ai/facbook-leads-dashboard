import React, { useState, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Textarea } from '../components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog'
import { supabase } from '../integrations/supabase/client'

interface Lead {
  [key: string]: string
}

interface LeadWithStatus extends Lead {
  status?: 'unchecked' | 'relevant' | 'irrelevant'
  notes?: string
}

const statusLabels = {
  he: {
    unchecked: 'לא נבדק',
    relevant: 'רלוונטי',
    irrelevant: 'לא רלוונטי',
    selectStatus: 'בחר סטטוס',
    notes: 'הערות',
    addNotes: 'הוסף הערות...'
  },
  en: {
    unchecked: 'Unchecked',
    relevant: 'Relevant',  
    irrelevant: 'Irrelevant',
    selectStatus: 'Select Status',
    notes: 'Notes',
    addNotes: 'Add notes...'
  }
}

const getStatusColor = (status: string) => {
  switch(status) {
    case 'relevant': return 'bg-green-600/20 text-green-300 border-green-600/30'
    case 'irrelevant': return 'bg-red-600/20 text-red-300 border-red-600/30'
    default: return 'bg-gray-600/20 text-gray-300 border-gray-600/30'
  }
}

export function ResultsPage() {
  console.log('ResultsPage component is rendering...')
  const { t, language } = useLanguage()
  const [leads, setLeads] = useState<LeadWithStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedLead, setSelectedLead] = useState<number | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  
  console.log('Current language:', language)

  const isHebrew = language === 'he'
  const labels = statusLabels[isHebrew ? 'he' : 'en']

  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = async () => {
    try {
      setLoading(true)
      setError(null)
      
      console.log('Calling get-leads function...')
      
      const { data, error } = await supabase.functions.invoke('get-leads')
      
      if (error) {
        console.error('Supabase function error:', error)
        throw error
      }

      console.log('Function response:', data)
      
      if (data?.leads) {
        const leadsWithStatus = data.leads.map((lead: Lead) => ({
          ...lead,
          status: 'unchecked' as const,
          notes: ''
        }))
        setLeads(leadsWithStatus)
      } else {
        setLeads([])
      }
      
    } catch (err: any) {
      console.error('Error fetching leads:', err)
      setError(err.message || 'שגיאה בטעינת הנתונים')
    } finally {
      setLoading(false)
    }
  }

  const refreshLeads = () => {
    fetchLeads()
  }

  const updateLeadStatus = (index: number, status: 'unchecked' | 'relevant' | 'irrelevant') => {
    setLeads(prev => prev.map((lead, i) => 
      i === index ? { ...lead, status } : lead
    ))
    setIsDialogOpen(false)
    
    // TODO: שליחה למייק
    console.log('Sending to Mike:', { leadIndex: index, status, lead: leads[index] })
  }

  const updateLeadNotes = (index: number, notes: string) => {
    setLeads(prev => prev.map((lead, i) => 
      i === index ? { ...lead, notes } : lead
    ))
  }

  const openStatusDialog = (leadIndex: number) => {
    setSelectedLead(leadIndex)
    setIsDialogOpen(true)
  }

  // מיון הלידים - לא רלוונטיים בתחתית
  const sortedLeads = [...leads].sort((a, b) => {
    if (a.status === 'irrelevant' && b.status !== 'irrelevant') return 1
    if (a.status !== 'irrelevant' && b.status === 'irrelevant') return -1
    return 0
  })

  if (loading) {
    return (
      <div className={`container mx-auto px-3 sm:px-4 py-4 sm:py-8 ${isHebrew ? 'rtl' : 'ltr'}`}>
        <div className="text-center">
          <p className="text-base sm:text-lg text-foreground">{isHebrew ? 'טוען נתונים...' : 'Loading data...'}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`container mx-auto px-3 sm:px-4 py-4 sm:py-8 ${isHebrew ? 'rtl' : 'ltr'}`}>
        <Card className="mx-auto max-w-md bg-card border-border">
          <CardHeader>
            <CardTitle className="text-destructive text-center">
              {isHebrew ? 'שגיאה' : 'Error'}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4 text-foreground">{error}</p>
            <Button onClick={refreshLeads}>
              {isHebrew ? 'נסה שוב' : 'Try Again'}
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={`container mx-auto px-3 sm:px-4 py-4 sm:py-8 ${isHebrew ? 'rtl' : 'ltr'}`}>
      <header className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground">
            {isHebrew ? 'לידים מפייסבוק' : 'Facebook Leads'}
          </h2>
          <Button onClick={refreshLeads} className="self-start sm:self-auto">
            {isHebrew ? 'רענן נתונים' : 'Refresh Data'}
          </Button>
        </div>
        <p className="text-muted-foreground text-sm sm:text-base">
          {isHebrew ? `נמצאו ${leads.length} לידים` : `Found ${leads.length} leads`}
        </p>
      </header>

      {leads.length === 0 ? (
        <Card className="mx-auto max-w-md bg-card border-border">
          <CardHeader>
            <CardTitle className="text-xl text-center text-foreground">
              {isHebrew ? 'אין לידים' : 'No Leads'}
            </CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              {isHebrew ? 'לא נמצאו לידים בגיליון' : 'No leads found in the spreadsheet'}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button onClick={refreshLeads}>
              {isHebrew ? 'רענן נתונים' : 'Refresh Data'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4 sm:space-y-6">
          {sortedLeads.map((lead, originalIndex) => {
            const actualIndex = leads.findIndex(l => l === lead)
            return (
              <Card 
                key={actualIndex} 
                className={`w-full bg-card border-border shadow-lg hover:shadow-xl transition-all duration-200 ${
                  lead.status === 'irrelevant' ? 'opacity-60' : ''
                }`}
              >
                <CardHeader className="pb-3 sm:pb-4">
                  <div className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
                      <div className="flex-1">
                        <CardTitle className="text-lg sm:text-xl break-words text-foreground">
                          {lead.name || lead['שם'] || lead['Name'] || `${isHebrew ? 'ליד' : 'Lead'} #${actualIndex + 1}`}
                        </CardTitle>
                        <CardDescription className="mt-1 break-all text-sm text-muted-foreground">
                          {lead.email || lead['אימייל'] || lead['Email'] || ''}
                        </CardDescription>
                      </div>
                      
                      {/* סטטוס נוכחי + כפתור שינוי */}
                      <div className="flex items-center gap-2">
                        {lead.status && lead.status !== 'unchecked' && (
                          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(lead.status)}`}>
                            {labels[lead.status]}
                          </span>
                        )}
                        
                        <Dialog open={isDialogOpen && selectedLead === actualIndex} onOpenChange={setIsDialogOpen}>
                          <DialogTrigger asChild>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => openStatusDialog(actualIndex)}
                              className="border-border hover:bg-accent"
                            >
                              {labels.selectStatus}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-card border-border">
                            <DialogHeader>
                              <DialogTitle className="text-foreground">
                                {labels.selectStatus}
                              </DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-3 pt-4">
                              <Button
                                variant="outline"
                                onClick={() => updateLeadStatus(actualIndex, 'unchecked')}
                                className="justify-start border-border hover:bg-accent"
                              >
                                {labels.unchecked}
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => updateLeadStatus(actualIndex, 'relevant')}
                                className="justify-start bg-green-600/10 border-green-600/30 text-green-300 hover:bg-green-600/20"
                              >
                                {labels.relevant}
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => updateLeadStatus(actualIndex, 'irrelevant')}
                                className="justify-start bg-red-600/10 border-red-600/30 text-red-300 hover:bg-red-600/20"
                              >
                                {labels.irrelevant}
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* פרטי הליד */}
                  <div className="space-y-2">
                    {Object.entries(lead).filter(([key]) => !['status', 'notes'].includes(key)).map(([key, value]) => (
                      <div key={key} className="flex flex-col sm:flex-row gap-1 text-sm border-b border-border/30 pb-1 last:border-0">
                        <span className="font-medium text-muted-foreground sm:min-w-[120px] sm:max-w-[120px]">
                          {key}:
                        </span>
                        <span className="break-words flex-1 text-foreground">{value}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* שדה הערות */}
                  <div className="space-y-2 pt-2 border-t border-border/30">
                    <label className="text-sm font-medium text-foreground block">
                      {labels.notes}:
                    </label>
                    <Textarea
                      value={lead.notes || ''}
                      onChange={(e) => updateLeadNotes(actualIndex, e.target.value)}
                      placeholder={labels.addNotes}
                      className="min-h-[70px] sm:min-h-[80px] resize-none text-sm bg-background border-border text-foreground"
                    />
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}