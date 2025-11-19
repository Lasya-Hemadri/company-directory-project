import { configureStore } from "@reduxjs/toolkit";
import { companiesApi } from "../services/companiesApi";
import companiesReducer from "../redux/companySlice";

const store = configureStore({
  reducer: {
    companies: companiesReducer,
    [companiesApi.reducerPath]: companiesApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(companiesApi.middleware),
});

export default store;
