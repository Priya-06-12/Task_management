// Example output: "2 Nov 2026, 10:45 am"
export const formatDate = (isoString) =>
  new Date(isoString).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
