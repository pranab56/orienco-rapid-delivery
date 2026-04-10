'use client';

import React, { useState } from 'react';
import { Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PasswordChangePage() {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  const handleSave = () => {
    const newErrors: Record<string, boolean> = {};
    if (!formData.currentPassword) newErrors.currentPassword = true;
    if (!formData.newPassword) newErrors.newPassword = true;
    if (!formData.confirmPassword) newErrors.confirmPassword = true;
    if (formData.newPassword !== formData.confirmPassword) {
      newErrors.newPassword = true;
      newErrors.confirmPassword = true;
    }
    
    setErrors(newErrors);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pb-20">
      <h2 className="text-[28px] font-bold text-gray-800 mb-8 tracking-tight">Password Change</h2>

      <div className="space-y-6 max-w-2xl">
        <div className="mb-8">
            <h3 className="font-bold text-[16px] text-gray-800">Choose a New Password</h3>
            <p className="text-[11px] text-gray-500 mt-1">Enter and confirm your new password to regain access</p>
        </div>

        <div>
           <label className="text-[12px] font-bold text-gray-500 mb-2 block">Current Password</label>
           <div className="relative">
              <input 
                type="password" 
                value={formData.currentPassword}
                onChange={(e) => {
                    setFormData(p => ({...p, currentPassword: e.target.value}));
                    setErrors(p => ({...p, currentPassword: false}));
                }}
                placeholder="Enter your old password" 
                className={`w-full bg-[#F2F2F2] border ${errors.currentPassword ? 'border-red-500' : 'border-gray-300 focus:border-[#EB5500]'} rounded-sm py-3.5 pl-11 pr-4 text-sm outline-none transition-colors placeholder:text-gray-400`}
              />
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
           </div>
           {errors.currentPassword && <span className="text-red-500 text-[10px] mt-1 ml-1 block font-bold">Required</span>}
        </div>

        <div>
           <label className="text-[12px] font-bold text-gray-500 mb-2 block">New Password</label>
           <div className="relative">
              <input 
                type="password" 
                value={formData.newPassword}
                onChange={(e) => {
                    setFormData(p => ({...p, newPassword: e.target.value}));
                    setErrors(p => ({...p, newPassword: false}));
                }}
                placeholder="Enter your new password" 
                className={`w-full bg-[#F2F2F2] border ${errors.newPassword ? 'border-red-500' : 'border-gray-300 focus:border-[#EB5500]'} rounded-sm py-3.5 pl-11 pr-4 text-sm outline-none transition-colors placeholder:text-gray-400`}
              />
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
           </div>
           {errors.newPassword && <span className="text-red-500 text-[10px] mt-1 ml-1 block font-bold">Please check your new password</span>}
        </div>

        <div>
           <label className="text-[12px] font-bold text-gray-500 mb-2 block">Confirm Password</label>
           <div className="relative">
              <input 
                type="password" 
                value={formData.confirmPassword}
                onChange={(e) => {
                    setFormData(p => ({...p, confirmPassword: e.target.value}));
                    setErrors(p => ({...p, confirmPassword: false}));
                }}
                placeholder="Re-enter your new password" 
                className={`w-full bg-[#F2F2F2] border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300 focus:border-[#EB5500]'} rounded-sm py-3.5 pl-11 pr-4 text-sm outline-none transition-colors placeholder:text-gray-400`}
              />
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
           </div>
           {errors.confirmPassword && <span className="text-red-500 text-[10px] mt-1 ml-1 block font-bold">Please confirm your new password</span>}
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
