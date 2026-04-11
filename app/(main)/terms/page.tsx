'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function TermsPage() {
  return (
    <div className="bg-[#EAEAEA] min-h-screen pb-32">
      {/* Hero Section */}
      <div className="w-full">
        <div className="relative w-full h-[400px] md:h-[600px] rounded-b-xl overflow-hidden shrink-0">
          <Image
            src="https://images.unsplash.com/photo-1586880244406-556ebe35f282?q=80&w=1600&auto=format&fit=crop"
            alt="Delivery worker with backpack"
            fill
            className="object-cover"
          />
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />

          <div className="absolute inset-0 p-8 md:p-24 flex flex-col justify-end pb-16 md:pb-24">
            <motion.h1
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-white font-medium text-4xl sm:text-5xl md:text-[4rem] leading-[1.1] tracking-normal max-w-[900px]"
            >
              Understand Our<br className="hidden md:block" /> Terms and Conditions<br className="hidden md:block" /> Completely.
            </motion.h1>
          </div>
        </div>
      </div>

      {/* Terms Content Section */}
      <div className="container mx-auto px-6 lg:px-12 pt-16 max-w-5xl text-[#333333]">
        <div className="space-y-12 font-sans tracking-wide">

          <p className="text-[15px] md:text-[16px] font-medium leading-relaxed mb-4">
            Please read these Terms and Conditions carefully before using our tradesperson platform Tradelock. By accessing or using the Platform, you agree to be bound by these Terms and Conditions.
          </p>

          <div>
            <h2 className="font-medium text-2xl md:text-[28px] mb-4">1. Acceptance of Terms</h2>
            <div className="space-y-4">
              <p className="text-gray-700 text-[15px] font-medium leading-relaxed">
                By creating an account and using the Tradelock, you confirm that you have read, understood, and agreed to these Terms and Conditions.
              </p>
              <p className="text-gray-700 text-[15px] font-medium leading-relaxed">
                If you do not agree with any part of these terms, you must not use the Platform.
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-medium text-2xl md:text-[28px] mb-4">2. User Accounts</h2>
            <div className="space-y-6">
              <p className="text-gray-700 text-[15px] font-medium leading-relaxed">
                To access certain features, you must create an account as a Client, Tradesperson, or Company.
              </p>
              <p className="text-gray-700 text-[15px] font-medium leading-relaxed">
                You agree to provide accurate, complete, and up-to-date information.
              </p>
              <p className="text-gray-700 text-[15px] font-medium leading-relaxed">
                You are responsible for maintaining the confidentiality of your account credentials.
              </p>
              <p className="text-gray-700 text-[15px] font-medium leading-relaxed">
                You are fully responsible for all activities conducted under your account.
              </p>
              <p className="text-gray-700 text-[15px] font-medium leading-relaxed">
                If you suspect unauthorized access or misuse, you must notify us immediately.
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-medium text-2xl md:text-[28px] mb-4">3. Privacy Policy</h2>
            <div className="space-y-6">
              <p className="text-gray-700 text-[15px] font-medium leading-relaxed">
                All job details (scope, pricing, timeline) must be agreed upon before work begins.
              </p>
              <p className="text-gray-700 text-[15px] font-medium leading-relaxed">
                Once a job is set up and approved, it becomes an official agreement between the client and the tradesperson.
              </p>
              <p className="text-gray-700 text-[15px] font-medium leading-relaxed">
                Any changes must be mutually agreed upon through the Platform.
              </p>
            </div>
          </div>

          <div>
            <h2 className="font-medium text-2xl md:text-[28px] mb-4">4. Governing Law</h2>
            <div className="space-y-6">
              <p className="text-gray-700 text-[15px] font-medium leading-relaxed">
                Payments may be held securely in escrow until job completion is confirmed.
              </p>
              <p className="text-gray-700 text-[15px] font-medium leading-relaxed">
                Funds are released only after the client approves the completed work.
              </p>
              <p className="text-gray-700 text-[15px] font-medium leading-relaxed">
                The Platform is not responsible for disputes arising outside the agreed job scope.
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
