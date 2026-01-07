'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export const languages = [
  { code: 'en', label: 'EN English' },
  { code: 'es', label: 'ES Español' },
  { code: 'fr', label: 'FR Français' },
] as const;

export type LanguageCode = typeof languages[number]['code'];

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (language: LanguageCode) => void;
  getLanguageLabel: () => string;
  isLoading: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const STORAGE_KEY = 'language-storage';

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<LanguageCode>('en');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const validLanguage = languages.find((lang) => lang.code === stored);
          if (validLanguage) {
            setLanguageState(validLanguage.code);
          }
        }
      } catch (error) {
        console.error('Error reading language from localStorage:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
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
        isLoading,
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

