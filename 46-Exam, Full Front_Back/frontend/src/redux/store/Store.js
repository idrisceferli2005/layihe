import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import productSlice from "../features/ProductSlice";
import userSlice from "../features/UserSlice";
import profileSlice from "../features/profileSlice";
import notificationSlice from "../features/notificationSlice";
import postSlice from "../features/postSlice";
import friendSlice from "../features/friendSlice";




const persistProductConfig = {
  key: "product",
  storage,
};

const persistUserConfig = {
  key: "user",
  storage,
};

const persistProfileConfig = {
  key: "profile",
  storage,
};
const persistNotificationConfig = {
  key: "notification",
  storage,
};
const persistPostConfig = {
  key: "posts",
  storage,
};
2

const persistedProductReducer = persistReducer(
  persistProductConfig,
  productSlice
);

const persistedUserReducer = persistReducer(
  persistUserConfig,
  userSlice
);

const persistedProfileReducer = persistReducer(
  persistProfileConfig,
  profileSlice
);
const persistedNotificationReducer = persistReducer(
  persistNotificationConfig,
  notificationSlice
);

const persistedPostReducer = persistReducer(
  persistPostConfig,
  postSlice
);



export const store = configureStore({
  reducer: {
    products: persistedProductReducer,
    user: persistedUserReducer,
    profile: persistedProfileReducer,
    notifications: persistedNotificationReducer,
    posts: persistedPostReducer,
    follow: friendSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
