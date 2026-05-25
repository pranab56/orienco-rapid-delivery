'use client';

import { useCreateFeedBackMutation } from '@/features/feedback/feedbackApi';
import { useCreateChatMutation } from '@/features/messages/chatApi';
import { useCancelParcelMutation, useSingleParcelDetailsQuery } from '@/features/parcel/parcelApi';
import { baseURL } from '@/utils/BaseURL';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  Loader,
  MessageSquare, Star,
  X
} from 'lucide-react';
import moment from 'moment';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';

function OrderDetailContent() {
  const params = useParams();
  const orderId = params.id as string;

  const router = useRouter();

  const { data: response, isLoading: parcelDetailsLoading, refetch } = useSingleParcelDetailsQuery(orderId);
  const parcel = response?.data;

  const { token } = useSelector((state: any) => state.auth);

  const [createChat, { isLoading: isCreatingChat }] = useCreateChatMutation();
  const [createFeedback, { isLoading: isSubmittingFeedback }] = useCreateFeedBackMutation();
  const [cancelParcel, { isLoading: isCancelling }] = useCancelParcelMutation();

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const mapRef = useRef<HTMLDivElement>(null);
  const googleMapRef = useRef<google.maps.Map | null>(null);

  const [driverLocation, setDriverLocation] = useState<{ lat: number, lng: number } | null>(null);
  const driverMarkerRef = useRef<google.maps.Marker | null>(null);

  // Connect to /tracking socket namespace and track the parcel driver in real-time
  useEffect(() => {
    if (!orderId || !token) return;

    const socketInstance = io(`${baseURL}/tracking`, {
      auth: { token },
      query: { token },
      extraHeaders: { token },
      transports: ['websocket', 'polling']
    });

    socketInstance.on('connect', () => {
      console.log('Connected to tracking socket. Emitting user::track-parcel for:', orderId);
      socketInstance.emit('user::track-parcel', orderId);
    });

    socketInstance.on('location::updated', (data: any) => {
      console.log('Live location update received:', data);
      if (data && typeof data.lat === 'number' && typeof data.lng === 'number') {
        setDriverLocation({ lat: data.lat, lng: data.lng });
      }
    });

    socketInstance.on('disconnect', () => {
      console.log('Disconnected from tracking socket');
    });

    return () => {
      console.log('Leaving tracking page. Emitting user::untrack-parcel for:', orderId);
      socketInstance.emit('user::untrack-parcel', orderId);
      socketInstance.disconnect();

      if (driverMarkerRef.current) {
        driverMarkerRef.current.setMap(null);
        driverMarkerRef.current = null;
      }
    };
  }, [orderId, token]);

  // Handle Live Driver Location Marker updates on Google Maps
  useEffect(() => {
    if (typeof google === 'undefined' || !googleMapRef.current || !driverLocation) return;

    const position = { lat: driverLocation.lat, lng: driverLocation.lng };

    if (!driverMarkerRef.current) {
      driverMarkerRef.current = new google.maps.Marker({
        position,
        map: googleMapRef.current,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: "#10B981",
          fillOpacity: 1,
          strokeWeight: 3,
          strokeColor: "#FFFFFF",
        },
        title: "Driver Live Location"
      });
    } else {
      driverMarkerRef.current.setPosition(position);
    }

    googleMapRef.current.panTo(position);
  }, [driverLocation]);

  useEffect(() => {
    if (typeof google === 'undefined' || !mapRef.current || !parcel) return;

    const pickup = { lat: parcel.pickupLocation.coordinates[1], lng: parcel.pickupLocation.coordinates[0] };
    const drop = { lat: parcel.dropLocation.coordinates[1], lng: parcel.dropLocation.coordinates[0] };

    googleMapRef.current = new google.maps.Map(mapRef.current, {
      center: pickup,
      zoom: 12,
      disableDefaultUI: true,
      zoomControl: true,
    });

    const directionsService = new google.maps.DirectionsService();
    const directionsRenderer = new google.maps.DirectionsRenderer({
      map: googleMapRef.current,
      suppressMarkers: true,
      polylineOptions: {
        strokeColor: "#EB5500",
        strokeWeight: 5,
      }
    });

    directionsService.route({
      origin: pickup,
      destination: drop,
      travelMode: google.maps.TravelMode.DRIVING,
    }, (result, status) => {
      if (status === google.maps.DirectionsStatus.OK) {
        directionsRenderer.setDirections(result);
      }
    });

    new google.maps.Marker({
      position: pickup,
      map: googleMapRef.current,
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

    new google.maps.Marker({
      position: drop,
      map: googleMapRef.current,
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
  }, [parcel]);

  const handleCancelParcel = async () => {
    try {
      const result = await cancelParcel(orderId).unwrap();
      toast.success(result?.message || "Parcel cancelled successfully!");
      setShowCancelModal(false);
      refetch(); // Refresh the parcel details
      router.push('/orders'); // Optional: redirect to orders page
    } catch (error: any) {
      console.error("Failed to cancel parcel", error);
      toast.error(error?.data?.message || "Failed to cancel parcel.");
    }
  };

  const handleMessageClick = async () => {
    if (!parcel?.driver?._id) return;
    try {
      const res = await createChat({ participant: parcel.driver._id }).unwrap();
      const chatId = res?.data?._id || res?._id;
      if (chatId) {
        router.push(`/chat/${chatId}`);
      } else {
        console.error("Chat ID not returned in response", res);
      }
    } catch (error) {
      console.error("Failed to create chat", error);
      toast.error("Failed to start chat.");
    }
  };

  const handleSubmitReview = async () => {
    if (rating === 0) {
      toast.error("Please provide a rating");
      return;
    }

    try {
      const response = await createFeedback({
        parcelId: orderId,
        rating,
        comment
      }).unwrap();
      toast.success(response?.message || "Review submitted successfully!");
      router.push("/");
      setShowReviewModal(false);
      setRating(0);
      setComment('');
    } catch (error: any) {
      console.error("Failed to submit review", error);
      toast.error(error?.data?.message || "Failed to submit review.");
    }
  };

  if (parcelDetailsLoading) {
    return (
      <div className="container mx-auto px-4 max-w-4xl flex items-center justify-center py-20">
        <Loader className="animate-spin text-[#EB5500]" size={40} />
      </div>
    );
  }

  if (!parcel) {
    return (
      <div className="container mx-auto px-4 max-w-4xl text-center py-20 font-medium">
        Order not found.
      </div>
    );
  }

  const isCompleted = parcel.status === 'DELIVERED';
  const isPending = parcel.status === 'PENDING';
  const isCancelled = parcel.status === 'CANCELLED';

  // Status mapping for tracker
  const statusSteps = [
    { key: 'PENDING', title: 'Request Sent', date: moment(parcel.createdAt).format('DD MMM YYYY • HH:mm') },
    { key: 'ACCEPTED', title: 'Accepted', date: parcel.acceptedAt ? moment(parcel.acceptedAt).format('DD MMM YYYY • HH:mm') : '' },
    { key: 'PICKED_UP', title: 'Picked Up', date: parcel.pickedUpAt ? moment(parcel.pickedUpAt).format('DD MMM YYYY • HH:mm') : '' },
    { key: 'IN_TRANSIT', title: 'In-transit', date: parcel.pickedUpAt ? moment(parcel.pickedUpAt).format('DD MMM YYYY • HH:mm') : '' },
    { key: 'DELIVERED', title: 'Delivered', date: parcel.deliveredAt ? moment(parcel.deliveredAt).format('DD MMM YYYY • HH:mm') : '' },
  ];

  const currentStatusIndex = statusSteps.findIndex(s => s.key === parcel.status);
  const activeStepIndex = currentStatusIndex === -1 ? 0 : currentStatusIndex;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="container mx-auto px-4 max-w-4xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-4 mb-6 md:mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/orders"
            className="w-9 h-9 md:w-10 md:h-10 rounded-full border border-gray-400/50 flex flex-shrink-0 items-center justify-center hover:bg-gray-200 transition-colors"
          >
            <ChevronLeft size={18} className="text-gray-800" />
          </Link>
          <h1 className="font-medium text-xl md:text-2xl">#{parcel._id.slice(-8).toUpperCase()}</h1>
        </div>

        {/* Cancel Button - Only shows when status is PENDING */}
        {isPending && !isCancelled && (
          <button
            onClick={() => setShowCancelModal(true)}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 cursor-pointer text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
          >
            <X size={16} />
            Cancel Order
          </button>
        )}
      </div>

      {/* Map Display Box */}
      <div className="relative w-full h-[300px] md:h-[400px] mb-10 rounded-xl overflow-hidden shadow-lg border border-black/5 bg-[#EAEAEA]">
        <div ref={mapRef} className="w-full h-full" />
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-[#EB5500]/20 z-10">
          <p className="text-[10px] uppercase font-bold text-gray-400">Distance</p>
          <p className="text-[#EB5500] font-bold text-sm">{parcel.distance.toFixed(2)} KM</p>
          <p className="text-[10px] text-gray-500 font-medium">{parcel.duration}</p>
        </div>
      </div>

      {/* Tracker Box */}
      <h2 className="font-medium text-base mb-4">Track your order</h2>
      <div className="bg-[#F3F3F3] rounded-2xl p-6 md:p-10 pt-8 pb-8 md:pt-12 md:pb-12 mb-8 shadow-sm border border-black/5">
        <div className="relative pl-9 md:pl-11.5 space-y-8 md:space-y-12">
          <div className="absolute left-[10px] top-[14px] -bottom-[6px] border-l-2 border-dashed border-gray-300 z-0"></div>
          <div
            className="absolute left-[10px] top-[14px] border-l-2 border-dashed border-[#10B981] z-0 transition-all duration-1000"
            style={{ height: `${(activeStepIndex / (statusSteps.length - 1)) * 100}%` }}
          ></div>

          {statusSteps.map((step, index) => {
            const isStepCompleted = index <= activeStepIndex;
            return (
              <div key={step.key} className={`relative z-10 flex flex-col ${!isStepCompleted ? 'opacity-80' : ''}`}>
                <div className="absolute -left-9 md:-left-12 flex items-start justify-center pt-0.5">
                  {isStepCompleted ? (
                    <CheckCircle2 fill="white" className="text-[#10B981] bg-white rounded-full size-[22px] md:size-[26px]" />
                  ) : (
                    <CheckCircle2 className="text-gray-400 bg-white rounded-full ml-0.5 size-[18px] md:size-[22px]" strokeWidth={1.5} />
                  )}
                </div>
                <h3 className="font-medium text-[13px] md:text-[15px] mb-1">{step.title}</h3>
                <p className="text-gray-400 text-[10px] md:text-xs font-normal">{step.date || 'Pending...'}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Rider Info Area */}
      {parcel.driver ? (
        <div className="bg-[#E5E5E5] rounded-2xl p-5 md:p-8 shadow-sm border border-black/5">
          <div className="flex justify-between items-start flex-wrap gap-4 mb-6 md:mb-8">
            <div className="flex items-center gap-4">
              <div className="relative w-12 h-12 md:w-16 md:h-16 rounded-full overflow-hidden border-2 border-white shadow-sm">
                <Image
                  src={parcel.driver.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"}
                  alt={parcel.driver.fullName}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-[10px] uppercase font-medium text-gray-400 mb-1 tracking-wider">Rider Info</p>
                <h3 className="text-lg md:text-2xl font-medium">{parcel.driver.fullName}</h3>
              </div>
            </div>
            <div className="flex items-center gap-1.5 bg-[#D44D00]/10 px-3 md:px-4 py-1.5 md:py-2 rounded-full h-fit flex-shrink-0">
              <Star fill="#F59E0B" className="text-[#F59E0B]" size={14} />
              <span className="font-medium text-xs md:text-sm text-[#EB5500]">{parcel.driver.driverInfo?.averageRating || parcel.driver.averageRating || '0.0'}</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
            {!isCompleted ? (
              <button
                onClick={handleMessageClick}
                disabled={isCreatingChat}
                className="flex-1 bg-transparent h-12 border-2 border-gray-300 hover:border-[#EB5500] text-[#EB5500] py-3 flex justify-center items-center gap-2 font-medium rounded-sm cursor-pointer transition-all disabled:opacity-50"
              >
                {isCreatingChat ? <Loader size={18} className="animate-spin" /> : <MessageSquare size={18} />}
                Message
              </button>
            ) : (
              <button
                onClick={() => setShowReviewModal(true)}
                className="flex-1 bg-transparent h-12 border-2 border-gray-300 hover:border-[#EB5500] text-[#EB5500] py-3 flex justify-center items-center gap-2 font-medium rounded-sm cursor-pointer transition-all"
              >
                Give Review
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-white/50 backdrop-blur-md rounded-2xl p-10 text-center border border-orange-100 shadow-xl shadow-orange-500/5 relative overflow-hidden">
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            <motion.div
              animate={{ scale: [1, 2.5], opacity: [0.5, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut" }}
              className="w-32 h-32 rounded-full border-2 border-orange-100"
            />
            <motion.div
              animate={{ scale: [1, 2.5], opacity: [0.5, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut", delay: 0.8 }}
              className="w-32 h-32 rounded-full border-2 border-orange-100"
            />
            <motion.div
              animate={{ scale: [1, 2.5], opacity: [0.5, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeOut", delay: 1.6 }}
              className="w-32 h-32 rounded-full border-2 border-orange-100"
            />
          </div>

          <div className="relative z-10 flex flex-col items-center">
            <h3 className="text-gray-900 font-bold text-lg mb-2">Finding a Rider</h3>
            <p className="text-gray-500 font-medium text-sm max-w-[260px]">
              Searching for the best rider nearby to handle your delivery...
            </p>

            <div className="mt-8 flex gap-1.5 justify-center">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.3, 1, 0.3], scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  className="w-2 h-2 bg-[#EB5500] rounded-full"
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Cancel Confirmation Modal */}
      <AnimatePresence>
        {showCancelModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white w-full max-w-md rounded-2xl p-6 relative"
            >
              <button
                onClick={() => setShowCancelModal(false)}
                className="absolute right-4 top-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                  <AlertTriangle size={32} className="text-red-500" />
                </div>

                <h3 className="font-semibold  text-xl text-gray-900 mb-2">
                  Cancel Order?
                </h3>

                <p className="text-gray-500 text-sm mb-6">
                  Are you sure you want to cancel this order? This action cannot be undone.
                </p>

                <div className="flex gap-3 w-full">
                  <button
                    onClick={() => setShowCancelModal(false)}
                    className="flex-1 px-4 py-2.5 border border-gray-300 cursor-pointer rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                  >
                    No, Keep It
                  </button>
                  <button
                    onClick={handleCancelParcel}
                    disabled={isCancelling}
                    className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isCancelling ? <Loader size={18} className="animate-spin" /> : 'Yes, Cancel Order'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Review Modal */}
      <AnimatePresence>
        {showReviewModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#EFEFEF] w-full max-w-md rounded-[32px] p-6 md:p-10 relative"
            >
              <button
                onClick={() => setShowReviewModal(false)}
                className="absolute right-4 top-4 bg-[#EF4444] text-white rounded-full p-1 hover:scale-110 transition-transform z-10"
              >
                <X size={18} strokeWidth={3} />
              </button>

              <div className="pt-8 flex flex-col items-center text-center">
                <h3 className="font-medium text-[#EB5500] text-lg mb-4">How was the driver?</h3>
                <div className="flex gap-2 mb-8">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="focus:outline-none hover:scale-110 transition-transform"
                    >
                      <Star
                        size={32}
                        fill={rating >= star ? '#EAB308' : 'none'}
                        className={rating >= star ? 'text-[#EAB308]' : 'text-gray-400'}
                      />
                    </button>
                  ))}
                </div>
                <div className="w-full text-left flex flex-col">
                  <label className="text-[12px] font-medium text-gray-600 mb-2">Description</label>
                  <textarea
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-transparent border border-gray-300 rounded-xl p-3 text-sm focus:border-[#EB5500] outline-none resize-none placeholder:text-gray-400 focus:bg-white transition-colors"
                    placeholder="Please enter your message"
                  ></textarea>
                </div>
                <button
                  onClick={handleSubmitReview}
                  disabled={isSubmittingFeedback}
                  className="w-full mt-8 flex justify-center items-center gap-2 bg-[#EB5500] cursor-pointer hover:bg-[#D44D00] disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3.5 rounded-xl transition-colors"
                >
                  {isSubmittingFeedback ? <Loader size={20} className="animate-spin" /> : 'Submit'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function OrderDetail() {
  return (
    <div className="min-h-screen pb-16 pt-24 md:pb-32 md:pt-32 font-sans text-[#333333]">
      <Suspense fallback={<div className="container mx-auto px-4 max-w-4xl text-center py-20 font-medium">Loading Order Details...</div>}>
        <OrderDetailContent />
      </Suspense>
    </div>
  );
}