'use client';

import { createContext, useContext, useState, useLayoutEffect, startTransition, ReactNode } from 'react';

export const languages = [
  { code: 'en', label: 'GB English' },
  { code: 'es', label: 'ES Español' },
  { code: 'fr', label: 'FR Français' },
] as const;

export type LanguageCode = typeof languages[number]['code'];

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  getLanguageLabel: () => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'language-storage';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>('en');

  useLayoutEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const validLanguage = languages.find((lang) => lang.code === stored);
        if (validLanguage) {
          startTransition(() => {
            setLanguageState(validLanguage.code);
          });
        }
      }
    }
  }, []);

  const setLanguage = (newLanguage: LanguageCode) => {
    setLanguageState(newLanguage);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, newLanguage);
    }
  };

  const getLanguageLabel = () => {
    return languages.find((lang) => lang.code === language)?.label || languages[0].label;
  };

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        getLanguageLabel,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

