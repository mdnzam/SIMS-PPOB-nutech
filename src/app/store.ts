import { configureStore } from "@reduxjs/toolkit";

import authReducer from "@/features/auth/authSlice";
import profileReducer from "@/features/profile/profileSlice";
import balanceReducer from "@/features/balance/balanceSlice";

import { persistStore, persistReducer } from "redux-persist";

const storage = {
  getItem: async (key: string) => {
    return localStorage.getItem(key);
  },

  setItem: async (key: string, value: string) => {
    localStorage.setItem(key, value);
  },

  removeItem: async (key: string) => {
    localStorage.removeItem(key);
  },
};

const authPersistConfig = {
  key: "auth",

  storage,

  whitelist: ["token"],
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,

    profile: profileReducer,

    balance: balanceReducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
