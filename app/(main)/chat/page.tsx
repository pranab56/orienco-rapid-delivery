'use client';

import React from 'react';
import { MessageSquare } from 'lucide-react';

export default function ChatIndexPage() {
    return (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-500 h-full">
            <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center mb-4">
               <MessageSquare size={32} className="text-gray-400" />
            </div>
            <p className="text-lg font-medium text-gray-400">Select a conversation to start chatting</p>
        </div>
    );
}
