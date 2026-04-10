'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft, Zap, Clock, Package, MapPin,
    Navigation, Bike, Truck, Car, User, Phone,
    ChevronDown, CreditCard, CheckCircle2, ShieldCheck, X
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import GetInTouch from '@/components/home/GetInTouch';
import Footer from '@/components/shared/Footer';

const STEPS = [
    {
        id: 1,
        title: 'Customize and Confirm\nYour Delivery\nPreferences.',
        bgImage: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=2070&auto=format&fit=crop',
    },
    {
        id: 2,
        title: 'Customize and Confirm\nYour Delivery\nPreferences.',
        bgImage: 'https://images.unsplash.com/photo-1512428559087-560fa5ceab42?q=80&w=2070&auto=format&fit=crop',
    },
    {
        id: 3,
        title: 'Enter Location Precisely\nfor a Smooth\nDelivery.',
        bgImage: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2000&auto=format&fit=crop',
    },
    {
        id: 4,
        title: 'Choose the Right Vehicle\nfor Your Delivery\nNeeds.',
        bgImage: 'https://images.unsplash.com/photo-1526948128573-703ea3aebc18?q=80&w=2000&auto=format&fit=crop',
    },
    {
        id: 5,
        title: 'Provide Parcel\nInformation\nfor Accurate Delivery.',
        bgImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2000&auto=format&fit=crop',
    },
    {
        id: 6,
        title: 'Review Your Order &\nComplete Payment\nto Confirm Your Delivery.',
        bgImage: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=2000&auto=format&fit=crop', // Credit card usage
    }
];

