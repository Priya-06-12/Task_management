import { useCallback, useEffect, useRef, useState } from "react";
import {
  createTask,
  deleteTask,
  fetchStats,
  fetchTasks,
  getErrorMessage,
  updateTask,
} from "./services/api";
import useDebounce from "./hooks/useDebounce";
import StatsPanel from "./components/StatsPanel";
import FilterBar from "./components/FilterBar";
import TaskList from "./components/TaskList";
import TaskFormModal from "./components/TaskFormModal";
import ConfirmDialog from "./components/ConfirmDialog";
import Toast from "./components/Toast";

const emptyStats = { total: 0, pending: 0, inProgress: 0, completed: 0 };

export default function App() {
  // Data
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(emptyStats);

  // Loading and error state
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  // Filters
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 400);

  // Modals: formTask is undefined (closed), null (adding) or a task (editing)
  const [formTask, setFormTask] = useState(undefined);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState("");
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // Toast message
  const [toast, setToast] = useState(null);
  const dismissToast = useCallback(() => setToast(null), []);

  // Ignore responses from older requests (e.g. while the user keeps typing)
  const latestRequest = useRef(0);

  const loadTasks = useCallback(async () => {
    const requestId = ++latestRequest.current;
    setLoading(true);
    setLoadError("");
    try {
      const data = await fetchTasks({ status: filter, search: debouncedSearch });
      if (requestId === latestRequest.current) setTasks(data);
    } catch (error) {
      if (requestId === latestRequest.current) setLoadError(getErrorMessage(error));
    } finally {
      if (requestId === latestRequest.current) setLoading(false);
    }
  }, [filter, debouncedSearch]);

  const loadStats = useCallback(async () => {
    try {
      setStats(await fetchStats());
    } catch (error) {
      // Stats are secondary, so a failure only shows a message
      setToast({ type: "error", message: getErrorMessage(error) });
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  // ---------- Handlers ----------

  const openAddForm = () => {
    setFormError("");
    setFormTask(null);
  };

  const openEditForm = (task) => {
    setFormError("");
    setFormTask(task);
  };

  const closeForm = useCallback(() => setFormTask(undefined), []);

  const handleSave = async (values) => {
    const isEditing = Boolean(formTask);
    setSaving(true);
    setFormError("");
    try {
      if (isEditing) await updateTask(formTask._id, values);
      else await createTask(values);

      setFormTask(undefined);
      setToast({
        type: "success",
        message: isEditing ? "Task updated." : "Task added.",
      });
      loadTasks();
      loadStats();
    } catch (error) {
      setFormError(getErrorMessage(error));
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteTask(taskToDelete._id);
      setTaskToDelete(null);
      setToast({ type: "success", message: "Task deleted." });
      loadTasks();
      loadStats();
    } catch (error) {
      setTaskToDelete(null);
      setToast({ type: "error", message: getErrorMessage(error) });
    } finally {
      setDeleting(false);
    }
  };

  const clearFilters = () => {
    setFilter("All");
    setSearch("");
  };

  const counts = {
    All: stats.total,
    Pending: stats.pending,
    "In Progress": stats.inProgress,
    Completed: stats.completed,
  };

  return (
    <div className="min-h-screen">
      <header className="border-b border-line bg-surface">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand"
              aria-hidden="true"
            >
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12.5l4.5 4.5L19 7.5" />
              </svg>
            </span>
            <div>
              <h1 className="font-display text-2xl font-bold leading-none">Task Manager</h1>
              <p className="mt-1 text-sm text-muted">Plan it, track it, finish it.</p>
            </div>
          </div>
          <button
            type="button"
            onClick={openAddForm}
            className="rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
          >
            Add task
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 sm:py-8">
        <StatsPanel stats={stats} loading={statsLoading} />

        <FilterBar
          activeFilter={filter}
          onFilterChange={setFilter}
          search={search}
          onSearchChange={setSearch}
          counts={counts}
        />

        <TaskList
          tasks={tasks}
          loading={loading}
          error={loadError}
          hasFilters={filter !== "All" || search.trim() !== ""}
          onRetry={loadTasks}
          onAdd={openAddForm}
          onEdit={openEditForm}
          onDelete={setTaskToDelete}
          onClearFilters={clearFilters}
        />
      </main>

      {formTask !== undefined && (
        <TaskFormModal
          key={formTask?._id || "new"}
          task={formTask}
          saving={saving}
          serverError={formError}
          onSubmit={handleSave}
          onClose={closeForm}
        />
      )}

      {taskToDelete && (
        <ConfirmDialog
          task={taskToDelete}
          deleting={deleting}
          onConfirm={handleDelete}
          onCancel={() => setTaskToDelete(null)}
        />
      )}

      <Toast toast={toast} onDismiss={dismissToast} />
    </div>
  );
}
