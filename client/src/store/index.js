import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/AuthSlice";
import lectureReducer from "../redux/LectureSlice";
import notificationReducer from "../redux/NotificationSlice";
import chatReducer from "../redux/chatSlice"

import storage from "redux-persist/es/storage";

import { persistReducer, persistStore } from "redux-persist";

const persistConfig = {
  key: "auth",
  storage,
};

const persistedReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedReducer,
    lectures: lectureReducer,
    notification: notificationReducer,
    chat: chatReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
