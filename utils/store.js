import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "./apiBaseQuery";
import authReducer from "../features/auth/authSlice";
import bookingReducer from "../features/parcel/bookingSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        booking: bookingReducer,
        [baseApi.reducerPath]: baseApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(baseApi.middleware),
});
