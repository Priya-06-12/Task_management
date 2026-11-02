import { useEffect } from "react";

// Small message in the bottom corner. Disappears by itself after 4 seconds.
export default function Toast({ toast, onDismiss }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(onDismiss, 4000);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  const isError = toast.type === "error";

  return (
    <div className="fixed inset-x-4 bottom-4 z-[60] flex justify-center sm:inset-x-auto sm:right-6 sm:bottom-6">
      <div
        role={isError ? "alert" : "status"}
        className={`flex w-full max-w-sm items-start gap-3 rounded-xl px-4 py-3 text-sm text-white shadow-lg ${
          isError ? "bg-red-700" : "bg-brand"
        }`}
      >
        <p className="flex-1">{toast.message}</p>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Dismiss message"
          className="-mr-1 rounded px-1.5 text-lg leading-none text-white/80 hover:text-white"
        >
          ×
        </button>
      </div>
    </div>
  );
}
