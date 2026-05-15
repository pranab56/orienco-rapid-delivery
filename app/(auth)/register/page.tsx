'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Eye, EyeOff, CheckCircle2, Loader } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import * as z from 'zod';

// Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import { useSignUpMutation } from '@/features/auth/authApi';
import toast from 'react-hot-toast';

const slides = [
  { image: "/images/auth/image1.jpg" },
  { image: "/images/auth/image2.png" },
  { image: "/images/auth/image3.png" }
];

const registerSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  phone: z.string().min(8, 'Invalid phone number'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  terms: z.boolean().refine(val => val === true, 'You must agree to the terms'),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [signUp, { isLoading }] = useSignUpMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      terms: false,
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      const fromData = new FormData();
      fromData.append("fullName", data.fullName);
      fromData.append("email", data.email);
      fromData.append("phone", data.phone);
      fromData.append("password", data.password);
      fromData.append("role", "sender");
      const result = await signUp(fromData).unwrap();
      if (result.success) {
        toast.success(result.message)
        setIsSuccess(true);
      }
    } catch (error: any) {
      toast.error(error.message)
    }
  };

  return (
    <div className="h-screen grid grid-cols-1 lg:grid-cols-2 bg-[#F8F9FA] overflow-hidden">

      {/* Left Pan: Visual Slider */}
      <div className="relative hidden lg:block h-screen bg-[#D32F2F] overflow-hidden">
        <Swiper
          modules={[Pagination, Autoplay, EffectFade]}
          effect="fade"
          autoplay={{ delay: 5000 }}
          pagination={{ clickable: true, bulletClass: 'swiper-pagination-bullet auth-bullet' }}
          className="h-full w-full"
        >
          {slides.map((slide, idx) => (
            <SwiperSlide key={idx} className="relative h-full w-full">
              <Image
                src={slide.image}
                alt={`Register Slide ${idx + 1}`}
                fill
                className="object-cover opacity-90"
                priority={idx === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/30" />
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Back Button Overlay */}
        <div className="absolute top-6 left-6 z-20">
          <Link href="/" className="flex items-center gap-2 px-6 py-2 bg-black/10 backdrop-blur-md border border-white/20 rounded-full text-white hover:bg-white/20 transition-all group">
            <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-sm font-medium">Back to the homepage</span>
          </Link>
        </div>

        <style jsx global>{`
          .auth-bullet {
            width: 120px !important;
            height: 3px !important;
            border-radius: 0px !important;
            background: rgba(255,255,255,0.3) !important;
            opacity: 1 !important;
            margin: 0 4px !important;
            transition: all 0.3s ease;
          }
          .swiper-pagination-bullet-active {
            background: white !important;
          }
          .swiper-pagination {
            bottom: 40px !important;
            left: 40px !important;
            text-align: left !important;
            width: auto !important;
          }
        `}</style>
      </div>

      {/* Right Pan: Content */}
      <div className="flex flex-col items-center justify-center p-6 sm:p-12 lg:p-20 h-screen overflow-hidden bg-[#F8F9FA] font-sans">
        <div className="w-full max-w-md space-y-8">

          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div
                key="register-form"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-8"
              >
                {/* Logo Section */}
                <div className="flex flex-col items-center space-y-1">
                  <div className="w-48 mb-4">
                    <Image src="/icons/logo.png" alt="Orienco Logo" width={200} height={80} className="w-full h-auto object-contain" />
                  </div>
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-[#1A1A1A]">Create Account</h2>
                    <p className="text-gray-500 text-sm">Join Orienco Rapid Delivery</p>
                  </div>
                </div>

                <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
                  <div className="space-y-4  overflow-y-auto p-2 pr-2 custom-scrollbar">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-gray-800">Full Name</Label>
                      <Input
                        placeholder="Enter your full name"
                        {...register('fullName')}
                        className={`h-11 bg-transparent border-gray-300 rounded-lg px-4 focus-visible:ring-1 focus-visible:ring-[#EB5500] transition-all text-sm ${errors.fullName ? 'border-red-500 ring-1 ring-red-500/20' : ''}`}
                      />
                      {errors.fullName && <p className="text-red-500 text-[10px] font-medium mt-1">{errors.fullName.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-gray-800">Email Address</Label>
                      <Input
                        placeholder="Enter your email"
                        {...register('email')}
                        className={`h-11 bg-transparent border-gray-300 rounded-lg px-4 focus-visible:ring-1 focus-visible:ring-[#EB5500] transition-all text-sm ${errors.email ? 'border-red-500 ring-1 ring-red-500/20' : ''}`}
                      />
                      {errors.email && <p className="text-red-500 text-[10px] font-medium mt-1">{errors.email.message}</p>}
                    </div>

                    <div className="space-y-1.5">
                      <Label className="text-xs font-bold text-gray-800">Phone Number</Label>
                      <Input
                        placeholder="Enter your phone"
                        {...register('phone')}
                        className={`h-11 bg-transparent border-gray-300 rounded-lg px-4 focus-visible:ring-1 focus-visible:ring-[#EB5500] transition-all text-sm ${errors.phone ? 'border-red-500 ring-1 ring-red-500/20' : ''}`}
                      />
                      {errors.phone && <p className="text-red-500 text-[10px] font-medium mt-1">{errors.phone.message}</p>}
                    </div>

                    <div className="space-y-1.5 relative">
                      <Label className="text-xs font-bold text-gray-800">Password</Label>
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          placeholder="Enter password"
                          {...register('password')}
                          className={`h-11 bg-transparent border-gray-300 rounded-lg px-4 pr-12 focus-visible:ring-1 focus-visible:ring-[#EB5500] transition-all text-sm ${errors.password ? 'border-red-500 ring-1 ring-red-500/20' : ''}`}
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                      {errors.password && <p className="text-red-500 text-[10px] font-medium mt-1">{errors.password.message}</p>}
                    </div>

                    <div>
                      <div className='flex items-center space-x-2 py-2'>
                        <Checkbox id="terms" className="h-5 w-5 rounded-sm border-gray-300 data-[state=checked]:bg-[#EB5500] data-[state=checked]:border-[#EB5500]" onCheckedChange={(checked) => setValue('terms', !!checked, { shouldValidate: true })} />
                        <Label htmlFor="terms" className="text-[11px] font-medium text-gray-500 leading-tight cursor-pointer">
                          Agree to the <Link href="#" className="text-[#EB5500] hover:underline">Terms & Privacy Policy</Link>
                        </Label>
                      </div>
                      <div className="">
                        {errors.terms && <p className="text-red-500 text-[10px] font-medium mt-1">{errors.terms.message}</p>}
                      </div>
                    </div>
                  </div>

                  <Button type="submit" disabled={isLoading} className="w-full cursor-pointer h-12 bg-[#EB5500] hover:bg-[#D44D00] text-white font-medium rounded-lg text-sm transition-all shadow-none active:scale-[0.98]">
                    {isLoading && <div className='flex justify-center items-center gap-2 animate-spin'><Loader size={16} /></div>} Sign Up
                  </Button>
                </form>

                <div className="text-center">
                  <p className="text-sm text-gray-500 font-medium tracking-tight">
                    Already have an account? <Link href="/login" className="text-gray-900 hover:text-[#EB5500] font-bold transition-all underline underline-offset-4 decoration-gray-200">Sign In</Link>
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="register-success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center space-y-6"
              >
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500 border border-green-100 shadow-xl shadow-green-500/10">
                  <CheckCircle2 size={40} strokeWidth={1.5} />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Account Created!</h2>
                  <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
                    Welcome to the Orienco family. Your account has been successfully created.
                  </p>
                </div>
                <Link href={`/verify-otp?email=${getValues('email')}`} className="w-full">
                  <Button className="w-full h-12 cursor-pointer bg-[#EB5500] hover:bg-[#D44D00] text-white font-medium rounded-lg text-sm shadow-lg shadow-orange-500/20 active:scale-95 transition-all">
                    verify your email
                  </Button>
                </Link>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}
