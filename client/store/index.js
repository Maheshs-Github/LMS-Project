// import { configureStore } from "@reduxjs/toolkit";
// import authReducer from "../redux/AuthSlice"

// export const index=configureStore({
//   reducer:{
//     auth:authReducer
//   }
// })


import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../redux/AuthSlice";
import lectureReducer from "../redux/LectureSlice"
import notificationReducer from "../redux/NotificationSlice"

import storage from "redux-persist/es/storage";

import {
  persistReducer,
  persistStore,
} from "redux-persist";

const persistConfig = {
  key: "auth",
  storage,
};

const persistedReducer = persistReducer(
  persistConfig,
  authReducer
);

export const store = configureStore({
  reducer: {
    auth: persistedReducer,
    lectures: lectureReducer,
    notification:notificationReducer
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);