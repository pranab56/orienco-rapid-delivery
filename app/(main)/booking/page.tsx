'use client';

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import {
    ChevronLeft, MapPin,
    Navigation, Bike, Truck, Car, User, Phone,
    ShieldCheck, Loader, CalendarIcon
} from 'lucide-react';
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { updateBooking, resetBooking } from '@/features/parcel/bookingSlice';
import { useCreateParcelMutation, useCalculateDistacePriceQuery } from '@/features/parcel/parcelApi';
import toast from 'react-hot-toast';
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
        title: 'Enter Location Precisely\nfor a Smooth\nDelivery.',
        bgImage: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2000&auto=format&fit=crop',
    },
    {
        id: 3,
        title: 'Choose the Right Vehicle\nfor Your Delivery\nNeeds.',
        bgImage: 'https://images.unsplash.com/photo-1526948128573-703ea3aebc18?q=80&w=2000&auto=format&fit=crop',
    },
    {
        id: 4,
        title: 'Provide Parcel\nInformation\nfor Accurate Delivery.',
        bgImage: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=2000&auto=format&fit=crop',
    },
    {
        id: 5,
        title: 'Review Your Order &\nConfirm to Proceed\nto Payment.',
        bgImage: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=2000&auto=format&fit=crop',
    }
];

