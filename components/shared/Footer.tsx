'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Facebook, Instagram } from 'lucide-react';

const TikTokIcon = ({ size = 15, className = "" }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
  </svg>
);

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
                    {
                      name: 'Facebook',
                      icon: <Facebook size={16} fill="currentColor" />,
                      href: 'https://www.facebook.com/share/1KNEPADG9T/',
                    },
                    {
                      name: 'Instagram',
                      icon: <Instagram size={16} />,
                      href: 'https://instagram.com/oriencodelivery?cplk=anExN2NwcHkycTAy',
                    },
                    {
                      name: 'TikTok',
                      icon: <TikTokIcon size={16} />,
                      href: 'https://www.tiktok.com/@oriencorapid.delivery?_r=1&_t=ZN-9AW3x0p4hPC',
                    },
                  ].map((social) => (
                    <a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.name}
                      className="w-10 h-10 md:w-11 md:h-11 bg-white rounded-sm flex items-center justify-center text-gray-800 hover:text-[#EB5500] hover:shadow-xl transition-all duration-300 hover:-translate-y-1 active:scale-95 border border-white/60"
                    >
                      {social.icon}
                    </a>
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
                <h4 className="text-gray-900 font-bold text-lg tracking-tight uppercase opacity-50">Quick Links</h4>
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
                <h4 className="text-gray-900 font-bold text-lg tracking-tight uppercase opacity-50">Company</h4>
                <ul className="space-y-4 lg:space-y-5 flex flex-col">
                  {[{ name: 'Contact Us', href: 'contact' }, { name: 'Terms & Conditions', href: '/terms' }, { name: 'Privacy Policy', href: '/privacy' }].map((link) => (
                    <li key={link.name}>
                      <Link href={link.href} className="text-gray-600 hover:text-[#EB5500] font-medium transition-all text-base md:text-lg">{link.name}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Business Offer Column */}
              <div className="space-y-8 lg:space-y-10 text-center sm:text-left sm:col-span-2 md:col-span-1 mt-6 md:mt-0">
                <h4 className="text-gray-900 font-bold text-lg md:text-lg tracking-tight uppercase text-xs opacity-50">Business Offer</h4>
                <div className="space-y-4 lg:space-y-5">
                  <div className="flex flex-col">
                    <Link href="tel:+237 6 98 77 19 68" className="text-gray-900 font-bold text-lg md:text-xl hover:text-[#EB5500] transition-all tracking-tighter opacity-80">+237 6 98 77 19 68</Link>
                  </div>
                  <div className="flex flex-col">
                    <Link href="mailto:admin@oriencorapiddelivery.com" className="text-gray-900 font-medium text-lg  hover:text-[#EB5500] transition-all tracking-tight opacity-70">admin@oriencorapiddelivery.com</Link>
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
