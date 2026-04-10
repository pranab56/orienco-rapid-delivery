'use client';

import { cn } from '@/lib/utils';
import { motion, useInView } from 'framer-motion';
import { MapPin, Navigation } from 'lucide-react';
import { useRef, useState } from 'react';
import Image from 'next/image';

const SIZES = ['Quick', 'Standard', 'Large'] as const;
type PackageSize = (typeof SIZES)[number];

export default function Hero() {
  const [packageSize, setPackageSize] = useState<PackageSize>('Quick');
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  const stats = [
    { value: '95%', label: 'On-Time Delivery Rate' },
    { value: '10+', label: 'Deliveries Completed' },
    { value: '10m', label: 'Happy Customers' },
    { value: '99%', label: 'Support Satisfaction Rate' },
  ];

  return (
    <>
      <section ref={ref} className="relative min-h-[100vh] w-full flex items-center pt-32  z-20">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <Image
            src="/images/hero/image.png"
            alt="Delivery worker"
            width={1920}
            height={1080}
            quality={100}
            className="w-full h-auto object-contain"
          />
          {/* <div className="absolute inset-0 bg-gradient-to-r from-black/95 via-black/40 to-transparent z-10" /> */}
        </div>

        <div className="container mx-auto px-4 lg:px-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-20 items-center">
          {/* Content */}
          <div className="flex flex-col space-y-10 pb-20">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-white font-medium leading-[1.05] tracking-tight"
              style={{ fontSize: 'clamp(2.8rem, 6.5vw, 5rem)' }}
            >
              Doorstep delivery<br />
              you can count on.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-white/70 text-xl max-w-lg  font-normal"
            >
              Efficient rail freight services ensuring fast, safe, and reliable
              delivery of your product across every destination.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <button className="bg-[#EB5500] hover:bg-[#D44D00] text-white font-black px-12 py-3.5 rounded-sm text-lg transition-all cursor-pointer border-none active:scale-[0.98]">
                Get Started
              </button>
            </motion.div>
          </div>

          {/* Booking Card - Positioned to overhang the bottom edge */}
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={inView ? { opacity: 1, y: typeof window !== 'undefined' && window.innerWidth < 1024 ? 0 : 280, scale: 1 } : {}} // Pushing it down past the hero border only on LG
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-end relative z-50 pointer-events-auto mt-20 lg:mt-64"
          >
            <div className="bg-[#F2F2F2]/95 backdrop-blur-3xl rounded-xl p-5 w-full max-w-[450px] shadow-xl border border-white/20">
              <h3 className="text-gray-900 font-medium text-2xl mb-10 tracking-tight">Book a Delivery</h3>

              <div className="space-y-8">
                <div className="bg-black/[0.06] p-1.5 rounded-2xl flex gap-1 relative overflow-hidden">
                  {SIZES.map((size) => (
                    <button
                      key={size}
                      onClick={() => setPackageSize(size)}
                      className={cn(
                        'flex-1 py-4 px-2 rounded-xl text-[10px] font-black transition-all cursor-pointer tracking-wider uppercase relative z-10',
                        packageSize === size ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'
                      )}
                    >
                      {packageSize === size && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-white rounded-xl shadow-md z-[-1]"
                          transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                        />
                      )}
                      {size}
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                      <MapPin size={20} />
                    </div>
                    <input type="text" placeholder="Pickup location" className="w-full h-14 pl-14 pr-6 bg-black/[0.04] rounded-[22px] border-none outline-none focus:ring-2 focus:ring-primary/10 text-gray-900 placeholder:text-gray-400 text-sm font-normal transition-all shadow-inner" />
                  </div>
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-primary">
                      <Navigation size={20} className="rotate-45" />
                    </div>
                    <input type="text" placeholder="Drop-off location" className="w-full h-14 pl-14 pr-6 bg-black/[0.04] rounded-[22px] border-none outline-none focus:ring-2 focus:ring-primary/10 text-gray-900 placeholder:text-gray-400 text-sm font-normal transition-all shadow-inner" />
                  </div>
                </div>

                <button className="w-full bg-[#EB5500] hover:bg-[#D44D00] text-white font-black h-14  rounded-sm text-lg shadow-[0_15px_30px_-5px_rgba(235,85,0,0.4)] transition-all cursor-pointer border-none active:scale-[0.98]  tracking-widest">
                  Get Started
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section - Extra padding top to leave space for the card */}
      <section className="bg-white pt-20 pb-32 z-10">
        <div className="container mx-auto px-4 lg:px-10 space-y-20 lg:space-y-36">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-24 items-start">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-10"
            >
              <h2 className="text-gray-900 font-normal text-3xl md:text-4xl leading-[1.3] tracking-tight ">
                We are committed to making delivery simple, fast, and reliable for everyone.
              </h2>
              <p className="text-gray-400 font-normal text-xl leading-relaxed ">
                Our platform connects people with the right delivery options, ensuring every package reaches its destination safely and on time.
              </p>
            </motion.div>


          </div>

          <div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex flex-col justify-end "
            >
              <p className="text-gray-400 font-medium text-xl text-left mb-10 lg:text-right max-w-xl self-end leading-relaxed">
                With a focus on convenience, transparency, and user experience, <span className="text-gray-900 font-black">we aim to simplify how you send and receive items every day.</span>
              </p>
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 pt-16 md:pt-24 border-t border-gray-100">

              {stats.map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="space-y-4 border-l-4 border-gray-100 pl-10 h-28 flex flex-col justify-center first:border-none first:pl-0"
                >
                  <h3 className="text-3xl md:text-5xl font-medium text-gray-900 tracking-tighter tabular-nums">{stat.value}</h3>
                  <p className="text-gray-400 text-[10px] font-medium  tracking-widest leading-tight">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
