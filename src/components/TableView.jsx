import React, { useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPage } from "../redux/companySlice";

export default function TableView({
  companies = [],
  isLoading = false,
  isError = false,
}) {
  const dispatch = useDispatch();
  const page = useSelector((s) => s.companies.page);
  const totalPages = useSelector((s) => s.companies.totalPages);
  const useInfinite = useSelector((s) => s.companies.useInfinite);

  const [localSort, setLocalSort] = useState({ key: "name", dir: "asc" });
  const loadMoreRef = useRef(null);

  useEffect(() => {
    if (!useInfinite) return;
    const node = loadMoreRef.current;
    if (!node) return;

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isLoading) {
            const nextPage = Math.min(
              totalPages ? totalPages : page + 1,
              page + 1
            );
            dispatch(setPage(nextPage));
          }
        });
      },
      { rootMargin: "200px" }
    );

    obs.observe(node);
    return () => obs.disconnect();
  }, [useInfinite, isLoading, dispatch, totalPages]);

  function onHeaderClick(key) {
    setLocalSort((prev) =>
      prev.key === key
        ? { key, dir: prev.dir === "asc" ? "desc" : "asc" }
        : { key, dir: "asc" }
    );
  }

  const sorted = useMemo(() => {
    const arr = [...companies];
    const { key, dir } = localSort;
    arr.sort((a, b) => {
      if (a[key] == null) return 1;
      if (b[key] == null) return -1;
      if (typeof a[key] === "string")
        return dir === "asc"
          ? a[key].localeCompare(b[key])
          : b[key].localeCompare(a[key]);
      return dir === "asc" ? a[key] - b[key] : b[key] - a[key];
    });
    return arr;
  }, [companies, localSort]);

  if (isError)
    return <div className="p-6 text-red-600">Error loading companies.</div>;

  return (
    <div className="overflow-x-auto rounded-lg border border-slate-100">
      <table className="min-w-full table-auto divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th
              className="px-4 py-3 text-black text-left text-sm font-medium cursor-pointer"
              onClick={() => onHeaderClick("name")}
            >
              Name
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium">
              Industry
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium">
              Location
            </th>
            <th
              className="px-4 py-3 text-right text-sm font-medium cursor-pointer"
              onClick={() => onHeaderClick("employees")}
            >
              Employees
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium">Website</th>
            <th className="px-4 py-3 text-center text-sm font-medium">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-slate-100">
          {sorted.map((c) => (
            <tr key={c.id} className="hover:bg-slate-50">
              <td className="px-4 py-3 text-sm text-slate-600">{c.name}</td>
              <td className="px-4 py-3 text-sm text-slate-600">{c.industry}</td>
              <td className="px-4 py-3 text-sm text-slate-600">{c.location}</td>
              <td className="px-4 py-3 text-right text-sm text-slate-600">
                {c.employees}
              </td>
              <td className="px-4 py-3">
                <a
                  href={c.website}
                  target="_blank"
                  rel="noreferrer"
                  className="underline text-sm"
                >
                  Visit
                </a>
              </td>
              <td className="px-4 py-3 text-center">
                <div className="flex items-center justify-center gap-2">
                  <button className="px-2 py-1 rounded-md bg-indigo-600 text-white text-xs">
                    View
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="p-4 flex items-center justify-between">
        <div className="text-sm text-slate-600">
          Showing {companies.length} items
        </div>
        {!useInfinite && (
          <div className="flex items-center gap-3">
            <button
              className="px-3 py-1 rounded-md border text-white"
              onClick={() => {
                dispatch(setPage(Math.max(1, page - 1)));
              }}
              disabled={page === 1}
            >
              Prev
            </button>
            <div className="px-3 py-1 rounded-lg bg-slate-50">
              Page {page} of {totalPages}
            </div>
            <button
              className="px-3 py-1 rounded-md border text-white"
              onClick={() => {
                dispatch(setPage(Math.min(totalPages, page + 1)));
              }}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>

      <div ref={loadMoreRef} style={{ height: 1 }} />
    </div>
  );
}
