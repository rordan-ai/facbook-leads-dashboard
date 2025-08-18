import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const GOOGLE_API_KEY = Deno.env.get('GOOGLE_API_KEY')
    
    console.log('GOOGLE_API_KEY exists:', !!GOOGLE_API_KEY)
    
    const SHEET_ID = '1e2abbnmnY6OsIsCJvtVo5tFtNlQlUQHSMlU7Jyg29dI'
    const RANGE = 'Sheet1!A:Z'

    console.log('Fetching leads from Google Sheets...')
    console.log('Sheet ID:', SHEET_ID)
    console.log('Range:', RANGE)
    
    // Try both with and without API key for public sheets
    let url
    if (GOOGLE_API_KEY) {
      url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${GOOGLE_API_KEY}`
    } else {
      // For public sheets, try without API key first
      url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}`
    }
    
    console.log('Request URL:', url)
    
    const response = await fetch(url)
    
    console.log('Response status:', response.status)
    console.log('Response statusText:', response.statusText)
    
    if (!response.ok) {
      const errorText = await response.text()
      console.error('Google Sheets API error details:', errorText)
      
      // If API key failed, try without it for public sheets
      if (response.status === 400 && GOOGLE_API_KEY) {
        console.log('Trying without API key for public sheet...')
        const publicUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}`
        console.log('Public URL:', publicUrl)
        
        const publicResponse = await fetch(publicUrl)
        console.log('Public response status:', publicResponse.status)
        
        if (publicResponse.ok) {
          const publicData = await publicResponse.json()
          console.log('Successfully fetched with public access')
          
          if (!publicData.values || publicData.values.length === 0) {
            return new Response(
              JSON.stringify({ leads: [], message: 'No data found in sheet' }),
              { 
                headers: { ...corsHeaders, 'Content-Type': 'application/json' },
                status: 200
              }
            )
          }

          const headers = publicData.values[0]
          const rows = publicData.values.slice(1)

          const leads = rows.map((row: string[]) => {
            const lead: any = {}
            headers.forEach((header: string, index: number) => {
              lead[header] = row[index] || ''
            })
            return lead
          })

          console.log(`Successfully processed ${leads.length} leads`)

          return new Response(
            JSON.stringify({ leads, total: leads.length }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200
            }
          )
        }
      }
      
      return new Response(
        JSON.stringify({ 
          error: 'Google Sheets access failed',
          details: `שגיאה בגישה לגיליון: ${response.status} - ${errorText}. אנא וודא שהגיליון פתוח לקריאה ציבורית.`,
          status: response.status,
          url: url
        }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: response.status
        }
      )
    }

    const data = await response.json()
    console.log('Raw data from sheets:', data)

    if (!data.values || data.values.length === 0) {
      return new Response(
        JSON.stringify({ leads: [], message: 'No data found in sheet' }),
        { 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      )
    }

    // First row should contain headers
    const headers = data.values[0]
    const rows = data.values.slice(1)

    // Convert rows to objects using headers as keys
    const leads = rows.map((row: string[]) => {
      const lead: any = {}
      headers.forEach((header: string, index: number) => {
        lead[header] = row[index] || ''
      })
      return lead
    })

    console.log(`Successfully processed ${leads.length} leads`)

    return new Response(
      JSON.stringify({ leads, total: leads.length }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Error fetching leads:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to fetch leads', 
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})