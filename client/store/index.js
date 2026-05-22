import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/AuthSlice"

export const index=configureStore({
  reducer:{
    auth:authReducer
  }
})