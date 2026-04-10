'use client';

import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
  Eye,
  Globe,
  Home,
  Key,
  Lock,
  Tag,
  Target,
  UserCheck
} from 'lucide-react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

interface InfoCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  dark?: boolean;
  hasButton?: boolean;
}

const InfoCard = ({ icon: Icon, title, description, dark = false, hasButton = false }: InfoCardProps) => {
  const { t } = useTranslation('common');
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`p-6 md:p-10 rounded-2xl flex flex-col items-center text-center space-y-4 md:space-y-6 ${dark ? 'bg-white shadow-sm' : 'bg-[#F7F7F7]'}`}
    >
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary">
        <Icon size={32} />
      </div>
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-neutral-1">{title}</h3>
        <p className="text-sm text-neutral-2 leading-relaxed font-medium">{description}</p>
      </div>
      {hasButton && (
        <Button className="bg-[#2D2E32] hover:bg-[#1E1F22] text-white font-bold h-11 px-8 rounded-lg">
          {t('about.help.learn_more')}
        </Button>
      )}
    </motion.div>
  );
};

const ServiceStep = ({ title, description }: { title: string, description: string }) => (
  <div className="p-6 md:p-8 rounded-xl border border-white/10 hover:border-primary/30 transition-colors space-y-3 md:space-y-4">
    <h3 className="text-base md:text-lg font-bold text-white">{title}</h3>
    <p className="text-xs md:text-sm text-white/50 leading-relaxed font-medium">{description}</p>
  </div>
);

export default function AboutPage() {
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
              className="text-xl md:text-4xl font-black text-neutral-1 leading-tight tracking-tight uppercase"
              dangerouslySetInnerHTML={{ __html: t('about.hero_title') }}
            />
            <p className="sm:text-lg text-sm text-neutral-2 max-w-xl font-medium leading-relaxed">
              {t('about.hero_subtitle')}
            </p>
            <Button className="h-10 md:h-12 px-6 md:px-8 bg-primary hover:bg-primary/90 cursor-pointer text-white font-bold rounded-lg shadow-lg shadow-primary/20 transition-all">
              {t('about.explore_btn')}
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/10"
          >
            <Image
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&h=800&fit=crop"
              alt={t('about.hero_img_alt')}
              width={1200}
              height={800}
              className="object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="container mx-auto px-4 md:px-6 py-16 md:py-24 space-y-10 md:space-y-16">
        <h2 className="text-2xl md:text-4xl font-bold text-neutral-1 text-center tracking-tight">{t('about.mission_vision_title')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <InfoCard
            icon={Target}
            title={t('about.mission_title')}
            description={t('about.mission_desc')}
          />
          <InfoCard
            icon={Eye}
            title={t('about.vision_title')}
            description={t('about.vision_desc')}
          />
        </div>
      </section>

      {/* What We Do Section */}
      <section className="bg-[#1E2024] py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 space-y-10 md:space-y-16">
          <h2 className="text-2xl md:text-4xl font-bold text-white text-center tracking-tight">{t('about.what_we_do')}</h2>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={{
              visible: { transition: { staggerChildren: 0.1 } }
            }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            <ServiceStep
              title={t('about.services.properties')}
              description={t('about.services.properties_desc')}
            />
            <ServiceStep
              title={t('about.services.hotels')}
              description={t('about.services.hotels_desc')}
            />
            <ServiceStep
              title={t('about.services.transport')}
              description={t('about.services.transport_desc')}
            />
            <ServiceStep
              title={t('about.services.legal')}
              description={t('about.services.legal_desc')}
            />
          </motion.div>
        </div>
      </section>

      {/* How Can We Help You? Section */}
      <section className="container mx-auto px-4 md:px-6 py-16 md:py-24 space-y-10 md:space-y-16">
        <div className="text-center space-y-3 md:space-y-4 max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold text-neutral-1 tracking-tight">{t('about.help.title')}</h2>
          <p className="text-neutral-2 font-medium italic">{t('about.help.subtitle')}</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <InfoCard
            icon={Home}
            title={t('about.help.buy')}
            description={t('about.help.desc')}
            hasButton
          />
          <InfoCard
            icon={Key}
            title={t('about.help.rent')}
            description={t('about.help.desc')}
            hasButton
          />
          <InfoCard
            icon={Tag}
            title={t('about.help.sell')}
            description={t('about.help.desc')}
            hasButton
          />
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-orange-50/20 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 space-y-10 md:space-y-16">
          <div className="text-center space-y-3 md:space-y-4 max-w-3xl mx-auto font-medium">
            <h2 className="text-2xl md:text-4xl font-bold text-neutral-1 tracking-tight">{t('why.title')}</h2>
            <p className="text-neutral-2">{t('why.subtitle')}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="bg-white p-6 md:p-10 rounded-2xl flex flex-col items-center text-center space-y-4 md:space-y-6 shadow-sm"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Lock size={32} />
              </div>
              <h3 className="text-xl font-bold text-neutral-1">{t('why.benefits.secure_title')}</h3>
              <p className="text-sm text-neutral-2 leading-relaxed font-medium">{t('why.benefits.secure_desc')}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-white p-6 md:p-10 rounded-2xl flex flex-col items-center text-center space-y-4 md:space-y-6 shadow-sm"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <UserCheck size={32} />
              </div>
              <h3 className="text-xl font-bold text-neutral-1">{t('why.benefits.partners_title')}</h3>
              <p className="text-sm text-neutral-2 leading-relaxed font-medium">{t('why.benefits.partners_desc')}</p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-white p-6 md:p-10 rounded-2xl flex flex-col items-center text-center space-y-4 md:space-y-6 shadow-sm"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                <Globe size={32} />
              </div>
              <h3 className="text-xl font-bold text-neutral-1">{t('why.benefits.remote_title')}</h3>
              <p className="text-sm text-neutral-2 leading-relaxed font-medium">{t('why.benefits.remote_desc')}</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
