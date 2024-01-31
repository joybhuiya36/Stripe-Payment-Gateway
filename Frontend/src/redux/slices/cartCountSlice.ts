import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  count: 0,
};

const cartCountSlice = createSlice({
  name: "cartCount",
  initialState,
  reducers: {
    increase: (state) => {
      state.count = state.count + 1;
    },
    decrease: (state) => {
      state.count = state.count - 1;
    },
    decreaseMany: (state, action) => {
      if (state.count > 0) state.count -= action.payload;
    },
    countZero: (state, action) => {
      state.count = 0;
    },
    setCount: (state, action) => {
      state.count = action.payload;
    },
  },
});

export const { increase, decrease, decreaseMany, countZero, setCount } =
  cartCountSlice.actions;

export default cartCountSlice.reducer;
