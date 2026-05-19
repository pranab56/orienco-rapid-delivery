'use client';

import React from 'react';
import GoogleTranslate from '@/components/translate/Translate';

export function I18nProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      <GoogleTranslate />
      {children}
    </>
  );
}
