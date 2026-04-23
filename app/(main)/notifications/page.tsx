'use client';

import React from 'react';
import {
  Bell,
  CheckCheck,
  Package,
  Info,
  AlertTriangle,
  Clock,
  Trash2,
  Search,
  MoreVertical,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

// Mock data for notifications with the project's premium feel
const INITIAL_NOTIFICATIONS = [
  {
    id: 1,
    title: 'Order Delivered Successfully',
    message: 'Your shipment #ORD-9283-XP has been delivered to the recipient. Thank you for using Orienco Rapid Delivery!',
    time: 'Just now',
    type: 'order',
    status: 'unread',
    icon: Package,
    color: 'bg-primary', // Project primary color
  },
  {
    id: 2,
    title: 'System Maintenance Alert',
    message: 'We will be performing scheduled maintenance on April 25th from 2:00 AM to 4:00 AM UTC. Some services may be temporarily unavailable.',
    time: '2 hours ago',
    type: 'system',
    status: 'unread',
    icon: AlertTriangle,
    color: 'bg-amber-500',
  },
  {
    id: 3,
    title: 'New Account Login detected',
    message: 'A new login attempt was detected from a Chrome browser on Windows 11. If this wasn\'t you, please secure your account immediately.',
    time: '5 hours ago',
    type: 'alert',
    status: 'unread',
    icon: Info,
    color: 'bg-blue-500',
  },
  {
    id: 4,
    title: 'Identity Verification Complete',
    message: 'Your documents have been verified. You now have full access to international shipping features.',
    time: 'Yesterday',
    type: 'system',
    status: 'read',
    icon: CheckCheck,
    color: 'bg-green-500',
  },
  {
    id: 5,
    title: 'Payment Confirmed',
    message: 'We\'ve received your payment of $45.00 for order #ORD-8821. Your invoice is now available in the history section.',
    time: '2 days ago',
    type: 'order',
    status: 'read',
    icon: Package,
    color: 'bg-primary',
  },
];

export default function NotificationsPage() {
  const [notifications, setNotifications] = React.useState(INITIAL_NOTIFICATIONS);
  const [activeTab, setActiveTab] = React.useState('all');

  const filteredNotifications = notifications.filter(n => {
    if (activeTab === 'all') return true;
    if (activeTab === 'unread') return n.status === 'unread';
    if (activeTab === 'orders') return n.type === 'order';
    return true;
  });

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, status: 'read' })));
  };

  const deleteNotification = (id: number) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => n.status === 'unread').length;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden pt-32 pb-20 px-4 md:px-8">
      <div className="container mx-auto relative z-10 space-y-10">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2 border-b border-border/50">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-2xl">
                <Bell className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-medium">Notifications</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors rounded-full px-3">
                    {unreadCount} Unread
                  </Badge>
                  <span className="text-muted-foreground text-sm flex items-center gap-1">
                    • Last updated just now
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              onClick={markAllRead}
              className="rounded-sm border-border/50 py-5 border border-gray-300 cursor-pointer hover:bg-muted font-medium transition-all"
            >
              <CheckCheck className="w-4 h-4 mr-2" />
              Mark all as read
            </Button>
          </div>
        </div>

        {/* Filters & Actions Search */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
            <TabsList className="bg-muted/30 p-1.5 rounded-lg py-6 border border-border/20 backdrop-blur-xl">
              <TabsTrigger value="all" className="rounded-sm px-6 py-4 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg cursor-pointer data-[state=active]:shadow-primary/20 transition-all font-medium">
                All
              </TabsTrigger>
              <TabsTrigger value="unread" className="rounded-sm px-6 py-4 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg cursor-pointer data-[state=active]:shadow-primary/20 transition-all font-medium">
                Unread
              </TabsTrigger>
              <TabsTrigger value="orders" className="rounded-sm px-6 py-4 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-lg cursor-pointer data-[state=active]:shadow-primary/20 transition-all font-medium">
                Orders
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search notifications..."
              className="w-full bg-muted/20 border border-gray-300 rounded-sm py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all backdrop-blur-md"
            />
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">

          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onDelete={() => deleteNotification(notification.id)}
              />
            ))
          ) : (
            <EmptyState message={
              activeTab === 'unread' ? "No unread notifications" :
                activeTab === 'orders' ? "No order-related updates" :
                  "Your notification inbox is empty"
            } />
          )}

        </div>

        {/* Load More Button if needed */}
        {filteredNotifications.length > 0 && (
          <div className="flex justify-center pt-6">
            <Button variant="ghost" className="text-muted-foreground hover:text-primary transition-colors">
              View Earlier Notifications
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: string;
  status: string;
  icon: React.ElementType;
  color: string;
}

function NotificationItem({ notification, onDelete }: { notification: Notification, onDelete: () => void }) {
  const Icon = notification.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`group relative overflow-hidden backdrop-blur-xl bg-card/60 dark:bg-card/40 border border-border/50 rounded-xl p-6 flex gap-5 transition-all hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 ${notification.status === 'unread' ? 'ring-1 ring-primary/10' : ''}`}
    >
      {/* Unread Indicator Glow */}
      {notification.status === 'unread' && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary blur-[2px]" />
      )}

      <div className={`shrink-0 w-14 h-14 rounded-xl ${notification.color} flex items-center justify-center text-white shadow-xl shadow-black/10 relative overflow-hidden group-hover:scale-110 transition-transform`}>
        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        <Icon className="w-7 h-7 relative z-10" />
      </div>

      <div className="flex-1 space-y-2">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className={`text-lg font-bold transition-colors ${notification.status === 'unread' ? 'text-foreground' : 'text-foreground/70'}`}>
              {notification.title}
            </h3>
            <p className={`text-sm leading-relaxed transition-colors ${notification.status === 'unread' ? 'text-muted-foreground/90' : 'text-muted-foreground/60'}`}>
              {notification.message}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <span className="text-xs font-medium text-muted-foreground/50 flex items-center gap-1.5 whitespace-nowrap bg-muted/50 px-2 py-1 rounded-full">
              <Clock className="w-3 h-3" />
              {notification.time}
            </span>

            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="ghost" size="sm" className="h-8 cursor-pointer w-8 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="rounded-xl w-full p-3 space-y-1 border-border/50 backdrop-blur-lg bg-card/80">
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer p-2 focus:bg-primary/10 focus:text-primary">
                  <CheckCheck className="w-4 h-4" />
                  Mark as {notification.status === 'unread' ? 'read' : 'unread'}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={onDelete}
                  className="flex items-center gap-2 cursor-pointer p-2 text-red-500 focus:bg-red-50 focus:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex flex-col items-center justify-center py-24 text-center space-y-6"
    >
      <div className="relative">
        <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 animate-pulse" />
        <div className="relative w-24 h-24 rounded-full bg-muted/40 backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-inner">
          <Bell className="w-10 h-10 text-muted-foreground/30" />
        </div>
      </div>
      <div className="space-y-2 max-w-xs mx-auto">
        <h3 className="text-2xl font-bold text-foreground/80">{message}</h3>
        <p className="text-muted-foreground">
          Check back later for new updates regarding your deliveries and account activity.
        </p>
      </div>
    </motion.div>
  );
}
