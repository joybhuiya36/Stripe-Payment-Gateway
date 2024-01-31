import { combineReducers } from "@reduxjs/toolkit";

import userReducer from "./slices/userSlice";
import cartCountReducer from "./slices/cartCountSlice";

export const rootReducer = combineReducers({
  user: userReducer,
  cartCount: cartCountReducer,
});
