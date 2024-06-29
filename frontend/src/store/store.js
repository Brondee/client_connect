import { configureStore } from "@reduxjs/toolkit";
import orderInfoSlice from "./orderInfoSlice";
import adminSlice from "./adminSlice";

export const store = configureStore({
  reducer: {
    orderInfo: orderInfoSlice,
    admin: adminSlice,
  },
});
