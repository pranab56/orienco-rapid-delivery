'use client';

import React from 'react';
import {
  Bell,
  CheckCheck,
  Package,
  Info,
  AlertTriangle,
  Clock,
  Loader,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useGetAllNotificationsQuery } from '@/features/notification/notificationApi';
import moment from 'moment';

export default function NotificationsPage() {
  const [page, setPage] = React.useState(1);

  const { data: response, isLoading } = useGetAllNotificationsQuery({ page, limit: 10 });
  const filteredNotifications = response?.data?.notifications || [];
  const unreadCount = response?.data?.unreadCount || 0;


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-24">
        <Loader className="animate-spin text-primary" size={40} />
      </div>
    );
  }

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


        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification: any) => (
                <NotificationItem
                  key={notification._id}
                  notification={notification}
                />
              ))
            ) : (
              <EmptyState message={"Your notification inbox is empty"} />
            )}
          </AnimatePresence>
        </div>

        {/* Load More Button */}
        {response?.pagination?.totalPage > page && (
          <div className="flex justify-center pt-6">
            <Button
              variant="ghost"
              onClick={() => setPage(p => p + 1)}
              className="text-muted-foreground hover:text-primary transition-colors"
            >
              View Earlier Notifications
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

function NotificationItem({ notification }: { notification: any }) {
  const getIconAndColor = (title: string) => {
    const t = title.toLowerCase();
    if (t.includes('driver') || t.includes('parcel')) return { icon: Package, color: 'bg-primary' };
    if (t.includes('maintenance')) return { icon: AlertTriangle, color: 'bg-amber-500' };
    if (t.includes('payment') || t.includes('verified')) return { icon: CheckCheck, color: 'bg-green-500' };
    return { icon: Info, color: 'bg-blue-500' };
  };

  const { icon: Icon, color } = getIconAndColor(notification.title);

  return (
    <div

      className={`group relative overflow-hidden backdrop-blur-xl bg-card/60 dark:bg-card/40 border border-border/50 rounded-xl p-6 flex gap-5 transition-all hover:shadow-2xl hover:shadow-primary/5 hover:border-primary/20 ${!notification.read ? 'ring-1 ring-primary/10' : ''}`}
    >
      {/* Unread Indicator Glow */}
      {!notification.read && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary blur-[2px]" />
      )}

      <div className={`shrink-0 w-14 h-14 rounded-xl ${color} flex items-center justify-center text-white shadow-xl shadow-black/10 relative overflow-hidden group-hover:scale-110 transition-transform`}>
        <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
        <Icon className="w-7 h-7 relative z-10" />
      </div>

      <div className="flex-1 space-y-2">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h3 className={`text-lg font-bold transition-colors ${!notification.read ? 'text-foreground' : 'text-foreground/70'}`}>
              {notification.title}
            </h3>
            <p className={`text-sm leading-relaxed transition-colors ${!notification.read ? 'text-muted-foreground/90' : 'text-muted-foreground/60'}`}>
              {notification.message}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2 shrink-0">
            <span className="text-xs font-medium text-muted-foreground/50 flex items-center gap-1.5 whitespace-nowrap bg-muted/50 px-2 py-1 rounded-full">
              <Clock className="w-3 h-3" />
              {moment(notification.createdAt).fromNow()}
            </span>


          </div>
        </div>
      </div>
    </div>
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
