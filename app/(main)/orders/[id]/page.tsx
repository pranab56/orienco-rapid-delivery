'use client';

import React, { useState, Suspense } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft, Phone, MessageSquare, Star,
    CheckCircle2, X
} from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

function OrderDetailContent() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();

    // Check if the order is completed (delivered). If 'status' is 'Delivered' in url.
    const isCompleted = searchParams.get('status') === 'Delivered';
    const orderId = params.id as string || 'ORD-2024-8842';

    const [showReviewModal, setShowReviewModal] = useState(false);
    const [rating, setRating] = useState(0);

    const trackingSteps = [
        { id: 1, title: 'Request Sent', date: '30 May 2025 • 12:15' },
        { id: 2, title: 'Pickup', date: '30 May 2025 • 12:15' },
        { id: 3, title: 'In-transit', date: '30 May 2025 • 12:15' },
        { id: 4, title: 'Delivered', date: '30 May 2025 • 12:15' },
    ];

    // If completed: index is 3 (Delivered), else index is 1 (Pickup)
    const activeStepIndex = isCompleted ? 3 : 1;

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="container mx-auto px-4 max-w-4xl"
        >
            {/* Header */}
            <div className="flex items-center gap-4 mb-6 md:mb-8">
                <Link
                    href="/orders"
                    className="w-9 h-9 md:w-10 md:h-10 rounded-full border border-gray-400/50 flex flex-shrink-0 items-center justify-center hover:bg-gray-200 transition-colors"
                >
                    <ChevronLeft size={18} className="text-gray-800 md:size-20" />
                </Link>
                <h1 className="font-medium text-xl md:text-2xl">#{orderId}</h1>
            </div>

            {/* Map Display Box */}
            <div className="relative w-full h-[300px] md:h-[400px] mb-10 rounded-xl overflow-hidden shadow-lg border border-black/5 bg-[#EAEAEA]">
                {/* Embedded Google Map */}
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d11394.1370211155!2d12.441097232261763!3d43.9317926173003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x132d59bad360d009%3A0x647610111a8775f0!2sSan%20Marino!5e0!3m2!1sen!2sus!4v1712745778213!5m2!1sen!2sus"
                    width="100%"
                    height="100%"
                    className="border-0 opacity-80"
                    allowFullScreen={false}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                ></iframe>

                <div className="absolute inset-0 bg-blue-100/10 pointer-events-none" />

                {/* Fake UI floating elements on map
                <div className="absolute top-[40%] left-[45%] w-[120px] h-20 -rotate-45 bg-blue-500 rounded-xl" style={{ clipPath: 'polygon(0 40%, 100% 40%, 80% 60%, 20% 60%)' }} />
                <div className="absolute top-[48%] left-[40%] flex flex-col items-center">
                    <div className="w-14 h-14 bg-[#F59E0B] rounded-full border-4 border-white shadow-xl flex items-center justify-center text-white z-10">
                        <Navigation size={22} className="rotate-45" />
                    </div>
                </div> */}
                {/* {!isCompleted && (
                    <div className="absolute bottom-[20%] left-[25%] bg-[#1E3A8A] text-white px-6 py-3 rounded-2xl font-bold shadow-xl border-4 border-white/20 text-3xl">
                        3 hr 58 min
                    </div>
                )} */}
                {/* {isCompleted && (
                    <div className="absolute bottom-[20%] left-[25%] bg-[#10B981] text-white px-6 py-3 rounded-2xl font-bold shadow-xl border-4 border-white/20 text-xl">
                        Delivered Successfully
                    </div>
                )} */}
                {/* <div className="absolute top-[55%] left-[50%] flex flex-col items-center">
                    <div className="w-14 h-14 bg-[#2563EB] rounded-full border-4 border-white shadow-xl flex items-center justify-center text-white z-10">
                        <MessageSquare size={22} fill="currentColor" />
                    </div>
                </div> */}
            </div>

            {/* Tracker Box */}
            <h2 className="font-medium text-base mb-4">Track your order</h2>
            <div className="bg-[#F3F3F3] rounded-2xl p-5 md:p-10 pt-8 pb-8 md:pt-12 md:pb-12 mb-8 shadow-sm border border-black/5">
                <div className="relative pl-10 md:pl-12 space-y-10 md:space-y-12">
                    {/* Full line bg */}
                    <div className="absolute left-[13.5px] top-[14px] -bottom-[6px] border-l-2 border-dashed border-gray-300 z-0"></div>
                    {/* Completed active line bg */}
                    <div
                        className="absolute left-[13.5px] top-[14px] border-l-2 border-dashed border-[#10B981] z-0 transition-all duration-1000"
                        style={{ height: `${(activeStepIndex / (trackingSteps.length - 1)) * 100}%` }}
                    ></div>

                    {/* Steps mapped dynamically */}
                    {trackingSteps.map((step, index) => {
                        const isStepCompleted = index <= activeStepIndex;
                        return (
                            <div key={step.id} className={`relative z-10 flex flex-col ${!isStepCompleted ? 'opacity-80' : ''}`}>
                                <div className="absolute -left-10 md:-left-12 flex items-start justify-center pt-0.5">
                                    {isStepCompleted ? (
                                        <CheckCircle2 fill="white" className="text-[#10B981] bg-white rounded-full" size={26} />
                                    ) : (
                                        <CheckCircle2 className="text-gray-400 bg-white rounded-full ml-0.5" strokeWidth={1.5} size={22} />
                                    )}
                                </div>
                                <h3 className="font-medium text-[14px] md:text-[15px] mb-1">{step.title}</h3>
                                <p className="text-gray-400 text-[10px] md:text-xs font-normal">{step.date}</p>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Rider Info Area */}
            <div className="bg-[#E5E5E5] rounded-2xl p-5 md:p-8 shadow-sm border border-black/5">
                <div className="flex justify-between items-start flex-wrap gap-4 mb-6 md:mb-8">
                    <div className="flex-1">
                        <p className="text-[10px] uppercase font-medium text-gray-400 mb-1 tracking-wider">Rider Info</p>
                        <h3 className="text-lg md:text-2xl font-medium">Cameron Williamson</h3>
                    </div>
                    <div className="flex items-center gap-1.5 bg-[#D4D4D4] px-3 md:px-4 py-1.5 md:py-2 rounded-full h-fit flex-shrink-0">
                        <Star fill="#F59E0B" className="text-[#F59E0B]" size={14} />
                        <span className="font-medium text-xs md:text-sm text-[#EB5500]">4.9</span>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                    <button className="flex-1 bg-[#EB5500] hover:bg-[#D44D00] text-white h-12 flex justify-center items-center gap-2 font-medium rounded-xl cursor-pointer transition-all shadow-lg shadow-orange-500/20">
                        <Phone size={18} />
                        Call
                    </button>

                    {/* Dynamic Action Button based on Completion Status */}
                    {!isCompleted ? (
                        <button
                            onClick={() => router.push("/chat")}
                            className="flex-1 bg-transparent h-12 border-2 border-gray-300 hover:border-[#EB5500] text-[#EB5500] flex justify-center items-center gap-2 font-medium rounded-xl cursor-pointer transition-all"
                        >
                            <MessageSquare size={18} />
                            Message
                        </button>
                    ) : (
                        <button
                            onClick={() => setShowReviewModal(true)}
                            className="flex-1 bg-transparent h-12 border-2 border-gray-300 hover:border-[#EB5500] text-[#EB5500] flex justify-center items-center gap-2 font-medium rounded-xl cursor-pointer transition-all"
                        >
                            Give Review
                        </button>
                    )}
                </div>
            </div>

            {/* Review Modal Overlay */}
            <AnimatePresence>
                {showReviewModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            className="bg-[#EFEFEF] w-full max-w-md rounded-[32px] p-6 md:p-10 relative mt-16 md:mt-20"
                        >
                            {/* Close button */}
                            <button
                                onClick={() => setShowReviewModal(false)}
                                className="absolute right-4 top-4 bg-[#EF4444] text-white rounded-full p-1 hover:scale-110 transition-transform"
                            >
                                <X size={18} strokeWidth={3} />
                            </button>

                            {/* Icon Top Bubble */}
                            <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-xl flex items-center justify-center border-3 border-[#EFEFEF]">
                                <Image src="/icons/review.png" alt="Review" width={50} height={50} />
                            </div>

                            {/* Review Modal Form */}
                            <div className="pt-8 flex flex-col items-center text-center">
                                <h3 className="font-medium text-[#EB5500] text-lg mb-4">How was the driver?</h3>

                                {/* Star Selector */}
                                <div className="flex gap-2 mb-8">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => setRating(star)}
                                            className="focus:outline-none hover:scale-110 transition-transform"
                                        >
                                            <Star
                                                size={32}
                                                fill={rating >= star ? '#EAB308' : 'none'}
                                                className={rating >= star ? 'text-[#EAB308]' : 'text-gray-400'}
                                            />
                                        </button>
                                    ))}
                                </div>

                                <div className="w-full text-left flex flex-col">
                                    <label className="text-[12px] font-medium text-gray-600 mb-2">Description</label>
                                    <textarea
                                        rows={4}
                                        className="w-full bg-transparent border border-gray-300 rounded-xl p-3 text-sm focus:border-[#EB5500] outline-none resize-none placeholder:text-gray-400 focus:bg-white transition-colors"
                                        placeholder="Please enter your message"
                                    ></textarea>
                                </div>

                                <button
                                    onClick={() => setShowReviewModal(false)}
                                    className="w-full mt-8 bg-[#EB5500] cursor-pointer hover:bg-[#D44D00] text-white font-medium py-3.5 rounded-xl transition-colors"
                                >
                                    Submit
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

export default function OrderDetail() {
    return (
        <div className="min-h-screen pb-32 pt-32 font-sans text-[#333333]">
            <Suspense fallback={<div className="container mx-auto px-4 max-w-4xl text-center py-20 font-medium">Loading Order Details...</div>}>
                <OrderDetailContent />
            </Suspense>
        </div>
    );
}
