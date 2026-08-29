import { createSlice } from "@reduxjs/toolkit";

const NotificationSlice=createSlice({
  name:"notifications",
  initialState:{
    notifications:[],
  },
  reducers:{
    setNotifications:(state,action)=>{
      state.notifications=action.payload;
    },
    addNotifications:(state,action)=>{
      state.notifications.unshift(action.payload);
    }
  }
})

export const {
  setNotifications,addNotifications
}=NotificationSlice.actions;

export default NotificationSlice.reducer;