'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { useGetTermAndConditionQuery } from '@/features/policy/policyApi';

export default function TermsPage() {
  const { data, isLoading } = useGetTermAndConditionQuery(undefined);
  console.log(data);

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
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#EB5500]"></div>
          </div>
        ) : (
          <div 
            className="font-sans tracking-wide space-y-6 [&_p]:text-[15px] [&_p]:md:text-[16px] [&_p]:font-medium [&_p]:leading-relaxed [&_p]:mb-4 [&_h2]:font-medium [&_h2]:text-2xl [&_h2]:md:text-[28px] [&_h2]:mb-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_li]:text-gray-700 [&_li]:text-[15px] [&_li]:font-medium [&_li]:leading-relaxed"
            dangerouslySetInnerHTML={{ __html: data?.data?.content || '' }}
          />
        )}
      </div>
    </div>
  );
}
