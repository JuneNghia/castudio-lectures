import { combineReducers, configureStore } from "@reduxjs/toolkit";
import accountReducer from "./accountReducer";

const reducers = combineReducers({
  account: accountReducer,
});

export const store = configureStore({
  reducer: reducers,
  devTools: false,
});
