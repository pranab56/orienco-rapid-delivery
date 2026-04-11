'use client';

import React from 'react';
import { MapPin, Truck, Wallet, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const steps = [
  {
    icon: <MapPin size={24} />,
    title: 'Set Pickup & Drop-off',
    description: 'Enter the pickup and drop-off locations for your parcel to ensure accurate delivery and a smooth, hassle-free experience every time.',
    highlight: false,
  },
  {
    icon: <Truck size={24} />,
    title: 'Choose Your Vehicle',
    description: "Select the vehicle that best fits your parcel's size and type, guaranteeing safe and timely delivery across the city.",
    highlight: false,
  },
  {
    icon: <Wallet size={24} />,
    title: 'Add Parcel Details & Pay',
    description: 'Enter your parcel’s weight, dimensions, and any special instructions, then complete secure payment to confirm your order quickly and easily.',
    highlight: true,
  },
  {
    icon: <Users size={24} />,
    title: 'Get Matched with a Driver',
    description: 'We instantly connect you with a verified driver, keeping you updated with real-time tracking until your parcel reaches its destination.',
    highlight: false,
  },
];

const HowItWork = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4 space-y-16">
        <h2 className="text-[#333333] font-medium text-4xl md:text-5xl">
          How it Works
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className={`group relative p-8 rounded-2xl flex flex-col gap-10 shadow-sm transition-all duration-500 overflow-hidden cursor-pointer ${step.highlight
                ? 'bg-[#EB5500] text-white shadow-[0_40px_80px_-15px_rgba(235,85,0,0.4)] z-10'
                : 'bg-[#EAE7DF] text-[#333333] hover:bg-[#EB5500] hover:text-white hover:shadow-2xl hover:shadow-[#EB5500]/20 hover:-translate-y-2'
                }`}
            >
              {/* Highlight Card Backdrop Pattern */}
              <div className={`absolute inset-0 pointer-events-none overflow-hidden flex items-center justify-center transition-opacity duration-500 ${step.highlight ? 'opacity-30' : 'opacity-0 group-hover:opacity-30'}`}>
                <div className="w-[300px] h-[300px] border-[2px] border-white/20 rotate-45 transform scale-150" />
                <div className="absolute w-[200px] h-[200px] border-[2px] border-white/40 rotate-45" />
                <div className="absolute w-[100px] h-[100px] border-[2px] border-white/60 rotate-45" />
              </div>

              {/* Icon Container */}
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-500 group-hover:scale-110 
                ${step.highlight 
                  ? 'bg-white text-[#EB5500]' 
                  : 'bg-[#EB5500] text-white group-hover:bg-white group-hover:text-[#EB5500]'
                }`}
              >
                {step.icon}
              </div>

              {/* Text Content */}
              <div className="space-y-5 relative z-10">
                <h3 className={`text-2xl font-medium tracking-tight leading-tight transition-colors duration-500`}>
                  {step.title}
                </h3>
                <p className={`text-base font-medium leading-relaxed transition-colors duration-500 ${step.highlight ? 'text-white/80' : 'text-gray-500 group-hover:text-white/80'}`}>
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWork;
