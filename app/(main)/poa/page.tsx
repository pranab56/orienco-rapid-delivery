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
    <h3 className="text-xl font-medium text-neutral-1">{title}</h3>
    <p className="text-sm text-neutral-2 leading-relaxed">{description}</p>
  </motion.div>
);

const ProcessStep = ({ title, description }: { title: string, description: string }) => (
  <div className="p-6 md:p-8 rounded-xl border border-white/10 hover:border-primary/30 transition-colors space-y-3 md:space-y-4">
    <h3 className="text-base md:text-lg font-medium text-white">{title}</h3>
    <p className="text-xs md:text-sm text-white/50 leading-relaxed font-medium">{description}</p>
  </div>
);

export default function POAPage() {
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
              className="text-3xl md:text-4xl font-medium text-neutral-1 uppercase leading-tight tracking-tight"
              dangerouslySetInnerHTML={{ __html: "Secure Power of Attorney <br />for Remote Deliveries & Operations" }}
            />
            <p className="text-sm md:text-lg  text-neutral-2 max-w-xl font-medium leading-relaxed">
              Easily draft, verify, and register your Power of Attorney documents for seamless courier, business, and logistics operations from anywhere in the world.
            </p>
            <Button
              onClick={() => document.getElementById('consultation-form')?.scrollIntoView({ behavior: 'smooth' })}
              className="h-10 md:h-12 px-6 md:px-8 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg shadow-lg shadow-primary/20 transition-all cursor-pointer text-sm md:text-base"
            >
              Request Assistance
            </Button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative rounded-2xl overflow-hidden shadow-2xl shadow-black/10"
          >
            <Image
              src="https://images.unsplash.com/photo-1505664194779-8beaceb93744?q=80&w=1200&h=800&fit=crop"
              alt="Power of Attorney documents"
              width={1200}
              height={800}
              className="object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Why Use Orienco POA Services? Section */}
      <section className="container mx-auto px-4 md:px-6 py-16 md:py-24 space-y-10 md:space-y-16">
        <div className="text-center space-y-3 md:space-y-4 max-w-3xl mx-auto font-medium">
          <h2 className="text-2xl md:text-4xl font-medium text-neutral-1 tracking-tight">Why Use Orienco POA Services?</h2>
          <p className="text-neutral-2">We make delegating legal authority simple, quick, and completely secure.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            icon={Search}
            title="Instantly Verified"
            description="Our legal partners instantly verify your Power of Attorney to comply with local regulations and delivery guidelines."
          />
          <FeatureCard
            icon={FileText}
            title="Digitally Managed"
            description="Securely manage your authorized agents, representatives, and delivery permissions directly from our user-friendly dashboard."
          />
          <FeatureCard
            icon={ShieldCheck}
            title="Fully Protected"
            description="Rest easy knowing your information is safe with our military-grade encryption and secure document storage servers."
          />
        </div>
      </section>

      {/* 4-Step Process Section */}
      <section className="bg-[#1E2024] py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 space-y-10 md:space-y-16">
          <div className="text-center font-medium">
            <h2 className="text-2xl md:text-4xl text-white tracking-tight">Our 4-Step Simplified Process</h2>
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
              title="1. Initial Draft"
              description="Complete our simplified draft questionnaire online in under 10 minutes."
            />
            <ProcessStep
              title="2. Professional Review"
              description="Our legal experts review your document for strict regulatory compliance."
            />
            <ProcessStep
              title="3. Notarization"
              description="Easily notarize your documents remotely or in person with our vetted notary partners."
            />
            <ProcessStep
              title="4. Ready to Use"
              description="Your Power of Attorney is now fully ready, verified, and active for deliveries and logistics."
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
              alt="Orienco Rapid Delivery POA Consultation"
              fill
              className="object-cover brightness-[0.9]"
            />
          </div>
          <div className="lg:w-1/2 p-10 lg:p-16 space-y-8 bg-white">
            <div className="space-y-4">
              <h2 className="text-3xl font-medium text-neutral-1">Get a Free Consultation</h2>
              <p className="text-neutral-2 font-medium">Speak with our logistics experts to resolve all your delivery questions.</p>
            </div>
            <form className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-1 ml-1">Full Name</label>
                <Input placeholder="Enter your full name" className="h-12 bg-[#F6F6F6] border-none rounded-lg px-6 font-medium" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-1 ml-1">Email Address</label>
                <Input placeholder="Enter your email address" className="h-12 bg-[#F6F6F6] border-none rounded-lg px-6 font-medium" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-1 ml-1">Phone Number</label>
                <Input placeholder="Enter your phone number" className="h-12 bg-[#F6F6F6] border-none rounded-lg px-6 font-medium" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-1 ml-1">Your Message</label>
                <Textarea placeholder="Tell us how we can help you..." className="min-h-[120px] bg-[#F6F6F6] border-none rounded-lg p-6 font-medium resize-none" />
              </div>
              <Button className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-transform active:scale-[0.98]">
                Request Free Call
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Why Choose Zila Legal? Section */}
      <section className="bg-orange-50/20 py-16 md:py-24">
        <div className="container mx-auto px-4 md:px-6 space-y-10 md:space-y-16">
          <div className="text-center space-y-3 md:space-y-4 max-w-3xl mx-auto font-medium">
            <h2 className="text-2xl md:text-4xl font-medium text-neutral-1 tracking-tight">Why Choose Orienco Legal?</h2>
            <p className="text-neutral-2">Discover the benefits of utilizing the industry&apos;s leading rapid delivery logistics platform.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              light
              icon={Lock}
              title="Highly Secure"
              description="Your documents and transactions are guarded by cutting-edge security architectures."
            />
            <FeatureCard
              light
              icon={UserCheck}
              title="Vetted Professionals"
              description="Work only with certified, trusted legal notaries and delivery logistics professionals."
            />
            <FeatureCard
              light
              icon={Globe}
              title="100% Remote"
              description="Draft, approve, and finalize your agreements remotely from anywhere around the globe."
            />
          </div>
        </div>
      </section>
    </div>
  );
}
