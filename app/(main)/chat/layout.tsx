'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useMyChatQuery } from '@/features/messages/chatApi';
import { useSelector } from 'react-redux';
import { Loader } from 'lucide-react';
import { useEffect } from 'react';

export default function ChatLayout({ children }: { children: React.ReactNode }) {
    const params = useParams();
    const activeChat = params?.id as string;
    const [search, setSearch] = useState('');

    const { data: chatData, isLoading } = useMyChatQuery({});
    const myChats = chatData?.data || [];

    const router = useRouter();
    const user = useSelector((state: any) => state.auth?.user);

    useEffect(() => {
        if (!user) {
            router.push('/login');
        }
    }, [user, router]);

    if (!user) {
        return <div className="min-h-screen flex items-center justify-center pt-24"><Loader className="animate-spin text-[#EB5500]" size={40} /></div>;
    }

    return (
        <div className="min-h-screen pb-6 pt-24 md:pb-32 md:pt-32 font-sans text-[#333333]">
            <div className="container mx-auto px-4">
                <h1 className="text-center font-medium text-2xl md:text-3xl mb-6 md:mb-8">Chat</h1>

                {/* Main Chat Container */}
                <div className="flex flex-col md:flex-row h-[calc(100vh-200px)] md:h-[800px] border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">

                    {/* Left Sidebar - Hidden on mobile if a chat is active */}
                    <div className={`${activeChat ? 'hidden md:flex' : 'flex'} w-full md:w-[320px] lg:w-[350px] border-r border-gray-200 flex-col flex-shrink-0 min-h-0 bg-white`}>
                        {/* Search Bar */}
                        <div className="p-4 md:p-6 border-b border-gray-200">
                            <div className="relative">
                                <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Search conversations"
                                    className="w-full bg-[#F5F5F5] border border-transparent rounded-xl py-3 pl-11 pr-4 text-[14px] outline-none focus:bg-white focus:border-[#EB5500] transition-colors"
                                />
                            </div>
                        </div>

                        {/* Contacts List */}
                        <div className="flex-1 overflow-y-auto">
                            {isLoading ? (
                                <div className="p-4 text-center text-gray-500">Loading chats...</div>
                            ) : myChats.length === 0 ? (
                                <div className="p-4 text-center text-gray-500">No conversations yet.</div>
                            ) : myChats.filter((chat: any) => {
                                const participant = chat.participants[0] || {};
                                return participant.fullName?.toLowerCase().includes(search.toLowerCase());
                            }).map((chat: any) => {
                                const participant = chat.participants[0] || {};
                                const chatName = participant.fullName || "Unknown";
                                const chatAvatar = participant.image || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop";
                                const unreadCount = chat.unreadCount || 0;

                                return (
                                    <Link href={`/chat/${chat._id}`} key={chat._id}>
                                        <div
                                            className={`relative flex items-center p-4 md:p-5 cursor-pointer transition-colors border-b border-gray-200/50 ${activeChat === chat._id ? 'bg-[#F2DFCE]/60' : 'hover:bg-gray-50/50'}`}
                                        >
                                            {/* Active border indicator */}
                                            {activeChat === chat._id && (
                                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#EB5500]"></div>
                                            )}

                                            {/* Avatar */}
                                            <div className="relative w-[46px] h-[46px] rounded-full overflow-hidden bg-gray-300 flex-shrink-0">
                                                {chatAvatar ? (
                                                    <Image src={chatAvatar} alt={chatName} fill className="object-cover" />
                                                ) : null}
                                            </div>

                                            {/* Content */}
                                            <div className="ml-4 flex-1 overflow-hidden">
                                                <div className="flex justify-between items-start mb-1">
                                                    <h3 className="font-medium text-[14px]">{chatName}</h3>
                                                </div>
                                                <p className="text-[13px] text-gray-500 truncate capitalize">{participant.role}</p>
                                            </div>

                                            {/* Unread Badge */}
                                            {unreadCount > 0 && (
                                                <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5 bg-[#EB5500] text-white text-[11px] font-medium rounded-full">
                                                    {unreadCount}
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                    {/* Right Chat Area - Hidden on mobile if no chat is active */}
                    <div className={`${activeChat ? 'flex' : 'hidden md:flex'} flex-1 flex-col min-w-0 min-h-0 bg-white`}>
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
