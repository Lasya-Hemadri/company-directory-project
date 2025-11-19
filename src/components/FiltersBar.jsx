import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setFilters,
  setSort,
  setPage,
  setUseInfinite,
  resetPagination,
} from "../redux/companySlice";

export default function FiltersBar() {
  const dispatch = useDispatch();
  const filters = useSelector((s) => s.companies.filters);
  const sort = useSelector((s) => s.companies.sort);
  const useInfinite = useSelector((s) => s.companies.useInfinite);
  const [localSearch, setLocalSearch] = useState(filters.search || "");

  useEffect(() => {
    const t = setTimeout(() => {
      dispatch(setFilters({ search: localSearch }));
      dispatch(resetPagination());
    }, 350);
    return () => clearTimeout(t);
  }, [localSearch, dispatch]);

  useEffect(() => {
    dispatch(resetPagination());
  }, [filters.location, filters.industry, sort, dispatch]);

  const locations = [
    "Location",
    "Atlanta, GA",
    "Bengaluru",
    "Hyderabad",
    "Mumbai",
    "Delhi",
  ];
  const industries = [
    "Industry",
    "Software",
    "Finance",
    "Healthcare",
    "Education",
  ];

  return (
    <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
      <div className="flex gap-3 items-center">
        <input
          aria-label="Search companies"
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
          className="w-72 p-2 rounded-lg border bg-white/95 placeholder:opacity-60 shadow-sm"
          placeholder="Search company or description..."
        />

        <select
          value={filters.location}
          onChange={(e) => {
            dispatch(setFilters({ location: e.target.value }));
            dispatch(resetPagination());
          }}
          className="p-2 rounded-lg border"
        >
          {locations.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>

        <select
          value={filters.industry}
          onChange={(e) => {
            dispatch(setFilters({ industry: e.target.value }));
            dispatch(resetPagination());
          }}
          className="p-2 rounded-lg border"
        >
          {industries.map((i) => (
            <option key={i} value={i}>
              {i}
            </option>
          ))}
        </select>

        <select
          value={sort}
          onChange={(e) => {
            dispatch(setSort(e.target.value));
            dispatch(resetPagination());
          }}
          className="p-2 rounded-lg border"
        >
          <option value="name_asc">Name ↑</option>
          <option value="name_desc">Name ↓</option>
        </select>
      </div>

      <div className="flex gap-4 items-center">
        <label className="text-sm">Infinite scroll</label>
        <input
          type="checkbox"
          checked={useInfinite}
          onChange={(e) => dispatch(setUseInfinite(e.target.checked))}
        />
      </div>
    </div>
  );
}
