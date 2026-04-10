'use client';

import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from 'i18next-resources-to-backend';
import { getOptions } from './settings';

// Initialize i18next only on the client side
i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .use(
    resourcesToBackend(
      (language: string, namespace: string) =>
        import(`../../public/locales/${language}/${namespace}.json`)
    )
  )
  .init({
    ...getOptions(),
    detection: {
      caches: ['localStorage', 'cookie'],
      order: ['querystring', 'localStorage', 'cookie', 'navigator', 'htmlTag', 'path', 'subdomain'],
    },
    preload: ['en'], // Preload fallback
  });

export default i18next;
