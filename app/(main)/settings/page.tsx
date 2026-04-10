'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Camera, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PersonalInformationPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '+123456789',
    dob: '01 Jan 2000',
    address: 'Al Rigga Metro Station, Deira, Dubai'
  });
  
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const handleSave = () => {
    const newErrors: Record<string, boolean> = {};
    if (!formData.fullName) newErrors.fullName = true;
    if (!formData.phone) newErrors.phone = true;
    if (!formData.dob) newErrors.dob = true;
    if (!formData.address) newErrors.address = true;
    
    setErrors(newErrors);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pb-20">
      <h2 className="text-[28px] font-bold text-gray-800 mb-8 tracking-tight">Personal Information</h2>

      <div className="space-y-6 max-w-2xl">
        <div className="mb-8">
          <div className="relative inline-block">
            <div className="w-20 h-20 rounded-full overflow-hidden border border-gray-200">
              <Image 
                  src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop" 
                  alt="Avatar" 
                  width={80} 
                  height={80} 
                  className="object-cover"
              />
            </div>
            <button className="absolute bottom-0 right-0 w-7 h-7 rounded-lg bg-orange-100 flex items-center justify-center text-[#EB5500] border border-white hover:bg-orange-200 transition-colors shadow-sm cursor-pointer">
              <Camera size={14} />
            </button>
          </div>
        </div>

        <div>
          <label className="text-[12px] font-bold text-gray-500 mb-2 block">Full Name</label>
          <input 
            type="text" 
            value={formData.fullName}
            onChange={(e) => {
                setFormData(p => ({...p, fullName: e.target.value}));
                setErrors(p => ({...p, fullName: false}));
            }}
            placeholder="Enter your full name" 
            className={`w-full bg-[#F2F2F2] border ${errors.fullName ? 'border-red-500' : 'border-gray-300 focus:border-[#EB5500]'} rounded-sm py-3.5 px-4 text-sm outline-none transition-colors placeholder:text-gray-400`}
          />
          {errors.fullName && <span className="text-red-500 text-[10px] mt-1 ml-1 block font-bold">Required</span>}
        </div>

        <div>
          <label className="text-[12px] font-bold text-gray-500 mb-2 block">Phone Number</label>
          <input 
            type="text" 
            value={formData.phone}
            onChange={(e) => {
                setFormData(p => ({...p, phone: e.target.value}));
                setErrors(p => ({...p, phone: false}));
            }}
            placeholder="Enter your phone number" 
            className={`w-full bg-[#F2F2F2] border ${errors.phone ? 'border-red-500' : 'border-gray-300 focus:border-[#EB5500]'} rounded-sm py-3.5 px-4 text-sm outline-none transition-colors placeholder:text-gray-400`}
          />
          {errors.phone && <span className="text-red-500 text-[10px] mt-1 ml-1 block font-bold">Required</span>}
        </div>

        <div>
           <label className="text-[12px] font-bold text-gray-500 mb-2 block">Date of Birth</label>
           <div className="relative">
              <input 
                type="text" 
                value={formData.dob}
                onChange={(e) => {
                    setFormData(p => ({...p, dob: e.target.value}));
                    setErrors(p => ({...p, dob: false}));
                }}
                placeholder="01 Jan 2000" 
                className={`w-full bg-[#F2F2F2] border ${errors.dob ? 'border-red-500' : 'border-gray-300 focus:border-[#EB5500]'} rounded-sm py-3.5 pl-4 pr-10 text-sm outline-none transition-colors placeholder:text-gray-400`}
              />
              <Calendar size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
           </div>
           {errors.dob && <span className="text-red-500 text-[10px] mt-1 ml-1 block font-bold">Required</span>}
        </div>

        <div>
          <label className="text-[12px] font-bold text-gray-500 mb-2 block">Address</label>
          <input 
            type="text" 
            value={formData.address}
            onChange={(e) => {
                setFormData(p => ({...p, address: e.target.value}));
                setErrors(p => ({...p, address: false}));
            }}
            placeholder="Enter your address" 
            className={`w-full bg-[#F2F2F2] border ${errors.address ? 'border-red-500' : 'border-gray-300 focus:border-[#EB5500]'} rounded-sm py-3.5 px-4 text-sm outline-none transition-colors placeholder:text-gray-400`}
          />
          {errors.address && <span className="text-red-500 text-[10px] mt-1 ml-1 block font-bold">Required</span>}
        </div>

        <div className="pt-4 flex justify-end">
          <button 
             onClick={handleSave}
             className="bg-[#EB5500] hover:bg-[#D44D00] text-white px-10 py-3 rounded-sm font-medium text-sm transition-colors cursor-pointer shadow-sm"
          >
            Save
          </button>
        </div>
      </div>
    </motion.div>
  );
}
