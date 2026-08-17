"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
    CheckCircle2,
    ZoomIn,
    X,
    Sparkles,
    ShieldCheck,
    ChevronRight,
    MousePointerClick,
} from "lucide-react";

interface StepItem {
    step: number;
    badgeTag: string;
    title: string;
    subtitle: string;
    description: string;
    image: string;
    alt: string;
    highlights: string[];
    actionHint: string;
    colorTheme: "red" | "orange" | "crimson";
}

const steps: StepItem[] = [
    {
        step: 1,
        badgeTag: "Red Mark [1] Profile Menu",
        title: "Open Profile & Tap 'Delete Account'",
        subtitle: "Navigate to settings inside your Driver Profile screen",
        description:
            "Launch your app and select the 'Profile' tab from the bottom navigation bar. Scroll down to the bottom of the options menu list to find 'Delete Account'. Look for the red dashed box [1] and callout banner in the screenshot below.",
        image: "/images/step1.png",
        alt: "Profile screen highlighting Delete Account menu option",
        highlights: [
            "Select 'Profile' tab at bottom right",
            "Scroll to the bottom of the menu options",
            "Tap 'Delete Account' marked in red box [1]"
        ],
        actionHint: "Tap on the image to view high-resolution red markup",
        colorTheme: "red"
    },
    {
        step: 2,
        badgeTag: "Orange Mark [2] Form Fields",
        title: "Enter Reason & Account Password",
        subtitle: "Provide mandatory feedback and password authorization",
        description:
            "Once the 'Delete Account!' confirmation popup appears, type your reason for leaving in the Reason input box. Next, type your account password in the Password box to authorize the request. Both fields are framed in orange dashed highlight boxes [2].",
        image: "/images/step2.png",
        alt: "Modal popup highlighting Reason and Password text input fields",
        highlights: [
            "Enter reason why you want to delete client account",
            "Provide your security password for verification",
            "Check orange highlighted input boxes [2]"
        ],
        actionHint: "Tap on the image to view high-resolution orange markup",
        colorTheme: "orange"
    },
    {
        step: 3,
        badgeTag: "Red Mark [3] Confirm Button",
        title: "Click Orange 'Delete Account' Button",
        subtitle: "Final step to permanently erase client account data",
        description:
            "Verify all details and tap the main orange 'Delete Account' button at the bottom of the modal popup. Notice the vibrant red glowing box [3] and pointer callout directly surrounding the button.",
        image: "/images/step3.png",
        alt: "Modal popup highlighting main Delete Account orange button",
        highlights: [
            "Review the permanent account deletion warning",
            "Tap the bright orange 'Delete Account' button",
            "Framed inside red glowing box [3]"
        ],
        actionHint: "Tap on the image to view high-resolution red markup",
        colorTheme: "crimson"
    }
];

