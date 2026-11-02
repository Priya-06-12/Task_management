import TaskCard from "./TaskCard";

export default function TaskList({
  tasks,
  loading,
  error,
  hasFilters,
  onRetry,
  onAdd,
  onEdit,
  onDelete,
  onClearFilters,
}) {
  // Loading skeletons
  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-busy="true" aria-live="polite">
        <span className="sr-only">Loading tasks…</span>
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-40 animate-pulse rounded-2xl border border-line bg-surface" />
        ))}
      </div>
    );
  }

  // Failed to load
  if (error) {
    return (
      <div role="alert" className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
        <p className="font-display text-xl font-semibold text-red-900">Couldn’t load your tasks</p>
        <p className="mt-1 text-sm text-red-800">{error}</p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-4 rounded-xl bg-red-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-800"
        >
          Try again
        </button>
      </div>
    );
  }

  // Nothing to show
  if (tasks.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-line bg-surface/60 p-10 text-center">
        <p className="font-display text-xl font-semibold">
          {hasFilters ? "No tasks match your filters" : "No tasks yet"}
        </p>
        <p className="mt-1 text-sm text-muted">
          {hasFilters
            ? "Try a different search or status."
            : "Add your first task to start tracking your work."}
        </p>
        <button
          type="button"
          onClick={hasFilters ? onClearFilters : onAdd}
          className="mt-4 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
        >
          {hasFilters ? "Clear filters" : "Add task"}
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {tasks.map((task) => (
        <TaskCard key={task._id} task={task} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </div>
  );
}
