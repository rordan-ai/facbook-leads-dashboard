import React, { useState, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Textarea } from '../components/ui/textarea'
import { supabase } from '../integrations/supabase/client'

interface Lead {
  [key: string]: string
}

interface LeadWithStatus extends Lead {
  status?: 'unchecked' | 'relevant' | 'irrelevant'
  notes?: string
}

export function ResultsPage() {
  console.log('ResultsPage component is rendering...')
  const { t, language } = useLanguage()
  const [leads, setLeads] = useState<LeadWithStatus[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  console.log('Current language:', language)

  const isHebrew = language === 'he'

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
  }

  const updateLeadNotes = (index: number, notes: string) => {
    setLeads(prev => prev.map((lead, i) => 
      i === index ? { ...lead, notes } : lead
    ))
  }

  if (loading) {
    return (
      <div className={`container mx-auto px-3 sm:px-4 py-4 sm:py-8 ${isHebrew ? 'rtl' : 'ltr'}`}>
        <div className="text-center">
          <p className="text-base sm:text-lg">{isHebrew ? 'טוען נתונים...' : 'Loading data...'}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`container mx-auto px-3 sm:px-4 py-4 sm:py-8 ${isHebrew ? 'rtl' : 'ltr'}`}>
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive text-center">
              {isHebrew ? 'שגיאה' : 'Error'}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-4">{error}</p>
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
        <Card className="mx-auto max-w-md">
          <CardHeader>
            <CardTitle className="text-xl text-center">
              {isHebrew ? 'אין לידים' : 'No Leads'}
            </CardTitle>
            <CardDescription className="text-center">
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
          {leads.map((lead, index) => (
            <Card key={index} className="w-full shadow-md hover:shadow-lg transition-shadow duration-200">
              <CardHeader className="pb-3 sm:pb-4">
                <div className="space-y-3">
                  <div>
                    <CardTitle className="text-lg sm:text-xl break-words">
                      {lead.name || lead['שם'] || lead['Name'] || `${isHebrew ? 'ליד' : 'Lead'} #${index + 1}`}
                    </CardTitle>
                    <CardDescription className="mt-1 break-all text-sm">
                      {lead.email || lead['אימייל'] || lead['Email'] || ''}
                    </CardDescription>
                  </div>
                  
                  {/* Status buttons */}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant={lead.status === 'unchecked' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateLeadStatus(index, 'unchecked')}
                      className="flex-1 sm:flex-none text-xs sm:text-sm min-w-[80px]"
                    >
                      {isHebrew ? 'לא נבדק' : 'Unchecked'}
                    </Button>
                    <Button
                      variant={lead.status === 'relevant' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateLeadStatus(index, 'relevant')}
                      className="flex-1 sm:flex-none text-xs sm:text-sm min-w-[80px] bg-green-600 hover:bg-green-700 text-white border-green-600 data-[state=open]:bg-green-700"
                    >
                      {isHebrew ? 'רלוונטי' : 'Relevant'}
                    </Button>
                    <Button
                      variant={lead.status === 'irrelevant' ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => updateLeadStatus(index, 'irrelevant')}
                      className="flex-1 sm:flex-none text-xs sm:text-sm min-w-[80px] bg-red-600 hover:bg-red-700 text-white border-red-600 data-[state=open]:bg-red-700"
                    >
                      {isHebrew ? 'לא רלוונטי' : 'Irrelevant'}
                    </Button>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Lead details */}
                <div className="space-y-2">
                  {Object.entries(lead).filter(([key]) => !['status', 'notes'].includes(key)).map(([key, value]) => (
                    <div key={key} className="flex flex-col sm:flex-row gap-1 text-sm border-b border-border/30 pb-1 last:border-0">
                      <span className="font-medium text-muted-foreground sm:min-w-[120px] sm:max-w-[120px]">
                        {key}:
                      </span>
                      <span className="break-words flex-1">{value}</span>
                    </div>
                  ))}
                </div>
                
                {/* Notes section */}
                <div className="space-y-2 pt-2 border-t border-border/30">
                  <label className="text-sm font-medium text-foreground block">
                    {isHebrew ? 'הערות:' : 'Notes:'}
                  </label>
                  <Textarea
                    value={lead.notes || ''}
                    onChange={(e) => updateLeadNotes(index, e.target.value)}
                    placeholder={isHebrew ? 'הוסף הערות...' : 'Add notes...'}
                    className="min-h-[70px] sm:min-h-[80px] resize-none text-sm"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}