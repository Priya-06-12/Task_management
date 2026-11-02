import { FILTERS } from "../utils/constants";

// Status tabs on the left, title search on the right.
export default function FilterBar({ activeFilter, onFilterChange, search, onSearchChange, counts }) {
  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
      <div
        role="tablist"
        aria-label="Filter tasks by status"
        className="flex gap-1 overflow-x-auto rounded-xl border border-line bg-surface p-1"
      >
        {FILTERS.map((filter) => {
          const active = filter === activeFilter;
          return (
            <button
              key={filter}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => onFilterChange(filter)}
              className={`flex shrink-0 items-center gap-2 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                active ? "bg-ink text-white" : "text-muted hover:bg-paper hover:text-ink"
              }`}
            >
              {filter}
              <span
                className={`rounded-full px-1.5 text-xs tabular-nums ${
                  active ? "bg-white/20 text-white" : "bg-paper text-muted"
                }`}
              >
                {counts[filter]}
              </span>
            </button>
          );
        })}
      </div>

      <div className="relative lg:w-80">
        <label htmlFor="search" className="sr-only">
          Search tasks by title
        </label>
        <svg
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
          viewBox="0 0 20 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <circle cx="9" cy="9" r="6" />
          <path d="M14 14l4 4" />
        </svg>
        <input
          id="search"
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by title"
          className="w-full rounded-xl border border-line bg-surface py-2.5 pl-9 pr-3 text-sm placeholder:text-muted/70"
        />
      </div>
    </div>
  );
}
