'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative w-full bg-[#F5F5F5] pt-12 md:pt-20 pb-12 md:pb-20 lg:pb-10 h-auto lg:h-[1000px] overflow-hidden">
      {/* Background Large Text "Orienco" */}
      <div className="absolute bottom-0 lg:bottom-[5%] left-0 w-full select-none pointer-events-none z-0 overflow-hidden">
        <h1 className="text-[25vw] md:text-[20vw] lg:text-[24vw] font-medium text-black/[0.10] leading-none text-center tracking-tighter [mask-image:linear-gradient(to_top,transparent_10%,black_70%)] whitespace-nowrap">
          Orienco
        </h1>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

          {/* Left Block - The Beige Card */}
          <div className="lg:col-span-12 xl:col-span-4 bg-[#EAE7DF] rounded-sm p-8 md:p-10 flex flex-col justify-between shadow-sm border border-white/40">
            <div className="space-y-10 lg:space-y-16 mb-10 xl:mb-0 text-center sm:text-left">
              {/* Logo & Brand Name */}
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <div className="relative w-12 h-12">
                  <Image src="/icons/logo.png" alt="Orienco Logo" fill className="object-contain" />
                </div>
                <span className="text-[#EB5500] font-medium text-2xl md:text-3xl tracking-tighter">Orienco Rapid-Delivery</span>
              </div>
            </div>


            {/* Social Media Section */}
            <div className='space-y-8 xl:space-y-5'>

              <div className="space-y-2 text-center sm:text-left">
                <h2 className="text-[#4A4A4A] font-medium text-2xl md:text-3xl lg:text-2xl leading-[1.1] tracking-tight">
                  Fast, Reliable Delivery at
                </h2>
                <h2 className="text-[#A0A0A0] font-medium text-2xl md:text-3xl lg:text-2xl leading-[1.1] tracking-tight">
                  Your Fingertips
                </h2>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-black/5 pt-8 sm:pt-0 sm:border-none">
                <p className="text-2xl lg:text-xl text-[#4A4A4A] select-none" style={{ fontFamily: "'Dancing Script', cursive" }}>Stay in Touch</p>
                <div className="flex gap-3 sm:gap-4 items-center">
                  {[
                    { icon: <Twitter size={15} fill="currentColor" />, href: '#' },
                    { icon: <Facebook size={15} fill="currentColor" />, href: '#' },
                    { icon: <Linkedin size={15} fill="currentColor" />, href: '#' },
                    { icon: <Instagram size={15} fill="currentColor" />, href: '#' },
                  ].map((social, i) => (
                    <Link
                      key={i}
                      href={social.href}
                      className="w-10 h-10 md:w-11 md:h-11 bg-white rounded-sm flex items-center justify-center hover:shadow-xl transition-all duration-300 hover:-translate-y-1 active:scale-95 border border-white/60"
                    >
                      {social.icon}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Block - The White Box with Links */}
          <div className="lg:col-span-12 xl:col-span-8 bg-white/40 backdrop-blur-md rounded-sm p-8 md:p-10 flex flex-col justify-between border border-white/60 shadow-sm relative overflow-hidden">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 md:gap-8">

              {/* Home Column */}
              <div className="space-y-6 lg:space-y-10 text-center sm:text-left">
                <h4 className="text-gray-900 font-bold text-lg md:text-xl tracking-tight uppercase text-xs opacity-50">Quick Links</h4>
                <ul className="space-y-4 lg:space-y-5">
                  {['Home', 'History', 'Chat', 'Orders'].map((link) => (
                    <li key={link}>
                      <Link href={link === 'Home' ? '/' : `/${link.toLowerCase()}`} className="text-gray-600 hover:text-[#EB5500] font-medium transition-all text-base md:text-lg">{link}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact Info Column */}
              <div className="space-y-6 lg:space-y-10 text-center sm:text-left">
                <h4 className="text-gray-900 font-bold text-lg md:text-xl tracking-tight uppercase text-xs opacity-50">Company</h4>
                <ul className="space-y-4 lg:space-y-5 flex flex-col">
                  {['Contact Us', 'Terms & Conditions', 'We are open 24/7'].map((link) => (
                    <li key={link}>
                      <Link href="#" className="text-gray-600 hover:text-[#EB5500] font-medium transition-all text-base md:text-lg">{link}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Business Offer Column */}
              <div className="space-y-8 lg:space-y-10 text-center sm:text-left sm:col-span-2 md:col-span-1 mt-6 md:mt-0">
                <h4 className="text-gray-900 font-bold text-lg md:text-xl tracking-tight uppercase text-xs opacity-50">Business Offer</h4>
                <div className="space-y-4 lg:space-y-5">
                  <div className="flex flex-col">
                    <Link href="tel:8473883747" className="text-gray-900 font-bold text-xl md:text-2xl hover:text-[#EB5500] transition-all tracking-tighter opacity-80">(847) 388-3747</Link>
                  </div>
                  <div className="flex flex-col">
                    <Link href="mailto:example@gmail.com" className="text-gray-900 font-medium text-lg md:text-xl hover:text-[#EB5500] transition-all tracking-tight opacity-70 underline underline-offset-4">example@gmail.com</Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Copyright & Bottom Info */}
            <div className="mt-12 lg:mt-20 pt-8 border-t border-black/5 flex flex-col sm:flex-row items-center justify-between gap-6 text-center sm:text-left">
              <span className="text-gray-400 text-sm font-medium flex items-center gap-2">
                <span className="text-lg">©</span> 2026 Orienco. All rights reserved.
              </span>
              <div className="flex gap-6">
                <Link href="#" className="text-gray-400 hover:text-gray-600 text-xs font-medium underline underline-offset-2">Privacy Policy</Link>
                <Link href="#" className="text-gray-400 hover:text-gray-600 text-xs font-medium underline underline-offset-2">Cookie Policy</Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
