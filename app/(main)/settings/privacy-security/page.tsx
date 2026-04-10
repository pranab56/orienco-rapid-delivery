'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function PrivacySecurityPage() {
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pb-20 max-w-3xl">
      <h2 className="text-[28px] font-bold text-gray-800 mb-8 tracking-tight">Privacy Policy</h2>
      
      <div className="text-[12px] text-[#333333] space-y-6 leading-relaxed bg-[#EBEBEB]/80 font-medium p-4 rounded-xl">
        <h3 className="text-[#EB5500] font-bold">Orienco - B2B Order Management Platform</h3>

        <p>
            Your privacy is important to us. This Privacy Policy explains how <span className="text-[#EB5500] font-bold">Orienco</span> (&quot;App&quot;, &quot;Platform&quot;, &quot;we&quot;, &quot;our&quot;) collects, uses, stores, and protects your information when you use our B2B application and services.
        </p>

        <p className="font-bold">
            By accessing or using the App, you agree to the collection and use of information as described in this Privacy Policy.
        </p>

        <div className="space-y-4">
            <p>1. Information We Collect</p>
            <p>a. Personal & Business Information</p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 marker:text-gray-400">
                <li>Full name</li>
                <li>Phone number</li>
                <li>Email address</li>
                <li>Business name & address</li>
                <li>Account credentials</li>
                <li>Role type (Super Admin, Supplier, Grocery market)</li>
            </ul>

            <p>b. Usage & Technical Information</p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 marker:text-gray-400">
                <li>App activity (pages visited, actions taken)</li>
                <li>Order interactions and preferences</li>
                <li>Device information and log data</li>
                <li>Language and region settings</li>
            </ul>

            <p>c. Transaction & Order Information</p>
            <ul className="list-disc pl-5 space-y-2 text-gray-600 marker:text-gray-400">
                <li>Order details and quantities</li>
                <li>Pricing (regular & bulk)</li>
                <li>Discount progress and group order participation</li>
                <li>Payment method details (no sensitive payment data is stored by Orienco)</li>
                <li>Payment processing is handled securely through trusted third-party gateways.</li>
            </ul>

            <p className="font-bold text-[14px] pt-2 text-[#333333]">3. How We Use Your Information</p>
            <p className="mb-2">We use collected information to:</p>
            
            <ul className="space-y-4 pt-2">
                <li>Operate and maintain the platform</li>
                <li>Process and validate orders</li>
                <li>Enable group discounts and bulk pricing</li>
                <li>Send notifications (order updates, cut-offs, reminders)</li>
                <li>Generate reports and analytics</li>
                <li>Improve platform performance and user experience</li>
                <li>Ensure platform security and prevent misuse</li>
            </ul>
        </div>
      </div>
    </motion.div>
  );
}
