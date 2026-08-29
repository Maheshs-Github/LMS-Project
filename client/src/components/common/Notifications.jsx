import { useMutation } from "@/hooks/useMutation";
import React, { useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { markNotificationRead } from "../../../redux/NotificationSlice";

const Notifications = () => {
  const notifications = useSelector(
    (state) => state.notification.notifications,
  );
  const {mutate}=useMutation();
  const dispatch=useDispatch();
  const handleMarkAsRead=async(notificationId)=>{
    try {
      console.log("notificationId: ",notificationId)
      const res=await mutate({
        url:`notification/mark-as-read/${notificationId}`,
        body:{},
        method:"patch",
      })
      console.log("res: ",res?.data?._id);
      dispatch(markNotificationRead(notificationId));
      toast.success(res?.message || "Message Marked as Read Successfully")
    } catch (error) {
      console.log("error: ",error)
      toast.error(error?.message || "error while performaing mark as read");
    }
  }

  const handleMarkAllAsRead=async()=>{
    try {
      const res=await mutate({
        url:`notification/mark-all-as-read`,
        method:"patch",
      });
      console.log("res: ",res);
      toast.success(res?.message || "All Marked As Read Successfully");
    } catch (error) {
            console.log("error: ",error)
      toast.error(error?.message || "error while performaing mark all as read");
    }
  }

  useEffect(() => {
  console.log("🔥 Redux notifications updated:", notifications);
}, [notifications]);
  return (
    <>
    <div className="flex justify-between">
      <h1 className="font-semibold text-xl">Notifications</h1>
      <button className="p-2 rounded-md bg-black text-white font-semibold cursor-pointer" onClick={handleMarkAllAsRead}>Mark All As Read</button>
    </div>

      {notifications?.length > 0 ? (
        <div className="flex flex-col ">
          {(notifications || []).map((notification) => (
            <div
              key={notification._id}
              className={`group flex items-start gap-3 border-b px-4 py-3 cursor-pointer transition-colors ${
                !notification?.isRead
                  ? "bg-blue-50/70 hover:bg-blue-100/70"
                  : "bg-background hover:bg-muted/50"
              }`}
              onClick={()=>handleMarkAsRead(notification?._id)}
            >
              {/* Notification Content */}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h2
                    className={`truncate text-sm ${
                      !notification?.isRead
                        ? "font-semibold text-gray-900"
                        : "font-medium text-gray-700"
                    }`}
                  >
                    {notification?.title}
                  </h2>

                  {!notification?.isRead && (
                    <span className="h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                  )}
                </div>

                <p className="mt-1 line-clamp-2 text-sm leading-5 text-gray-500">
                  {notification?.message}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex justify-center items-center p-10">
          <h2 className="text-lg font-semibold ">No Notifications Yet</h2>
        </div>
      )}
    </>
  );
};

export default Notifications;
