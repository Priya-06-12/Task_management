import { STATUS_STYLES } from "../utils/constants";

// One panel with four figures, plus a progress bar showing how much is done.
export default function StatsPanel({ stats, loading }) {
  const items = [
    { label: "Total", value: stats.total, dot: "bg-ink" },
    { label: "Pending", value: stats.pending, dot: STATUS_STYLES.Pending.dot },
    { label: "In Progress", value: stats.inProgress, dot: STATUS_STYLES["In Progress"].dot },
    { label: "Completed", value: stats.completed, dot: STATUS_STYLES.Completed.dot },
  ];

  const percentDone = stats.total ? Math.round((stats.completed / stats.total) * 100) : 0;

  return (
    <section aria-label="Task statistics" className="rounded-2xl border border-line bg-surface">
      <dl className="grid grid-cols-2 divide-line sm:grid-cols-4 sm:divide-x">
        {items.map((item, index) => (
          <div
            key={item.label}
            className={`px-5 py-4 ${index > 1 ? "border-t border-line sm:border-t-0" : ""} ${
              index % 2 === 1 ? "border-l border-line sm:border-l-0" : ""
            }`}
          >
            <dt className="flex items-center gap-2 text-sm text-muted">
              <span className={`h-2 w-2 rounded-full ${item.dot}`} aria-hidden="true" />
              {item.label}
            </dt>
            <dd className="mt-1 font-display text-3xl font-bold tabular-nums">
              {loading ? <span className="text-line">–</span> : item.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="flex items-center gap-3 border-t border-line px-5 py-3">
        <div
          className="h-2 flex-1 overflow-hidden rounded-full bg-paper"
          role="progressbar"
          aria-valuenow={percentDone}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Percentage of tasks completed"
        >
          <div
            className="h-full rounded-full bg-emerald-600 transition-[width] duration-500"
            style={{ width: `${percentDone}%` }}
          />
        </div>
        <span className="w-24 text-right text-sm text-muted">{percentDone}% completed</span>
      </div>
    </section>
  );
}
