// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import CardItem from "./CardItem";
// import TableView from "./TableView";
// import { useGetCompaniesQuery } from "../services/companiesApi";
// import { setPage, setTotalPages, resetPagination } from "../redux/companySlice";

// const PAGE_LIMIT = 10;

// export default function CompaniesList({ view }) {
//   const dispatch = useDispatch();
//   const { page, filters, sort, useInfinite } = useSelector((s) => s.companies);

//   const args = useMemo(
//     () => ({
//       page,
//       limit: PAGE_LIMIT,
//       search: (filters.search || "").trim(),
//       location: filters.location === "All" ? "" : filters.location,
//       industry: filters.industry === "All" ? "" : filters.industry,
//       sort,
//     }),
//     [page, filters.search, filters.location, filters.industry, sort]
//   );

//   const { data, isLoading, isError, isFetching } = useGetCompaniesQuery(args, {
//     refetchOnFocus: false,
//   });

//   const pageItems = data?.data ?? [];
//   const meta = data?.meta ?? {};
//   const [accumulated, setAccumulated] = useState([]);

//   const appendedPagesRef = useRef(new Set());

//   useEffect(() => {
//     dispatch(resetPagination());
//     setAccumulated([]);
//     appendedPagesRef.current = new Set();
//   }, [filters.search, filters.location, filters.industry, sort, dispatch]);

//   useEffect(() => {
//     if (!page || !Array.isArray(pageItems)) return;

//     if (appendedPagesRef.current.has(page)) {
//       return;
//     }

//     if (useInfinite) {
//       setAccumulated((prev) => {
//         if (page === 1) {
//           appendedPagesRef.current = new Set([1]);
//           return [...pageItems];
//         }
//         appendedPagesRef.current.add(page);
//         return [...prev, ...pageItems];
//       });
//     } else {
//       appendedPagesRef.current = new Set([page]);
//       setAccumulated([...pageItems]);
//     }
//   }, [pageItems, page, useInfinite]);

//   useEffect(() => {
//     if (meta?.totalPages) {
//       dispatch(setTotalPages(meta.totalPages));
//     } else if (meta?.total) {
//       dispatch(setTotalPages(Math.max(1, Math.ceil(meta.total / PAGE_LIMIT))));
//     }
//   }, [meta, dispatch]);

//   useEffect(() => {
//     dispatch(setPage(1));
//   }, [dispatch]);

//   const companiesToRender = accumulated;

//   return (
//     <div>
//       {view === "card" && (
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//           {companiesToRender.map((c) => (
//             <CardItem key={c.id} c={c} />
//           ))}
//         </div>
//       )}

//       {view === "table" && (
//         <TableView
//           companies={companiesToRender}
//           isLoading={isLoading || isFetching}
//           isError={isError}
//         />
//       )}

//       <div className="mt-6 flex items-center justify-center">
//         {(isLoading || isFetching) && (
//           <div className="p-3 rounded-lg bg-white/90 shadow">Loading...</div>
//         )}
//       </div>
//     </div>
//   );
// }

// src/components/CompaniesList.jsx
import React, { useEffect, useMemo, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import CardItem from "./CardItem";
import TableView from "./TableView";
import { useGetCompaniesQuery } from "../services/companiesApi";
import { setPage, setTotalPages, resetPagination } from "../redux/companySlice";

const PAGE_LIMIT = 10;

export default function CompaniesList({ view }) {
  const dispatch = useDispatch();
  const { page, filters, sort, useInfinite } = useSelector((s) => s.companies);

  // stable args so RTK Query re-fetches correctly when page/filters change
  const args = useMemo(
    () => ({
      page,
      limit: PAGE_LIMIT,
      search: (filters.search || "").trim(),
      location: filters.location === "All" ? "" : filters.location,
      industry: filters.industry === "All" ? "" : filters.industry,
      sort,
    }),
    [page, filters.search, filters.location, filters.industry, sort]
  );

  // fetch exactly the server page for the args
  const { data, isLoading, isError, isFetching } = useGetCompaniesQuery(args, {
    refetchOnFocus: false,
  });

  const pageItems = data?.data ?? [];
  const meta = data?.meta ?? {};

  // For infinite scroll we accumulate pages; for paged mode we show server page only.
  const [accumulated, setAccumulated] = useState([]);

  // Set to track appended page numbers in infinite mode (avoid duplicate appends)
  const appendedPagesRef = useRef(new Set());

  // When filters/sort change, reset server pagination and accumulation.
  // Note: FiltersBar should also reset page to 1; keep this to be safe.
  useEffect(() => {
    dispatch(resetPagination()); // sets page=1
    setAccumulated([]);
    appendedPagesRef.current = new Set();
  }, [filters.search, filters.location, filters.industry, sort, dispatch]);

  // Append or replace behavior:
  useEffect(() => {
    // If no page number or no array returned, bail.
    if (!page || !Array.isArray(pageItems)) return;

    if (useInfinite) {
      // If page 1, start fresh
      if (page === 1) {
        setAccumulated([...pageItems]);
        appendedPagesRef.current = new Set([1]);
        return;
      }

      // Append only if not already appended
      if (!appendedPagesRef.current.has(page)) {
        appendedPagesRef.current.add(page);
        setAccumulated((prev) => {
          // guard: if prev already contains same items by id, avoid duplicate ids
          const existingIds = new Set(prev.map((it) => it.id));
          const newItems = pageItems.filter((it) => !existingIds.has(it.id));
          return [...prev, ...newItems];
        });
      }
    } else {
      // paged mode: replace accumulated with current page items (so it shows exactly what server returned)
      setAccumulated([...pageItems]);
      appendedPagesRef.current = new Set([page]);
    }
  }, [pageItems, page, useInfinite]);

  // Update total pages in slice from server meta (so pagination controls work)
  useEffect(() => {
    if (meta?.totalPages) {
      dispatch(setTotalPages(meta.totalPages));
    } else if (meta?.total) {
      dispatch(setTotalPages(Math.max(1, Math.ceil(meta.total / PAGE_LIMIT))));
    }
  }, [meta, dispatch]);

  // ensure page is initialized
  useEffect(() => {
    dispatch(setPage(1));
    // don't clear accumulated here; filters effect handles it
  }, [dispatch]);

  // debugging (optional; remove in production)
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.debug("CompaniesList:", {
      page,
      itemsThisPage: pageItems.length,
      accumulated: accumulated.length,
      appendedPages: Array.from(appendedPagesRef.current),
      useInfinite,
    });
  }, [page, pageItems, accumulated, useInfinite]);

  const companiesToRender = accumulated;

  return (
    <div>
      {view === "card" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {companiesToRender.map((c) => (
            <CardItem key={c.id} c={c} />
          ))}
        </div>
      )}

      {view === "table" && (
        <TableView
          companies={companiesToRender}
          isLoading={isLoading || isFetching}
          isError={isError}
        />
      )}

      <div className="mt-6 flex items-center justify-center">
        {(isLoading || isFetching) && (
          <div className="p-3 rounded-lg bg-white/90 shadow">Loading...</div>
        )}
      </div>
    </div>
  );
}
