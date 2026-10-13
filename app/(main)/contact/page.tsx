'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Phone, Mail, MapPin, Twitter, Instagram, Loader, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import GetInTouch from '@/components/home/GetInTouch';
import { useCreateContactMutation } from '@/features/contact/contactApi';
import toast from 'react-hot-toast';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

// Mock Discord Icon since lucide doesn't have it natively
const DiscordIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189z" />
    </svg>
);

const subjects = [
    'General Inquiry',
    'Delivery & Tracking',
    'Partnership',
    'Support',
];

export default function Contact() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        subjectIndex: 0,
        message: '',
    });

    const [touched, setTouched] = useState<Record<string, boolean>>({});
    const [errors, setErrors] = useState<Record<string, string>>({});

    const user = useSelector((state: any) => state.auth?.user);
    const router = useRouter();

    const [createContact, { isLoading }] = useCreateContactMutation();

    // Prefill form if user is already logged in
    useEffect(() => {
        if (user) {
            setFormData((prev) => {
                const names = (user.fullName || user.name || '').trim().split(' ');
                const userFirst = names[0] || '';
                const userLast = names.slice(1).join(' ') || '';
                return {
                    ...prev,
                    firstName: prev.firstName || userFirst,
                    lastName: prev.lastName || userLast,
                    email: prev.email || user.email || '',
                    phone: prev.phone || user.phone || '',
                };
            });
        }
    }, [user]);

    // Validation rule per field
    const validateField = (name: string, value: string): string => {
        const trimmed = value.trim();
        switch (name) {
            case 'firstName':
                if (!trimmed) return 'First name is required';
                if (trimmed.length < 2) return 'First name must be at least 2 characters';
                return '';
            case 'lastName':
                if (!trimmed) return 'Last name is required';
                if (trimmed.length < 2) return 'Last name must be at least 2 characters';
                return '';
            case 'email':
                if (!trimmed) return 'Email address is required';
                if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(trimmed)) {
                    return 'Please enter a valid email address';
                }
                return '';
            case 'phone': {
                if (!trimmed) return 'Phone number is required';
                const validPattern = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;
                const digitCount = (trimmed.replace(/\D/g, '')).length;
                if (!validPattern.test(trimmed) || digitCount < 7 || digitCount > 15) {
                    return 'Please enter a valid phone number (7-15 digits)';
                }
                return '';
            }
            case 'message':
                if (!trimmed) return 'Message is required';
                if (trimmed.length < 10) return 'Message must be at least 10 characters';
                return '';
            default:
                return '';
        }
    };

    const validateAll = (): boolean => {
        const newErrors: Record<string, string> = {};
        const allTouched: Record<string, boolean> = {
            firstName: true,
            lastName: true,
            email: true,
            phone: true,
            message: true,
        };
        setTouched(allTouched);

        const fields = ['firstName', 'lastName', 'email', 'phone', 'message'] as const;
        fields.forEach((field) => {
            const err = validateField(field, formData[field]);
            if (err) newErrors[field] = err;
        });

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        let processedValue = value;
        if (name === 'phone') {
            // Allow only valid phone characters: digits, +, spaces, hyphens, parentheses
            processedValue = value.replace(/[^0-9+\s\-()]/g, '');
        }

        setFormData((prev) => ({ ...prev, [name]: processedValue }));

        // Real-time validation if the field was already touched or has an existing error
        if (touched[name] || errors[name]) {
            const errorMsg = validateField(name, processedValue);
            setErrors((prev) => ({ ...prev, [name]: errorMsg }));
        }
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));
        const errorMsg = validateField(name, value);
        setErrors((prev) => ({ ...prev, [name]: errorMsg }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateAll()) {
            toast.error('Please fix the errors in the form before submitting.');
            return;
        }

        if (!user) {
            toast.error('Please log in first to send a message.');
            router.push('/login');
            return;
        }

        try {
            const payload = {
                firstName: formData.firstName.trim(),
                lastName: formData.lastName.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim(),
                subject: subjects[formData.subjectIndex] || 'General Inquiry',
                message: formData.message.trim(),
            };

            const response = await createContact(payload).unwrap();

            if (response?.success !== false) {
                toast.success(response?.message || 'Message sent successfully!');
                setFormData({
                    firstName: user?.fullName ? user.fullName.split(' ')[0] : '',
                    lastName: user?.fullName ? user.fullName.split(' ').slice(1).join(' ') : '',
                    email: user?.email || '',
                    phone: user?.phone || '',
                    subjectIndex: 0,
                    message: '',
                });
                setTouched({});
                setErrors({});
            }
        } catch (error: any) {
            toast.error(error?.data?.message || 'Failed to send message. Please try again.');
        }
    };

    return (
        <div className="bg-[#EAEAEA] min-h-screen">
            {/* Hero Section */}
            <div>
                <div className="relative w-full h-[350px] md:h-[600px] lg:h-[800px] overflow-hidden shadow-2xl shrink-0">
                    <Image
                        src="/images/contact.jpg"
                        alt="Customer Support Worker"
                        width={1920}
                        height={1080}
                        quality={100}
                        priority
                        className="w-full h-full object-cover"
                    />
                    {/* Overlay Gradient to match image readability */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/80 via-black/40 to-transparent" />

                    <div className="absolute inset-0 p-6 md:p-14 lg:p-24 flex flex-col justify-center">
                        <motion.h1
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.6 }}
                            className="text-white font-medium text-3xl md:text-5xl lg:text-[5rem] leading-[1.2] md:leading-[1.3] tracking-tight max-w-[900px]"
                        >
                            Get in Touch with Us <br className="hidden md:block" /> for Any Questions or <br className="hidden md:block" /> Support.
                        </motion.h1>
                    </div>
                </div>
            </div>

            {/* Main Form Section */}
            <div className="container mx-auto px-4 lg:px-10 pt-16 md:pt-24 shrink-0">
                <div className="mx-auto bg-[#F6F6F6] rounded-xl shadow-[0_10px_40px_rgba(0,0,0,0.06)] border border-white p-2.5 overflow-hidden flex flex-col lg:flex-row min-h-[750px]">

                    {/* Left Side: Contact Information */}
                    <div className="relative w-full lg:w-[45%] bg-gradient-to-br from-[#EFEBE9] to-[#F1D7CB] rounded-xl p-8 md:p-14 overflow-hidden flex flex-col justify-between group cursor-default">
                        {/* Background Decorative Graphic Circles */}
                        <div className="absolute -bottom-24 -right-24 w-[250px] md:w-[350px] h-[250px] md:h-[350px] rounded-full bg-white/20 blur-3xl z-0" />
                        <div className="absolute -bottom-40 -right-10 w-[400px] md:w-[500px] h-[400px] md:h-[500px] rounded-full border-[30px] md:border-[50px] border-white/10 z-0 transition-transform duration-1000 group-hover:scale-105" />
                        <div className="absolute top-[50%] right-[-15%] w-[200px] md:w-[250px] h-[200px] md:h-[250px] rounded-full border-[18px] md:border-[24px] border-white/10 z-0 transition-transform duration-1000 group-hover:-rotate-12" />

                        {/* Headers */}
                        <div className="relative z-10 space-y-3">
                            <h3 className="text-[#EB5500] font-medium text-2xl md:text-[32px] tracking-tight">Contact Information</h3>
                            <p className="text-gray-600 text-sm md:text-[16px] font-medium font-sans">Say something to start a live chat!</p>
                        </div>

                        {/* List Array Info */}
                        <div className="relative z-10 space-y-8 md:space-y-12 mt-12 md:mt-24 mb-16 md:mb-24 text-gray-800">
                            <div className="flex items-center gap-5 md:gap-6 group/item cursor-pointer">
                                <Phone className="text-gray-900 group-hover/item:text-[#EB5500] transition-colors" size={20} />
                                <span className="font-medium text-sm md:text-[15px]">+237 6 98 77 19 68</span>
                            </div>
                            <div className="flex items-center gap-5 md:gap-6 group/item cursor-pointer">
                                <Mail className="text-gray-900 group-hover/item:text-[#EB5500] transition-colors" size={20} />
                                <span className="font-medium text-sm md:text-[15px]">support@oriencorapiddelivery.com</span>
                            </div>
                            <div className="flex items-start gap-5 md:gap-6 group/item cursor-pointer">
                                <MapPin className="text-gray-900 flex-shrink-0 mt-0.5 group-hover/item:text-[#EB5500] transition-colors" size={20} />
                                <span className="font-medium text-sm md:text-[15px] leading-relaxed max-w-[250px]">
                                    Opposite Opium, Mboa Market Shopping Centre Douala, Cameroon
                                </span>
                            </div>
                        </div>

                        {/* Social Icons Bottom Section */}
                        <div className="relative z-10 flex gap-4 md:gap-5 mt-auto">
                            <a href="#" aria-label="Twitter" className="w-9 h-9 md:w-[42px] md:h-[42px] rounded-full bg-black flex items-center justify-center text-white hover:bg-[#EB5500] hover:scale-110 transition-all duration-300 shadow-xl shadow-black/10">
                                <Twitter size={15} fill="currentColor" stroke="none" />
                            </a>
                            <a href="#" aria-label="Instagram" className="w-9 h-9 md:w-[42px] md:h-[42px] rounded-full bg-black flex items-center justify-center text-white hover:bg-[#EB5500] hover:scale-110 transition-all duration-300 shadow-xl shadow-black/10">
                                <Instagram size={17} />
                            </a>
                            <a href="#" aria-label="Discord" className="w-9 h-9 md:w-[42px] md:h-[42px] rounded-full bg-black flex items-center justify-center text-white hover:bg-[#EB5500] hover:scale-110 transition-all duration-300 shadow-xl shadow-black/10">
                                <DiscordIcon />
                            </a>
                        </div>
                    </div>

                    {/* Right Side: Form View */}
                    <div className="w-full lg:w-[55%] p-8 md:p-12 lg:p-16 xl:pr-24 flex flex-col justify-between">
                        <form onSubmit={handleSubmit} noValidate className="flex flex-col h-full justify-between">

                            {/* Row 1 Text Fields: First Name & Last Name */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10 mb-4">
                                <div className="flex flex-col group">
                                    <label htmlFor="firstName" className="text-[12px] font-medium text-gray-600 mb-1.5 transition-colors group-focus-within:text-[#EB5500]">
                                        First Name <span className="text-[#EB5500]">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="firstName"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="John"
                                        className={`w-full bg-transparent border-b-2 py-1.5 text-sm font-medium text-gray-900 outline-none transition-colors placeholder:text-gray-400 ${
                                            errors.firstName ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#EB5500]'
                                        }`}
                                    />
                                    <div className="min-h-[20px] mt-1">
                                        {errors.firstName && (
                                            <span className="text-[11px] font-medium text-red-500 tracking-wide flex items-center gap-1">
                                                <AlertCircle size={12} className="shrink-0" />
                                                {errors.firstName}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col group">
                                    <label htmlFor="lastName" className="text-[12px] font-medium text-gray-600 mb-1.5 transition-colors group-focus-within:text-[#EB5500]">
                                        Last Name <span className="text-[#EB5500]">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="lastName"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="Doe"
                                        className={`w-full bg-transparent border-b-2 py-1.5 text-sm font-semibold text-gray-900 outline-none transition-colors placeholder:text-gray-400 ${
                                            errors.lastName ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#EB5500]'
                                        }`}
                                    />
                                    <div className="min-h-[20px] mt-1">
                                        {errors.lastName && (
                                            <span className="text-[11px] font-medium text-red-500 tracking-wide flex items-center gap-1">
                                                <AlertCircle size={12} className="shrink-0" />
                                                {errors.lastName}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Row 2 Text Fields: Email & Phone Number */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-10 mb-4">
                                <div className="flex flex-col group">
                                    <label htmlFor="email" className="text-[12px] font-medium text-gray-600 mb-1.5 transition-colors group-focus-within:text-[#EB5500]">
                                        Email <span className="text-[#EB5500]">*</span>
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        autoComplete="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="demo@gmail.com"
                                        className={`w-full bg-transparent border-b-2 py-1.5 text-sm font-medium text-gray-900 outline-none transition-colors placeholder:text-gray-400 ${
                                            errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#EB5500]'
                                        }`}
                                    />
                                    <div className="min-h-[20px] mt-1">
                                        {errors.email && (
                                            <span className="text-[11px] font-medium text-red-500 tracking-wide flex items-center gap-1">
                                                <AlertCircle size={12} className="shrink-0" />
                                                {errors.email}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="flex flex-col group">
                                    <label htmlFor="phone" className="text-[12px] font-medium text-gray-600 mb-1.5 transition-colors group-focus-within:text-[#EB5500]">
                                        Phone Number <span className="text-[#EB5500]">*</span>
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        inputMode="tel"
                                        autoComplete="tel"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        placeholder="+1 012 3456 789"
                                        className={`w-full bg-transparent border-b-2 py-1.5 text-sm font-semibold text-gray-900 outline-none transition-colors placeholder:text-gray-400 ${
                                            errors.phone ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#EB5500]'
                                        }`}
                                    />
                                    <div className="min-h-[20px] mt-1">
                                        {errors.phone && (
                                            <span className="text-[11px] font-medium text-red-500 tracking-wide flex items-center gap-1">
                                                <AlertCircle size={12} className="shrink-0" />
                                                {errors.phone}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Subject Radio Group */}
                            <div className="mb-6">
                                <label className="text-[13px] font-medium text-gray-900 mb-3 block">
                                    Select Subject <span className="text-[#EB5500]">*</span>
                                </label>
                                <div className="flex items-center flex-nowrap overflow-x-auto sm:overflow-visible gap-3 sm:gap-4 md:gap-5 lg:gap-6 pb-1 scrollbar-none">
                                    {subjects.map((subject, idx) => {
                                        const isChecked = formData.subjectIndex === idx;
                                        return (
                                            <label
                                                key={idx}
                                                htmlFor={`subject-${idx}`}
                                                className="flex items-center gap-2 cursor-pointer group hover:opacity-85 transition-opacity select-none whitespace-nowrap shrink-0"
                                            >
                                                <div className={`relative flex items-center justify-center w-4 h-4 rounded-full border-2 transition-colors shrink-0 ${
                                                    isChecked ? 'border-[#EB5500]' : 'border-gray-300 group-hover:border-[#EB5500]'
                                                }`}>
                                                    <input
                                                        type="radio"
                                                        id={`subject-${idx}`}
                                                        name="subject"
                                                        value={idx}
                                                        checked={isChecked}
                                                        onChange={() => setFormData((prev) => ({ ...prev, subjectIndex: idx }))}
                                                        className="peer sr-only"
                                                    />
                                                    <div className={`w-2 h-2 rounded-full bg-[#EB5500] transition-transform duration-200 ${
                                                        isChecked ? 'scale-100' : 'scale-0'
                                                    }`} />
                                                </div>
                                                <span className={`text-[12px] sm:text-[13px] whitespace-nowrap transition-colors ${
                                                    isChecked ? 'text-gray-900 font-semibold' : 'text-gray-600 font-medium'
                                                }`}>
                                                    {subject}
                                                </span>
                                            </label>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Multiline Message Block */}
                            <div className="flex flex-col mb-6 group">
                                <div className="flex items-center justify-between mb-1.5">
                                    <label htmlFor="message" className="text-[12px] font-medium text-gray-600 transition-colors group-focus-within:text-[#EB5500]">
                                        Message <span className="text-[#EB5500]">*</span>
                                    </label>
                                    <span className="text-[11px] text-gray-400 font-normal">
                                        {formData.message.length}/1000 characters (min 10)
                                    </span>
                                </div>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={4}
                                    maxLength={1000}
                                    placeholder="Write your message here..."
                                    value={formData.message}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    className={`w-full bg-transparent border-b-2 py-2 text-sm font-medium text-gray-900 placeholder:text-gray-400 outline-none transition-colors resize-y min-h-[90px] leading-relaxed ${
                                        errors.message ? 'border-red-500 focus:border-red-500' : 'border-gray-300 focus:border-[#EB5500]'
                                    }`}
                                />
                                <div className="min-h-[20px] mt-1">
                                    {errors.message && (
                                        <span className="text-[11px] font-medium text-red-500 tracking-wide flex items-center gap-1">
                                            <AlertCircle size={12} className="shrink-0" />
                                            {errors.message}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Submit CTA Right aligned */}
                            <div className="flex flex-col items-center sm:items-end mt-2 pt-2">
                                <motion.button
                                    whileHover={{ scale: isLoading ? 1 : 1.02 }}
                                    whileTap={{ scale: isLoading ? 1 : 0.98 }}
                                    type="submit"
                                    disabled={isLoading}
                                    className="bg-[#EB5500] flex items-center justify-center gap-2 hover:bg-[#D44D00] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer text-white text-[15px] font-semibold px-10 py-3.5 rounded-lg transition-colors shadow-lg shadow-orange-500/30 w-full sm:min-w-[200px] sm:w-auto"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader size={16} className="animate-spin" />
                                            <span>Sending...</span>
                                        </>
                                    ) : (
                                        'Send Message'
                                    )}
                                </motion.button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
            <GetInTouch />
        </div>
    );
}
