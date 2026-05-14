'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, Phone, Apple, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useRef } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';

// Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';
import { useLoginMutation } from '@/features/auth/authApi';
import toast from 'react-hot-toast';
import { setCredentials } from '@/features/auth/authSlice';
import { useDispatch } from 'react-redux';

const loginSchema = z.object({
  email: z.string().email('Invalid email address').optional().or(z.literal('')),
  password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
  phone: z.string().min(8, 'Invalid phone number').optional().or(z.literal('')),
  remember: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const slides = [
  { image: "/images/auth/image1.jpg" },
  { image: "/images/auth/image2.png" },
  { image: "/images/auth/image3.png" }
];

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [loginMode, setLoginMode] = useState<'email' | 'phone'>('email');
  const [loginStep, setLoginStep] = useState<'input' | 'otp' | 'success'>('input');
  const [otp, setOtp] = useState(['', '', '', '', '']); // 5 digits as per screenshot
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [login, { isLoading }] = useLoginMutation();

  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      phone: '',
      remember: false,
    },
  });

  const onSubmit = async () => {
    if (loginMode === 'phone' && loginStep === 'input') {
      const phoneVal = getValues('phone');
      if (!phoneVal || phoneVal.length < 8) return;
      setLoginStep('otp');
      return;
    }
    try {
      const response = await login({
        email: getValues("email"),
        password: getValues("password")
      }).unwrap();

      if (response.success) {
        toast.success(response.message);
        dispatch(setCredentials({
          token: response.data.accessToken,
          user: response.data.userInfo
        }));
        setLoginStep("success");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "An error occurred while logging in");
    }


  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 4) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const onVerifyOtp = () => {
    if (otp.some(digit => digit === '')) return;
    setLoginStep('success');
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
                alt={`Delivery Slide ${idx + 1}`}
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
            {loginStep === 'input' ? (
              <motion.div
                key="input-step"
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
                    <h2 className="text-2xl font-bold text-[#1A1A1A]">Welcome Back</h2>
                    <p className="text-gray-500 text-sm">Login to your account</p>
                  </div>
                </div>

                <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                  {loginMode === 'email' ? (
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-xs font-bold text-gray-800">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          {...register('email')}
                          className={`h-11 bg-transparent border-gray-300 rounded-lg px-4 focus-visible:ring-1 focus-visible:ring-[#EB5500] transition-all text-sm ${errors.email ? 'border-red-500 ring-1 ring-red-500/20' : ''}`}
                        />
                        {errors.email && <p className="text-red-500 text-[10px] font-medium mt-1">{errors.email.message}</p>}
                      </div>

                      <div className="space-y-1.5 relative">
                        <Label htmlFor="password" className="text-xs font-bold text-gray-800">Password</Label>
                        <div className="relative">
                          <Input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            {...register('password')}
                            className={`h-11 bg-transparent border-gray-300 rounded-lg px-4 pr-12 focus-visible:ring-1 focus-visible:ring-[#EB5500] transition-all text-sm ${errors.password ? 'border-red-500 ring-1 ring-red-500/20' : ''}`}
                          />
                          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">
                            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                        {errors.password && <p className="text-red-500 text-[10px] font-medium mt-1">{errors.password.message}</p>}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Checkbox id="remember" className="h-5 w-5 rounded-sm border-gray-300 data-[state=checked]:bg-[#EB5500] data-[state=checked]:border-[#EB5500]" />
                          <Label htmlFor="remember" className="text-xs font-bold text-gray-800 cursor-pointer">Remember Password</Label>
                        </div>
                        <Link href="/forgot-password" title="Forgot Password" className="text-xs font-bold text-gray-800 transition-colors underline decoration-gray-800 decoration-1 underline-offset-2">Forgot Password</Link>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <Label htmlFor="phone" className="text-xs font-bold text-gray-800">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="Enter your phone number"
                        {...register('phone')}
                        className={`h-11 bg-transparent border-gray-300 rounded-lg px-4 focus-visible:ring-1 focus-visible:ring-[#EB5500] transition-all text-sm ${errors.phone ? 'border-red-500 ring-1 ring-red-500/20' : ''}`}
                      />
                      {errors.phone && <p className="text-red-500 text-[10px] font-medium mt-1">{errors.phone.message}</p>}
                    </div>
                  )}

                  <Button type="submit" className="w-full h-12 bg-[#EB5500] hover:bg-[#D44D00] text-white font-medium rounded-lg text-sm transition-all shadow-none active:scale-[0.98]">
                    Sign In
                  </Button>
                </form>

                {loginMode === 'email' && (
                  <>
                    <div className="relative flex items-center gap-2">
                      <div className="h-px bg-gray-300 flex-1" />
                      <span className="text-[10px] text-gray-400 font-medium">or</span>
                      <div className="h-px bg-gray-300 flex-1" />
                    </div>

                    <div className="space-y-2.5">
                      <Button variant="outline" className="w-full h-11 border-gray-300 bg-transparent rounded-lg font-bold flex items-center justify-center gap-3 hover:bg-gray-100 text-xs">
                        <Image src="https://www.svgrepo.com/show/475656/google-color.svg" width={18} height={18} alt="Google" />
                        Sign in with Google
                      </Button>
                      <Button className="w-full h-11 bg-black hover:bg-black/90 text-white rounded-lg font-bold flex items-center justify-center gap-3 transition-all text-xs">
                        <Apple size={18} fill="currentColor" />
                        Sign in with Apple
                      </Button>
                      <Button onClick={() => setLoginMode('phone')} variant="outline" className="w-full h-11 border-gray-300 bg-transparent rounded-lg font-bold flex items-center justify-center gap-3 hover:bg-gray-100 transition-all text-xs">
                        <Phone size={18} className="text-gray-900" />
                        Sign in with Phone
                      </Button>
                    </div>
                  </>
                )}

                <div className="text-center">
                  <p className="text-sm text-gray-500 font-medium tracking-tight">
                    If haven&apos;t account? <Link href="/register" className="text-gray-900 hover:text-[#EB5500] font-bold transition-all">Sign Up</Link>
                  </p>
                </div>
              </motion.div>
            ) : loginStep === 'otp' ? (
              <motion.div
                key="otp-step"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-8"
              >
                <div className="flex flex-col items-center space-y-1">
                  <div className="w-48 mb-8">
                    <Image src="/icons/logo.png" alt="Orienco Logo" width={200} height={80} className="w-full h-auto object-contain" />
                  </div>
                  <div className="text-center space-y-2">
                    <h2 className="text-2xl font-bold text-[#1A1A1A]">Verify OTP</h2>
                    <p className="text-gray-500 text-[10px] font-medium leading-relaxed max-w-[280px] mx-auto">
                      Your OTP has been sent to your registered {loginMode === 'phone' ? 'phone number' : 'email address'}. Enter it below to continue.
                    </p>
                  </div>
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
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        className="w-12 h-12 text-center text-lg font-bold text-gray-800 bg-transparent border border-gray-300 rounded-lg focus:border-[#EB5500] focus:ring-1 focus:ring-[#EB5500] outline-none transition-all"
                      />
                    ))}
                  </div>

                  <div className="space-y-3">
                    <Button
                      onClick={onVerifyOtp}
                      className="w-full h-11 bg-[#EB5500] hover:bg-[#D44D00] text-white font-medium rounded-lg text-sm shadow-none active:scale-[0.98]"
                    >
                      Verify Code
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => { setLoginStep('input'); setLoginMode('email'); }}
                      className="w-full h-11 border-gray-300 bg-transparent rounded-lg font-bold text-xs hover:bg-gray-100"
                    >
                      Back to Sign In
                    </Button>
                  </div>

                  <p className="text-center text-[10px] text-gray-400 font-medium">
                    Resend code in 00:56
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="success-step"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center text-center space-y-6"
              >
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-green-500 border border-green-100 shadow-xl shadow-green-500/10">
                  <CheckCircle2 size={40} strokeWidth={1.5} />
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-gray-800 tracking-tight">Login Successful</h2>
                  <p className="text-gray-500 text-sm leading-relaxed max-w-xs mx-auto">
                    Welcome back to Orienco! Your account has been verified successfully.
                  </p>
                </div>
                <Link href="/" className="w-full">
                  <Button className="w-full h-12 bg-[#EB5500] hover:bg-[#D44D00] text-white font-bold rounded-lg text-sm shadow-lg shadow-orange-500/20 active:scale-95 transition-all">
                    Go
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
