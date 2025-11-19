// src/services/companiesApi.js
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/";

export const companiesApi = createApi({
  reducerPath: "companiesApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_URL }),
  endpoints: (builder) => ({
    getCompanies: builder.query({
      // args: { page, limit, search, location, industry, sort }
      query: (args) => {
        const params = new URLSearchParams();
        if (args?.page) params.append("page", args.page);
        if (args?.limit) params.append("limit", args.limit);
        if (args?.search) params.append("search", args.search);
        if (args?.location) params.append("location", args.location);
        if (args?.industry) params.append("industry", args.industry);
        if (args?.sort) params.append("sort", args.sort);
        const qs = params.toString();
        return { url: qs ? `companies?${qs}` : "companies", method: "GET" };
      },
      // Return the raw response, we'll read data/meta in the component
      transformResponse: (response) => response,
    }),
  }),
});

export const { useGetCompaniesQuery } = companiesApi;
