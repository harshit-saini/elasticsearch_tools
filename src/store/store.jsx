import app from "./app";
import { configureStore } from "@reduxjs/toolkit";
const store = configureStore({
  reducer: {
    app: app,
  },
});

export default store;
