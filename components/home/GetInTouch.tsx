'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';

const GetInTouch = () => {
  const router = useRouter();
  const user = useSelector((state: any) => state.auth?.user);

  const handleGetStarted = () => {
    if (!user) {
      router.push('/login');
    } else {
      router.push('/booking');
    }
  };
  return (
    <section className="w-full container mx-auto px-4 py-20 overflow-hidden">
      <div className="relative w-full bg-[#EB5500] rounded-3xl overflow-hidden min-h-[400px] md:min-h-[500px] flex items-center p-6 md:p-24  border border-white/10">

        {/* Decorative Concentric Rings Background */}
        <div className="absolute right-[-10%] top-1/2 -translate-y-1/2 flex items-center justify-center opacity-20 pointer-events-none z-0">
          <div className="w-[400px] h-[400px] border-[50px] border-white/40 rounded-full" />
          <div className="absolute w-[600px] h-[600px] border-[50px] border-white/20 rounded-full" />
          <div className="absolute w-[800px] h-[800px] border-[50px] border-white/10 rounded-full" />
          <div className="absolute w-[1000px] h-[1000px] border-[50px] border-white/5 rounded-full" />
        </div>

        <div className="relative z-10 w-full max-w-2xl space-y-12">
          <div className="space-y-4 md:space-y-6">
            <h2 className="text-white font-medium text-4xl md:text-6xl leading-[1.1]">
              Let&apos;s Get In Touch.
            </h2>
            <p className="text-white/80 font-medium text-xl md:text-2xl leading-relaxed max-w-xl">
              Your laboratory instruments should serve you, not the other way around. We&apos;re happy to help you.
            </p>
          </div>

          <div className="space-y-8 md:space-y-10">
            <button 
              onClick={handleGetStarted}
              className="w-full sm:w-auto bg-white hover:bg-gray-50 text-[#EB5500] font-medium px-12 py-3 rounded-sm text-xl shadow-xl transition-all active:scale-[0.98] cursor-pointer"
            >
              Get Started
            </button>

            {/* App Store Buttons Container */}
            <div className="flex flex-col sm:flex-row gap-4 p-4 sm:p-2 border border-white/20 rounded-xl sm:rounded-sm w-full sm:w-fit backdrop-blur-xl bg-white/5">
              {/* Google Play */}
              <Link href="#" className="w-full sm:w-auto flex items-center justify-center sm:justify-start gap-4 bg-black/90 hover:bg-black transition-all border border-white/5 px-7 py-3 rounded-lg sm:rounded-sm group">
                <div className="relative w-7 h-7">
                  <Image src="https://www.vectorlogo.zone/logos/google_play/google_play-icon.svg" alt="Google Play" fill className="object-contain" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-white/50 text-[9px] font-medium uppercase tracking-[0.2em] leading-none">Get it on</span>
                  <span className="text-white text-base font-medium tracking-tight leading-none mt-1.5">Google Play</span>
                </div>
              </Link>

              {/* App Store */}
              <Link href="#" className="w-full sm:w-auto flex items-center justify-center sm:justify-start gap-4 bg-black/90 hover:bg-black transition-all border border-white/5 px-7 py-3 rounded-lg sm:rounded-sm group">
                <div className="relative w-7 h-7 grayscale invert brightness-0 transition-all group-hover:grayscale-0 ">
                  <Image src="https://www.vectorlogo.zone/logos/apple/apple-icon.svg" alt="App Store" fill className="object-contain" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-white/50 text-[9px] font-medium uppercase tracking-[0.2em] leading-none">Get it on</span>
                  <span className="text-white text-base font-medium tracking-tight leading-none mt-1.5">App Store</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GetInTouch;