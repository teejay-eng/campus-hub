export default function Alert({ type = "info", children }) {
  const styles = {
    success: "bg-emerald-50 text-emerald-800 border-emerald-200",
    error: "bg-red-50 text-red-800 border-red-200",
    info: "bg-blue-50 text-blue-800 border-blue-200",
    warning: "bg-amber-50 text-amber-900 border-amber-200",
  };

  return (
    <div className={`rounded-lg border px-4 py-3 text-sm ${styles[type]}`}>{children}</div>
  );
}
