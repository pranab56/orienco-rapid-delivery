'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { chatListMock } from './mock-data';

export default function ChatLayout({ children }: { children: React.ReactNode }) {
    const params = useParams();
    const activeChat = params?.id as string;
    const [search, setSearch] = useState('');

    return (
        <div className="min-h-screen pb-32 pt-28 md:pt-32 font-sans text-[#333333]">
            <div className="container mx-auto px-4">
                <h1 className="text-center font-bold text-2xl md:text-3xl mb-8">Chat</h1>

                {/* Main Chat Container */}
                <div className="flex flex-col md:flex-row h-[800px] border border-gray-200 rounded-xl overflow-hidden">

                    {/* Left Sidebar */}
                    <div className="w-full md:w-[320px] lg:w-[350px] border-r border-gray-200 flex flex-col flex-shrink-0">
                        {/* Search Bar */}
                        <div className="p-4 md:p-6 border-b border-gray-200">
                            <div className="relative">
                                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search conversations"
                                    className="w-full bg-[#E5E5E5] border border-transparent rounded-xl py-3 pl-11 pr-4 text-[14px] outline-none focus:bg-white focus:border-[#EB5500] transition-colors"
                                />
                            </div>
                        </div>

                        {/* Contacts List */}
                        <div className="flex-1 overflow-y-auto">
                            {chatListMock.map((chat) => (
                                <Link href={`/chat/${chat.id}`} key={chat.id}>
                                    <div
                                        className={`relative flex items-center p-4 md:p-5 cursor-pointer transition-colors border-b border-gray-200/50 ${activeChat === chat.id ? 'bg-[#F2DFCE]/60' : 'hover:bg-gray-200/50'}`}
                                    >
                                        {/* Active border indicator */}
                                        {activeChat === chat.id && (
                                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#EB5500]"></div>
                                        )}

                                        {/* Avatar */}
                                        <div className="relative w-[46px] h-[46px] rounded-full overflow-hidden bg-gray-300 flex-shrink-0">
                                            {chat.avatar ? (
                                                <Image src={chat.avatar} alt={chat.name} fill className="object-cover" />
                                            ) : null}
                                        </div>

                                        {/* Content */}
                                        <div className="ml-4 flex-1 overflow-hidden">
                                            <div className="flex justify-between items-start mb-1">
                                                <h3 className="font-bold text-[14px]">{chat.name}</h3>
                                                <span className="text-[11px] text-gray-500 font-medium">{chat.time}</span>
                                            </div>
                                            <p className="text-[13px] text-gray-500 truncate">{chat.message}</p>
                                        </div>

                                        {/* Unread Badge */}
                                        {chat.unread > 0 && (
                                            <div className="absolute right-5 top-10 flex items-center justify-center w-5 h-5 bg-[#EB5500] text-white text-[11px] font-bold rounded-full">
                                                {chat.unread}
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    {/* Right Chat Area is injected via children */}
                    <div className="flex-1 flex flex-col min-w-0">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
