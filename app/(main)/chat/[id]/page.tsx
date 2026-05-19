'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Paperclip, Send, ChevronLeft, Loader, Edit2, Trash2, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
    useGetSpecificMessagesQuery,
    useSendMessageMutation,
    useEditMessageMutation,
    useDeleteMessageMutation
} from '@/features/messages/messageApi';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { io } from 'socket.io-client';
import { getToken } from '@/utils/storage';
import { baseURL } from '@/utils/BaseURL';

export default function ChatWindow() {
    const params = useParams();
    const activeChat = params.id as string;

    const [inputValue, setInputValue] = useState('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    // Edit state
    const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');

    // Delete state
    const [deletedMessages, setDeletedMessages] = useState<string[]>([]);

    const isAtBottomRef = useRef(true);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const currentUser = useSelector((state: any) => state.auth?.user);
    const myId = currentUser?._id || currentUser?.id;

    const { data: messagesResponse, isLoading, refetch } = useGetSpecificMessagesQuery(activeChat, { skip: !activeChat });
    const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
    const [editMessage, { isLoading: isEditing }] = useEditMessageMutation();
    const [deleteMessage] = useDeleteMessageMutation();

    console.log("message response", messagesResponse)

    const activeMessages = messagesResponse?.data?.messages || [];
    const activeUserData = messagesResponse?.data?.participant || null;

    const [messages, setMessages] = useState<any[]>([]);

    // Synchronize local messages state with API query messages
    useEffect(() => {
        if (activeMessages) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setMessages(activeMessages);
        }
    }, [activeMessages]);

    // Socket.io connection and real-time chat joining flow
    useEffect(() => {
        if (!activeChat) return;

        const token = getToken();
        if (!token) return;

        // Establish the socket connection with token in auth, query, and headers
        const socketInstance = io(`${baseURL}/chat`, {
            auth: {
                token: token
            },
            query: {
                token: token
            },
            extraHeaders: {
                token: token
            },
            transports: ['websocket', 'polling']
        });

        socketInstance.on('connect', () => {
            console.log('Successfully connected to chat socket. Joining chat:', activeChat);
            socketInstance.emit('join-chat', activeChat);
        });

        socketInstance.on('message::received', (message: any) => {
            console.log('Real-time message received:', message);

            // Trigger refetch to automatically keep the local RTK cache fully in sync with database (perfect for edits/deletes)
            refetch();

            // Extract the message ID supporting raw string, _id, messageId, and id properties
            const messageId = typeof message === 'string' ? message : (message?._id || message?.messageId || message?.id);

            if (messageId) {
                setMessages((prev) => {
                    // If raw string or explicit deleted flag, completely remove the message from the active list
                    if (typeof message === 'string' || message.isDeleted || message.text === "message had been deleted" || message.type === 'delete' || message.operationType === 'deleted') {
                        return prev.filter(m => (m._id !== messageId && m.id !== messageId));
                    }

                    const exists = prev.some(m => m._id === messageId || m.id === messageId);

                    if (exists) {
                        const existingItem = prev.find(m => m._id === messageId || m.id === messageId);
                        const updated = { ...existingItem, ...message };

                        if (updated.isDeleted || updated.text === "message had been deleted" || updated.type === 'delete' || updated.operationType === 'deleted') {
                            return prev.filter(m => (m._id !== messageId && m.id !== messageId));
                        }
                        // Update by merging new fields to preserve original properties like sender, createdAt, etc.
                        return prev.map(m => (m._id === messageId || m.id === messageId) ? updated : m);
                    } else if (message.chatId === activeChat && message.operationType !== 'deleted') {
                        // Only append new messages if they belong to this active chat room
                        return [...prev, message];
                    }

                    return prev;
                });
            }

            // Automatically scroll down when a message is received in active chat window
            setTimeout(() => {
                if (chatContainerRef.current) {
                    chatContainerRef.current.scrollTo({
                        top: chatContainerRef.current.scrollHeight,
                        behavior: 'smooth'
                    });
                }
            }, 100);
        });

        socketInstance.on('disconnect', () => {
            console.log('Disconnected from chat socket');
        });

        return () => {
            socketInstance.disconnect();
        };
    }, [activeChat]);

    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
        // Consider 'at bottom' if within 100px of the bottom
        isAtBottomRef.current = scrollHeight - scrollTop - clientHeight < 100;
    };

    const scrollToBottom = (force = false) => {
        if (chatContainerRef.current && (isAtBottomRef.current || force)) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    };

    const lastMessageId = messages.length > 0 ? messages[messages.length - 1]._id : null;

    useEffect(() => {
        // Only auto-scroll if user is already at the bottom
        if (isAtBottomRef.current) {
            const timeout = setTimeout(() => {
                scrollToBottom(true);
            }, 150);
            return () => clearTimeout(timeout);
        }
    }, [lastMessageId]);

    const handleSendMessage = async () => {
        if ((!inputValue.trim() && !selectedFile) || isSending) return;

        try {
            const formData = new FormData();
            formData.append('chatId', activeChat);
            formData.append('text', inputValue.trim());

            if (selectedFile) {
                formData.append('files', selectedFile);
            }

            await sendMessage(formData).unwrap();

            setInputValue('');
            handleRemoveFile();
            // Force scroll down when the user actively sends a message
            setTimeout(() => scrollToBottom(true), 100);
        } catch (error) {
            console.error("Failed to send message", error);
        }
    };

    const handleFileAttach = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setSelectedFile(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
    };

    const handleRemoveFile = () => {
        setSelectedFile(null);
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleEditSave = async (msgId: string) => {
        if (!editValue.trim() || isEditing) return;
        try {
            await editMessage({ messageId: msgId, data: { text: editValue } }).unwrap();
            setEditingMessageId(null);
            setEditValue('');
        } catch (error) {
            console.error("Failed to edit message", error);
        }
    };

    const handleDelete = async (msgId: string) => {
        try {
            setDeletedMessages(prev => [...prev, msgId]);
            await deleteMessage({ messageId: msgId }).unwrap();
        } catch (error) {
            console.error("Failed to delete message", error);
            setDeletedMessages(prev => prev.filter(id => id !== msgId));
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    if (isLoading) {
        return <div className="p-8 text-gray-500 text-center mt-20">Loading messages...</div>;
    }

    if (!activeUserData && !isLoading) {
        return <div className="p-8 text-gray-500">User not found</div>;
    }



    return (
        <div className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden bg-white">
            {/* Chat Header */}
            <div className="h-[70px] md:h-[84px] p-4 md:p-6 border-b border-gray-200 flex items-center gap-3 md:gap-4 shrink-0">
                <Link href="/chat" className="md:hidden p-1 -ml-1 text-gray-500 hover:text-[#EB5500]">
                    <ChevronLeft size={24} />
                </Link>
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-300 flex-shrink-0 shadow-sm border border-black/5">
                    {activeUserData?.image ? (
                        <Image src={baseURL + activeUserData.image} alt={activeUserData.fullName || "User"} fill className="object-cover" />
                    ) : (
                        <Image src={"https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop"} alt={activeUserData.fullName || "User"} fill className="object-cover" />
                    )}
                </div>
                <h2 className="font-medium text-[15px]">{activeUserData?.fullName || "User"}</h2>
            </div>

            {/* Chat Messages */}
            <div
                ref={chatContainerRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto p-6 md:p-8 space-y-4 min-h-0 bg-gray-50/30"
            >
                {messages
                    .filter((msg: any) => !msg.isDeleted && !deletedMessages.includes(msg._id) && msg.text !== "message had been deleted")
                    .map((msg: any) => {
                        const isMe = msg.sender?._id === myId || msg.sender?.id === myId || msg.sender === myId;
                        const senderName = isMe ? "Me" : (msg.sender?.fullName || activeUserData?.fullName || "Them");
                        const time = moment(msg.createdAt).format('hh:mm A');
                        const isEditingThis = editingMessageId === msg._id;
                        const isDeleted = msg.isDeleted || deletedMessages.includes(msg._id) || msg.text === "message had been deleted";
                        const textToShow = isDeleted ? <span className="italic text-gray-500">Message had been deleted</span> : msg.text;

                        return !isMe ? (
                            <div key={msg._id} className="flex flex-col items-start max-w-[85%] md:max-w-[70%]">
                                <p className="text-[11px] text-gray-400 font-medium mb-1.5 ml-1">{senderName}</p>
                                <div className={`border border-gray-300 rounded-xl rounded-tl-sm ${!isDeleted && !msg.text ? 'p-1.5' : 'p-4'} text-[13px] leading-relaxed shadow-sm ${isDeleted ? 'bg-gray-100/50' : 'bg-[#EBEBEB] text-gray-800'}`}>
                                    {!isDeleted && msg.files && msg.files.length > 0 && msg.files[0] && (
                                        <div className={`rounded-lg overflow-hidden relative w-[250px] sm:w-[280px] aspect-[4/5] bg-gray-200 ${msg.text ? 'mb-2' : ''}`}>
                                            <Image src={msg.files[0]} alt="attachment" fill className="object-cover" />
                                        </div>
                                    )}
                                    {textToShow && <span>{textToShow}</span>}
                                </div>
                                <span className="text-[11px] text-gray-400 font-medium mt-1.5 ml-1">{time}</span>
                            </div>
                        ) : (
                            <div key={msg._id} className="flex flex-col items-end self-end max-w-[85%] md:max-w-[70%] ml-auto">
                                <div className="flex items-center justify-end gap-2 group w-full">
                                    {/* Hover Actions */}
                                    {!isDeleted && !isEditingThis && (
                                        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 bg-white shadow-sm border border-gray-200 rounded-lg p-1 flex-shrink-0">
                                            <button onClick={() => { setEditingMessageId(msg._id); setEditValue(msg.text); }} className="p-1.5 text-gray-500 hover:text-[#EB5500] hover:bg-orange-50 rounded-md cursor-pointer transition-colors" title="Edit">
                                                <Edit2 size={14} />
                                            </button>
                                            <button onClick={() => handleDelete(msg._id)} className="p-1.5 text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-md cursor-pointer transition-colors" title="Delete">
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    )}

                                    {isEditingThis ? (
                                        <div className="bg-white border-2 border-[#EB5500] rounded-xl rounded-tr-sm p-3 shadow-md w-full min-w-[250px]">
                                            <textarea
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                className="w-full bg-transparent text-[13px] outline-none resize-none"
                                                rows={2}
                                                autoFocus
                                            />
                                            <div className="flex justify-end gap-2 mt-2">
                                                <button onClick={() => setEditingMessageId(null)} className="text-xs text-gray-500 hover:text-gray-700">Cancel</button>
                                                <button onClick={() => handleEditSave(msg._id)} className="text-xs bg-[#EB5500] text-white px-3 py-1 rounded-md">{isEditing ? 'Saving...' : 'Save'}</button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className={`rounded-xl rounded-tr-sm ${!isDeleted && !msg.text ? 'p-1.5' : 'p-4'} text-[13px] leading-relaxed shadow-md shadow-orange-500/20 text-left ${isDeleted ? 'bg-orange-100/50 border border-orange-200 text-gray-600' : 'bg-[#EB5500] text-white'}`}>
                                            {!isDeleted && msg.files && msg.files.length > 0 && msg.files[0] && (
                                                <div className={`rounded-lg overflow-hidden relative w-[250px] sm:w-[280px] aspect-[4/5] bg-orange-400 ${msg.text ? 'mb-2' : ''}`}>
                                                    <Image src={msg.files[0]} alt="attachment" fill className="object-cover" />
                                                </div>
                                            )}
                                            {textToShow && <span>{textToShow}</span>}
                                        </div>
                                    )}
                                </div>
                                <span className="text-[11px] text-gray-400 font-medium mt-1.5 mr-1">{time}</span>
                            </div>
                        );
                    })}
                <div ref={messagesEndRef} className="h-1" />
            </div>

            {/* Input Area */}
            <div className="p-4 md:p-6 border-t border-gray-200 shrink-0">
                <div className="relative border border-gray-300 rounded-xl overflow-hidden focus-within:border-[#EB5500] focus-within:bg-white transition-colors min-h-[120px] flex flex-col bg-white">
                    {/* Image Preview Area */}
                    {previewUrl && (
                        <div className="p-4 pb-0">
                            <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-gray-200 shadow-sm group">
                                <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button onClick={handleRemoveFile} className="text-white hover:text-red-400 bg-black/50 rounded-full p-1">
                                        <X size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    <textarea
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isSending}
                        className="w-full flex-1 bg-transparent p-4 text-[14px] outline-none resize-none placeholder:text-gray-400 disabled:opacity-50"
                        placeholder="Type your message..."
                        rows={previewUrl ? 2 : 3}
                    ></textarea>

                    <div className="p-3 flex justify-between items-center bg-transparent mt-auto border-t border-gray-100">
                        <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
                        <button
                            onClick={handleFileAttach}
                            disabled={isSending}
                            className="flex items-center gap-2 border border-gray-200 text-gray-700 px-3 md:px-4 py-2 rounded-lg cursor-pointer text-xs font-semibold transition-colors hover:bg-gray-50 disabled:opacity-50"
                        >
                            <Paperclip size={14} />
                            <span className="hidden md:inline">Attach Image</span>
                        </button>

                        <button
                            onClick={handleSendMessage}
                            disabled={isSending || (!inputValue.trim() && !selectedFile)}
                            className={`w-10 h-10 flex items-center cursor-pointer justify-center transition-colors rounded-full ${inputValue.trim() || selectedFile
                                ? 'bg-[#EB5500] text-white hover:bg-[#D44D00]'
                                : 'bg-gray-100 text-gray-400'
                                }`}
                        >
                            {isSending ? (
                                <Loader size={18} className="animate-spin" />
                            ) : (
                                <Send size={18} className="ml-0.5" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
