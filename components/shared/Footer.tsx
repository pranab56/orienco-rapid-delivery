'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Instagram, Linkedin, Twitter } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="relative w-full bg-[#F5F5F5] pt-20 pb-10 h-[1000px] overflow-hidden font-sans">
      {/* Background Large Text "Orienco" */}
      <div className="absolute bottom-[7%]  left-0 w-full select-none pointer-events-none z-0">
        <h1 className="text-[24vw] font-black text-black/[0.10] leading-none text-center tracking-tighter [mask-image:linear-gradient(to_top,transparent_20%,black_70%)]">
          Orienco
        </h1>
      </div>

      <div className="container mx-auto px-6   z-80  relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

          {/* Left Block - The Beige Card */}
          <div className="lg:col-span-12 xl:col-span-4 bg-[#EAE7DF] rounded-sm p-10 md:p-10 flex flex-col justify-between shadow-sm">
            <div className="space-y-16">
              {/* Logo & Brand Name */}
              <div className="flex items-center gap-3">
                <div className="relative w-12 h-12">
                  <Image src="/icons/logo.png" alt="Orienco Logo" fill className="object-contain" />
                </div>
                <span className="text-[#EB5500] font-black text-2xl tracking-tighter">Orienco Rapid-Delivery</span>
              </div>
            </div>


            {/* Social Media Section */}
            <div className='space-y-5'>

              <div className="space-y-1">
                <h2 className="text-[#4A4A4A] font-medium text-xl md:text-2xl leading-[1.1] tracking-tight">
                  Fast, Reliable Delivery at
                </h2>
                <h2 className="text-[#A0A0A0] font-medium text-xl md:text-2xl leading-[1.1] tracking-tight">
                  Your Fingertips
                </h2>
              </div>

              <div className="flex items-center justify-between">
                <p className="text-xl text-[#4A4A4A] select-none" style={{ fontFamily: "'Dancing Script', cursive" }}>Stay in Touch</p>
                <div className="flex gap-4 items-center">
                  {[
                    { icon: <Twitter size={15} fill="currentColor" />, href: '#' },
                    { icon: <Facebook size={15} fill="currentColor" />, href: '#' },
                    { icon: <Linkedin size={15} fill="currentColor" />, href: '#' },
                    { icon: <Instagram size={15} fill="currentColor" />, href: '#' },
                  ].map((social, i) => (
                    <Link
                      key={i}
                      href={social.href}
                      className="w-10 h-10 bg-white rounded-sm flex items-center justify-center  hover:shadow-xl transition-all duration-300 hover:-translate-y-1 active:scale-95 border border-white"
                    >
                      {social.icon}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Block - The White Box with Links */}
          <div className="lg:col-span-12 xl:col-span-8 bg-white/40 backdrop-blur-md rounded-sm p-10 md:p-10 flex flex-col justify-between border border-white/60 shadow-sm relative overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">

              {/* Home Column */}
              <div className="space-y-10">
                <h4 className="text-gray-900 font-medium text-xl tracking-tight">Home</h4>
                <ul className="space-y-5">
                  {['Home', 'History', 'Chat', 'Orders'].map((link) => (
                    <li key={link}>
                      <Link href="#" className="text-gray-600 hover:text-gray-900 font-medium transition-all text-base">{link}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contact Info Column */}
              <div className="space-y-10">
                <h4 className="text-gray-900 font-medium text-xl tracking-tight">Contact Info</h4>
                <ul className="space-y-5 flex flex-col">
                  {['Contact Us', 'Terms & Conditions', 'We are open 24/7'].map((link) => (
                    <li key={link}>
                      <Link href="#" className="text-gray-600 hover:text-gray-900 font-medium transition-all text-base">{link}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Business Offer Column */}
              <div className="space-y-10">
                <h4 className="text-gray-900 font-medium text-xl tracking-tight">Business Offer</h4>
                <div className="space-y-5">
                  <div className="flex flex-col">
                    <Link href="tel:8473883747" className="text-gray-900 font-medium text-lg hover:text-[#EB5500] transition-all tracking-tight">(847) 388-3747</Link>
                  </div>
                  <div className="flex flex-col">
                    <Link href="mailto:example@gmail.com" className="text-gray-900 font-medium text-lg hover:text-[#EB5500] transition-all tracking-tight">example@gmail.com</Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Copyright & Bottom Info */}
            <div className="mt-20 pt-10 border-t border-gray-100/50 flex flex-wrap items-center gap-4">
              <span className="text-gray-400 text-sm font-medium flex items-center gap-2">
                <span className="text-lg">©</span> 2026 Orienco. All rights reserved.
              </span>
            </div>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;
