'use client';

import React, { useState } from 'react';
import { Paperclip, Send, ChevronLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { chatListMock } from '../mock-data';

type Message = { id: number; text: string; sender: string; time: string };

// Mock DB for dynamic chat history mapping to user IDs
const INITIAL_MESSAGES: Record<string, Message[]> = {
    'david': [
        { id: 1, text: "Hi! I've reviewed the project requirements and prepared some initial design concepts.", sender: 'them', time: '10:15 AM' },
        { id: 2, text: "Great! Could you share the mockups?", sender: 'me', time: '10:20 AM' }
    ],
    'sarah': [
        { id: 1, text: "I can help with the repair task", sender: 'them', time: '10:30 AM' }
    ],
    'emma': [
        { id: 1, text: "When can we schedule a call?", sender: 'them', time: 'Yesterday' }
    ]
};

export default function ChatWindow() {
    const params = useParams();
    const activeChat = params.id as string;
    
    const [inputValue, setInputValue] = useState('');
    const [messagesMap, setMessagesMap] = useState<Record<string, Message[]>>(INITIAL_MESSAGES);

    const activeMessages = messagesMap[activeChat] || [];
    const activeUserData = chatListMock.find(c => c.id === activeChat);

    const handleSendMessage = () => {
        if (!inputValue.trim()) return;

        const newMsg = {
            id: Date.now(),
            text: inputValue.trim(),
            sender: 'me',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        setMessagesMap(prev => ({
            ...prev,
            [activeChat]: [...(prev[activeChat] || []), newMsg]
        }));
        setInputValue('');
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    // If invalid ID matching
    if (!activeUserData) {
        return <div className="p-8 text-gray-500">User not found</div>;
    }

    return (
        <div className="flex-1 flex flex-col min-w-0 h-full">
            {/* Chat Header */}
            <div className="h-[70px] md:h-[84px] p-4 md:p-6 border-b border-gray-200 flex items-center gap-3 md:gap-4">
                <Link href="/chat" className="md:hidden p-1 -ml-1 text-gray-500 hover:text-[#EB5500]">
                    <ChevronLeft size={24} />
                </Link>
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-300 flex-shrink-0 shadow-sm border border-black/5">
                    {activeUserData.avatar && (
                        <Image src={activeUserData.avatar} alt={activeUserData.name} fill className="object-cover" />
                    )}
                </div>
                <h2 className="font-medium text-[15px]">{activeUserData.name}</h2>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
                {activeMessages.map((msg) => (
                    msg.sender === 'them' ? (
                        <div key={msg.id} className="flex flex-col items-start max-w-[85%] md:max-w-[70%]">
                            <p className="text-[11px] text-gray-400 font-medium mb-1.5 ml-1">{activeUserData.name}</p>
                            <div className="bg-[#EBEBEB] border border-gray-300 rounded-xl rounded-tl-sm p-4 text-[13px] text-gray-800 leading-relaxed shadow-sm">
                                {msg.text}
                            </div>
                            <span className="text-[11px] text-gray-400 font-medium mt-1.5 ml-1">{msg.time}</span>
                        </div>
                    ) : (
                        <div key={msg.id} className="flex flex-col items-end self-end max-w-[85%] md:max-w-[70%] ml-auto">
                            <div className="bg-[#EB5500] text-white rounded-xl rounded-tr-sm p-4 text-[13px] leading-relaxed shadow-md shadow-orange-500/20">
                                {msg.text}
                            </div>
                            <span className="text-[11px] text-gray-400 font-medium mt-1.5 mr-1">{msg.time}</span>
                        </div>
                    )
                ))}
            </div>

            {/* Input Area */}
            <div className="p-4 md:p-6 border-t border-gray-200">
                <div className="relative border border-gray-300 rounded-xl overflow-hidden focus-within:border-[#EB5500] focus-within:bg-white transition-colors h-[120px] flex flex-col">
                    <textarea 
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="w-full flex-1 bg-transparent p-4 text-[14px] outline-none resize-none placeholder:text-gray-400"
                        placeholder="Type your message..."
                    ></textarea>
                    
                    <div className="p-3 flex justify-between items-center bg-transparent mt-auto">
                        <button className="flex items-center gap-2 border border-gray-200 text-gray-700 px-3 md:px-4 py-2 rounded-lg cursor-pointer text-xs font-semibold transition-colors hover:bg-gray-50">
                            <Paperclip size={14} />
                            <span className="hidden md:inline">Attach file</span>
                        </button>
                        
                        <button 
                            onClick={handleSendMessage}
                            className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-[#EB5500] transition-colors rounded-full hover:bg-gray-100 cursor-pointer"
                        >
                            <Send size={20} className="ml-1" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
