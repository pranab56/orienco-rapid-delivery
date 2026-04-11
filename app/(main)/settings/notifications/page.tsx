'use client';

import React, { useState } from 'react';
import { Megaphone } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotificationsPage() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [desktopAlerts, setDesktopAlerts] = useState(false);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pb-20">
      <h2 className="text-[28px] font-medium text-gray-800 mb-8 tracking-tight">Notification Preferences</h2>

      <div className="bg-[#EBEBEB] border border-gray-200 shadow-sm rounded-xl p-8 max-w-2xl">
        <div className="flex items-center gap-2 mb-8">
            <Megaphone size={20} className="text-[#EB5500]" />
            <h3 className="font-medium text-[16px] text-gray-800">Communication Channels</h3>
        </div>

        <div className="space-y-6">
            {/* Email Alerts Toggle */}
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="font-semibold text-[13px] text-gray-800">Email Alerts</h4>
                    <p className="text-[11px] text-gray-500 mt-1">Instant updates about your account activity sent to your inbox.</p>
                </div>
                <button 
                    onClick={() => setEmailAlerts(!emailAlerts)}
                    className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${emailAlerts ? 'bg-[#EB5500]' : 'bg-gray-300'}`}
                >
                    <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${emailAlerts ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
            </div>
            
            {/* Desktop Notifications Toggle */}
            <div className="flex items-center justify-between">
                <div>
                    <h4 className="font-semibold text-[13px] text-gray-800">Desktop Notifications</h4>
                    <p className="text-[11px] text-gray-500 mt-1">Get notified directly on your browser while working.</p>
                </div>
                <button 
                    onClick={() => setDesktopAlerts(!desktopAlerts)}
                    className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${desktopAlerts ? 'bg-[#EB5500]' : 'bg-gray-300'}`}
                >
                    <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${desktopAlerts ? 'translate-x-5' : 'translate-x-0'}`} />
                </button>
            </div>
        </div>

        <div className="mt-8 border-t border-gray-200/60 pt-8">
            <button className="bg-[#EB5500] hover:bg-[#D44D00] text-white px-10 py-3 rounded-lg font-medium text-sm transition-colors cursor-pointer shadow-sm">
                Save
            </button>
        </div>
      </div>
    </motion.div>
  );
}
