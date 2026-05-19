'use client';

import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { Camera, Calendar as CalendarIcon, Loader } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useGetMyProfileQuery, useUpdateProfileMutation } from '@/features/profileAndSettings/profileApi';
import toast from 'react-hot-toast';

export default function PersonalInformationPage() {
  const { data: profileResponse, isLoading: profileLoading } = useGetMyProfileQuery(undefined);
  const [updateProfile, { isLoading }] = useUpdateProfileMutation();

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: ''
  });

  const [date, setDate] = useState<Date | undefined>(undefined);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  // Populate form with fetched data
  React.useEffect(() => {
    if (profileResponse?.data) {
      const profile = profileResponse.data;
      setFormData({
        fullName: profile.fullName || '',
        phone: profile.phone || '',
        address: profile.address || ''
      });
      if (profile.dateOfBirth) {
        setDate(new Date(profile.dateOfBirth));
      }
      if (profile.image) {
        setPreviewImage(profile.image);
      }
    }
  }, [profileResponse]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    const newErrors: Record<string, boolean> = {};
    if (!formData.fullName) newErrors.fullName = true;
    if (!formData.phone) newErrors.phone = true;
    if (!date) newErrors.dob = true;
    if (!formData.address) newErrors.address = true;

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      const submitData = new FormData();
      submitData.append('fullName', formData.fullName);
      submitData.append('phone', formData.phone);
      submitData.append('address', formData.address);
      if (date) {
        // Format to M-D-YY as shown in your Postman image (4-10-26) or standard ISO
        submitData.append('dateOfBirth', date.toISOString());
      }
      if (imageFile) {
        submitData.append('image', imageFile);
      }

      try {
        await updateProfile(submitData).unwrap();
        toast.success('Profile updated successfully!');
      } catch (err: any) {
        toast.error(err?.data?.message || 'Failed to update profile');
      }
    }
  };


  if (profileLoading) {
    return <div className="flex items-center justify-center h-[50vh]"><Loader size={40} className="animate-spin text-[#EB5500]" /></div>;
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pb-20 px-4 md:px-0">
      <h2 className="text-2xl md:text-[28px] font-medium text-gray-800 mb-6 md:mb-8 tracking-tight">Personal Information</h2>

      <div className="space-y-6 max-w-2xl">
        {/* Avatar Section */}
        <div className="mb-8">
          <div className="relative inline-block">
            <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-white shadow-md bg-gray-100">
              <Image
                src={previewImage || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop"}
                alt="Avatar"
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageChange}
              className="hidden"
              accept="image/*"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-1 right-1 w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-[#EB5500] border-2 border-white hover:bg-orange-200 transition-all shadow-sm cursor-pointer active:scale-90"
            >
              <Camera size={16} />
            </button>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 gap-6">
          <div>
            <label className="text-[12px] font-medium text-gray-500 mb-2 block">Full Name</label>
            <input
              type="text"
              value={formData.fullName}
              onChange={(e) => {
                setFormData(p => ({ ...p, fullName: e.target.value }));
                setErrors(p => ({ ...p, fullName: false }));
              }}
              placeholder="Enter your full name"
              className={cn(
                "w-full bg-[#F2F2F2] border rounded-sm py-3.5 px-4 text-sm outline-none transition-all placeholder:text-gray-400",
                errors.fullName ? "border-red-500" : "border-gray-200 focus:border-[#EB5500] focus:bg-white"
              )}
            />
            {errors.fullName && <span className="text-red-500 text-[10px] mt-1 ml-1 block font-medium">Required</span>}
          </div>

          <div>
            <label className="text-[12px] font-medium text-gray-500 mb-2 block">Phone Number</label>
            <input
              type="text"
              value={formData.phone}
              onChange={(e) => {
                setFormData(p => ({ ...p, phone: e.target.value }));
                setErrors(p => ({ ...p, phone: false }));
              }}
              placeholder="Enter your phone number"
              className={cn(
                "w-full bg-[#F2F2F2] border rounded-sm py-3.5 px-4 text-sm outline-none transition-all placeholder:text-gray-400",
                errors.phone ? "border-red-500" : "border-gray-200 focus:border-[#EB5500] focus:bg-white"
              )}
            />
            {errors.phone && <span className="text-red-500 text-[10px] mt-1 ml-1 block font-medium">Required</span>}
          </div>

          <div className='w-full '>
            <label className="text-[12px] font-medium text-gray-500 mb-2 block">Date of Birth</label>
            <Popover>
              <PopoverTrigger className="w-full bg-transparent border-none p-0 h-auto cursor-default">
                <div className="relative cursor-pointer group w-full">
                  <div
                    className={cn(
                      "w-full bg-[#F2F2F2] border rounded-sm py-3.5 pl-4 pr-10 text-sm outline-none transition-all flex items-center",
                      !date && "text-gray-400",
                      errors.dob ? "border-red-500" : "border-gray-200 group-hover:border-[#EB5500]"
                    )}
                  >
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </div>
                  <CalendarIcon size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-[#EB5500] transition-colors" />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0 border-none shadow-2xl rounded-xl overflow-hidden" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => {
                    setDate(d);
                    setErrors(p => ({ ...p, dob: false }));
                  }}
                  initialFocus
                  captionLayout="dropdown"
                  fromYear={1960}
                  toYear={2025}
                  className="p-3 w-full"
                />
              </PopoverContent>
            </Popover>
            {errors.dob && <span className="text-red-500 text-[10px] mt-1 ml-1 block font-medium">Required</span>}
          </div>

          <div>
            <label className="text-[12px] font-medium text-gray-500 mb-2 block">Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => {
                setFormData(p => ({ ...p, address: e.target.value }));
                setErrors(p => ({ ...p, address: false }));
              }}
              placeholder="Enter your address"
              className={cn(
                "w-full bg-[#F2F2F2] border rounded-sm py-3.5 px-4 text-sm outline-none transition-all placeholder:text-gray-400",
                errors.address ? "border-red-500" : "border-gray-200 focus:border-[#EB5500] focus:bg-white"
              )}
            />
            {errors.address && <span className="text-red-500 text-[10px] mt-1 ml-1 block font-medium">Required</span>}
          </div>
        </div>

        <div className="pt-8 flex sm:justify-end">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="w-full sm:w-auto bg-[#EB5500] hover:bg-[#D44D00] text-white px-12 py-3.5 rounded-sm font-medium text-base transition-all cursor-pointer shadow-lg shadow-[#EB5500]/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading && <Loader className="animate-spin" size={18} />}
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </motion.div>
  );
}

