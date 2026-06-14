import React, { createContext, useContext, useState, useEffect, useRef } from 'react';

type Language = 'en' | 'fr' | 'ar';

interface TranslationContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (text: string) => string;
}

const TranslationContext = createContext<TranslationContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (text) => text,
});

export const useTranslation = () => useContext(TranslationContext);

export const TranslationProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [dict, setDict] = useState<Record<string, Record<string, string>>>({ fr: {}, ar: {} });
  const pendingTranslations = useRef<Set<string>>(new Set());
  const translating = useRef<Set<string>>(new Set());
  const failedTranslations = useRef<Set<string>>(new Set());
  const bufferTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('app_lang') as Language;
    if (saved && ['en', 'fr', 'ar'].includes(saved)) {
      setLanguage(saved);
      document.documentElement.dir = saved === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = saved;
    }
    const savedDict = localStorage.getItem('app_dict');
    if (savedDict) {
      try { setDict(JSON.parse(savedDict)); } catch (e) {}
    }
  }, []);

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('app_lang', lang);
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
  };

  const processPendingTranslations = async (targetLang: Language) => {
    const texts = Array.from(pendingTranslations.current);
    if (texts.length === 0) return;
    
    texts.forEach(t => translating.current.add(t));
    pendingTranslations.current.clear();
    
    try {
      const response = await fetch('/api/translate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ texts, targetLang })
      });
      
      if (!response.ok) throw new Error('Translation failed');
      
      const translatedTexts = await response.json();
      
      if (Array.isArray(translatedTexts) && translatedTexts.length === texts.length) {
        setDict(prev => {
          const newTargetDict = { ...prev[targetLang] };
          texts.forEach((text, idx) => {
            newTargetDict[text as keyof typeof newTargetDict] = translatedTexts[idx] || text;
            translating.current.delete(text);
          });
          const newDict = { ...prev, [targetLang]: newTargetDict };
          localStorage.setItem('app_dict', JSON.stringify(newDict));
          return newDict;
        });
      }
    } catch (e: any) {
      console.warn("Translation batch failed. Skipping these strings for now.", e?.message || e);
      texts.forEach(text => {
        failedTranslations.current.add(text);
        translating.current.delete(text);
      });
    }
  };

  const t = (text: string | undefined | null): string => {
    if (!text) return "";
    if (language === 'en') return text;
    if (dict[language]?.[text]) return dict[language][text];
    if (failedTranslations.current.has(text)) return text;
    
    if (!pendingTranslations.current.has(text) && !translating.current.has(text)) {
      pendingTranslations.current.add(text);
      if (bufferTimeout.current) clearTimeout(bufferTimeout.current);
      bufferTimeout.current = setTimeout(() => {
        processPendingTranslations(language);
      }, 1500);
    }

    return text;
  };

  return (
    <TranslationContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </TranslationContext.Provider>
  );
};
