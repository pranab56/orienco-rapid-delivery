'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Loader } from 'lucide-react';
import Link from 'next/link';
import { useGetMyPercelQuery } from '@/features/parcel/parcelApi';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

// Custom Scooter Icon component
const Scooter = () => (
    <svg className="w-5 h-5 text-gray-800" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
    </svg>
);

export default function Orders() {
    const { data: response, isLoading } = useGetMyPercelQuery(1); 
    const parcels = response?.data?.parcels || [];
    
    const router = useRouter();
    const user = useSelector((state: any) => state.auth?.user);

    useEffect(() => {
        if (!user) {
            router.push('/login');
        }
    }, [user, router]);

    if (!user) {
        return <div className="min-h-screen flex items-center justify-center pt-24"><Loader className="animate-spin text-[#EB5500]" size={40} /></div>;
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-24">
                <Loader className="animate-spin text-[#EB5500]" size={40} />
            </div>
        );
    }

    if (parcels.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center pt-24">
                <h1 className="text-2xl font-medium mb-4">No Orders Found</h1>
                <p className="text-gray-500 mb-8">You haven&apos;t booked any deliveries yet.</p>
                <Link href="/booking" className="bg-[#EB5500] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#D44D00] transition-colors">
                    Book a Delivery
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-16 pt-24 md:pb-32 md:pt-32 font-sans text-[#333333]">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-center font-medium text-2xl md:text-3xl mb-8 md:mb-10">Orders</h1>

                <div className="space-y-6 md:space-y-8">
                    {parcels.map((parcel: any, idx: number) => (
                        <Link href={`/orders/${parcel._id}?status=${parcel.status}`} key={parcel._id} className="block">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="rounded-2xl p-5 md:p-10 border border-black/5 bg-[#F9F9F9]/50 cursor-pointer hover:shadow-md transition-all relative overflow-hidden"
                            >
                                {/* Top Badges */}
                                <div className="flex md:absolute top-8 right-8 gap-2 md:gap-3 mb-5 md:mb-0">
                                    <div className="bg-[#A7F3D0] text-[#065F46] text-[10px] md:text-xs font-medium px-2.5 py-1.5 rounded-full flex items-center gap-1">
                                        ⏱ {parcel.duration || 'N/A'}
                                    </div>
                                    <div className="bg-[#FED7AA] text-[#C2410C] text-[10px] md:text-xs font-medium px-2.5 py-1.5 rounded-full">
                                        ${parcel.totalDeliveryFee}
                                    </div>
                                </div>

                                {/* ID Information */}
                                <p className="text-[10px] font-medium text-gray-400 uppercase tracking-widest mb-1.5">
                                    Shipment Track • <span className={parcel.status === 'DELIVERED' ? 'text-green-600' : 'text-[#EB5500]'}>{parcel.status}</span>
                                </p>
                                <h2 className="text-lg md:text-2xl font-medium mb-6 md:mb-10">#{parcel._id.slice(-8).toUpperCase()}</h2>

                                {/* Timeline */}
                                <div className="relative pl-9 md:pl-12 space-y-8 md:space-y-12 mb-6 md:mb-10">
                                    {/* Dotted border connecting points */}
                                    <div className="absolute left-[13px] md:left-[13px] top-[14px] -bottom-[5px] border-l-2 border-dashed border-gray-300 z-0"></div>

                                    {/* Pickup */}
                                    <div className="relative z-10 flex flex-col">
                                        <div className="absolute -left-9 md:-left-12 mt-1 flex items-center justify-center w-6 h-6 md:w-7 md:h-7 rounded-full bg-[#D1FAE5]">
                                            <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-[#059669]"></div>
                                        </div>
                                        <h3 className="font-medium text-[13px] md:text-[15px]">Pickup Location</h3>
                                        <p className="text-gray-500 text-[11px] md:text-sm font-medium">{parcel.pickupLocation.address}</p>
                                    </div>

                                    {/* Drop-off */}
                                    <div className="relative z-10 flex flex-col">
                                        <div className="absolute -left-9 md:-left-12 mt-1 flex items-center justify-center w-6 h-6 md:w-7 md:h-7 rounded-full bg-[#FFEDD5]">
                                            <div className="w-2 h-2 md:w-2.5 md:h-2.5 rounded-full bg-[#D97706]"></div>
                                        </div>
                                        <h3 className="font-medium text-[13px] md:text-[15px] mb-1">Drop-off Location</h3>
                                        <p className="text-gray-500 text-[11px] md:text-sm font-medium">{parcel.dropLocation.address}</p>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="border-t border-gray-300/60 my-5 md:my-6"></div>

                                {/* Bottom Info Tags */}
                                <div className="flex flex-wrap gap-x-6 md:gap-x-10 gap-y-4 md:gap-y-6">
                                    <div className="flex items-center gap-3 md:gap-4">
                                        <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-100/80 rounded flex items-center justify-center">
                                            <Scooter />
                                        </div>
                                        <div>
                                            <p className="text-[9px] md:text-[10px] uppercase font-medium text-gray-400">Vehicle</p>
                                            <p className="font-medium text-xs md:text-[14px] capitalize">{parcel.vehicleType}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 md:gap-4">
                                        <div className="w-8 h-8 md:w-10 md:h-10 bg-gray-100/80 rounded flex items-center justify-center">
                                            <MapPin size={16} className="text-gray-600 md:size-[18px]" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] md:text-[10px] uppercase font-medium text-gray-400">Distance</p>
                                            <p className="font-medium text-xs md:text-[14px]">{parcel.distance.toFixed(2)} KM</p>
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
