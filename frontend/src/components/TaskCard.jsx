import { STATUS_STYLES } from "../utils/constants";
import { formatDate } from "../utils/formatDate";

export default function TaskCard({ task, onEdit, onDelete }) {
  const style = STATUS_STYLES[task.status];

  return (
    <article className="relative flex flex-col overflow-hidden rounded-2xl border border-line bg-surface">
      {/* Coloured strip on the left shows the status at a glance */}
      <span className={`absolute inset-y-0 left-0 w-1.5 ${style.bar}`} aria-hidden="true" />

      <div className="flex flex-1 flex-col gap-3 py-5 pl-6 pr-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-lg font-semibold leading-snug break-words">
            {task.title}
          </h3>
          <span
            className={`inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-xs font-medium ${style.badge}`}
          >
            {task.status}
          </span>
        </div>

        {task.description ? (
          <p className="text-sm leading-relaxed text-muted break-words">{task.description}</p>
        ) : (
          <p className="text-sm italic text-muted/70">No description</p>
        )}

        <div className="mt-auto flex items-center justify-between gap-2 pt-2">
          <time dateTime={task.createdAt} className="text-xs text-muted">
            Created {formatDate(task.createdAt)}
          </time>
          <div className="flex gap-1">
            <button
              type="button"
              onClick={() => onEdit(task)}
              aria-label={`Edit ${task.title}`}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-ink transition-colors hover:bg-paper"
            >
              Edit
            </button>
            <button
              type="button"
              onClick={() => onDelete(task)}
              aria-label={`Delete ${task.title}`}
              className="rounded-lg px-3 py-1.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-50"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
