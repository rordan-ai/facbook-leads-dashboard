import React, { createContext, useContext, useState } from 'react'

type Language = 'he' | 'en'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

const translations = {
  he: {
    candidates: 'מועמדים',
    search: 'חיפוש',
    results: 'תוצאות',
    name: 'שם',
    position: 'תפקיד',
    experience: 'ניסיון'
  },
  en: {
    candidates: 'Candidates',
    search: 'Search',
    results: 'Results', 
    name: 'Name',
    position: 'Position',
    experience: 'Experience'
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>('he')
  
  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.he] || key
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}