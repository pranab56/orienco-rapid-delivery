'use client';

import GetInTouch from '@/components/home/GetInTouch';
import Footer from '@/components/shared/Footer';
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { resetBooking, updateBooking } from '@/features/parcel/bookingSlice';
import { useCalculateDistacePriceQuery, useCreateParcelMutation } from '@/features/parcel/parcelApi';
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertCircle,
  Bike,
  CalendarIcon,
  Car,
  ChevronLeft,
  Loader,
  MapPin,
  Navigation,
  Phone,
  ShieldCheck,
  Truck,
  User
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';

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
    bgImage: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=2000&auto=format&fit=crop',
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
  const [errors, setErrors] = useState<Record<string, string>>({});
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

  const validateField = (field: string, value: any): string => {
    switch (field) {
      case 'receiverName': {
        const name = typeof value === 'string' ? value.trim() : '';
        if (!name) return 'Receiver name is required';
        if (name.length < 2) return 'Name must be at least 2 characters';
        if (name.length > 50) return 'Name must not exceed 50 characters';
        if (!/^[\p{L}\s.'-]+$/u.test(name)) {
          return 'Please enter a valid name (letters only)';
        }
        return '';
      }
      case 'receiverPhone': {
        const phone = typeof value === 'string' ? value.trim() : '';
        if (!phone) return 'Receiver phone number is required';
        const phoneDigits = phone.replace(/\D/g, '');
        const phonePattern = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;
        if (!phonePattern.test(phone) || phoneDigits.length < 8 || phoneDigits.length > 15) {
          return 'Please enter a valid phone number (8-15 digits)';
        }
        if (/^(\d)\1+$/.test(phoneDigits)) {
          return 'Please enter a valid phone number';
        }
        return '';
      }
      case 'deliveryDate': {
        if (!value) return 'Please select a delivery date';
        const selectedDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const checkDate = new Date(selectedDate);
        checkDate.setHours(0, 0, 0, 0);
        if (checkDate < today) return 'Delivery date cannot be in the past';
        return '';
      }
      case 'deliveryTime': {
        if (bookingState.deliveryDate) {
          const selectedDate = new Date(bookingState.deliveryDate);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const checkDate = new Date(selectedDate);
          checkDate.setHours(0, 0, 0, 0);
          if (checkDate > today && (!value || !value.trim())) {
            return 'Please select a delivery time for the scheduled date';
          }
        }
        return '';
      }
      case 'note': {
        if (value && value.length > 500) return 'Note must not exceed 500 characters';
        return '';
      }
      default:
        return '';
    }
  };

  const validateStep = (step: number) => {
    const newErrors: Record<string, string> = {};
    if (step === 1) {
      if (!bookingState.name || !bookingState.name.trim()) newErrors.name = 'Package name is required';
      if (!bookingState.itemValue || Number(bookingState.itemValue) <= 0) newErrors.itemValue = 'Please enter item value';
    }
    if (step === 2) {
      if (!bookingState.pickupLocation?.address) newErrors.pickupLocation = 'Pickup location is required';
      if (!bookingState.dropLocation?.address) newErrors.dropLocation = 'Drop-off location is required';
    }
    if (step === 3) {
      if (!bookingState.vehicleType) newErrors.vehicleType = 'Please select a vehicle option';
    }
    if (step === 4) {
      const nameError = validateField('receiverName', bookingState.receiverName);
      if (nameError) newErrors.receiverName = nameError;

      const phoneError = validateField('receiverPhone', bookingState.receiverPhone);
      if (phoneError) newErrors.receiverPhone = phoneError;

      const dateError = validateField('deliveryDate', bookingState.deliveryDate);
      if (dateError) newErrors.deliveryDate = dateError;

      const timeError = validateField('deliveryTime', bookingState.deliveryTime);
      if (timeError) newErrors.deliveryTime = timeError;

      const noteError = validateField('note', bookingState.note);
      if (noteError) newErrors.note = noteError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleContinue = () => {
    if (!validateStep(currentStep)) {
      toast.error('Please fill in all required fields correctly');
      return;
    }
    setIsStepLoading(true);
    setTimeout(() => {
      if (currentStep < 5) setCurrentStep(prev => prev + 1);
      setIsStepLoading(false);
    }, 1000);
  };

  const handleInputChange = (field: string, value: any) => {
    let processedValue = value;
    if (field === 'receiverPhone' && typeof value === 'string') {
      // Disallow non-phone characters, only allow digits, +, spaces, hyphens, and ()
      processedValue = value.replace(/[^0-9+\s\-()]/g, '');
    }
    dispatch(updateBooking({ [field]: processedValue }));

    if (field === 'deliveryDate') {
      const selected = processedValue ? new Date(processedValue) : null;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selected) {
        const check = new Date(selected);
        check.setHours(0, 0, 0, 0);
        if (check.getTime() === today.getTime()) {
          setErrors(prev => {
            const next = { ...prev };
            delete next.deliveryDate;
            delete next.deliveryTime;
            return next;
          });
          return;
        }
      }
    }

    if (errors[field]) {
      const err = validateField(field, processedValue);
      setErrors(prev => {
        const next = { ...prev };
        if (err) {
          next[field] = err;
        } else {
          delete next[field];
        }
        return next;
      });
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
                  {errors.name && (
                    <span className="text-red-500 text-[11px] mt-1.5 ml-1 flex items-center gap-1.5 font-medium">
                      <AlertCircle size={13} className="flex-shrink-0" /> {errors.name}
                    </span>
                  )}
                </div>
                <div>
                  <label className="text-[12px] font-semibold text-gray-400 mb-2 block">What is the value of your item?</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm">CFA franc</span>
                    <input
                      type="number"
                      value={bookingState.itemValue === 0 ? '' : bookingState.itemValue}
                      onChange={(e) => handleInputChange('itemValue', Number(e.target.value))}
                      placeholder="1200"
                      className={`w-full bg-[#E5E0DA]/50 border ${errors.itemValue ? 'border-red-500 focus:border-red-500' : 'border-transparent focus:border-[#EB5500]'} rounded-lg pl-24 pr-4 py-3.5 text-sm outline-none focus:bg-white transition-colors placeholder:text-gray-400`}
                    />
                  </div>
                  {errors.itemValue && (
                    <span className="text-red-500 text-[11px] mt-1.5 ml-1 flex items-center gap-1.5 font-medium">
                      <AlertCircle size={13} className="flex-shrink-0" /> {errors.itemValue}
                    </span>
                  )}
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
                      {errors.pickupLocation && (
                        <span className="text-red-500 text-[11px] mt-1.5 ml-1 flex items-center gap-1.5 font-medium">
                          <AlertCircle size={13} className="flex-shrink-0" /> {errors.pickupLocation}
                        </span>
                      )}
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
                      {errors.dropLocation && (
                        <span className="text-red-500 text-[11px] mt-1.5 ml-1 flex items-center gap-1.5 font-medium">
                          <AlertCircle size={13} className="flex-shrink-0" /> {errors.dropLocation}
                        </span>
                      )}
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
                    <p className="font-bold text-[#EB5500]">CFA franc {priceData?.vehicles?.motorcycle?.totalPrice || '5.99'}</p>
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
                    <p className="font-bold text-[#EB5500]">CFA franc {priceData?.vehicles?.tricycle?.totalPrice || '12.99'}</p>
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
                    <p className="font-bold text-[#EB5500]">CFA franc {priceData?.vehicles?.van?.totalPrice || '24.99'}</p>
                  </div>
                </div>

                {errors.vehicleType && (
                  <span className="text-red-500 text-[11px] flex items-center justify-center gap-1.5 mt-2 ml-1 text-center font-medium">
                    <AlertCircle size={13} className="flex-shrink-0" /> {errors.vehicleType}
                  </span>
                )}

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
                    <User size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.receiverName ? 'text-red-500' : 'text-gray-400'}`} />
                    <input
                      type="text"
                      value={bookingState.receiverName}
                      maxLength={50}
                      onChange={(e) => handleInputChange('receiverName', e.target.value)}
                      onBlur={() => {
                        const err = validateField('receiverName', bookingState.receiverName);
                        if (err) setErrors(prev => ({ ...prev, receiverName: err }));
                      }}
                      placeholder="Receiver Name"
                      className={`w-full bg-[#E5E0DA]/40 border ${errors.receiverName ? 'border-red-500 ring-1 ring-red-500' : 'border-transparent focus:border-[#EB5500]'} rounded-lg py-3.5 pl-11 pr-4 text-sm outline-none focus:bg-white transition-all`}
                    />
                  </div>
                  {errors.receiverName && (
                    <span className="text-red-500 text-[11px] mt-1.5 ml-1 flex items-center gap-1.5 font-medium">
                      <AlertCircle size={13} className="flex-shrink-0" /> {errors.receiverName}
                    </span>
                  )}
                </div>

                <div>
                  <div className="relative">
                    <Phone size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.receiverPhone ? 'text-red-500' : 'text-gray-400'}`} />
                    <input
                      type="tel"
                      value={bookingState.receiverPhone}
                      maxLength={18}
                      onChange={(e) => handleInputChange('receiverPhone', e.target.value)}
                      onBlur={() => {
                        const err = validateField('receiverPhone', bookingState.receiverPhone);
                        if (err) setErrors(prev => ({ ...prev, receiverPhone: err }));
                      }}
                      placeholder="Receiver Phone Number"
                      className={`w-full bg-[#E5E0DA]/40 border ${errors.receiverPhone ? 'border-red-500 ring-1 ring-red-500' : 'border-transparent focus:border-[#EB5500]'} rounded-lg py-3.5 pl-11 pr-4 text-sm outline-none focus:bg-white transition-all`}
                    />
                  </div>
                  {errors.receiverPhone && (
                    <span className="text-red-500 text-[11px] mt-1.5 ml-1 flex items-center gap-1.5 font-medium">
                      <AlertCircle size={13} className="flex-shrink-0" /> {errors.receiverPhone}
                    </span>
                  )}
                </div>

                <div className="pt-2 w-full">
                  <label className="text-[12px] font-semibold w-full text-gray-400 mb-2 block">Delivery Date & Time</label>
                  <Popover>
                    {/* @ts-expect-error type definition mismatch */}
                    <PopoverTrigger asChild className="w-full">
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full bg-[#E5E0DA]/40 border rounded-lg py-7 px-4 text-sm justify-start text-left font-normal hover:bg-[#E5E0DA]/60 transition-colors",
                          !bookingState.deliveryDate && "text-gray-400",
                          errors.deliveryDate ? 'border-red-500 ring-1 ring-red-500' : 'border-transparent'
                        )}
                      >
                        <CalendarIcon className={`mr-2 h-4 w-4 flex-shrink-0 ${errors.deliveryDate ? 'text-red-500' : 'text-gray-400'}`} />
                        {bookingState.deliveryDate ? (
                          format(new Date(bookingState.deliveryDate), "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 w-full" align="start" side="bottom">
                      <Calendar
                        mode="single"
                        selected={bookingState.deliveryDate ? new Date(bookingState.deliveryDate) : undefined}
                        onSelect={(date) => {
                          const today = new Date();
                          today.setHours(0, 0, 0, 0);

                          if (date) {
                            const selectedDate = new Date(date);
                            selectedDate.setHours(0, 0, 0, 0);

                            // If selected date is today, set time to current time + 1 hour
                            if (selectedDate.getTime() === today.getTime()) {
                              const currentDateTime = new Date();
                              currentDateTime.setHours(currentDateTime.getHours() + 1);
                              handleInputChange('deliveryDate', currentDateTime.toISOString());
                              handleInputChange('deliveryTime', '');
                            }
                            // If selected date is future date, set to 9 AM on that date
                            else if (selectedDate > today) {
                              const futureDate = new Date(date);
                              futureDate.setHours(9, 0, 0, 0);
                              handleInputChange('deliveryDate', futureDate.toISOString());
                            }
                            // If selected date is past, don't allow
                            else {
                              toast.error("Please select today or a future date");
                              return;
                            }
                          } else {
                            handleInputChange('deliveryDate', '');
                          }
                        }}
                        initialFocus
                        disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.deliveryDate && (
                    <span className="text-red-500 text-[11px] mt-1.5 ml-1 flex items-center gap-1.5 font-medium">
                      <AlertCircle size={13} className="flex-shrink-0" /> {errors.deliveryDate}
                    </span>
                  )}
                </div>

                {/* Time Picker - Only show for future dates (not today) */}
                {bookingState.deliveryDate && new Date(bookingState.deliveryDate).toDateString() !== new Date().toDateString() && (
                  <div className="pt-2">
                    <label className="text-[12px] font-semibold w-full text-gray-400 mb-2 block">Select Delivery Time</label>
                    <div className="relative">
                      <input
                        type="time"
                        value={bookingState.deliveryTime || ''}
                        onChange={(e) => {
                          const time = e.target.value;
                          handleInputChange('deliveryTime', time);

                          // Update the full datetime
                          if (bookingState.deliveryDate && time) {
                            const dateObj = new Date(bookingState.deliveryDate);
                            const [hours, minutes] = time.split(':');
                            dateObj.setHours(parseInt(hours), parseInt(minutes), 0, 0);
                            handleInputChange('deliveryDate', dateObj.toISOString());
                          }
                        }}
                        className={`w-full bg-[#E5E0DA]/40 border ${errors.deliveryTime ? 'border-red-500 ring-1 ring-red-500' : 'border-transparent focus:border-[#EB5500]'} rounded-lg py-3.5 px-4 text-sm outline-none focus:bg-white transition-all`}
                      />
                    </div>
                    {errors.deliveryTime && (
                      <span className="text-red-500 text-[11px] mt-1.5 ml-1 flex items-center gap-1.5 font-medium">
                        <AlertCircle size={13} className="flex-shrink-0" /> {errors.deliveryTime}
                      </span>
                    )}
                  </div>
                )}

                <div className="pt-2">
                  <div className="relative">
                    <textarea
                      value={bookingState.note}
                      onChange={(e) => handleInputChange('note', e.target.value)}
                      maxLength={500}
                      rows={4}
                      placeholder="Additional Note (Optional)...."
                      className={`w-full bg-[#E5E0DA]/40 border ${errors.note ? 'border-red-500 ring-1 ring-red-500' : 'border-transparent focus:border-[#EB5500]'} rounded-lg py-4 px-4 text-sm outline-none focus:bg-white resize-none transition-all`}
                    ></textarea>
                    {bookingState.note && (
                      <span className="absolute right-3 bottom-3 text-[10px] text-gray-400">
                        {bookingState.note.length}/500
                      </span>
                    )}
                  </div>
                  {errors.note && (
                    <span className="text-red-500 text-[11px] mt-1.5 ml-1 flex items-center gap-1.5 font-medium">
                      <AlertCircle size={13} className="flex-shrink-0" /> {errors.note}
                    </span>
                  )}
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
                      <p className="font-medium text-gray-800">CFA franc {bookingState.itemValue}</p>
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
                      <span className="text-[#EB5500]">CFA franc {priceData?.vehicles?.[bookingState.vehicleType]?.totalPrice || '0.00'}</span>
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
