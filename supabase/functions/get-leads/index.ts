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
    const SHEET_ID = '1e2abbnmnY6OsIsCJvtVo5tFtNlQlUQHSMlU7Jyg29dI'
    const RANGE = 'Sheet1!A:Z' // Read all columns from row 1 onwards

    console.log('Fetching leads from Google Sheets...')
    
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${GOOGLE_API_KEY}`
    
    const response = await fetch(url)
    
    if (!response.ok) {
      console.error('Google Sheets API error:', response.status, response.statusText)
      throw new Error(`Google Sheets API error: ${response.status}`)
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