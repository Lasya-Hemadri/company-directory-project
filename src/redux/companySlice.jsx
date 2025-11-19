import { createSlice } from "@reduxjs/toolkit";

const PAGE_LIMIT = 10;

const companiesSlice = createSlice({
  name: "companies",
  initialState: {
    page: 1,
    totalPages: 1,
    total: 0,
    filters: { search: "", location: "All", industry: "All" },
    sort: "name_asc",
    useInfinite: true,
  },
  reducers: {
    setPage(state, action) {
      state.page = action.payload;
    },
    setFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSort(state, action) {
      state.sort = action.payload;
    },
    setUseInfinite(state, action) {
      state.useInfinite = action.payload;
    },
    resetPagination(state) {
      state.page = 1;
    },
    setTotalPages(state, action) {
      state.totalPages = action.payload;
    },
  },
});

export const {
  setPage,
  setFilters,
  setSort,
  setUseInfinite,
  resetPagination,
  setTotalPages,
} = companiesSlice.actions;
export const PAGE_LIMIT_CONST = PAGE_LIMIT;
export default companiesSlice.reducer;
