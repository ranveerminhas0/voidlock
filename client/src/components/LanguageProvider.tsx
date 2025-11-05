import { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { translations, type Translations } from '@/lib/i18n/translations';
import { detectUserLanguage } from '@/lib/i18n/languages';

interface LanguageContextType {
  language: string;
  setLanguage: (lang: string) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<string>(() => {
    const stored = localStorage.getItem('voidlock-language');
    return stored || detectUserLanguage();
  });

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem('voidlock-language', lang);
  };

  const t = useMemo(() => translations[language] || translations.en, [language]);

  const value = useMemo(() => ({ language, setLanguage, t }), [language, t]);

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
