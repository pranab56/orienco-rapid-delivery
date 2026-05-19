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

interface InfoCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  dark?: boolean;
  hasButton?: boolean;
}

const InfoCard = ({ icon: Icon, title, description, dark = false, hasButton = false }: InfoCardProps) => {
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
        <h3 className="text-xl font-medium text-neutral-1">{title}</h3>
        <p className="text-sm text-neutral-2 leading-relaxed font-medium">{description}</p>
      </div>
      {hasButton && (
        <Button className="bg-[#2D2E32] hover:bg-[#1E1F22] text-white font-medium h-11 px-8 rounded-lg">
          Learn More
        </Button>
      )}
    </motion.div>
  );
};

const ServiceStep = ({ title, description }: { title: string, description: string }) => (
  <div className="p-6 md:p-8 rounded-xl border border-white/10 hover:border-primary/30 transition-colors space-y-3 md:space-y-4">
    <h3 className="text-base md:text-lg font-medium text-white">{title}</h3>
    <p className="text-xs md:text-sm text-white/50 leading-relaxed font-medium">{description}</p>
  </div>
);

export default function AboutPage() {
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
              className="text-xl md:text-4xl font-medium text-neutral-1 leading-tight tracking-tight uppercase"
              dangerouslySetInnerHTML={{ __html: "Reinventing Global Logistics & <br />Rapid On-Demand Delivery" }}
            />
            <p className="sm:text-lg text-sm text-neutral-2 max-w-xl font-medium leading-relaxed">
              Orienco Rapid Delivery is a premium global tech platform connecting businesses and individuals with instant, secure, and reliable shipping, cargo, and logistics networks.
            </p>
            <Button className="h-10 md:h-12 px-6 md:px-8 bg-primary hover:bg-primary/90 cursor-pointer text-white font-medium rounded-lg shadow-lg shadow-primary/20 transition-all">
              Explore Our Network
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/10"
          >
            <Image
              src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&h=800&fit=crop"
              alt="Orienco logistics fulfillment center"
              width={1200}
              height={800}
              className="object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision Section */}
      <section className="container mx-auto px-4 md:px-6 py-16 md:py-24 space-y-10 md:space-y-16">
        <h2 className="text-2xl md:text-4xl font-medium text-neutral-1 text-center tracking-tight">Our Core Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <InfoCard
            icon={Target}
            title="Our Mission"
            description="To empower local businesses and international operations by delivering excellence through seamless tech-driven logistics, prioritizing speed, absolute safety, and unmatched customer care."
          />
          <InfoCard
            icon={Eye}
            title="Our Vision"
            description="To be the globally trusted standard in rapid courier logistics, bridging physical distance through frictionless, intelligent, and highly secure transport networks."
          />
        </div>
      </section>

      {/* What We Do Section */}
      <section className="bg-[#1E2024] py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 space-y-10 md:space-y-16">
          <h2 className="text-2xl md:text-4xl font-medium text-white text-center tracking-tight">Services We Offer</h2>
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
              title="Parcel & Cargo Delivery"
              description="Ultra-rapid parcel courier services and heavy freight shipping with real-time GPS tracking enabled."
            />
            <ServiceStep
              title="Corporate Logistics"
              description="Tailored supply chain management and priority business logistics handling."
            />
            <ServiceStep
              title="Fleet Dispatching"
              description="An active on-demand network of certified professional riders, drivers, and heavy vehicle fleets."
            />
            <ServiceStep
              title="Legal Courier Services"
              description="Highly secure handling, notarization, and verification of confidential corporate contracts and Power of Attorney agreements."
            />
          </motion.div>
        </div>
      </section>

      {/* How Can We Help You? Section */}
      <section className="container mx-auto px-4 md:px-6 py-16 md:py-24 space-y-10 md:space-y-16">
        <div className="text-center space-y-3 md:space-y-4 max-w-2xl mx-auto">
          <h2 className="text-2xl md:text-4xl font-medium text-neutral-1 tracking-tight">How Can We Help You?</h2>
          <p className="text-neutral-2 font-medium italic">Select an option to scale your logistics operations</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <InfoCard
            icon={Home}
            title="Business Shipping"
            description="Get access to top-tier, on-demand shipping rates with dedicated customer service support."
            hasButton
          />
          <InfoCard
            icon={Key}
            title="Instant Delivery"
            description="Get access to top-tier, on-demand shipping rates with dedicated customer service support."
            hasButton
          />
          <InfoCard
            icon={Tag}
            title="Bulk Fleet Hire"
            description="Get access to top-tier, on-demand shipping rates with dedicated customer service support."
            hasButton
          />
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-orange-50/20 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 space-y-10 md:space-y-16">
          <div className="text-center space-y-3 md:space-y-4 max-w-3xl mx-auto font-medium">
            <h2 className="text-2xl md:text-4xl font-medium text-neutral-1 tracking-tight">Why Choose Orienco?</h2>
            <p className="text-neutral-2">Discover the benefits of utilizing the industry&apos;s leading rapid logistics platform.</p>
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
              <h3 className="text-xl font-medium text-neutral-1">Highly Secure</h3>
              <p className="text-sm text-neutral-2 leading-relaxed font-medium">Your shipments and transactions are protected by next-generation encryption architectures.</p>
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
              <h3 className="text-xl font-medium text-neutral-1">Vetted Professionals</h3>
              <p className="text-sm text-neutral-2 leading-relaxed font-medium">Work only with certified, trusted delivery logistics riders and professional legal dispatchers.</p>
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
              <h3 className="text-xl font-medium text-neutral-1">100% Remote Control</h3>
              <p className="text-sm text-neutral-2 leading-relaxed font-medium">Track your orders, schedule courier pickups, and authorize dispatches entirely online from anywhere.</p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
