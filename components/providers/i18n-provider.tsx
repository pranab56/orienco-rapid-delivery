'use client';

import React, { useEffect } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18nClient from '@/lib/i18n/client';

export function I18nProvider({ children }: { children: React.ReactNode }) {

  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      document.dir = lng === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = lng;
    };

    i18nClient.on('languageChanged', handleLanguageChange);
    // Set initial direction
    handleLanguageChange(i18nClient.language);

    return () => {
      i18nClient.off('languageChanged', handleLanguageChange);
    };
  }, []);

  return <I18nextProvider i18n={i18nClient}>{children}</I18nextProvider>;
}
