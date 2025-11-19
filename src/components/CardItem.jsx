import React from "react";

export default function CardItem({ c }) {
  return (
    <article className="p-5 rounded-2xl bg-white/90 border border-slate-100 shadow-sm hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg text-black font-semibold">{c.name}</h3>
          <p className="text-sm opacity-80">
            {c.industry} • {c.location}
          </p>
        </div>
        <div className="text-xs text-slate-500">{c.employees} employees</div>
      </div>

      <p className="mt-3 text-sm text-slate-600 line-clamp-3">
        {c.description}
      </p>

      <div className="mt-4 flex items-center justify-between">
        <a
          className="text-sm underline"
          href={c.website}
          target="_blank"
          rel="noreferrer"
        >
          Visit site
        </a>
        <div className="flex gap-2">
          <button className="px-3 py-1 rounded-lg bg-indigo-600 text-white text-sm">
            View
          </button>
        </div>
      </div>
    </article>
  );
}
