'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';

const faqData = [
  {
    id: '01',
    question: 'What is Orienco?',
    answer: 'Orienco is a leading delivery service platform providing fast, safe, and reliable logistics solutions for both individuals and businesses.',
  },
  {
    id: '02',
    question: 'Is Orienco suitable for solo job seekers?',
    answer: 'Absolutely! Orienco offers various opportunities for individuals to join our delivery network and manage their own schedules.',
  },
  {
    id: '03',
    question: 'Can companies and individuals both create accounts?',
    answer: 'Yes, our platform is designed to accommodate both corporate clients with large-scale needs and individuals with single delivery requests.',
  },
  {
    id: '04',
    question: 'Is Orienco free to use?',
    answer: 'Creating an account is free. We only charge for the delivery services based on the distance, package size, and speed of delivery.',
  },
  {
    id: '05',
    question: 'How does Orienco ensure quality matches?',
    answer: 'We use advanced algorithms to match the right delivery partners with the right packages, ensuring efficiency and safety at every step.',
  },
  {
    id: '06',
    question: 'Can I manage everything in one place?',
    answer: 'Absolutely. From package tracking and order history to communications and payments, Orienco keeps everything organized in one central platform.',
  },
];

const FAQ = () => {
  const [openId, setOpenId] = useState<string | null>('06');

  const toggleFAQ = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="bg-[#F5F5F5] py-16 md:py-32">
      <div className="container mx-auto px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-12 gap-10 md:gap-20">

        {/* Left Side: Title */}
        <div className="lg:col-span-5">
          <h2 className="text-[#333333] font-black text-3xl md:text-5xl tracking-tight leading-tight text-center lg:text-left">
            Frequently Asked
            <span className="text-[#EB5500]"> Question</span>
          </h2>
        </div>

        {/* Right Side: Accordion */}
        <div className="lg:col-span-7 space-y-0 border-t border-gray-200">
          {faqData.map((item) => (
            <div key={item.id} className="border-b border-gray-200">
              <button
                onClick={() => toggleFAQ(item.id)}
                className="w-full py-5 md:py-8 flex items-center justify-between text-left group cursor-pointer"
              >
                <div className="flex items-start md:items-center gap-4 md:gap-12">
                  <span className="text-gray-900 font-black text-lg md:text-xl tabular-nums pt-0.5 md:pt-0 shrink-0">{item.id}</span>
                  <span className="text-gray-800 font-bold text-base md:text-xl transition-colors group-hover:text-[#EB5500]">
                    {item.question}
                  </span>
                </div>
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-400 group-hover:border-[#EB5500] group-hover:text-[#EB5500] transition-all shrink-0 ml-4">
                  {openId === item.id ? <Minus size={18} className="md:w-5 md:h-5" /> : <Plus size={18} className="md:w-5 md:h-5" />}
                </div>
              </button>

              <AnimatePresence>
                {openId === item.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <p className="pb-6 pl-9 md:pl-24 pr-4 md:pr-12 text-gray-500 font-bold leading-relaxed max-w-2xl text-xs sm:text-sm md:text-base">
                      {item.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FAQ;
