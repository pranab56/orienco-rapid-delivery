'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Motorbike, Star } from 'lucide-react';
import Link from 'next/link';


export default function History() {
    // Dummy history array
    const historyList = [
        { id: '1432566411', price: '$12.50', time: '25-30 min', rating: 4, distance: '5.8 km' },
        { id: '1432566412', price: '$12.50', time: '25-30 min', rating: 4, distance: '5.8 km' },
        { id: '1432566413', price: '$12.50', time: '25-30 min', rating: 4, distance: '5.8 km' },
    ];

    return (
        <div className="min-h-screen pb-32 pt-32 font-sans text-[#333333]">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-center font-medium text-2xl md:text-3xl mb-10">History</h1>

                <div className="space-y-6">
                    {historyList.map((item, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="rounded-xl p-6 md:p-8 border border-gray-200 relative"
                        >
                            {/* Top row */}
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-[16px] font-medium mb-4">Order ID: #{item.id}</h2>
                                    <div className="flex gap-3">
                                        <div className="bg-[#D1FAE5] text-[#059669] text-sm font-medium px-4 py-1.5 rounded-full">
                                            {item.price}
                                        </div>
                                        <div className="bg-[#E5E5E5] text-gray-600 flex items-center gap-1.5 text-sm font-medium px-4 py-1.5 rounded-full">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {item.time}
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-[#FFEDD5] text-[#EA580C] flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium">
                                    <Star size={14} fill="currentColor" /> {item.rating}
                                </div>
                            </div>

                            {/* Timeline Locations */}
                            <div className="relative pl-3 space-y-6 mb-6 ml-2">
                                {/* Dotted line */}
                                {/* <div className="absolute left-[5px] top-[10px] bottom-[10px] border-l-2 border-dashed border-gray-300"></div> */}
                                
                                <div className="relative z-10 flex flex-col pl-4">
                                    <div className="absolute -left-1 mt-1 w-2.5 h-2.5 rounded-full bg-[#10B981]"></div>
                                    <p className="text-[12px] text-gray-500 font-medium uppercase tracking-wide">Pickup</p>
                                    <p className="text-[14px] font-medium text-gray-800">123 Main St, Downtown</p>
                                </div>

                                <div className="relative z-10 flex flex-col pl-4">
                                    <div className="absolute -left-1 mt-1 w-2.5 h-2.5 rounded-full bg-[#EA580C]"></div>
                                    <p className="text-[12px] text-gray-500 font-medium uppercase tracking-wide">Drop off</p>
                                    <p className="text-[14px] font-medium text-gray-800">456 Oak Ave, Uptown</p>
                                </div>
                            </div>

                            {/* Small badges */}
                            <div className="flex gap-6 mb-6">
                                <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                                    <Motorbike />
                                    Motorcycle
                                </div>
                                <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                                    <MapPin size={16} />
                                    {item.distance}
                                </div>
                            </div>

                            <hr className="border-gray-300 mb-6" />

                            {/* Footer: User + Action */}
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-300 rounded-full flex-shrink-0"></div>
                                    <div>
                                        <h3 className="font-medium text-[15px]">John Smith</h3>
                                        <div className="flex items-center gap-1 text-[#EAB308]">
                                            <Star size={12} fill="currentColor" />
                                            <span className="text-gray-500 text-xs font-medium">4.9</span>
                                        </div>
                                    </div>
                                </div>
                                <Link 
                                    href={`/history/${item.id}`}
                                    className="text-[#EB5500] font-medium text-sm hover:underline"
                                >
                                    View Details
                                </Link>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
}
