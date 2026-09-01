import { createSlice } from "@reduxjs/toolkit";

const NotificationSlice=createSlice({
  name:"notification",
  initialState:{
    notifications:[],
  },
  reducers:{
    setNotifications:(state,action)=>{
      state.notifications=action.payload;
    },
    addNotifications:(state,action)=>{
      state.notifications.unshift(action.payload);
    },
    markNotificationRead:(state,action)=>{
      console.log("Reducer ID:", action.payload);
      const notification=state.notifications.find((item)=>item?._id===action.payload)
      if(notification)
        notification.isRead=true;
    },
    markAllNotificationsRead:(state,action)=>{
      state.notifications.forEach((item)=>item.isRead=true)
    }
  }
})

export const {
  setNotifications,addNotifications,markNotificationRead,markAllNotificationsRead
}=NotificationSlice.actions;

export default NotificationSlice.reducer;