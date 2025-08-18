import React, { useState, useEffect } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { supabase } from '../integrations/supabase/client'

interface Lead {
  [key: string]: string
}

export function ResultsPage() {
  console.log('ResultsPage component is rendering...')
  const { t, language } = useLanguage()
  const [leads, setLeads] = useState<Lead[]>([])
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
        setLeads(data.leads)
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

  if (loading) {
    return (
      <div className={`container mx-auto px-4 py-8 ${isHebrew ? 'rtl' : 'ltr'}`}>
        <div className="text-center">
          <p className="text-lg">{isHebrew ? 'טוען נתונים...' : 'Loading data...'}</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={`container mx-auto px-4 py-8 ${isHebrew ? 'rtl' : 'ltr'}`}>
        <Card>
          <CardHeader>
            <CardTitle className="text-red-600">
              {isHebrew ? 'שגיאה' : 'Error'}
            </CardTitle>
          </CardHeader>
          <CardContent>
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
    <div className={`container mx-auto px-4 py-8 ${isHebrew ? 'rtl' : 'ltr'}`}>
      <header className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-bold text-foreground">
            {isHebrew ? 'לידים מפייסבוק' : 'Facebook Leads'}
          </h2>
          <Button onClick={refreshLeads}>
            {isHebrew ? 'רענן נתונים' : 'Refresh Data'}
          </Button>
        </div>
        <p className="text-muted-foreground">
          {isHebrew ? `נמצאו ${leads.length} לידים` : `Found ${leads.length} leads`}
        </p>
      </header>

      {leads.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">
              {isHebrew ? 'אין לידים' : 'No Leads'}
            </CardTitle>
            <CardDescription>
              {isHebrew ? 'לא נמצאו לידים בגיליון' : 'No leads found in the spreadsheet'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={refreshLeads}>
              {isHebrew ? 'רענן נתונים' : 'Refresh Data'}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {leads.map((lead, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="text-lg">
                  {lead.name || lead['שם'] || lead['Name'] || `${isHebrew ? 'ליד' : 'Lead'} #${index + 1}`}
                </CardTitle>
                <CardDescription>
                  {lead.email || lead['אימייל'] || lead['Email'] || ''}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(lead).map(([key, value]) => (
                    <div key={key} className="flex justify-between">
                      <span className="font-medium">{key}:</span>
                      <span>{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}