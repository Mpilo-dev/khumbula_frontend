import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import authReducer from "./features/authSlice";
import { pillsReducer } from "./features/pillsSlice";
import alertsReducer from "./features/alertsSlice";

const authPersistConfig = {
  key: "auth",
  storage,
};

const pillsPersistConfig = {
  key: "pills",
  storage,
};

const alertsPersistConfig = {
  key: "alerts",
  storage,
};

const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedPillsReducer = persistReducer(pillsPersistConfig, pillsReducer);
const persistedAlertsReducer = persistReducer(
  alertsPersistConfig,
  alertsReducer
);

export const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,
    pills: persistedPillsReducer,
    alerts: persistedAlertsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Ignore serialization warnings
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
