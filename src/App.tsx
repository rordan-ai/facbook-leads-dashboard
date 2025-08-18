import React from 'react'

// רשימת מועמדים פשוטה
const candidates = [
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
  }
]

function App() {
  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      <header className="bg-blue-600 text-white p-4 text-center">
        <h1 className="text-2xl font-bold">מועמדים</h1>
      </header>
      
      <main className="container mx-auto p-4">
        <h2 className="text-xl font-semibold mb-4">רשימת מועמדים ({candidates.length})</h2>
        
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {candidates.map((candidate) => (
            <div key={candidate.id} className="bg-white p-4 rounded-lg shadow border">
              <h3 className="font-bold text-lg text-gray-800 mb-2">{candidate.name}</h3>
              <p className="text-gray-600 mb-2">{candidate.position}</p>
              <p className="text-sm text-gray-500 mb-3">{candidate.experience}</p>
              
              <div className="space-y-1 text-sm">
                <p>
                  <span className="font-medium">אימייל: </span>
                  <a href={`mailto:${candidate.email}`} className="text-blue-600 hover:underline">
                    {candidate.email}
                  </a>
                </p>
                <p>
                  <span className="font-medium">טלפון: </span>
                  <a href={`tel:${candidate.phone}`} className="text-blue-600 hover:underline">
                    {candidate.phone}
                  </a>
                </p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}

export default App