'use client';

import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from 'react-i18next';

const PolicySection = ({ index, title, content }: { index: number; title: string; content: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      className="space-y-4 md:space-y-6"
    >
      <h2 className="text-xl md:text-2xl font-bold text-neutral-1">{title}</h2>
      <p className="text-neutral-2 leading-relaxed text-sm lg:text-base font-medium opacity-80">
        {content}
      </p>
    </motion.div>
  );
};



export default function PrivacyPage() {
  const { t } = useTranslation('common');


  return (
    <div className="min-h-screen bg-white">
      {/* Header Section */}
      <section className="bg-[#FAF6F2] py-16 md:py-24 text-center mt-8 md:mt-12">
        <div className="container mx-auto px-4 md:px-6 space-y-3 md:space-y-4">
          <div className="flex items-center justify-center gap-2 text-sm font-medium">
            <Link href="/" className="text-primary hover:underline">{t('privacy.breadcrumb_company')}</Link>
            <ChevronRight size={14} className="text-neutral-2" />
            <span className="text-neutral-2">{t('privacy.breadcrumb_privacy')}</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-bold text-neutral-1">{t('privacy.title')}</h1>
          <p className="text-neutral-2 text-sm md:text-base font-medium max-w-lg mx-auto opacity-70">
            {t('privacy.subtitle')}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="container mx-auto px-4 md:px-6 max-w-5xl py-16 md:py-24 space-y-10 md:space-y-16">
        {(() => {
            const sections = t('privacy.sections', { returnObjects: true });
            const sectionsArray = Array.isArray(sections) ? sections : [];
            return sectionsArray.map((section: Record<string, string>, i: number) => (
              <PolicySection key={i} index={i} title={section?.title || ''} content={section?.content || ''} />
            ));
        })()}
      </section>
    </div>
  );
}
