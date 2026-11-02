import { useEffect, useRef, useState } from "react";
import { STATUSES } from "../utils/constants";

const emptyForm = { title: "", description: "", status: "Pending" };

// Same rules as the backend model, so users get instant feedback.
const validate = (form) => {
  const errors = {};
  const title = form.title.trim();

  if (!title) errors.title = "Enter a title for the task.";
  else if (title.length < 3) errors.title = "Title must be at least 3 characters.";
  else if (title.length > 100) errors.title = "Title must be 100 characters or fewer.";

  if (form.description.trim().length > 500) {
    errors.description = "Description must be 500 characters or fewer.";
  }
  if (!STATUSES.includes(form.status)) errors.status = "Choose a valid status.";

  return errors;
};

// task = null  -> "Add task" mode
// task = {...} -> "Edit task" mode
export default function TaskFormModal({ task, saving, serverError, onSubmit, onClose }) {
  const isEditing = Boolean(task);
  const [form, setForm] = useState(
    task ? { title: task.title, description: task.description || "", status: task.status } : emptyForm
  );
  const [errors, setErrors] = useState({});
  const titleRef = useRef(null);

  // Focus the first field and close on Escape
  useEffect(() => {
    titleRef.current?.focus();
    const handleKey = (e) => e.key === "Escape" && !saving && onClose();
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose, saving]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length > 0) return;

    onSubmit({
      title: form.title.trim(),
      description: form.description.trim(),
      status: form.status,
    });
  };

  const fieldClass = (hasError) =>
    `w-full rounded-xl border bg-surface px-3.5 py-2.5 text-sm ${
      hasError ? "border-red-500" : "border-line"
    }`;

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-ink/50 p-0 sm:items-center sm:p-4"
      onMouseDown={(e) => e.target === e.currentTarget && !saving && onClose()}
    >
      <form
        onSubmit={handleSubmit}
        noValidate
        role="dialog"
        aria-modal="true"
        aria-labelledby="task-form-title"
        className="max-h-full w-full max-w-lg overflow-y-auto rounded-t-2xl bg-surface p-6 shadow-xl sm:rounded-2xl"
      >
        <h2 id="task-form-title" className="font-display text-2xl font-bold">
          {isEditing ? "Edit task" : "Add task"}
        </h2>

        {serverError && (
          <p role="alert" className="mt-4 rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-800">
            {serverError}
          </p>
        )}

        <div className="mt-5 space-y-4">
          <div>
            <label htmlFor="title" className="mb-1.5 block text-sm font-medium">
              Title
            </label>
            <input
              ref={titleRef}
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              maxLength={120}
              aria-invalid={Boolean(errors.title)}
              aria-describedby={errors.title ? "title-error" : undefined}
              className={fieldClass(errors.title)}
              placeholder="e.g. Finish the API documentation"
            />
            {errors.title && (
              <p id="title-error" className="mt-1.5 text-sm text-red-700">
                {errors.title}
              </p>
            )}
          </div>

          <div>
            <label htmlFor="description" className="mb-1.5 block text-sm font-medium">
              Description <span className="font-normal text-muted">(optional)</span>
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={form.description}
              onChange={handleChange}
              aria-invalid={Boolean(errors.description)}
              aria-describedby="description-hint"
              className={`${fieldClass(errors.description)} resize-y`}
              placeholder="Add any details you want to remember"
            />
            <div id="description-hint" className="mt-1.5 flex justify-between text-sm">
              <span className="text-red-700">{errors.description}</span>
              <span className={form.description.length > 500 ? "text-red-700" : "text-muted"}>
                {form.description.length}/500
              </span>
            </div>
          </div>

          <div>
            <label htmlFor="status" className="mb-1.5 block text-sm font-medium">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={form.status}
              onChange={handleChange}
              className={fieldClass(errors.status)}
            >
              {STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            {errors.status && <p className="mt-1.5 text-sm text-red-700">{errors.status}</p>}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-paper disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex min-w-32 items-center justify-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-70"
          >
            {saving && <Spinner />}
            {saving ? "Saving…" : isEditing ? "Save changes" : "Add task"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Spinner() {
  return (
    <span
      className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
      aria-hidden="true"
    />
  );
}
