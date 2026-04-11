'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SplashScreen() {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Prevent scrolling while loading
        document.body.style.overflow = 'hidden';
        
        // Hide splash screen after 2.5 seconds
        const timer = setTimeout(() => {
            setIsVisible(false);
            document.body.style.overflow = 'unset';
        }, 2200);

        return () => {
            clearTimeout(timer);
            document.body.style.overflow = 'unset';
        };
    }, []);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
                    className="fixed inset-0 z-[99999] bg-[#EBEBEB] flex flex-col items-center justify-center font-sans tracking-wide"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="relative flex flex-col items-center"
                    >
                        {/* Orienco Spinning Icon animation */}
                        <div className="relative w-24 h-24 mb-8 flex items-center justify-center">
                            {/* Outer spinning ring */}
                            <motion.div 
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                className="absolute inset-0 rounded-[28px] border-[5px] border-transparent border-t-[#EB5500] border-l-[#EB5500]/50"
                            />
                            <motion.div 
                                animate={{ rotate: -360 }}
                                transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
                                className="absolute inset-2 rounded-full border-[3px] border-transparent border-b-[#EAB308] border-r-[#EAB308]/50 opacity-60"
                            />
                            {/* Inner pulsing solid circle element */}
                            <motion.div
                                animate={{ scale: [1, 1.15, 1], borderRadius: ["50%", "30%", "50%"] }}
                                transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                                className="w-10 h-10 bg-gradient-to-tr from-[#EB5500] to-[#EAB308] shadow-lg shadow-orange-500/40"
                            />
                        </div>

                        {/* Title Display Animation */}
                        <motion.div className="flex flex-col items-center text-center overflow-hidden">
                            <motion.h1 
                                initial={{ y: 30, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
                                className="text-4xl md:text-5xl font-medium text-gray-900 tracking-tight"
                            >
                                Orienco<span className="text-[#EB5500]">.</span>
                            </motion.h1>
                            
                            <motion.p 
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
                                className="mt-3 text-xs md:text-sm font-medium text-[#EB5500] uppercase tracking-[0.3em]"
                            >
                                Rapid Delivery
                            </motion.p>
                        </motion.div>
                        
                    </motion.div>
                    
                    {/* Bottom minimal loading bar */}
                    <div className="absolute bottom-20 w-48 h-1 bg-gray-300 rounded-full overflow-hidden">
                         <motion.div 
                            initial={{ x: '-100%' }}
                            animate={{ x: '100%' }}
                            transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                            className="w-full h-full bg-[#EB5500] rounded-full"
                         />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
