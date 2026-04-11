'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';
import Link from 'next/link';

// Custom Scooter Icon component
const Scooter = () => (
    <svg className="w-5 h-5 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
    </svg>
);

export default function Orders() {
    // Dummy array representing the 3 list items with different mock statuses
    const ordersList = [
        { id: 'ORD-2024-8842', status: 'In-transit', time: '14 MIN', price: '$42.00', distance: '4.2 KM' },
        { id: 'ORD-2024-8843', status: 'Delivered', time: '10 MIN', price: '$35.00', distance: '3.1 KM' },
        { id: 'ORD-2024-8844', status: 'In-transit', time: '20 MIN', price: '$50.00', distance: '6.5 KM' },
    ];

    return (
        <div className="min-h-screen pb-32 pt-32 font-sans text-[#333333]">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-center font-medium text-2xl md:text-3xl mb-10">Orders</h1>

                <div className="space-y-8">
                    {ordersList.map((item, idx) => (
                        <Link href={`/orders/${item.id}?status=${item.status}`} key={idx} className="block">
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="rounded-2xl p-5 md:p-10 border border-black/5 bg-[#F9F9F9]/50 cursor-pointer hover:shadow-md transition-all relative overflow-hidden"
                                >
                                {/* Top Badges */}
                                <div className="md:absolute top-8 right-8 flex gap-2 md:gap-3 mb-6 md:mb-0">
                                    <div className="bg-[#A7F3D0] text-[#065F46] text-[10px] md:text-xs font-medium px-3 py-1.5 rounded-full flex items-center gap-1">
                                        ⏱ {item.time}
                                    </div>
                                    <div className="bg-[#FED7AA] text-[#C2410C] text-[10px] md:text-xs font-medium px-3 py-1.5 rounded-full">
                                        {item.price}
                                    </div>
                                </div>

                                {/* ID Information */}
                                <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-1.5">Shipment Track • <span className={item.status === 'Delivered' ? 'text-green-600' : 'text-[#EB5500]'}>{item.status}</span></p>
                                <h2 className="text-xl md:text-2xl font-medium mb-8 md:mb-10">#{item.id}</h2>

                                {/* Timeline */}
                                <div className="relative pl-10 md:pl-12 space-y-10 md:space-y-12 mb-8 md:mb-10">
                                    {/* Dotted border connecting points */}
                                    <div className="absolute left-[13px] top-[14px] -bottom-[5px] border-l-2 border-dashed border-gray-300 z-0"></div>

                                    {/* Location 1 */}
                                    <div className="relative z-10 flex flex-col">
                                        <div className="absolute -left-10 md:-left-12 mt-1 flex items-center justify-center w-7 h-7 rounded-full bg-[#D1FAE5]">
                                            <div className="w-2.5 h-2.5 rounded-full bg-[#059669]"></div>
                                        </div>
                                        <h3 className="font-medium text-[14px] md:text-[15px] ">Central Warehouse A</h3>
                                        <p className="text-gray-500 text-xs md:text-sm font-medium">451 Industrial Way, San Francisco, CA 94107</p>
                                    </div>

                                    {/* Location 2 */}
                                    <div className="relative z-10 flex flex-col">
                                        <div className="absolute -left-10 md:-left-12 mt-1 flex items-center justify-center w-7 h-7 rounded-full bg-[#FFEDD5]">
                                            <div className="w-2.5 h-2.5 rounded-full bg-[#D97706]"></div>
                                        </div>
                                        <h3 className="font-medium text-[14px] md:text-[15px] mb-1">Global Media HQ</h3>
                                        <p className="text-gray-500 text-xs md:text-sm font-medium">1200 Market Street, San Francisco, CA 94103</p>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="border-t border-gray-300/60 my-6"></div>

                                {/* Bottom Info Tags */}
                                <div className="flex flex-wrap gap-x-10 gap-y-6">
                                    <div className="flex items-center gap-3 md:gap-4">
                                        <div className="w-9 h-9 md:w-10 md:h-10 bg-gray-100 rounded flex items-center justify-center">
                                            <Scooter />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-medium text-gray-400">Vehicle</p>
                                            <p className="font-medium text-xs md:text-[14px]">EV-Courier</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 md:gap-4">
                                        <div className="w-9 h-9 md:w-10 md:h-10 bg-gray-100 rounded flex items-center justify-center">
                                            <MapPin size={18} className="text-gray-600" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase font-medium text-gray-400">Distance</p>
                                            <p className="font-medium text-xs md:text-[14px]">{item.distance}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