export default function BookDeliveryPage() {
    const router = useRouter();
    const dispatch = useDispatch();
    const bookingState = useSelector((state: any) => state.booking);
    const [createParcel, { isLoading }] = useCreateParcelMutation();
    const { data: priceResponse } = useCalculateDistacePriceQuery(
        {
            pickupLat: bookingState.pickupLocation.coordinates[1],
            pickupLng: bookingState.pickupLocation.coordinates[0],
            dropLat: bookingState.dropLocation.coordinates[1],
            dropLng: bookingState.dropLocation.coordinates[0],
        },
        {
            skip: bookingState.pickupLocation.coordinates[0] === 0 || bookingState.dropLocation.coordinates[0] === 0,
        }
    );
    const priceData = priceResponse?.data;

    const [currentStep, setCurrentStep] = useState(1);
    const [errors, setErrors] = useState<Record<string, boolean>>({});
    const [isStepLoading, setIsStepLoading] = useState(false);

    const user = useSelector((state: any) => state.auth?.user);

    useEffect(() => {
        if (!user) {
            router.push('/login');
        }
    }, [user, router]);

    // Refs for Google Autocomplete and Map
    const pickupInputRef = useRef<HTMLInputElement>(null);
    const dropoffInputRef = useRef<HTMLInputElement>(null);
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<google.maps.Map | null>(null);
    const markersRef = useRef<google.maps.Marker[]>([]);
    const directionsRendererRef = useRef<google.maps.DirectionsRenderer | null>(null);

    useEffect(() => {
        if (typeof google === 'undefined') return;

        if (currentStep !== 2) {
            mapRef.current = null;
            directionsRendererRef.current = null;
            return;
        }

        // Initialize Map
        if (mapContainerRef.current && !mapRef.current) {
            mapRef.current = new google.maps.Map(mapContainerRef.current, {
                center: bookingState.pickupLocation.coordinates[0] !== 0
                    ? { lat: bookingState.pickupLocation.coordinates[1], lng: bookingState.pickupLocation.coordinates[0] }
                    : { lat: 23.8103, lng: 90.4125 },
                zoom: 12,
                disableDefaultUI: true,
                zoomControl: true,
            });
            directionsRendererRef.current = new google.maps.DirectionsRenderer({
                map: mapRef.current,
                suppressMarkers: true,
                polylineOptions: {
                    strokeColor: "#EB5500",
                    strokeWeight: 5,
                }
            });
        }

        const options = {
            types: ['address'],
            componentRestrictions: { country: 'BD' },
        };

        const setupAutocomplete = (inputRef: React.RefObject<HTMLInputElement | null>, field: 'pickupLocation' | 'dropLocation') => {
            if (inputRef.current) {
                const autocomplete = new google.maps.places.Autocomplete(inputRef.current, options);
                autocomplete.addListener('place_changed', () => {
                    const place = autocomplete.getPlace();
                    if (place.geometry && place.geometry.location) {
                        dispatch(updateBooking({
                            [field]: {
                                address: place.formatted_address || '',
                                coordinates: [place.geometry.location.lng(), place.geometry.location.lat()],
                            }
                        }));
                    }
                });
            }
        };

        setupAutocomplete(pickupInputRef, 'pickupLocation');
        setupAutocomplete(dropoffInputRef, 'dropLocation');
    }, [currentStep, dispatch, bookingState.pickupLocation.coordinates, bookingState.dropLocation.coordinates]);

    // Update markers and route when coordinates change
    useEffect(() => {
        if (!mapRef.current || typeof google === 'undefined') return;

        // Clear existing markers
        markersRef.current.forEach(m => m.setMap(null));
        markersRef.current = [];

        const points: { lat: number; lng: number }[] = [];
        if (bookingState.pickupLocation.coordinates[0] !== 0) {
            const pos = { lat: bookingState.pickupLocation.coordinates[1], lng: bookingState.pickupLocation.coordinates[0] };
            const marker = new google.maps.Marker({
                position: pos,
                map: mapRef.current,
                icon: {
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 8,
                    fillColor: "#EB5500",
                    fillOpacity: 1,
                    strokeWeight: 2,
                    strokeColor: "#FFFFFF",
                },
                title: "Pickup"
            });
            markersRef.current.push(marker);
            points.push(pos);
        }

        if (bookingState.dropLocation.coordinates[0] !== 0) {
            const pos = { lat: bookingState.dropLocation.coordinates[1], lng: bookingState.dropLocation.coordinates[0] };
            const marker = new google.maps.Marker({
                position: pos,
                map: mapRef.current,
                icon: {
                    path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                    scale: 6,
                    fillColor: "#333333",
                    fillOpacity: 1,
                    strokeWeight: 2,
                    strokeColor: "#FFFFFF",
                },
                title: "Drop-off"
            });
            markersRef.current.push(marker);
            points.push(pos);
        }

        if (points.length === 2) {
            const directionsService = new google.maps.DirectionsService();
            directionsService.route({
                origin: points[0],
                destination: points[1],
                travelMode: google.maps.TravelMode.DRIVING,
            }, (result, status) => {
                if (status === google.maps.DirectionsStatus.OK && directionsRendererRef.current && result) {
                    directionsRendererRef.current.setDirections(result);

                    // Adjust map to show both markers
                    const bounds = new google.maps.LatLngBounds();
                    points.forEach(p => bounds.extend(p));
                    mapRef.current?.fitBounds(bounds, { top: 50, bottom: 50, left: 50, right: 50 });
                }
            });
        } else if (points.length === 1) {
            mapRef.current.setCenter(points[0]);
            mapRef.current.setZoom(15);
            if (directionsRendererRef.current) directionsRendererRef.current.setDirections({ routes: [] } as any);
            dispatch(updateBooking({ distance: '', duration: '' }));
        }
    }, [currentStep, bookingState.pickupLocation.coordinates, bookingState.dropLocation.coordinates]);

    const activeStepData = STEPS.find(s => s.id === currentStep) || STEPS[0];

    const validateStep = (step: number) => {
        const newErrors: Record<string, boolean> = {};
        if (step === 1) {
            if (!bookingState.name) newErrors.name = true;
            if (!bookingState.itemValue) newErrors.itemValue = true;
        }
        if (step === 2) {
            if (!bookingState.pickupLocation.address) newErrors.pickupLocation = true;
            if (!bookingState.dropLocation.address) newErrors.dropLocation = true;
        }
        if (step === 3) {
            if (!bookingState.vehicleType) newErrors.vehicleType = true;
        }
        if (step === 4) {
            if (!bookingState.receiverName) newErrors.receiverName = true;
            if (!bookingState.receiverPhone) newErrors.receiverPhone = true;
            if (!bookingState.deliveryDate) newErrors.deliveryDate = true;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleContinue = () => {
        if (!validateStep(currentStep)) return;
        setIsStepLoading(true);
        setTimeout(() => {
            if (currentStep < 5) setCurrentStep(prev => prev + 1);
            setIsStepLoading(false);
        }, 1000);
    };

    const handleInputChange = (field: string, value: any) => {
        dispatch(updateBooking({ [field]: value }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: false }));
        }
    };

    const handleSubmit = async () => {
        try {
            const payload = {
                ...bookingState,
                totalDeliveryFee: priceData?.vehicles?.[bookingState.vehicleType]?.totalPrice || 0,
                distance: priceData?.distanceKm || 0,
                duration: priceData?.duration || '',
            };
            const response = await createParcel(payload).unwrap();
            if (response.success && response.data.paymentLink) {
                toast.success("Parcel created successfully! Redirecting to payment...");
                dispatch(resetBooking());
                window.location.href = response.data.paymentLink;
            }
        } catch (error: any) {
            toast.error(error?.data?.message || "Failed to create parcel. Please try again.");
        }
    };

    const prevStep = () => {
        if (currentStep > 1) setCurrentStep(prev => prev - 1);
        else router.push('/');
    };

    if (!user) {
        return <div className="min-h-screen flex items-center justify-center"><Loader className="animate-spin text-[#EB5500]" size={40} /></div>;
    }

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

            {/* Page Header Content */}
            <div className="pt-40 md:pt-48 px-8 md:px-16 container mx-auto h-[250px] md:h-[300px]">
                <AnimatePresence mode="wait">
                    <motion.h1
                        key={activeStepData.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-white text-4xl md:text-5xl lg:text-[54px] font-medium leading-[1.1] max-w-2xl whitespace-pre-wrap tracking-tight"
                    >
                        {activeStepData.title}
                    </motion.h1>
                </AnimatePresence>
            </div>

            {/* Content Container Below Hero */}
            <div className="container mx-auto px-4 max-w-4xl pt-8 mt-80">

                {/* Horizontal Stepper */}
                <div className="flex gap-2 w-full mb-12 px-4 md:px-12 ">
                    {[1, 2, 3, 4, 5].map((step) => (
                        <div
                            key={step}
                            className={`h-[3px] rounded-full flex-1 transition-colors duration-500 max-w-[150px] ${step <= currentStep ? 'bg-[#EB5500]' : 'bg-[#D1CFCD]'}`}
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

                        <h2 className="text-[#EB5500] font-medium text-[20px]">
                            {currentStep === 1 && "Package Information"}
                            {currentStep === 2 && "Enter Locations"}
                            {currentStep === 3 && "Choose Vehicle"}
                            {currentStep === 4 && "Parcel Details"}
                            {currentStep === 5 && "Review & Confirm"}
                        </h2>
                    </div>

                    <p className="text-[13px] text-gray-500 font-medium mb-8 ml-[48px]">
                        {currentStep === 1 && "Please provide your package information"}
                        {currentStep === 2 && "Where should we pick up and deliver?"}
                        {currentStep === 3 && "Select based on parcel size"}
                        {currentStep === 4 && "Who's receiving this?"}
                        {currentStep === 5 && "Review your order details and proceed to payment"}
                    </p>

                    <div className="ml-0 md:ml-[48px]">
                        {/* STEP 1: Package Information */}
                        {currentStep === 1 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                <div>
                                    <label className="text-[12px] font-semibold text-gray-400 mb-2 block">What are you sending today?</label>
                                    <input
                                        type="text"
                                        value={bookingState.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        placeholder="Documents / Gadget"
                                        className={`w-full bg-[#E5E0DA]/50 border ${errors.name ? 'border-red-500 focus:border-red-500' : 'border-transparent focus:border-[#EB5500]'} rounded-lg px-4 py-3.5 text-sm outline-none focus:bg-white transition-colors placeholder:text-gray-400`}
                                    />
                                    {errors.name && <span className="text-red-500 text-[10px] mt-1 ml-1 block">This field is required</span>}
                                </div>
                                <div>
                                    <label className="text-[12px] font-semibold text-gray-400 mb-2 block">What is the value of your item?</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">$</span>
                                        <input
                                            type="number"
                                            value={bookingState.itemValue === 0 ? '' : bookingState.itemValue}
                                            onChange={(e) => handleInputChange('itemValue', Number(e.target.value))}
                                            placeholder="1200"
                                            className={`w-full bg-[#E5E0DA]/50 border ${errors.itemValue ? 'border-red-500 focus:border-red-500' : 'border-transparent focus:border-[#EB5500]'} rounded-lg pl-8 pr-4 py-3.5 text-sm outline-none focus:bg-white transition-colors placeholder:text-gray-400`}
                                        />
                                    </div>
                                    {errors.itemValue && <span className="text-red-500 text-[10px] mt-1 ml-1 block">This field is required</span>}
                                </div>
                                <div className="pt-8">
                                    <button
                                        onClick={handleContinue}
                                        disabled={isStepLoading}
                                        className="w-full bg-[#EB5500] cursor-pointer text-white py-3.5 rounded-lg font-medium shadow-md hover:bg-[#D44D00] transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isStepLoading && <Loader size={18} className="animate-spin" />}
                                        Continue
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 2: Enter Locations */}
                        {currentStep === 2 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                <div className=" p-5 rounded-xl border border-gray-200">
                                    <div className="space-y-4 relative">
                                        <div>
                                            <label className="text-[11px] font-medium text-gray-500 mb-1.5 block ml-1">Pickup Location</label>
                                            <div className="relative">
                                                <MapPin size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                <input
                                                    ref={pickupInputRef}
                                                    type="text"
                                                    defaultValue={bookingState.pickupLocation.address}
                                                    placeholder="Enter pickup address"
                                                    className={`w-full bg-[#EBEBEB] border ${errors.pickupLocation ? 'border-red-500' : 'border-transparent focus:border-[#EB5500]'} rounded-lg py-3 pl-10 pr-4 text-sm outline-none focus:bg-white`}
                                                />
                                            </div>
                                            {errors.pickupLocation && <span className="text-red-500 text-[10px] mt-1 ml-1 block">This field is required</span>}
                                        </div>
                                        <div>
                                            <label className="text-[11px] font-medium text-gray-500 mb-1.5 block ml-1">Drop-off Location</label>
                                            <div className="relative">
                                                <Navigation size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                                <input
                                                    ref={dropoffInputRef}
                                                    type="text"
                                                    defaultValue={bookingState.dropLocation.address}
                                                    placeholder="Enter delivery address"
                                                    className={`w-full bg-[#EBEBEB] border ${errors.dropLocation ? 'border-red-500' : 'border-transparent focus:border-[#EB5500]'} rounded-lg py-3 pl-10 pr-4 text-sm outline-none focus:bg-white`}
                                                />
                                            </div>
                                            {errors.dropLocation && <span className="text-red-500 text-[10px] mt-1 ml-1 block">This field is required</span>}
                                        </div>
                                    </div>
                                </div>

                                <div className="w-full h-[250px] rounded-xl overflow-hidden shadow-sm relative border border-gray-100 bg-gray-50">
                                    <div ref={mapContainerRef} className="w-full h-full" />
                                    {priceData && (
                                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-[#EB5500]/20 z-10 animate-in fade-in slide-in-from-top-2">
                                            <div className="flex flex-col gap-0.5">
                                                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider">Distance</p>
                                                <p className="text-[#EB5500] font-bold text-sm">{priceData.distanceKm} km</p>
                                                <p className="text-[10px] text-gray-500 font-medium">{priceData.duration}</p>
                                            </div>
                                        </div>
                                    )}
                                    {(!bookingState.pickupLocation.coordinates[0] && !bookingState.dropLocation.coordinates[0]) && (
                                        <div className="absolute inset-0 bg-gray-50 flex items-center justify-center text-gray-400 text-xs font-medium">
                                            Select locations to see live map and distance
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={handleContinue}
                                    disabled={isStepLoading}
                                    className="w-full bg-[#EB5500] cursor-pointer text-white py-3.5 rounded-lg font-medium shadow-md hover:bg-[#D44D00] transition-colors mt-2 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isStepLoading && <Loader size={18} className="animate-spin" />}
                                    Continue
                                </button>
                            </motion.div>
                        )}

                        {/* STEP 3: Choose Vehicle */}
                        {currentStep === 3 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                                <div onClick={() => handleInputChange('vehicleType', 'motorcycle')} className={`shadow p-4 py-5 rounded-xl flex items-center justify-between border cursor-pointer transition-all ${bookingState.vehicleType === 'motorcycle' ? 'border-[#EB5500] bg-[#E5E0DA]/70 ring-1 ring-[#EB5500]' : 'border-gray-200 hover:shadow-lg hover:border-[#EB5500]/50'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-[#E0E0E0] flex items-center justify-center flex-shrink-0">
                                            <Bike size={20} className="text-gray-700" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-[14px]">Motorcycle</h3>
                                            <p className="text-[11px] text-gray-500 font-medium">Small items • {priceData?.duration || '15-20 min'}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-[#EB5500]">${priceData?.vehicles?.motorcycle?.totalPrice || '5.99'}</p>
                                    </div>
                                </div>

                                <div onClick={() => handleInputChange('vehicleType', 'tricycle')} className={`shadow p-4 py-5 rounded-xl flex items-center justify-between border cursor-pointer transition-all ${bookingState.vehicleType === 'tricycle' ? 'border-[#EB5500] bg-[#E5E0DA]/70 ring-1 ring-[#EB5500]' : 'border-gray-200 hover:shadow-lg hover:border-[#EB5500]/50'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-[#E0E0E0] flex items-center justify-center flex-shrink-0">
                                            <Car size={20} className="text-gray-700" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-[14px]">Tricycle</h3>
                                            <p className="text-[11px] text-gray-500 font-medium">Medium items • {priceData?.duration || '20-30 min'}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-[#EB5500]">${priceData?.vehicles?.tricycle?.totalPrice || '12.99'}</p>
                                    </div>
                                </div>

                                <div onClick={() => handleInputChange('vehicleType', 'van')} className={`shadow p-4 py-5 rounded-xl flex items-center justify-between border cursor-pointer transition-all ${bookingState.vehicleType === 'van' ? 'border-[#EB5500] bg-[#E5E0DA]/70 ring-1 ring-[#EB5500]' : 'border-gray-200 hover:shadow-lg hover:border-[#EB5500]/50'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-lg bg-[#E0E0E0] flex items-center justify-center flex-shrink-0">
                                            <Truck size={20} className="text-gray-700" />
                                        </div>
                                        <div>
                                            <h3 className="font-medium text-[14px]">Van</h3>
                                            <p className="text-[11px] text-gray-500 font-medium">Large items • {priceData?.duration || '30-45 min'}</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-[#EB5500]">${priceData?.vehicles?.van?.totalPrice || '24.99'}</p>
                                    </div>
                                </div>

                                {errors.vehicleType && <span className="text-red-500 text-[10px] block mt-2 ml-1 text-center font-medium">Please select a vehicle option</span>}

                                <div className="pt-4">
                                    <button
                                        onClick={handleContinue}
                                        disabled={isStepLoading}
                                        className="w-full cursor-pointer bg-[#EB5500] text-white py-3.5 rounded-lg font-medium shadow-md hover:bg-[#D44D00] transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isStepLoading && <Loader size={18} className="animate-spin" />}
                                        Continue
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 4: Parcel Details */}
                        {currentStep === 4 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
                                <div>
                                    <div className="relative">
                                        <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                        <input
                                            type="text"
                                            value={bookingState.receiverName}
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
                                            type="text"
                                            value={bookingState.receiverPhone}
                                            onChange={(e) => handleInputChange('receiverPhone', e.target.value)}
                                            placeholder="Receiver Phone Number"
                                            className={`w-full bg-[#E5E0DA]/40 border ${errors.receiverPhone ? 'border-red-500' : 'border-transparent focus:border-[#EB5500]'} rounded-lg py-3.5 pl-11 pr-4 text-sm outline-none focus:bg-white`}
                                        />
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <label className="text-[12px] font-semibold w-full text-gray-400 mb-2 block">Delivery Date</label>
                                    <Popover>
                                        {/* @ts-expect-error type definition mismatch */}
                                        <PopoverTrigger asChild>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full bg-[#E5E0DA]/40 border rounded-lg py-7 px-4 text-sm justify-start text-left font-normal hover:bg-[#E5E0DA]/60 transition-colors",
                                                    !bookingState.deliveryDate && "text-gray-400",
                                                    errors.deliveryDate ? 'border-red-500' : 'border-transparent'
                                                )}
                                            >
                                                <CalendarIcon className="mr-2 h-4 w-4 text-gray-400" />
                                                {bookingState.deliveryDate ? (
                                                    format(new Date(bookingState.deliveryDate), "PPP")
                                                ) : (
                                                    <span>Pick a date</span>
                                                )}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start" side="bottom">
                                            <Calendar
                                                mode="single"
                                                selected={bookingState.deliveryDate ? new Date(bookingState.deliveryDate) : undefined}
                                                onSelect={(date) => handleInputChange('deliveryDate', date ? date.toISOString() : '')}
                                                initialFocus
                                                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    {errors.deliveryDate && <span className="text-red-500 text-[10px] mt-1 ml-1 block">Please select date</span>}
                                </div>

                                <div className="pt-2">
                                    <textarea
                                        value={bookingState.note}
                                        onChange={(e) => handleInputChange('note', e.target.value)}
                                        rows={4}
                                        placeholder="Additional Note (Optional)...."
                                        className="w-full bg-[#E5E0DA]/40 border border-transparent rounded-lg py-4 px-4 text-sm outline-none focus:bg-white focus:border-[#EB5500] resize-none"
                                    ></textarea>
                                </div>

                                <div className="pt-4">
                                    <button
                                        onClick={handleContinue}
                                        disabled={isStepLoading}
                                        className="w-full bg-[#EB5500] text-white py-3.5 rounded-lg font-medium shadow-md hover:bg-[#D44D00] transition-colors cursor-pointer flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isStepLoading && <Loader size={18} className="animate-spin" />}
                                        Continue
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* STEP 5: Review & Confirm */}
                        {currentStep === 5 && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6">
                                <div className="bg-[#E5E0DA]/30 rounded-xl p-6 border border-gray-200 text-sm space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-gray-400 text-[11px] uppercase font-bold">Parcel Name</p>
                                            <p className="font-medium text-gray-800">{bookingState.name}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-[11px] uppercase font-bold">Item Value</p>
                                            <p className="font-medium text-gray-800">${bookingState.itemValue}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-gray-400 text-[11px] uppercase font-bold">Pickup</p>
                                            <p className="font-medium text-gray-800">{bookingState.pickupLocation.address}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <p className="text-gray-400 text-[11px] uppercase font-bold">Drop-off</p>
                                            <p className="font-medium text-gray-800">{bookingState.dropLocation.address}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-[11px] uppercase font-bold">Vehicle</p>
                                            <p className="font-medium text-gray-800 capitalize">{bookingState.vehicleType}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-400 text-[11px] uppercase font-bold">Receiver</p>
                                            <p className="font-medium text-gray-800">{bookingState.receiverName}</p>
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-gray-200/50 space-y-2">
                                        <div className="flex justify-between items-center font-bold text-[16px]">
                                            <span className="text-gray-900">Total Delivery Fee</span>
                                            <span className="text-[#EB5500]">${priceData?.vehicles?.[bookingState.vehicleType]?.totalPrice || '0.00'}</span>
                                        </div>
                                        <div className="flex justify-between items-center text-[12px] text-gray-400">
                                            <span>Ready to Proceed?</span>
                                            <span>Payment Link will be generated</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-[11px] text-gray-400 font-medium flex items-center justify-center gap-2">
                                    <ShieldCheck size={14} /> Secure transaction via Stripe
                                </div>

                                <div className="pt-4">
                                    <button
                                        onClick={handleSubmit}
                                        disabled={isLoading}
                                        className="w-full bg-[#EB5500] text-white py-3.5 rounded-lg font-medium shadow-md hover:bg-[#D44D00] transition-colors cursor-pointer flex items-center justify-center gap-2"
                                    >
                                        {isLoading ? <Loader size={20} className="animate-spin" /> : "Confirm and Pay"}
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
            {/* Global Shared Footer Components */}
            <GetInTouch />
            <Footer />
        </div>
    );
}
