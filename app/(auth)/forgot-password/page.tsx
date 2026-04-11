'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import * as z from 'zod';

// Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

const slides = [
  { image: "/images/auth/image1.jpg" },
  { image: "/images/auth/image2.png" },
  { image: "/images/auth/image3.png" }
];

const emailSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
});

const passwordSchema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string().min(1, 'Please confirm your password'),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type EmailFormValues = z.infer<typeof emailSchema>;
type PasswordFormValues = z.infer<typeof passwordSchema>;

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password, 4: Success
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState('');
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  });

  const passwordForm = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setOtpError('');

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const onEmailSubmit = (data: EmailFormValues) => {
    console.log('Reset Email:', data);
    setStep(2);
  };

  const onVerifyOtp = () => {
    if (otp.some(digit => digit === '')) {
      setOtpError('Please enter the full 6-digit code');
      return;
    }
    setStep(3);
  };

  const onPasswordSubmit = (data: PasswordFormValues) => {
    console.log('New Password Data:', data);
    setStep(4);
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
                alt={`Forgot Slide ${idx + 1}`}
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
        <div className="w-full max-w-md">

          {/* Logo Section - Hidden on success step to match flow */}
          {step !== 4 && (
            <div className="flex flex-col items-center space-y-1 mb-10">
              <div className="w-48 mb-4">
                <Image src="/icons/logo.png" alt="Orienco Logo" width={200} height={80} className="w-full h-auto object-contain" />
              </div>
            </div>
          )}

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step-email"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                className="space-y-8"
              >
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold text-[#1A1A1A]">Forgot Password</h2>
                  <p className="text-gray-500 text-sm leading-relaxed px-4">
                    Enter your email address and we&apos;ll send you an OTP to reset your password.
                  </p>
                </div>

                <form className="space-y-6" onSubmit={emailForm.handleSubmit(onEmailSubmit)}>
                  <div className="space-y-1.5">
                    <Label className="text-xs font-bold text-gray-800">Email Address</Label>
                    <Input
                      placeholder="Enter your email"
                      {...emailForm.register('email')}
                      className={`h-11 bg-transparent border-gray-300 rounded-lg px-4 focus-visible:ring-1 focus-visible:ring-[#EB5500] transition-all text-sm ${emailForm.formState.errors.email ? 'border-red-500 ring-1 ring-red-500/20' : ''}`}
                    />
                    {emailForm.formState.errors.email && (
                      <p className="text-red-500 text-[10px] font-medium mt-1">{emailForm.formState.errors.email.message}</p>
                    )}
                  </div>

                  <Button type="submit" className="w-full h-12 bg-[#EB5500] hover:bg-[#D44D00] text-white font-medium rounded-lg text-sm transition-all shadow-none active:scale-[0.98]">
                    Send OTP Codes
                  </Button>

                  <div className="text-center">
                    <Link href="/login" className="text-sm font-bold text-gray-600 hover:text-[#EB5500] transition-all underline underline-offset-4 decoration-gray-200">
                      Back to Login
                    </Link>
                  </div>
                </form>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step-otp"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold text-[#1A1A1A]">Verify Account</h2>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    We&apos;ve sent a unique 6-digit verification code to your email address.
                  </p>
                </div>

                <div className="space-y-6">
                  <div className="flex justify-center gap-3">
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => { otpRefs.current[idx] = el; }}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(idx, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(idx, e)}
                        className={`w-12 h-12 text-center text-lg font-bold text-gray-800 bg-transparent border border-gray-300 rounded-lg focus:border-[#EB5500] focus:ring-1 focus:ring-[#EB5500] outline-none transition-all ${otpError ? 'border-red-500' : ''}`}
                      />
                    ))}
                  </div>
                  {otpError && (
                    <p className="text-red-500 text-[10px] font-medium text-center">{otpError}</p>
                  )}
                </div>

                <div className="flex items-center justify-between text-xs font-medium">
                  <span className="text-gray-500">Didn&apos;t receive the code?</span>
                  <button onClick={() => setOtp(['', '', '', '', '', ''])} className="text-[#EB5500] hover:underline font-bold">Resend OTP</button>
                </div>

                <Button
                  onClick={onVerifyOtp}
                  className="w-full h-12 bg-[#EB5500] hover:bg-[#D44D00] text-white font-medium rounded-lg text-sm transition-all shadow-none active:scale-[0.98]"
                >
                  Verify & Continue
                </Button>

                <div className="text-center">
                  <button onClick={() => setStep(1)} className="text-xs font-bold text-gray-400 hover:text-gray-600">Cancel and Restart</button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step-password"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold text-[#1A1A1A]">New Password</h2>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    Please create a new secure password for your account.
                  </p>
                </div>

                <form className="space-y-6" onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}>
                  <div className="space-y-1.5 relative">
                    <Label className="text-xs font-bold text-gray-800">Password</Label>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter password"
                        {...passwordForm.register('password')}
                        className={`h-11 bg-transparent border-gray-300 rounded-lg px-4 pr-12 focus-visible:ring-1 focus-visible:ring-[#EB5500] transition-all text-sm ${passwordForm.formState.errors.password ? 'border-red-500 ring-1 ring-red-500/20' : ''}`}
                      />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {passwordForm.formState.errors.password && (
                      <p className="text-red-500 text-[10px] font-medium mt-1">{passwordForm.formState.errors.password.message}</p>
                    )}
                  </div>

                  <div className="space-y-1.5 relative">
                    <Label className="text-xs font-bold text-gray-800">Confirm Password</Label>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm password"
                        {...passwordForm.register('confirmPassword')}
                        className={`h-11 bg-transparent border-gray-300 rounded-lg px-4 pr-12 focus-visible:ring-1 focus-visible:ring-[#EB5500] transition-all text-sm ${passwordForm.formState.errors.confirmPassword ? 'border-red-500 ring-1 ring-red-500/20' : ''}`}
                      />
                      <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {passwordForm.formState.errors.confirmPassword && (
                      <p className="text-red-500 text-[10px] font-medium mt-1">{passwordForm.formState.errors.confirmPassword.message}</p>
                    )}
                  </div>

                  <Button type="submit" className="w-full h-12 bg-[#EB5500] hover:bg-[#D44D00] text-white font-medium rounded-lg text-sm transition-all shadow-none active:scale-[0.98]">
                    Update Password
                  </Button>
                </form>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div
                key="step-success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center space-y-6"
              >
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500 border border-green-100 shadow-xl shadow-green-500/10">
                  <CheckCircle2 size={40} strokeWidth={1.5} />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Password Changed</h2>
                  <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                    Your password has been reset successfully. You can now login with your new credentials.
                  </p>
                </div>
                <Link href="/login" className="w-full">
                  <Button className="w-full h-12 bg-[#EB5500] hover:bg-[#D44D00] text-white font-bold rounded-lg text-sm shadow-lg shadow-orange-500/20 active:scale-95 transition-all">
                    Go to Login
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
