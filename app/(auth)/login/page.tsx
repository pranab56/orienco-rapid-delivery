'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
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

const slides = [
  {
    title: 'Discover the Pinnacle of Luxury Living',
    subtitle: 'Join an exclusive community of property enthusiasts and professionals navigating the world’s most prestigious estates.',
    image: '/images/auth/image1.png'
  },
  {
    title: 'Modern Architecture and Elegant Design',
    subtitle: 'Explore the finest designs from top-tier architects and discover your next dream home.',
    image: '/images/auth/image2.png'
  },
  {
    title: 'Premium Property Dashboard',
    subtitle: 'All your real estate management tools in one integrated and intuitive platform.',
    image: '/images/auth/image3.png'
  },
  {
    title: 'Premium Property Dashboard',
    subtitle: 'All your real estate management tools in one integrated and intuitive platform.',
    image: '/images/auth/image4.png'
  }
];

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  remember: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

function Logo() {
  return (
    <div className="flex items-center gap-2">
      <Image src="/icons/logo.png" alt="Logo" width={1000} height={1000} className='w-full h-10' />
    </div>
  );
}

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      remember: false,
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    console.log('Login Form Data:', data);
    // Handle login action here
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 overflow-x-hidden bg-white font-sans">

      {/* Left Pan: Slider */}
      <div className="relative hidden lg:block h-screen sticky top-0">
        <Swiper
          modules={[Pagination, Autoplay, EffectFade]}
          effect="fade"
          autoplay={{ delay: 5000 }}
          pagination={{ clickable: true, bulletClass: 'swiper-pagination-bullet login-bullet' }}
          className="h-full w-full"
        >
          {slides.map((slide, idx) => (
            <SwiperSlide key={idx} className="relative h-full w-full">
              <Image
                src={slide.image}
                alt="Architecture"
                fill
                className="object-cover"
                priority={idx === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute bottom-24 left-12 right-12 text-white space-y-6">
                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  key={`title-${idx}`}
                  className="text-5xl font-bold leading-tight max-w-lg"
                >
                  {slide.title}
                </motion.h1>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  key={`subtitle-${idx}`}
                  className="text-lg text-white/80 max-w-md font-medium"
                >
                  {slide.subtitle}
                </motion.p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        <div className="absolute top-8 left-8 z-20">
          <Logo />
        </div>

        <style jsx global>{`
          .login-bullet {
            width: 30px !important;
            height: 4px !important;
            border-radius: 2px !important;
            background: rgba(255,255,255,0.4) !important;
            opacity: 1 !important;
            margin: 0 4px !important;
            transition: all 0.3s ease;
          }
          .swiper-pagination-bullet-active {
            background: white !important;
            width: 40px !important;
          }
          .swiper-pagination {
            bottom: 40px !important;
            left: 48px !important;
            text-align: left !important;
          }
        `}</style>
      </div>

      {/* Right Pan: Login Form */}
      <div className="flex items-center justify-center p-4 sm:p-6 lg:p-12 min-h-screen overflow-y-auto">
        <div className="w-full max-w-xl space-y-8 lg:space-y-12">

          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center mb-8">
            <div className="w-48">
              <Logo />
            </div>
          </div>

          <div className="space-y-8 lg:space-y-10 border border-gray-100 rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-12 shadow-sm lg:shadow-none bg-white">
            <div className="text-center space-y-2 lg:space-y-4">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-1">Welcome back!</h2>
              <p className="text-sm sm:text-base text-neutral-2 font-medium px-4 sm:px-0">Sign in to access your premium property dashboard</p>
            </div>

            <form className="space-y-5 lg:space-y-7" onSubmit={handleSubmit(onSubmit)}>
              <div className="space-y-2 lg:space-y-3">
                <Label htmlFor="email" className="text-neutral-1 font-bold text-sm lg:text-base">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register('email')}
                  className={`h-11 lg:h-12 bg-[#F2F2F2] border-none focus-visible:ring-1 focus-visible:ring-primary rounded-lg px-4 lg:px-6 text-neutral-1 placeholder:text-neutral-2 font-medium text-sm lg:text-base ${errors.email ? 'ring-2 ring-red-500' : ''}`}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs font-bold mt-1 ml-1 animate-in fade-in slide-in-from-top-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div className="space-y-2 lg:space-y-3 relative">
                <Label htmlFor="password" title="Forget Password?" className="text-neutral-1 font-bold text-sm lg:text-base flex justify-between w-full">
                  Password
                  <Link href="/forgot-password" className="text-xs text-neutral-2 hover:text-primary transition-colors">Forget Password?</Link>
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    {...register('password')}
                    className={`h-11 lg:h-12 bg-[#F2F2F2] border-none focus-visible:ring-1 focus-visible:ring-primary rounded-lg px-4 lg:px-6 pr-12 text-neutral-1 placeholder:text-neutral-2 font-medium text-sm lg:text-base ${errors.password ? 'ring-2 ring-red-500' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-2 hover:text-primary transition-colors cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-xs font-bold mt-1 ml-1 animate-in fade-in slide-in-from-top-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  className="border-neutral-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary size-4 sm:size-5"
                  onCheckedChange={() => {
                    // Manually handle checkbox if needed or rely on register
                  }}
                />
                <Label htmlFor="remember" className="text-xs sm:text-sm text-neutral-2 font-medium cursor-pointer">Remember Me</Label>
              </div>

              <Button type="submit" className="w-full h-11 lg:h-12 bg-primary hover:bg-primary/90 text-white font-bold rounded-lg text-base lg:text-lg flex items-center justify-center gap-2 transition-all active:scale-95 group">
                Login
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Button>

              <div className="flex items-center gap-4 py-1">
                <div className="h-px bg-gray-100 flex-1" />
                <span className="text-[10px] sm:text-xs text-neutral-2 font-medium uppercase tracking-widest whitespace-nowrap">Instant Login</span>
                <div className="h-px bg-gray-100 flex-1" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 ">
                <Button type="button" variant="outline" className="h-12 lg:h-14 border-gray-100 rounded-lg font-bold flex items-center gap-3 hover:bg-gray-50 text-xs sm:text-sm lg:text-base px-2">
                  <Image src="https://www.svgrepo.com/show/475656/google-color.svg" width={20} height={20} alt="Google" className="size-5" />
                  Continue With Google
                </Button>
                <Button type="button" variant="outline" className="h-12 lg:h-14 border-gray-100 rounded-lg font-bold flex items-center gap-3 hover:bg-gray-50 text-xs sm:text-sm lg:text-base px-2">
                  <Image src="https://www.svgrepo.com/show/475647/facebook-color.svg" width={20} height={20} alt="Facebook" className="size-5" />
                  Continue With Facebook
                </Button>
              </div>

              <div className="text-center pt-2 lg:pt-4">
                <p className="text-xs sm:text-sm lg:text-base text-neutral-2 font-medium">
                  Don&apos;t have any account? <Link href="/register" className="text-primary hover:underline font-bold">Register Now</Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