export default function BookDeliveryPage() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [showModal, setShowModal] = useState<'none' | 'step5' | 'step6'>('none');
    
    // Form state tracking
    const [formData, setFormData] = useState({
        sendingToday: '',
        itemValue: '',
        deliveryType: '',
        pickupLocation: '',
        dropoffLocation: '',
        vehicle: '',
        receiverName: '',
        receiverPhone1: '',
        receiverPhone2: '',
        futureDate: 'Select',
        additionalNote: '',
        cardName: '',
        cardNumber: '',
        cardExpiry: '',
        cardCvv: '',
    });
    const [errors, setErrors] = useState<Record<string, boolean>>({});

    const activeStepData = STEPS.find(s => s.id === currentStep) || STEPS[0];

    const validateStep = (step: number) => {
        const newErrors: Record<string, boolean> = {};
        if (step === 1) {
            if (!formData.sendingToday) newErrors.sendingToday = true;
            if (!formData.itemValue) newErrors.itemValue = true;
        }
        if (step === 2) {
            if (!formData.deliveryType) newErrors.deliveryType = true;
        }
        if (step === 3) {
            if (!formData.pickupLocation) newErrors.pickupLocation = true;
            if (!formData.dropoffLocation) newErrors.dropoffLocation = true;
        }
        if (step === 4) {
            if (!formData.vehicle) newErrors.vehicle = true;
        }
        if (step === 5) {
            if (!formData.receiverName) newErrors.receiverName = true;
            if (!formData.receiverPhone1) newErrors.receiverPhone1 = true;
            if (!formData.receiverPhone2) newErrors.receiverPhone2 = true;
            if (formData.futureDate === 'Select') newErrors.futureDate = true;
        }
        if (step === 6) {
            if (!formData.cardName) newErrors.cardName = true;
            if (!formData.cardNumber) newErrors.cardNumber = true;
            if (!formData.cardExpiry) newErrors.cardExpiry = true;
            if (!formData.cardCvv) newErrors.cardCvv = true;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleContinue = () => {
        if (!validateStep(currentStep)) return;
        nextStep();
    };

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: false }));
        }
    };

    const nextStep = () => {
        if (currentStep === 5) {
            setShowModal('step5');
            return;
        }
        if (currentStep === 6) {
            setShowModal('step6');
            return;
        }

        if (currentStep < 6) setCurrentStep(prev => prev + 1);
        else router.push('/orders/ORD-2024-8842'); // Track order redirect
    };

    const handleModalConfirm = () => {
        if (showModal === 'step5') {
            setShowModal('none');
            setCurrentStep(6);
        } else if (showModal === 'step6') {
            setShowModal('none');
            router.push('/orders/ORD-2024-8843'); // Redirect to success/tracking orders
        }
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(prev => prev - 1);
        else router.push('/'); // Escape to home
    };

    return (
        <div className="relative min-h-screen font-sans text-[#333333]">
            {/* Background Hero Map/Image for Header Area */}
            <div className="absolute top-0 left-0 right-0 w-full h-[450px] md:h-[550px] overflow-hidden -z-10">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={activeStepData.id}
                        initial={{ opacity: 0.5, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0.5 }}
                        transition={{ duration: 0.6 }}
                        className="absolute inset-0"
                    >
                        <Image src={activeStepData.bgImage} alt="bg" fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/40" />
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Page Header Content (sits over the image) */}
            <div className="pt-40 md:pt-48 px-8 md:px-16 container mx-auto h-[250px] md:h-[300px]">
                <AnimatePresence mode="wait">
                    <motion.h1
                        key={activeStepData.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-white text-4xl md:text-5xl lg:text-[54px] font-bold leading-[1.1] max-w-2xl whitespace-pre-wrap tracking-tight"
                    >
                        {activeStepData.title}
                    </motion.h1>
                </AnimatePresence>
            </div>

            {/* Content Container Below Hero */}
            <div className="container mx-auto px-4 max-w-4xl pt-8 mt-80">

                {/* Horizontal Stepper */}
                <div className="flex gap-2 w-full mb-12 px-4 md:px-12 ">
                    {[1, 2, 3, 4, 5, 6].map((step) => (
                        <div
                            key={step}
                            className={`h-[3px] rounded-full flex-1 transition-colors duration-500 max-w-[120px] ${step <= currentStep ? 'bg-[#EB5500]' : 'bg-[#D1CFCD]'}`}
                        />
                    ))}
                </div>

                {/* Form Sections Box */}
                <div className="px-2 md:px-12 pb-20">
                    <div className="flex items-center gap-4 mb-4">
                        <button
                            onClick={prevStep}
                            className="w-8 h-8 rounded-full cursor-pointer bg-[#E0E0E0] hover:bg-[#D4D4D4] flex items-center justify-center transition-colors shadow-sm"
                        >
                            <ChevronLeft size={18} className="text-gray-700 -ml-0.5" />
                        </button>

                        <h2 className="text-[#EB5500] font-bold text-[20px]">
                            {currentStep === 1 && "Package Information"}
                            {currentStep === 2 && "Select Delivery Type"}
                            {currentStep === 3 && "Enter Locations"}
                            {currentStep === 4 && "Choose Vehicle"}
                            {currentStep === 5 && "Parcel Details"}
                            {currentStep === 6 && "Order Summary & Payment"}
                        </h2>
                    </div>

                    <p className="text-[13px] text-gray-500 font-medium mb-8 ml-[48px]">
                        {currentStep === 1 && "Please provide your package information"}
                        {currentStep === 2 && "Choose the service that fits your needs"}
                        {currentStep === 3 && "Where should we pick up and deliver?"}
                        {currentStep === 4 && "Select based on parcel size"}
                        {currentStep === 5 && "Who's receiving this?"}
                        {currentStep === 6 && "Review your order details below and proceed to pay"}
                    </p>

                    <div className="ml-0 md:ml-[48px]">
                        {/* STEP 1: Package Information */}
                        {currentStep === 1 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                <div>
                                    <label className="text-[12px] font-semibold text-gray-400 mb-2 block">What are you sending today?</label>
                                    <input
                                        type="text"
                                        value={formData.sendingToday}
                                        onChange={(e) => handleInputChange('sendingToday', e.target.value)}
                                        placeholder="Documents"
                                        className={`w-full bg-[#E5E0DA]/50 border ${errors.sendingToday ? 'border-red-500 focus:border-red-500' : 'border-transparent focus:border-[#EB5500]'} rounded-lg px-4 py-3.5 text-sm outline-none focus:bg-white transition-colors placeholder:text-gray-400`}
                                    />
                                    {errors.sendingToday && <span className="text-red-500 text-[10px] mt-1 ml-1 block">This field is required</span>}
                                </div>
                                <div>
                                    <label className="text-[12px] font-semibold text-gray-400 mb-2 block">What is the value of your item?</label>
                                    <input
                                        type="number"
                                        value={formData.itemValue}
                                        onChange={(e) => handleInputChange('itemValue', e.target.value)}
                                        placeholder="$100"
                                        className={`w-full bg-[#E5E0DA]/50 border ${errors.itemValue ? 'border-red-500 focus:border-red-500' : 'border-transparent focus:border-[#EB5500]'} rounded-lg px-4 py-3.5 text-sm outline-none focus:bg-white transition-colors placeholder:text-gray-400`}
                                    />
                                    {errors.itemValue && <span className="text-red-500 text-[10px] mt-1 ml-1 block">This field is required</span>}
                                </div>
                                <div className="pt-8">
                                    <button onClick={handleContinue} className="w-full bg-[#EB5500] cursor-pointer text-white py-3.5 rounded-lg font-bold shadow-md hover:bg-[#D44D00] transition-colors">
                                        Continue
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 2: Select Delivery Type */}
                        {currentStep === 2 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                                <div onClick={() => handleInputChange('deliveryType', 'small')} className={`shadow p-4 py-5 rounded-xl flex items-center gap-4 border cursor-pointer transition-all ${formData.deliveryType === 'small' ? 'border-[#EB5500] bg-[#E5E0DA]/70 ring-1 ring-[#EB5500]' : 'border-transparent hover:shadow-lg hover:border-[#EB5500]/50'}`}>
                                    <div className="w-10 h-10 rounded-lg bg-[#FDF0E9] flex items-center justify-center text-[#EB5500] flex-shrink-0">
                                        <Zap size={18} fill="currentColor" className="text-[#EB5500]" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[14px]">Small Parcel</h3>
                                        <p className="text-[11px] text-gray-500 font-medium">Small & Light weight.</p>
                                    </div>
                                </div>
                                <div onClick={() => handleInputChange('deliveryType', 'medium')} className={`shadow p-4 py-5 rounded-xl flex items-center gap-4 border cursor-pointer transition-all ${formData.deliveryType === 'medium' ? 'border-[#EB5500] bg-[#E5E0DA]/70 ring-1 ring-[#EB5500]' : 'border-transparent hover:shadow-lg hover:border-[#EB5500]/50'}`}>
                                    <div className="w-10 h-10 rounded-lg bg-[#FDF0E9] flex items-center justify-center text-[#EB5500] flex-shrink-0">
                                        <Clock size={18} className="text-[#EB5500]" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[14px]">Medium Parcel</h3>
                                        <p className="text-[11px] text-gray-500 font-medium">Everyday items.</p>
                                    </div>
                                </div>
                                <div onClick={() => handleInputChange('deliveryType', 'large')} className={`shadow p-4 py-5 rounded-xl flex items-center gap-4 border cursor-pointer transition-all ${formData.deliveryType === 'large' ? 'border-[#EB5500] bg-[#E5E0DA]/70 ring-1 ring-[#EB5500]' : 'border-transparent hover:shadow-lg hover:border-[#EB5500]/50'}`}>
                                    <div className="w-10 h-10 rounded-lg bg-[#FDF0E9] flex items-center justify-center text-[#EB5500] flex-shrink-0">
                                        <Package size={18} className="text-[#EB5500]" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-[14px]">Large Parcel</h3>
                                        <p className="text-[11px] text-gray-500 font-medium">For bulky items</p>
                                    </div>
                                </div>

                                {errors.deliveryType && <span className="text-red-500 text-[10px] block mt-2 ml-1 text-center font-bold">Please select a delivery type</span>}

                                <div className="pt-4">
                                    <button onClick={handleContinue} className="w-full bg-[#EB5500] cursor-pointer text-white py-3.5 rounded-lg font-bold shadow-md hover:bg-[#D44D00] transition-colors">
                                        Continue
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 3: Enter Locations */}
                        {currentStep === 3 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                <div className=" p-5 rounded-xl border border-gray-200">
                                    <div className="space-y-4 relative">
                                        <div>
                                            <label className="text-[11px] font-bold text-gray-500 mb-1.5 block ml-1">Pickup Location</label>
                                            <div className="relative">
                                                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                <input 
                                                    type="text" 
                                                    value={formData.pickupLocation}
                                                    onChange={(e) => handleInputChange('pickupLocation', e.target.value)}
                                                    placeholder="Enter pickup address" 
                                                    className={`w-full bg-[#EBEBEB] border ${errors.pickupLocation ? 'border-red-500' : 'border-transparent focus:border-[#EB5500]'} rounded-lg py-3 pl-10 pr-4 text-sm outline-none focus:bg-white`} 
                                                />
                                            </div>
                                            {errors.pickupLocation && <span className="text-red-500 text-[10px] mt-1 ml-1 block">This field is required</span>}
                                        </div>
                                        <div>
                                            <label className="text-[11px] font-bold text-gray-500 mb-1.5 block ml-1">Drop-off Location</label>
                                            <div className="relative">
                                                <Navigation size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                <input 
                                                    type="text" 
                                                    value={formData.dropoffLocation}
                                                    onChange={(e) => handleInputChange('dropoffLocation', e.target.value)}
                                                    placeholder="Enter delivery address" 
                                                    className={`w-full bg-[#EBEBEB] border ${errors.dropoffLocation ? 'border-red-500' : 'border-transparent focus:border-[#EB5500]'} rounded-lg py-3 pl-10 pr-4 text-sm outline-none focus:bg-white`} 
                                                />
                                            </div>
                                            {errors.dropoffLocation && <span className="text-red-500 text-[10px] mt-1 ml-1 block">This field is required</span>}
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full h-[180px] rounded-xl overflow-hidden shadow-sm relative">
                                    <Image src="https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop" alt="map" fill className="object-cover" />
                                </div>

                                <button onClick={handleContinue} className="w-full bg-[#EB5500] cursor-pointer text-white py-3.5 rounded-lg font-bold shadow-md hover:bg-[#D44D00] transition-colors mt-2">
                                    Continue
                                </button>
                            </motion.div>
                        )}

                        {/* STEP 4: Choose Vehicle */}
                        {currentStep === 4 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                                {/* Motorcycle */}
                                <div onClick={() => handleInputChange('vehicle', 'motorcycle')} className={`shadow p-4 py-5 rounded-xl flex items-center justify-between border cursor-pointer transition-all ${formData.vehicle === 'motorcycle' ? 'border-[#EB5500] bg-[#E5E0DA]/70 ring-1 ring-[#EB5500]' : 'border-gray-200 hover:shadow-lg hover:border-[#EB5500]/50'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-[#E0E0E0] flex items-center justify-center flex-shrink-0">
                                            <Bike size={20} className="text-gray-700" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-[14px]">Motorcycle</h3>
                                            <p className="text-[11px] text-gray-500 font-medium">Small items</p>
                                            <p className="text-[10px] text-[#EB5500] font-bold mt-0.5">15-20 min</p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-[15px]">$5.99</span>
                                </div>

                                {/* Tricycle */}
                                <div onClick={() => handleInputChange('vehicle', 'tricycle')} className={`shadow p-4 py-5 rounded-xl flex items-center justify-between border cursor-pointer transition-all ${formData.vehicle === 'tricycle' ? 'border-[#EB5500] bg-[#E5E0DA]/70 ring-1 ring-[#EB5500]' : 'border-gray-200 hover:shadow-lg hover:border-[#EB5500]/50'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-[#E0E0E0] flex items-center justify-center flex-shrink-0">
                                            <Car size={20} className="text-gray-700" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-[14px]">Tricycle</h3>
                                            <p className="text-[11px] text-gray-500 font-medium">Medium items</p>
                                            <p className="text-[10px] text-[#EB5500] font-bold mt-0.5">20-30 min</p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-[15px]">$12.99</span>
                                </div>

                                {/* Van */}
                                <div onClick={() => handleInputChange('vehicle', 'van')} className={`shadow p-4 py-5 rounded-xl flex items-center justify-between border cursor-pointer transition-all ${formData.vehicle === 'van' ? 'border-[#EB5500] bg-[#E5E0DA]/70 ring-1 ring-[#EB5500]' : 'border-gray-200 hover:shadow-lg hover:border-[#EB5500]/50'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-[#E0E0E0] flex items-center justify-center flex-shrink-0">
                                            <Truck size={20} className="text-gray-700" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-[14px]">Van</h3>
                                            <p className="text-[11px] text-gray-500 font-medium">Large items</p>
                                            <p className="text-[10px] text-[#EB5500] font-bold mt-0.5">30-45 min</p>
                                        </div>
                                    </div>
                                    <span className="font-bold text-[15px]">$24.99</span>
                                </div>

                                {errors.vehicle && <span className="text-red-500 text-[10px] block mt-2 ml-1 text-center font-bold">Please select a vehicle option</span>}

                                <div className="pt-4">
                                    <button onClick={handleContinue} className="w-full cursor-pointer bg-[#EB5500] text-white py-3.5 rounded-lg font-bold shadow-md hover:bg-[#D44D00] transition-colors">
                                        Continue
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 5: Parcel Details */}
                        {currentStep === 5 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                                <div>
                                    <div className="relative">
                                        <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input 
                                            type="text" 
                                            value={formData.receiverName}
                                            onChange={(e) => handleInputChange('receiverName', e.target.value)}
                                            placeholder="Receiver Name" 
                                            className={`w-full bg-[#E5E0DA]/40 border ${errors.receiverName ? 'border-red-500' : 'border-transparent focus:border-[#EB5500]'} rounded-lg py-3.5 pl-11 pr-4 text-sm outline-none focus:bg-white`} 
                                        />
                                    </div>
                                    {errors.receiverName && <span className="text-red-500 text-[10px] mt-1 ml-1 block">Name is required</span>}
                                </div>
                                
                                <div>
                                    <div className="relative">
                                        <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input 
                                            type="number" 
                                            value={formData.receiverPhone1}
                                            onChange={(e) => handleInputChange('receiverPhone1', e.target.value)}
                                            placeholder="Receiver Phone Number" 
                                            className={`w-full bg-[#E5E0DA]/40 border ${errors.receiverPhone1 ? 'border-red-500' : 'border-transparent focus:border-[#EB5500]'} rounded-lg py-3.5 pl-11 pr-4 text-sm outline-none focus:bg-white`} 
                                        />
                                    </div>
                                    {errors.receiverPhone1 && <span className="text-red-500 text-[10px] mt-1 ml-1 block">Phone number is required</span>}
                                </div>

                                <div>
                                    <div className="relative">
                                        <Package size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input 
                                            type="number" 
                                            value={formData.receiverPhone2}
                                            onChange={(e) => handleInputChange('receiverPhone2', e.target.value)}
                                            placeholder="Receiver Phone Number" 
                                            className={`w-full bg-[#E5E0DA]/40 border ${errors.receiverPhone2 ? 'border-red-500' : 'border-transparent focus:border-[#EB5500]'} rounded-lg py-3.5 pl-11 pr-4 text-sm outline-none focus:bg-white`} 
                                        />
                                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    </div>
                                    {errors.receiverPhone2 && <span className="text-red-500 text-[10px] mt-1 ml-1 block">Phone number is required</span>}
                                </div>

                                <div className="pt-2">
                                    <label className="text-[12px] font-semibold text-gray-400 mb-2 block">Would you like your delivery for a future date or time?</label>
                                    <div className="relative">
                                        <select 
                                            value={formData.futureDate}
                                            onChange={(e) => handleInputChange('futureDate', e.target.value)}
                                            className={`w-full bg-[#E5E0DA]/40 border ${errors.futureDate ? 'border-red-500' : 'border-transparent focus:border-[#EB5500]'} rounded-lg py-3.5 px-4 text-sm outline-none focus:bg-white appearance-none cursor-pointer`}
                                        >
                                            <option value="Select">Select</option>
                                            <option value="Today">Today</option>
                                            <option value="Tomorrow">Tomorrow</option>
                                        </select>
                                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                    </div>
                                    {errors.futureDate && <span className="text-red-500 text-[10px] mt-1 ml-1 block">Please select date</span>}
                                </div>

                                <div className="pt-2">
                                    <textarea
                                        value={formData.additionalNote}
                                        onChange={(e) => handleInputChange('additionalNote', e.target.value)}
                                        rows={4}
                                        placeholder="Additional Note (Optional)...."
                                        className="w-full bg-[#E5E0DA]/40 border border-transparent rounded-lg py-4 px-4 text-sm outline-none focus:bg-white focus:border-[#EB5500] resize-none"
                                    ></textarea>
                                </div>

                                <div className="pt-4">
                                    <button onClick={handleContinue} className="w-full bg-[#EB5500] text-white py-3.5 rounded-lg font-bold shadow-md hover:bg-[#D44D00] transition-colors cursor-pointer">
                                        Continue
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 6: Review Order & Payment */}
                        {currentStep === 6 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col md:flex-row gap-8">
                                {/* Left Side: Order Summary */}
                                <div className="flex-1 space-y-6">
                                    <div className="bg-[#E5E0DA]/30 rounded-xl p-6 border border-gray-200 text-sm">
                                        <div className="flex justify-between items-center mb-4 text-gray-600">
                                            <span>Base Fare</span>
                                            <span className="font-medium text-gray-800">$4.00</span>
                                        </div>
                                        <div className="flex justify-between items-center mb-4 text-gray-600">
                                            <span>Distance (4.2 km)</span>
                                            <span className="font-medium text-gray-800">$1.99</span>
                                        </div>
                                        <div className="flex justify-between items-center mb-4 text-gray-600">
                                            <span>Tax</span>
                                            <span className="font-medium text-gray-800">$0.00</span>
                                        </div>
                                        <div className="pt-4 border-t border-gray-200/50 flex justify-between items-center font-bold text-[15px]">
                                            <span className="text-gray-800">Total</span>
                                            <span className="text-[#EB5500]">$5.99</span>
                                        </div>
                                    </div>
                                    <div className="text-[11px] text-gray-400 font-medium flex items-center justify-center gap-2">
                                        <ShieldCheck size={14} /> Transactions are securely encrypted
                                    </div>
                                </div>

                                {/* Right Side: Payment Form */}
                                <div className="flex-1 space-y-4">
                                    <div>
                                        <div className="relative">
                                            <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input 
                                                type="text" 
                                                value={formData.cardName}
                                                onChange={(e) => handleInputChange('cardName', e.target.value)}
                                                placeholder="Name on Card" 
                                                className={`w-full bg-[#E5E0DA]/40 border ${errors.cardName ? 'border-red-500' : 'border-transparent focus:border-[#EB5500]'} rounded-lg py-3.5 pl-11 pr-4 text-sm outline-none focus:bg-white`} 
                                            />
                                        </div>
                                        {errors.cardName && <span className="text-red-500 text-[10px] mt-1 ml-1 block">Required</span>}
                                    </div>
                                    
                                    <div>
                                        <div className="relative">
                                            <CreditCard size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                            <input 
                                                type="text" 
                                                value={formData.cardNumber}
                                                onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                                                placeholder="Card Number" 
                                                className={`w-full bg-[#E5E0DA]/40 border ${errors.cardNumber ? 'border-red-500' : 'border-transparent focus:border-[#EB5500]'} rounded-lg py-3.5 pl-11 pr-4 text-sm outline-none focus:bg-white`} 
                                            />
                                        </div>
                                        {errors.cardNumber && <span className="text-red-500 text-[10px] mt-1 ml-1 block">Required</span>}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <input 
                                                type="text" 
                                                value={formData.cardExpiry}
                                                onChange={(e) => handleInputChange('cardExpiry', e.target.value)}
                                                placeholder="MM/YY" 
                                                className={`w-full bg-[#E5E0DA]/40 border ${errors.cardExpiry ? 'border-red-500' : 'border-transparent focus:border-[#EB5500]'} rounded-lg py-3.5 px-4 text-sm outline-none focus:bg-white`} 
                                            />
                                            {errors.cardExpiry && <span className="text-red-500 text-[10px] mt-1 ml-1 block">Required</span>}
                                        </div>
                                        <div>
                                            <input 
                                                type="text" 
                                                value={formData.cardCvv}
                                                onChange={(e) => handleInputChange('cardCvv', e.target.value)}
                                                placeholder="CVV" 
                                                className={`w-full bg-[#E5E0DA]/40 border ${errors.cardCvv ? 'border-red-500' : 'border-transparent focus:border-[#EB5500]'} rounded-lg py-3.5 px-4 text-sm outline-none focus:bg-white`} 
                                            />
                                            {errors.cardCvv && <span className="text-red-500 text-[10px] mt-1 ml-1 block">Required</span>}
                                        </div>
                                    </div>

                                    <div className="pt-6">
                                        <button onClick={handleContinue} className="w-full bg-[#EB5500] text-white py-3.5 rounded-lg font-bold shadow-md hover:bg-[#D44D00] transition-colors cursor-pointer">
                                            Place Order
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>

                {/* Modals for Interstitial Success Steps */}
                <AnimatePresence>
                    {showModal !== 'none' && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
                        >
                            <motion.div
                                initial={{ scale: 0.95, y: 20 }}
                                animate={{ scale: 1, y: 0 }}
                                exit={{ scale: 0.95, y: 20 }}
                                className="bg-[#F8F7F4] rounded-2xl p-8 max-w-sm w-full relative shadow-2xl border border-white flex flex-col items-center text-center"
                            >
                                <button
                                    onClick={() => setShowModal('none')}
                                    className="absolute right-4 top-4 hover:scale-110 transition-transform bg-gray-200 text-gray-500 rounded-full p-1 cursor-pointer"
                                >
                                    <X size={18} />
                                </button>

                                <div className="w-20 h-20 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-gray-100 mb-6 mt-2 relative">
                                    <CheckCircle2 size={40} className="text-[#EB5500] z-10" />
                                    <div className="absolute inset-2 bg-orange-100 rounded-xl opacity-50 pointer-events-none" />
                                </div>

                                <h3 className="font-bold text-[18px] text-[#EB5500] mb-2">
                                    {showModal === 'step5' ? 'Saved Successfully!' : 'Payment Successful!'}
                                </h3>
                                <p className="text-[13px] text-gray-500 mb-8 font-medium px-4">
                                    {showModal === 'step5'
                                        ? 'Your parcel details have been processed. Proceed to checkout.'
                                        : 'Connecting you to your driver now...'}
                                </p>

                                <button
                                    onClick={handleModalConfirm}
                                    className="w-full bg-[#EB5500] hover:bg-[#D44D00] text-white font-bold py-3.5 rounded-xl transition-colors cursor-pointer"
                                >
                                    {showModal === 'step5' ? 'Continue to Payment' : 'Track Order'}
                                </button>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            {/* Gobal Shared Footer Components */}
            <GetInTouch />
            <Footer />
        </div>
    );
}
