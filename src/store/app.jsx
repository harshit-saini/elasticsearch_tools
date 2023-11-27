import { createSlice } from "@reduxjs/toolkit";

export const app = createSlice({
  name: "app",
  initialState: {
    indexes: [],
    host: "",
    currentIndex: "",
    currentIndexColumns: [],
    currentQuery: {},
    queryResponse: {},
  },
  reducers: {
    setStateValue: (state, action) => {
      state[action.payload.key] = action.payload.value;
    },
  },
});

// creating actions from reducers
export const { setStateValue } = app.actions;

export default app.reducer;
