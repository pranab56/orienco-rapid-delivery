'use client';

import GoogleTranslate from '@/components/translate/Translate';
import React from 'react';

export function I18nProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GoogleTranslate />
      {children}
    </>
  );
}
