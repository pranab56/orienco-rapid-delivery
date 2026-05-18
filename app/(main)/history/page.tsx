'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, Loader } from 'lucide-react';
import Link from 'next/link';
import { useGetMyPercelHistoryQuery } from '@/features/parcel/parcelApi';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

const Motorbike = () => (
    <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
    </svg>
);

export default function History() {
    const { data: response, isLoading } = useGetMyPercelHistoryQuery(1);
    const parcels = response?.data?.parcels || [];
    console.log("HISTORY PARCELS DRIVER:", JSON.stringify(parcels[0]?.driver, null, 2));

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
            <div className="min-h-screen flex flex-col items-center justify-center pt-24 text-center px-4">
                <h1 className="text-2xl font-medium mb-4">No History Found</h1>
                <p className="text-gray-500 mb-8">You haven&apos;t completed any deliveries yet.</p>
                <Link href="/booking" className="bg-[#EB5500] text-white px-8 py-3 rounded-lg font-medium hover:bg-[#D44D00] transition-colors">
                    Start a Delivery
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-32 pt-32 font-sans text-[#333333]">
            <div className="container mx-auto px-4 max-w-4xl">
                <h1 className="text-center font-medium text-2xl md:text-3xl mb-10">History</h1>

                <div className="space-y-6">
                    {parcels.map((parcel: any, idx: number) => (
                        <motion.div
                            key={parcel._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="rounded-xl p-6 md:p-8 border border-gray-200 relative bg-[#F9F9F9]/50"
                        >
                            {/* Top row */}
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-[16px] font-medium mb-4">Order ID: #{parcel._id.slice(-8).toUpperCase()}</h2>
                                    <div className="flex gap-3">
                                        <div className="bg-[#D1FAE5] text-[#059669] text-sm font-medium px-4 py-1.5 rounded-full">
                                            ${parcel.totalDeliveryFee}
                                        </div>
                                        <div className="bg-[#E5E5E5] text-gray-600 flex items-center gap-1.5 text-sm font-medium px-4 py-1.5 rounded-full">
                                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                            {parcel.duration || 'N/A'}
                                        </div>
                                    </div>
                                </div>
                                {/* <div className="bg-[#FFEDD5] text-[#EA580C] flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium">
                                    <Star size={14} fill="currentColor" /> {parcel.driver?.driverInfo?.averageRating || parcel.driver?.averageRating || '0.0'}
                                </div> */}
                            </div>

                            {/* Timeline Locations */}
                            <div className="relative pl-3 space-y-6 mb-6 ml-2">
                                <div className="relative z-10 flex flex-col pl-4">
                                    <div className="absolute -left-1 mt-1 w-2.5 h-2.5 rounded-full bg-[#10B981]"></div>
                                    <p className="text-[12px] text-gray-500 font-medium uppercase tracking-wide">Pickup</p>
                                    <p className="text-[14px] font-medium text-gray-800">{parcel.pickupLocation.address}</p>
                                </div>

                                <div className="relative z-10 flex flex-col pl-4">
                                    <div className="absolute -left-1 mt-1 w-2.5 h-2.5 rounded-full bg-[#EA580C]"></div>
                                    <p className="text-[12px] text-gray-500 font-medium uppercase tracking-wide">Drop off</p>
                                    <p className="text-[14px] font-medium text-gray-800">{parcel.dropLocation.address}</p>
                                </div>
                            </div>

                            {/* Small badges */}
                            <div className="flex gap-6 mb-6">
                                <div className="flex items-center gap-2 text-gray-500 text-sm font-medium capitalize">
                                    <Motorbike />
                                    {parcel.vehicleType}
                                </div>
                                <div className="flex items-center gap-2 text-gray-500 text-sm font-medium">
                                    <MapPin size={16} />
                                    {parcel.distance.toFixed(2)} km
                                </div>
                            </div>

                            <hr className="border-gray-300 mb-6" />

                            {/* Footer: User + Action */}
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-4">
                                    <div className="relative w-12 h-12 bg-gray-200 rounded-full flex-shrink-0 overflow-hidden">
                                        {parcel.driver?.image ? (
                                            <Image src={parcel.driver.image} alt={parcel.driver.fullName} fill className="object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-400 font-bold">
                                                {parcel.driver?.fullName?.[0] || '?'}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-[15px]">{parcel.driver?.fullName || 'No Driver Assigned'}</h3>
                                        <div className="flex items-center gap-1 text-[#EAB308]">
                                            <Star size={12} fill="currentColor" />
                                            <span className="text-gray-500 text-xs font-medium">{parcel.driver?.driverInfo?.averageRating || parcel.driver?.averageRating || '0.0'}</span>
                                        </div>
                                    </div>
                                </div>
                                <Link
                                    href={`/history/${parcel._id}`}
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
