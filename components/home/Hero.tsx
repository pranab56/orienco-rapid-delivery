'use client';

import { updateBooking } from '@/features/parcel/bookingSlice';
import { cn } from '@/lib/utils';
import { motion, useInView } from 'framer-motion';
import { Loader, MapPin, Navigation } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function Hero() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const dispatch = useDispatch();
  const router = useRouter();

  const pickupRef = useRef<HTMLInputElement>(null);
  const dropRef = useRef<HTMLInputElement>(null);
  const [pickupData, setPickupData] = useState({ address: '', coordinates: [0, 0] });
  const [dropData, setDropData] = useState({ address: '', coordinates: [0, 0] });
  const [isLoading, setIsLoading] = useState(false);

  const user = useSelector((state: any) => state.auth?.user);

  useEffect(() => {
    if (typeof google === 'undefined') return;

    const options = {
      types: ['address'],
      componentRestrictions: { country: 'BD' }, // Assuming Bangladesh based on user example
    };

    if (pickupRef.current) {
      const autocomplete = new google.maps.places.Autocomplete(pickupRef.current, options);
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry && place.geometry.location) {
          setPickupData({
            address: place.formatted_address || '',
            coordinates: [place.geometry.location.lng(), place.geometry.location.lat()],
          });
        }
      });
    }

    if (dropRef.current) {
      const autocomplete = new google.maps.places.Autocomplete(dropRef.current, options);
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry && place.geometry.location) {
          setDropData({
            address: place.formatted_address || '',
            coordinates: [place.geometry.location.lng(), place.geometry.location.lat()],
          });
        }
      });
    }
  }, []);

  const handleGetStarted = () => {
    setIsLoading(true);

    setTimeout(() => {
      if (!user) {
        router.push('/login');
        setIsLoading(false);
        return;
      }

      dispatch(updateBooking({
        pickupLocation: pickupData,
        dropLocation: dropData,
        vehicleType: 'motorcycle',
      }));
      router.push('/booking');
      setIsLoading(false);
    }, 1000);
  };

  const stats = [
    { value: '95%', label: 'On-Time Delivery Rate' },
    { value: '10+', label: 'Deliveries Completed' },
    { value: '10m', label: 'Happy Customers' },
    { value: '99%', label: 'Support Satisfaction Rate' },
  ];

  return (
    <>
      <section ref={ref} className="relative min-h-[100vh] w-full flex items-center pt-16 md:pt-32 z-30">
        {/* Background Image */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-black lg:bg-transparent">
          {/* Mobile Background */}
          <div className="block lg:hidden absolute inset-0">
            <Image
              src="/images/hero/image.png"
              alt="Delivery worker"
              fill
              priority
              quality={100}
              className="object-cover object-top opacity-70"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/40 to-black/60 z-10" />
          </div>

          {/* Desktop Background (Original) */}
          <div className="hidden lg:block absolute inset-0">
            <Image
              src="/images/hero/image.png"
              alt="Delivery worker"
              width={1920}
              height={1080}
              quality={100}
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

        <div className="container mx-auto px-6 md:px-4 lg:px-10 w-full grid grid-cols-1 lg:grid-cols-2 gap-10 relative z-20 items-center">
          {/* Content */}
          <div className="flex flex-col space-y-6 md:space-y-10 pb-0 md:pb-20 pt-10 md:pt-0">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-white font-medium leading-[1.05] tracking-tight drop-shadow-sm lg:drop-shadow-none"
              style={{ fontSize: 'clamp(2rem, 6.5vw, 5rem)' }}
            >
              Doorstep delivery <br className="hidden sm:block" />
              you can count on.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              className="text-white/80 text-base md:text-xl max-w-lg font-normal leading-relaxed"
            >
              Efficient rail freight services ensuring fast, safe, and reliable
              delivery of your product across every destination.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
            >
              <button
                onClick={handleGetStarted}
                className="w-full md:w-auto bg-[#EB5500] hover:bg-[#D44D00] text-white font-medium px-8 md:px-12 py-3 md:py-3.5 rounded-sm text-base md:text-lg transition-all cursor-pointer border-none active:scale-[0.98]"
              >
                Get Started
              </button>
            </motion.div>
          </div>

          {/* Booking Card - Positioned to overhang the bottom edge */}
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={inView ? { opacity: 1, y: typeof window !== 'undefined' && window.innerWidth < 1024 ? 0 : 280, scale: 1 } : {}} // Pushing it down past the hero border only on LG
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="flex justify-center lg:justify-end relative z-50 pointer-events-auto mt-2 md:mt-20 lg:mt-60 mb-16 lg:mb-0"
          >
            <div className="bg-[#F2F2F2]/95 backdrop-blur-3xl rounded-xl p-6 pb-12 md:p-8 w-full max-w-[450px] shadow-2xl border border-white/20">
              <h3 className="text-gray-900 font-medium text-xl md:text-2xl mb-6 md:mb-5 tracking-tight">Book a Delivery</h3>

              <div className="space-y-5">
                <div className="space-y-4">
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#EB5500] transition-colors">
                      <MapPin size={20} />
                    </div>
                    <input
                      ref={pickupRef}
                      type="text"
                      placeholder="Pickup location"
                      className="w-full h-14 pl-14 pr-6 bg-black/[0.04] rounded-[22px] border-none outline-none focus:ring-2 focus:ring-[#EB5500]/10 text-gray-900 placeholder:text-gray-400 text-sm font-normal transition-all shadow-inner"
                    />
                  </div>
                  <div className="relative group">
                    <div className="absolute left-5 top-1/2 -translate-y-1/2 text-[#EB5500]">
                      <Navigation size={20} className="rotate-45" />
                    </div>
                    <input
                      ref={dropRef}
                      type="text"
                      placeholder="Drop-off location"
                      className="w-full h-14 pl-14 pr-6 bg-black/[0.04] rounded-[22px] border-none outline-none focus:ring-2 focus:ring-[#EB5500]/10 text-gray-900 placeholder:text-gray-400 text-sm font-normal transition-all shadow-inner"
                    />
                  </div>
                </div>

                <button
                  onClick={handleGetStarted}
                  disabled={isLoading}
                  className="w-full bg-[#EB5500] flex items-center justify-center gap-2 hover:bg-[#D44D00] text-white font-medium h-14  rounded-sm text-lg shadow-[0_15px_30px_-5px_rgba(235,85,0,0.4)] transition-all cursor-pointer border-none active:scale-[0.98]  tracking-widest disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading && <div className='flex justify-center items-center gap-2 animate-spin'><Loader size={16} /></div>} Get Started
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section - Extra padding top to leave space for the card */}
      <section className="bg-white pt-10 md:pt-20 pb-20 md:pb-32 z-10 relative">
        <div className="container mx-auto px-6 md:px-4 lg:px-10 space-y-20 lg:space-y-36">
          <div className="grid grid-cols-1 lg:grid-cols-1 gap-10 md:gap-24 items-start">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-10 sm:w-7/12 w-full"
            >
              <h2 className="text-gray-900 font-normal text-2xl md:text-4xl leading-[1.3] tracking-tight">
                We are committed to making delivery simple, fast, and reliable for everyone.
              </h2>
              <p className="text-gray-400 font-normal text-lg md:text-xl leading-relaxed">
                Our platform connects people with the right delivery options, ensuring every package reaches its destination safely and on time.
              </p>
            </motion.div>


          </div>

          <div className='w-full'>
            <div className='w-9/12 ml-auto'>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className=" "
              >
                <p className="text-gray-400 font-medium text-lg md:text-xl text-left">
                  With a focus on convenience, transparency, and user experience, <span className="text-gray-900 font-medium">we aim to simplify how you send and receive items every day.</span>
                </p>
              </motion.div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-16 pt-16 md:pt-10">

                {stats.map((stat, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className={cn(
                      "space-y-3 md:space-y-4 border-gray-100 pl-6 md:pl-10 h-24 md:h-28 flex flex-col justify-center border-l-4",
                      i === 0 && "border-l-0",
                      i === 2 && "max-md:border-l-0"
                    )}
                  >
                    <h3 className="text-3xl md:text-5xl font-medium text-gray-900">{stat.value}</h3>
                    <p className="text-gray-400 text-[10px] font-medium tracking-widest leading-tight uppercase">{stat.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
