import { useEffect } from "react";

export default function ConfirmDialog({ task, deleting, onConfirm, onCancel }) {
  useEffect(() => {
    const handleKey = (e) => e.key === "Escape" && !deleting && onCancel();
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onCancel, deleting]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-ink/50 p-0 sm:items-center sm:p-4"
      onMouseDown={(e) => e.target === e.currentTarget && !deleting && onCancel()}
    >
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        aria-describedby="confirm-text"
        className="w-full max-w-md rounded-t-2xl bg-surface p-6 shadow-xl sm:rounded-2xl"
      >
        <h2 id="confirm-title" className="font-display text-2xl font-bold">
          Delete this task?
        </h2>
        <p id="confirm-text" className="mt-2 text-sm leading-relaxed text-muted">
          “<span className="font-medium text-ink break-words">{task.title}</span>” will be removed
          permanently. This can’t be undone.
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={deleting}
            autoFocus
            className="rounded-xl px-4 py-2.5 text-sm font-medium hover:bg-paper disabled:opacity-50"
          >
            Keep task
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={deleting}
            className="inline-flex min-w-32 items-center justify-center gap-2 rounded-xl bg-red-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-800 disabled:opacity-70"
          >
            {deleting && (
              <span
                className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
                aria-hidden="true"
              />
            )}
            {deleting ? "Deleting…" : "Delete task"}
          </button>
        </div>
      </div>
    </div>
  );
}
