'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, Star, Loader } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useSingleParcelHistoryDetailsQuery } from '@/features/parcel/parcelApi';
import moment from 'moment';

export default function HistoryDetails() {
    const params = useParams();
    const historyId = params.id as string;

    const { data: response, isLoading } = useSingleParcelHistoryDetailsQuery(historyId);
    const parcel = response?.data;

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-24">
                <Loader className="animate-spin text-[#EB5500]" size={40} />
            </div>
        );
    }

    if (!parcel) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center pt-24 text-center">
                <h2 className="text-xl font-medium mb-4">History details not found</h2>
                <Link href="/history" className="text-[#EB5500] hover:underline">Back to History</Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen pb-32 pt-24 font-sans text-[#333333]">
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="container mx-auto px-4 max-w-4xl"
            >
                {/* Header Navigation */}
                <div className="flex items-center gap-4 mb-8">
                    <Link
                        href="/history"
                        className="w-10 h-10 rounded-full border border-gray-400/50 flex flex-shrink-0 items-center justify-center hover:bg-gray-300 transition-colors bg-gray-200"
                    >
                        <ChevronLeft size={20} className="text-gray-800 -ml-0.5" />
                    </Link>
                    <h1 className="font-bold text-xl md:text-2xl">History Details</h1>
                </div>

                <div className="space-y-8">
                    {/* Driver Information Section */}
                    <div>
                        <h2 className="font-bold text-sm mb-4">Driver Information</h2>
                        <div className="rounded-xl p-6 md:p-8 border border-gray-200">
                            {parcel.driver ? (
                                <>
                                    <div className="flex justify-between items-start mb-8">
                                        <div>
                                            <h3 className="font-bold text-lg">{parcel.driver.fullName}</h3>
                                            <p className="text-gray-500 text-xs capitalize">{parcel.vehicleType}</p>
                                        </div>
                                        <div className="bg-[#E5E5E5] flex items-center gap-1.5 px-4 py-1.5 rounded-full">
                                            <Star size={14} fill="#EAB308" className="text-[#EAB308]" />
                                            <span className="text-sm font-bold">{parcel.driver.averageRating || '0.0'}</span>
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <p className="text-gray-500 text-sm mb-8">No driver was assigned to this order.</p>
                            )}

                            {/* Timeline Locations */}
                            <div className="relative pl-3 space-y-6 mb-10 ml-2">
                                <div className="relative z-10 flex flex-col pl-4">
                                    <div className="absolute -left-1 mt-1 w-2.5 h-2.5 rounded-full bg-[#10B981]"></div>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Pickup</p>
                                    <p className="text-[13px] font-medium text-gray-800 tracking-wide">{parcel.pickupLocation.address}</p>
                                </div>

                                <div className="relative z-10 flex flex-col pl-4">
                                    <div className="absolute -left-1 mt-1 w-2.5 h-2.5 rounded-full bg-[#EA580C]"></div>
                                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Drop off</p>
                                    <p className="text-[13px] font-medium text-gray-800 tracking-wide">{parcel.dropLocation.address}</p>
                                </div>
                            </div>

                            {/* 2x2 Grid Info */}
                            <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                                <div>
                                    <p className="text-[10px] text-gray-500 font-bold mb-1">Date & Time</p>
                                    <p className="text-[13px] font-medium">{moment(parcel.deliveredAt || parcel.createdAt).format('MMM D, YYYY h:mm A')}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500 font-bold mb-1">Parcel Type</p>
                                    <p className="text-[13px] font-medium capitalize">{parcel.name}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500 font-bold mb-1">Duration</p>
                                    <p className="text-[13px] font-medium">{parcel.duration || 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500 font-bold mb-1">Distance</p>
                                    <p className="text-[13px] font-medium">{parcel.distance.toFixed(2)} km</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <h2 className="font-bold text-lg mt-8">Order ID: #{parcel._id.slice(-8).toUpperCase()}</h2>

                    {/* Sender Info */}
                    <div>
                        <h2 className="font-bold text-sm mb-4">Sender Info</h2>
                        <div className="rounded-xl p-6 md:p-8 border border-gray-200 flex flex-col gap-5 text-[13px]">
                            <div className="flex justify-between gap-4">
                                <span className="text-gray-500 min-w-20">Name</span>
                                <span className="text-right">{parcel.sender.fullName}</span>
                            </div>
                            <div className="flex justify-between gap-4">
                                <span className="text-gray-500 min-w-20">Email</span>
                                <span className="text-right">{parcel.sender.email}</span>
                            </div>
                            <div className="flex justify-between gap-4">
                                <span className="text-gray-500 min-w-20">Contact</span>
                                <span className="text-right">{parcel.sender.phone || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between gap-4">
                                <span className="text-gray-500 min-w-20">Address</span>
                                <span className="text-right text-gray-500 max-w-[250px] leading-relaxed">{parcel.pickupLocation.address}</span>
                            </div>
                            <div className="flex justify-between gap-4">
                                <span className="text-gray-500 min-w-20">Note</span>
                                <span className="text-right text-gray-500 max-w-[250px] leading-relaxed">{parcel.note || 'No notes added.'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Receiver Info */}
                    <div>
                        <h2 className="font-bold text-sm mb-4">Receiver Info</h2>
                        <div className="rounded-xl p-6 md:p-8 border border-gray-200 flex flex-col gap-5 text-[13px]">
                            <div className="flex justify-between gap-4">
                                <span className="text-gray-500 min-w-20">Name</span>
                                <span className="text-right text-gray-600">{parcel.receiverName}</span>
                            </div>
                            <div className="flex justify-between gap-4">
                                <span className="text-gray-500 min-w-20">Contact</span>
                                <span className="text-right text-gray-600">{parcel.receiverPhone}</span>
                            </div>
                            <div className="flex justify-between gap-4">
                                <span className="text-gray-500 min-w-20">Address</span>
                                <span className="text-right text-gray-500 max-w-[250px] leading-relaxed">{parcel.dropLocation.address}</span>
                            </div>
                        </div>
                    </div>

                    {/* Price Breakdown */}
                    <div>
                        <h2 className="font-bold text-sm mb-4">Price Breakdown</h2>
                        <div className="rounded-xl p-6 md:p-8 border border-gray-200 flex flex-col gap-4 text-[13px]">
                            <div className="flex justify-between gap-4">
                                <span className="text-gray-500 font-medium">Base fare</span>
                                <span className="font-medium">${parcel.baseFare}</span>
                            </div>
                            <div className="flex justify-between gap-4 mb-2">
                                <span className="text-gray-500 font-medium">Distance ({parcel.distance.toFixed(2)} km)</span>
                                <span className="font-medium">${(parcel.totalDeliveryFee - parcel.baseFare).toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between gap-4 pt-4 border-t border-gray-300">
                                <span className="font-bold text-gray-800 text-sm">Total</span>
                                <span className="font-bold text-[#EB5500] text-sm">${parcel.totalDeliveryFee}</span>
                            </div>
                        </div>
                    </div>

                    {/* Your Rating (Mock as API doesn't return user rating yet) */}
                    <div>
                        <h2 className="font-bold text-sm mb-4">Your Rating</h2>
                        <div className="rounded-xl p-6 md:p-8 border border-gray-200">
                            <p className="text-sm text-gray-600 mb-4">You rated this delivery 5 out of 5 stars</p>
                            <div className="flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <Star key={star} size={28} fill="#EA580C" className="text-[#EA580C]" />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Delivery Completed Successfully */}
                    <div className="rounded-xl p-6 border border-[#EAC1AB] mt-4 bg-orange-50/30">
                        <h3 className="font-bold text-[14px]">Delivery Completed Successfully</h3>
                        <p className="text-[13px] text-gray-500 mt-2">
                            {parcel.deliveredAt ? `Your package was delivered on ${moment(parcel.deliveredAt).format('MMMM D, YYYY')}.` : 'Your package was delivered successfully.'} 
                            Thank you for choosing our service!
                        </p>
                    </div>

                </div>
            </motion.div>
        </div>
    );
}