export default function Page() {
    const [activeStep, setActiveStep] = useState<number>(1);
    const [zoomedImage, setZoomedImage] = useState<string | null>(null);

    return (
        <section className="min-h-screen bg-[#FAF9F6] text-stone-800 pb-20 selection:bg-orange-100 selection:text-[#FF5500]">
            {/* Top Banner Hero */}
            <div className="relative overflow-hidden bg-gradient-to-b from-orange-50/70 via-white to-[#FAF9F6] border-b border-orange-100/50 pt-10 pb-12 px-4 sm:px-6">
                {/* Subtle decorative background blur shapes */}
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-orange-400/10 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute top-1/2 right-0 w-80 h-80 bg-red-400/10 rounded-full blur-3xl pointer-events-none" />

                <div className="max-w-4xl mx-auto text-center relative z-10">
                    {/* Tag Pill */}
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500/10 via-red-500/10 to-orange-500/10 border border-orange-200 text-[#FF5500] text-xs font-bold px-4 py-1.5 rounded-full mb-4 shadow-xs"
                    >
                        <Sparkles className="w-3.5 h-3.5 text-[#FF5500] animate-pulse" />
                        <span>Red Marked Progress Guide • Client Account Deletion</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-3xl sm:text-5xl font-extrabold text-stone-900 tracking-tight leading-tight mb-4"
                    >
                        How to Delete Your <span className="bg-gradient-to-r from-[#FF5500] to-[#E53E3E] bg-clip-text text-transparent">Driver Client</span> Account
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-stone-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
                    >
                        Follow this clear step-by-step visual guide. Each step features <span className="font-semibold text-red-600">red &amp; orange mark indicators</span> so you can easily locate buttons and options inside the app.
                    </motion.p>

                    {/* Quick Progress Bar */}
                    <div className="mt-8 max-w-md mx-auto bg-white p-4 rounded-2xl border border-orange-100 shadow-sm">
                        <div className="flex items-center justify-between text-xs font-bold text-stone-600 mb-2">
                            <span className="flex items-center gap-1 text-[#FF5500]">
                                <MousePointerClick className="w-3.5 h-3.5" />
                                Step Progress
                            </span>
                            <span>Step {activeStep} of 3</span>
                        </div>
                        <div className="h-2.5 w-full bg-stone-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-[#FF6B00] via-[#FF5500] to-[#E53E3E] transition-all duration-500 rounded-full"
                                style={{ width: `${(activeStep / 3) * 100}%` }}
                            />
                        </div>
                    </div>
                </div>
            </div>


            {/* Step Quick Navigation Tabs */}
            <div className="sticky top-16 z-40">
                <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-center gap-2 sm:gap-4 overflow-x-auto no-scrollbar">
                    {steps.map((s) => {
                        const isActive = activeStep === s.step;
                        return (
                            <button
                                key={s.step}
                                onClick={() => {
                                    setActiveStep(s.step);
                                    const el = document.getElementById(`step-${s.step}`);
                                    if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
                                }}
                                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg cursor-pointer text-xs font-bold transition-all whitespace-nowrap ${isActive
                                    ? "bg-gradient-to-r from-[#FF5500] to-[#E53E3E] text-white shadow-md shadow-orange-500/20 scale-105"
                                    : "bg-stone-100 text-stone-600 hover:bg-orange-50 hover:text-[#FF5500]"
                                    }`}
                            >
                                <span className={`w-5 h-5 rounded-full text-[11px] flex items-center justify-center font-extrabold ${isActive ? "bg-white text-[#FF5500]" : "bg-stone-200 text-stone-700"
                                    }`}>
                                    {s.step}
                                </span>
                                <span>Step {s.step}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Main Container */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 space-y-12">
                {/* Step Cards */}
                {steps.map((item) => (
                    <motion.div
                        key={item.step}
                        id={`step-${item.step}`}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        onViewportEnter={() => setActiveStep(item.step)}
                        className={`bg-white rounded-3xl border transition-all duration-300 overflow-hidden ${activeStep === item.step
                            ? "border-orange-300 ring-4 ring-orange-500/10 shadow-xl"
                            : "border-stone-200/90 shadow-sm hover:border-orange-200"
                            }`}
                    >
                        <div className="flex flex-col lg:flex-row items-stretch">
                            {/* Left Column: Instructions & Details */}
                            <div className="flex-1 p-6 sm:p-10 flex flex-col justify-between">
                                <div>
                                    {/* Badge Pin */}
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-[#FF5500] to-[#E53E3E] text-white text-xs font-black px-3 py-1 rounded-xl shadow-xs">
                                            Step {item.step}
                                        </span>
                                        <span className="text-xs font-semibold text-stone-500 bg-stone-100 px-2.5 py-1 rounded-xl border border-stone-200/60">
                                            {item.badgeTag}
                                        </span>
                                    </div>

                                    <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mb-2 leading-snug">
                                        {item.title}
                                    </h2>
                                    <p className="text-xs font-medium text-orange-600 mb-4 tracking-wide uppercase">
                                        {item.subtitle}
                                    </p>
                                    <p className="text-stone-600 text-sm sm:text-base leading-relaxed mb-6">
                                        {item.description}
                                    </p>

                                    {/* Highlights Bullet Box */}
                                    <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/80 mb-6">
                                        <h4 className="text-xs font-bold text-stone-700 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                                            <CheckCircle2 className="w-4 h-4 text-[#FF5500]" />
                                            Key Steps &amp; Red Markings:
                                        </h4>
                                        <ul className="space-y-2">
                                            {item.highlights.map((point, idx) => (
                                                <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-stone-700">
                                                    <ChevronRight className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                                                    <span>{point}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>

                                {/* Bottom hint */}
                                <div className="flex items-center gap-2 text-xs font-semibold text-stone-400 pt-2 border-t border-stone-100">
                                    <ZoomIn className="w-4 h-4 text-[#FF5500]" />
                                    <span>{item.actionHint}</span>
                                </div>
                            </div>

                            {/* Right Column: Screenshot Image with Red Markings */}
                            <div className="w-full lg:w-[380px] bg-gradient-to-b from-stone-50 to-stone-100 p-6 sm:p-8 flex flex-col items-center justify-center border-t lg:border-t-0 lg:border-l border-stone-200/80 relative">
                                <div
                                    onClick={() => setZoomedImage(item.image)}
                                    className="group relative cursor-pointer rounded-[2rem] overflow-hidden shadow-2xl border-4 border-white ring-1 ring-stone-200/80 transition-transform duration-300 hover:scale-[1.02]"
                                >
                                    <Image
                                        src={item.image}
                                        alt={item.alt}
                                        width={460}
                                        height={1024}
                                        className="w-full max-w-[240px] sm:max-w-[260px] h-auto block object-contain"
                                        priority={item.step === 1}
                                        unoptimized
                                    />

                                    {/* Hover Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                        <div className="bg-white/95 text-stone-900 text-xs font-bold px-3.5 py-2 rounded-full shadow-lg flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                                            <ZoomIn className="w-4 h-4 text-[#FF5500]" />
                                            Click to Enlarge
                                        </div>
                                    </div>
                                </div>

                                <p className="text-[11px] text-stone-400 font-medium text-center mt-3 flex items-center gap-1">
                                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                                    Official App UI Screenshot
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Lightbox / Zoom Modal */}
            <AnimatePresence>
                {zoomedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setZoomedImage(null)}
                        className="fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-md flex items-center justify-center p-4"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative max-w-lg w-full bg-white rounded-3xl overflow-hidden shadow-2xl p-4 flex flex-col items-center"
                        >
                            <button
                                onClick={() => setZoomedImage(null)}
                                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-stone-900/80 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-3">
                                High Resolution Screenshot with Red Markings
                            </p>
                            <div className="rounded-2xl overflow-hidden border border-stone-200">
                                <Image
                                    src={zoomedImage}
                                    alt="Zoomed screenshot"
                                    width={460}
                                    height={1024}
                                    className="w-full max-h-[80vh] h-auto object-contain block"
                                    unoptimized
                                />
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
