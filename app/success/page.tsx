'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Home, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function PaymentSuccessPage() {
    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-gray-50/50 px-4 py-20">
            <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, type: 'spring', bounce: 0.4 }}
                className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl shadow-black/5 max-w-lg w-full text-center border border-gray-100"
            >
                <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', bounce: 0.5, duration: 0.6 }}
                    className="w-24 h-24 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner ring-4 ring-green-50/50"
                >
                    <CheckCircle size={48} strokeWidth={2.5} />
                </motion.div>

                <motion.h1 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 tracking-tight"
                >
                    Payment Successful!
                </motion.h1>

                <motion.p 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-gray-500 text-base md:text-lg mb-10 leading-relaxed font-medium"
                >
                    Thank you for your payment. Your transaction has been completed successfully and your parcel delivery is now being processed.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4"
                >
                    <Link href="/" className="w-full sm:w-auto">
                        <button className="w-full sm:w-auto bg-[#EB5500] hover:bg-[#D44D00] text-white font-medium px-8 py-3.5 rounded-xl transition-all shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2 active:scale-95 cursor-pointer">
                            <Home size={18} />
                            Go to Home
                        </button>
                    </Link>
                    <Link href="/history" className="w-full sm:w-auto">
                        <button className="w-full sm:w-auto bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium px-8 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer">
                            View Orders
                            <ArrowRight size={18} />
                        </button>
                    </Link>
                </motion.div>
            </motion.div>
        </div>
    );
}
