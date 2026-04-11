'use client';

import React from 'react';
import Image from 'next/image';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';
import 'swiper/css';

const testimonials = [
  {
    id: 1,
    name: 'Nathon Roberts',
    role: 'Doctor',
    avatar: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=200&auto=format&fit=crop',
    rating: 4.5,
    content: '“Orienco made sending parcels incredibly simple. I can quickly set my pickup and drop-off, choose the right vehicle, and track everything in real time. The whole process feels smooth and reliable, and I always stay updated until delivery is complete. It\'s become my go-to solution for fast and hassle-free deliveries.”',
  },
  {
    id: 2,
    name: 'Sarah Chen',
    role: 'Software Engineer',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop',
    rating: 5.0,
    content: '“The speed of delivery is unmatched in this industry. I was skeptical at first, but after 10+ deliveries, they haven’t missed a single deadline. The interface is clean, and the support team is actually helpful. Truly a premium experience for anyone who values their time.”',
  },
  {
    id: 3,
    name: 'Marcus Thorne',
    role: 'E-commerce Owner',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop',
    rating: 4.8,
    content: '“Scaling my business required a logistics partner I could actually trust. Orienco\'s real-time tracking gives my customers peace of mind, and the tiered pricing helps me manage overhead. Their driver network is professional and reliable. Essential for my business growth.”',
  },
];

