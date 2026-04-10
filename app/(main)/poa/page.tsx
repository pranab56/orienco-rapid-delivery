'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import {
  FileText,
  Globe,
  Lock,
  Search,
  ShieldCheck,
  UserCheck
} from 'lucide-react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

interface FeatureCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  light?: boolean;
}

const FeatureCard = ({ icon: Icon, title, description, light = false }: FeatureCardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    className={`p-6 md:p-10 rounded-2xl flex flex-col items-center text-center space-y-4 ${light ? 'bg-white shadow-sm' : 'bg-[#F7F7F7]'}`}
  >
    <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
      <Icon size={32} />
    </div>
    <h3 className="text-xl font-bold text-neutral-1">{title}</h3>
    <p className="text-sm text-neutral-2 leading-relaxed">{description}</p>
  </motion.div>
);

const ProcessStep = ({ title, description }: { title: string, description: string }) => (
  <div className="p-6 md:p-8 rounded-xl border border-white/10 hover:border-primary/30 transition-colors space-y-3 md:space-y-4">
    <h3 className="text-base md:text-lg font-bold text-white">{title}</h3>
    <p className="text-xs md:text-sm text-white/50 leading-relaxed font-medium">{description}</p>
  </div>
);

export default function POAPage() {
  const { t } = useTranslation('common');

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="container mx-auto px-4 md:px-6 pt-24 pb-12 md:pt-24 md:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6 md:space-y-8"
          >
            <h1 
              className="text-3xl md:text-4xl font-black text-neutral-1 uppercase leading-tight tracking-tight"
              dangerouslySetInnerHTML={{ __html: t('poa.title') }}
            />
            <p className="text-sm md:text-lg  text-neutral-2 max-w-xl font-medium leading-relaxed">
              {t('poa.subtitle')}
            </p>
            <Button
              onClick={() => document.getElementById('consultation-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="h-10 md:h-12 px-6 md:px-8 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg shadow-lg shadow-primary/20 transition-all cursor-pointer text-sm md:text-base"
            >
              {t('poa.request_assistance')}
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/10"
          >
            <Image
              src="https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=1200&h=800&fit=crop"
              alt={t('poa.hero_img_alt')}
              width={1200}
              height={800}
              className="object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Why Use ZilaHomes POA? Section */}
      <section className="container mx-auto px-4 md:px-6 py-16 md:py-24 space-y-10 md:space-y-16">
        <div className="text-center space-y-3 md:space-y-4 max-w-3xl mx-auto font-medium">
          <h2 className="text-2xl md:text-4xl font-bold text-neutral-1 tracking-tight">{t('poa.why_title')}</h2>
          <p className="text-neutral-2">{t('poa.why_subtitle')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={Search}
            title={t('poa.features.verify_title')}
            description={t('poa.features.verify_desc')}
          />
          <FeatureCard
            icon={FileText}
            title={t('poa.features.manage_title')}
            description={t('poa.features.manage_desc')}
          />
          <FeatureCard
            icon={ShieldCheck}
            title={t('poa.features.protect_title')}
            description={t('poa.features.protect_desc')}
          />
        </div>
      </section>

      {/* 4-Step Process Section */}
      <section className="bg-[#1E2024] py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 space-y-10 md:space-y-16">
          <div className="text-center font-bold">
            <h2 className="text-2xl md:text-4xl text-white tracking-tight">{t('poa.process.title')}</h2>
          </div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: { transition: { staggerChildren: 0.1 } }
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            <ProcessStep
              title={t('poa.process.step1_title')}
              description={t('poa.process.step1_desc')}
            />
            <ProcessStep
              title={t('poa.process.step2_title')}
              description={t('poa.process.step2_desc')}
            />
            <ProcessStep
              title={t('poa.process.step3_title')}
              description={t('poa.process.step3_desc')}
            />
            <ProcessStep
              title={t('poa.process.step4_title')}
              description={t('poa.process.step4_desc')}
            />
          </motion.div>
        </div>
      </section>

      {/* Consultation Section */}
      <section id="consultation-form" className="container mx-auto px-4 md:px-6 py-16 md:py-24">
        <div className=" mx-auto bg-white rounded-2xl md:rounded-[2.5rem] shadow-2xl shadow-black/5 overflow-hidden border border-gray-100 flex flex-col lg:row-reverse items-stretch lg:flex-row-reverse">
          <div className="lg:w-1/2 relative min-h-[250px] md:min-h-[400px]">
            <Image
              src="/images/company/image1.png"
              alt={t('poa.consultation_img_alt')}
              fill
              className="object-cover brightness-[0.9]"
            />
          </div>
          <div className="lg:w-1/2 p-10 lg:p-16 space-y-8 bg-white">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold text-neutral-1">{t('poa.consultation.title')}</h2>
              <p className="text-neutral-2 font-medium">{t('poa.consultation.subtitle')}</p>
            </div>
            <form className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-1 ml-1">{t('poa.consultation.name')}</label>
                <Input placeholder={t('poa.consultation.name_placeholder')} className="h-12 bg-[#F6F6F6] border-none rounded-lg px-6 font-medium" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-1 ml-1">{t('poa.consultation.email')}</label>
                <Input placeholder={t('poa.consultation.email_placeholder')} className="h-12 bg-[#F6F6F6] border-none rounded-lg px-6 font-medium" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-1 ml-1">{t('poa.consultation.phone')}</label>
                <Input placeholder={t('poa.consultation.phone_placeholder')} className="h-12 bg-[#F6F6F6] border-none rounded-lg px-6 font-medium" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-1 ml-1">{t('poa.consultation.message')}</label>
                <Textarea placeholder={t('poa.consultation.message_placeholder')} className="min-h-[120px] bg-[#F6F6F6] border-none rounded-lg p-6 font-medium resize-none" />
              </div>
              <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg transition-transform active:scale-[0.98]">
                {t('poa.consultation.submit')}
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Why Choose Zila Legal? Section */}
      <section className="bg-orange-50/20 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 space-y-10 md:space-y-16">
          <div className="text-center space-y-3 md:space-y-4 max-w-3xl mx-auto font-medium">
            <h2 className="text-2xl md:text-4xl font-bold text-neutral-1 tracking-tight">{t('why.title')}</h2>
            <p className="text-neutral-2">{t('why.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              light
              icon={Lock}
              title={t('why.benefits.secure_title')}
              description={t('why.benefits.secure_desc')}
            />
            <FeatureCard
              light
              icon={UserCheck}
              title={t('why.benefits.partners_title')}
              description={t('why.benefits.partners_desc')}
            />
            <FeatureCard
              light
              icon={Globe}
              title={t('why.benefits.remote_title')}
              description={t('why.benefits.remote_desc')}
            />
          </div>
        </div>
      </section>
    </div>
  );
}
