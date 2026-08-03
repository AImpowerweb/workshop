import { createContext, useContext, useEffect, useState, useCallback } from 'react';

const LanguageContext = createContext(null);
const STORAGE_KEY = 'aimpower-lang';

/** Decide the starting language: saved choice → browser preference → English. */
function getInitialLang() {
  if (typeof window === 'undefined') return 'en';
  const saved = window.localStorage.getItem(STORAGE_KEY);
  if (saved === 'en' || saved === 'zh') return saved;
  const browser = (navigator.language || '').toLowerCase();
  return browser.startsWith('zh') ? 'zh' : 'en';
}

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(getInitialLang);

  // Persist the choice and keep <html lang> accurate for a11y + correct CJK rendering.
  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang === 'zh' ? 'zh-Hans' : 'en';
  }, [lang]);

  // t({ en, zh }) → the string for the active language, falling back to English.
  const t = useCallback(
    (value) => {
      if (value && typeof value === 'object') return value[lang] ?? value.en ?? '';
      return value ?? '';
    },
    [lang],
  );

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used within a LanguageProvider');
  return ctx;
}