const floatingUsers = [
  { id: 1, name: 'Aisha', src: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=200&auto=format&fit=crop', size: 100, top: '40%', left: '15%', delay: 0.1 },
  { id: 2, name: 'Lucas', src: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop', size: 50, top: '15%', left: '26%', delay: 0.3 },
  { id: 3, name: 'Elena', src: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop', size: 130, top: '65%', left: '32%', delay: 0.4 },
  { id: 4, name: 'James', src: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=200&auto=format&fit=crop', size: 90, top: '-5%', left: '50%', delay: 0.2 },
  { id: 5, name: 'David', src: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop', size: 45, top: '35%', left: '58%', delay: 0.5 },
  { id: 6, name: 'Kevin', src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=200&auto=format&fit=crop', size: 85, top: '25%', left: '68%', delay: 0.2 },
  { id: 7, name: 'Chloe', src: 'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?q=80&w=200&auto=format&fit=crop', size: 70, top: '55%', left: '80%', delay: 0.6 },
];

const EnvelopeGraphic = ({ className, style }: { className?: string, style?: React.CSSProperties }) => (
  <svg viewBox="0 0 400 300" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={style}>
    <path d="M40 120 L200 20 L360 120" fill="#E8E8E8" stroke="#D5D5D5" strokeWidth="3" strokeLinejoin="round" />
    <path d="M80 120 L80 50 C80 40 90 30 100 30 L300 30 C310 30 320 40 320 50 L320 120" fill="#F8F8F8" stroke="#D5D5D5" strokeWidth="3" />
    <path d="M40 120 L40 270 C40 280 45 290 60 290 L340 290 C355 290 360 280 360 270 L360 120 Z" fill="#F0F0F0" stroke="#D5D5D5" strokeWidth="3" strokeLinejoin="round" />
    <path d="M40 120 L200 230 L360 120" fill="#F4F4F4" stroke="#D5D5D5" strokeWidth="3" strokeLinejoin="round" />
    <path d="M40 290 L200 230 L360 290" fill="none" stroke="#D5D5D5" strokeWidth="3" strokeLinejoin="round" />
  </svg>
);

const ChatBubble = ({ orientation, className, delay = 0 }: { orientation: 'left' | 'right', className?: string, delay?: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.6, type: "spring" }}
      className={cn("absolute hidden md:block z-30", className)}
    >
      <motion.div
        className="flex flex-col bg-[#FDFDFD] rounded-[24px] p-5 w-[220px] shadow-[0_15px_30px_-5px_rgba(0,0,0,0.08)] border border-white"
      >
        <div className="space-y-3 pb-1">
          <div className="h-2 w-14 bg-[#F2C9C2] rounded-full" />
          <div className="h-2 w-full bg-[#EEEEEE] rounded-full" />
          <div className="h-2 w-4/5 bg-[#EEEEEE] rounded-full" />
        </div>
        <svg
          className={cn("absolute -bottom-4 text-[#FDFDFD] w-6 h-6", orientation === 'left' ? 'right-8 scale-x-[-1]' : 'left-8')}
          viewBox="0 0 24 24" fill="currentColor"
          style={{ filter: "drop-shadow(0 6px 6px rgba(0,0,0,0.04))" }}
        >
          <path d="M0 0H24V24C24 24 20 0 0 0Z" />
        </svg>
      </motion.div>
    </motion.div>
  );
};

const ConnectUser = () => {
  return (
    <section className="relative py-20 md:py-24 bg-[#F4F4F4] overflow-hidden">
      {/* Background Grid */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-40 mix-blend-multiply"
          style={{
            backgroundImage: 'linear-gradient(rgba(235, 85, 0, 0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(235, 85, 0, 0.06) 1px, transparent 1px)',
            backgroundSize: '80px 80px'
          }}
        />
        <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-white/60 to-transparent" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Header Section */}
        <div className="text-center space-y-4 mb-12 md:mb-32 relative z-30">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-gray-500 font-medium text-[15px] tracking-wide"
          >
            Success experience
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-[#222222] font-medium text-3xl md:text-6xl tracking-tight leading-tight"
          >
            Insight From <span className="text-[#EB5500]">Connect Users</span>
          </motion.h2>
        </div>

        {/* Floating Users Arc Wrapper - Hidden on Mobile */}
        <div className="relative w-full container mx-auto h-[250px] -mb-16 z-20 pointer-events-none hidden md:block">
          {floatingUsers.map((user) => (
            <motion.div
              key={user.id}
              className="absolute z-10"
              style={{ top: user.top, left: user.left }}
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: user.delay, duration: 0.6, type: 'spring', bounce: 0.4 }}
            >
              <div
                className="relative rounded-full shadow-[0_15px_30px_rgba(0,0,0,0.12)] bg-gradient-to-br from-white to-gray-50 -translate-x-1/2 -translate-y-1/2 p-1 md:p-1.5 pointer-events-auto cursor-pointer group"
                style={{ width: user.size, height: user.size }}
              >
                <div className="relative w-full h-full rounded-full overflow-hidden bg-white">
                  <Image src={user.src} alt={user.name} fill className="object-cover" />
                </div>

                {/* Animated Tooltip on Hover */}
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 scale-95 group-hover:scale-100 origin-bottom z-50 pointer-events-none">
                  <div className="relative bg-[#1A1A1A] text-white text-[11px] font-medium px-3 py-1.5 rounded-lg whitespace-nowrap shadow-xl flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    {user.name}

                    {/* Dark Triangle Tail */}
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#1A1A1A] rotate-45" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Card Section */}
        <div className="relative max-w-[1000px] mx-auto z-30">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="bg-[#EBEBEB] rounded-[32px] md:rounded-[40px] pt-12 pb-16 md:pt-20 md:pb-32 px-4 md:px-16 overflow-hidden relative shadow-[0_20px_50px_-10px_rgba(0,0,0,0.05)] border border-white/60"
          >
            {/* Soft inner glow */}
            <div className="absolute inset-0 bg-gradient-radial from-white/70 to-transparent opacity-80 pointer-events-none" />

            {/* Static Chat Bubbles for Desktop View */}
            <ChatBubble orientation="left" className="top-[15%] left-[5%] lg:left-[10%]" delay={0.3} />
            <ChatBubble orientation="right" className="top-[25%] right-[5%] lg:right-[10%]" delay={0.5} />

            {/* Content Swiper */}
            <Swiper
              modules={[Autoplay]}
              spaceBetween={40}
              speed={800}
              autoplay={{ delay: 6000, disableOnInteraction: false }}
              loop={true}
              className="w-full relative z-40 max-w-2xl mx-auto"
            >
              {testimonials.map((item) => (
                <SwiperSlide key={item.id} className="cursor-grab active:cursor-grabbing pb-4 md:pb-8">
                  <div className="flex flex-col items-center">
                    {/* Main Avatar */}
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, type: "spring" }}
                      className="relative w-20 h-20 md:w-32 md:h-32 rounded-full overflow-hidden border-[5px] border-[#101010] shadow-[0_10px_40px_rgba(0,0,0,0.2)] mb-6 bg-black mx-auto"
                    >
                      <Image src={item.avatar} alt={item.name} fill className="object-cover opacity-90" />
                    </motion.div>

                    {/* User Info */}
                    <div className="text-center w-full">
                      <h4 className="text-[#1A1A1A] font-medium text-lg md:text-2xl mb-1 tracking-tight">{item.name}</h4>
                      <div className="flex items-center justify-center gap-1.5 text-[#6B7280] text-xs md:text-sm font-medium mb-6 md:mb-10">
                        {item.role} <Star size={12} className="text-[#FACC15] fill-[#FACC15] ml-1" /> {item.rating}
                      </div>

                      {/* Review Text */}
                      <p className="text-[#374151] text-sm md:text-base leading-relaxed tracking-wide min-h-[100px] md:min-h-[120px] px-2 md:px-0 opacity-90">
                        {item.content}
                      </p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Envelopes Background Graphic at Bottom - Hidden on small screens */}
            <div className="absolute -bottom-32 left-1/2 -translate-x-1/2 w-[120%] hidden md:flex justify-center items-end pointer-events-none z-10 opacity-80">
              <EnvelopeGraphic className="w-[300px] h-[300px] absolute left-[5%] bottom-16 -rotate-12 opacity-50" />
              <EnvelopeGraphic className="w-[300px] h-[300px] absolute right-[5%] bottom-16 rotate-12 opacity-50" />
              <EnvelopeGraphic className="w-[500px] h-[500px] relative z-10 translate-y-24 opacity-80" />
              {/* Soft Gradient Overlay to blend bottoms into the card */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#EBEBEB] via-[#EBEBEB]/80 to-transparent h-[200px] bottom-0 z-20" />
            </div>

          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ConnectUser;
