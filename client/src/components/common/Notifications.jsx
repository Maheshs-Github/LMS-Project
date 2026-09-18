import { useMutation } from "@/hooks/useMutation";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  markAllNotificationsRead,
  markNotificationRead,
} from "../../redux/NotificationSlice";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Icons from "@/utils/Icons";

const Notifications = () => {
  const notifications = useSelector(
    (state) => state.notification.notifications || []
  );
  const { mutate, loading } = useMutation();
  const dispatch = useDispatch();

  const handleMarkAsRead = async (notificationId) => {
    try {
      const res = await mutate({
        url: `notification/mark-as-read/${notificationId}`,
        body: {},
        method: "patch",
      });
      dispatch(markNotificationRead(notificationId));
      toast.success(res?.message || "Notification marked as read");
    } catch (error) {
      toast.error(error?.message || "Failed to mark as read");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const res = await mutate({
        url: `notification/mark-all-as-read`,
        method: "patch",
      });
      dispatch(markAllNotificationsRead());
      toast.success(res?.message || "All notifications marked as read");
    } catch (error) {
      toast.error(error?.message || "Failed to mark all as read");
    }
  };

  const unreadCount = notifications.filter((n) => !n?.isRead).length;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between pb-3 border-b border-border/60">
        <div className="flex items-center gap-2">
          <h2 className="font-bold text-lg text-foreground">Notifications</h2>
          {unreadCount > 0 && (
            <Badge className="bg-primary/20 text-primary hover:bg-primary/30 text-xs px-2 py-0.5">
              {unreadCount} new
            </Badge>
          )}
        </div>
        {unreadCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-primary font-medium hover:text-primary/80 cursor-pointer h-8 px-2"
            onClick={handleMarkAllAsRead}
            disabled={loading}
          >
            <Icons.Check className="w-3.5 h-3.5 mr-1" />
            Mark all read
          </Button>
        )}
      </div>

      {notifications.length > 0 ? (
        <div className="flex flex-col space-y-1.5 max-h-[420px] overflow-y-auto pr-1">
          {notifications.map((notification) => {
            const isUnread = !notification?.isRead;
            return (
              <div
                key={notification._id}
                className={`group flex items-start gap-3 p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                  isUnread
                    ? "bg-primary/5 border-primary/20 hover:bg-primary/10"
                    : "bg-card border-border/40 hover:bg-muted/40"
                }`}
                onClick={() => isUnread && handleMarkAsRead(notification?._id)}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                    isUnread
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <Icons.Bell className="w-4 h-4" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3
                      className={`text-xs truncate ${
                        isUnread
                          ? "font-bold text-foreground"
                          : "font-medium text-muted-foreground"
                      }`}
                    >
                      {notification?.title || "Notification"}
                    </h3>
                    {isUnread && (
                      <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                    )}
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5 leading-relaxed">
                    {notification?.message}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-muted/50 flex items-center justify-center mb-2">
            <Icons.Bell className="w-6 h-6 text-muted-foreground/50" />
          </div>
          <p className="text-sm font-semibold text-foreground">No notifications yet</p>
          <p className="text-xs text-muted-foreground mt-0.5">
            We'll notify you when important course updates or messages arrive.
          </p>
        </div>
      )}
    </div>
  );
};

export default Notifications;
