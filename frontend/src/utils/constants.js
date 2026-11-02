export const STATUSES = ["Pending", "In Progress", "Completed"];
export const FILTERS = ["All", ...STATUSES];

// Tailwind classes for each status (badge + accent bar)
export const STATUS_STYLES = {
  Pending: { badge: "bg-amber-100 text-amber-900", dot: "bg-amber-500", bar: "bg-amber-500" },
  "In Progress": { badge: "bg-sky-100 text-sky-900", dot: "bg-sky-500", bar: "bg-sky-500" },
  Completed: { badge: "bg-emerald-100 text-emerald-900", dot: "bg-emerald-600", bar: "bg-emerald-600" },
};
