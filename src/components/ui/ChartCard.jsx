
export default function ChartCard({ title, subtitle, children }) {
  return (
    <div
      className="
        w-full min-w-0 rounded-xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm
        transition-all duration-200 ease-out
        motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-md
        motion-reduce:transition-none
      "
    >
      <div className="mb-1 border-b border-dashed border-slate-200 pb-3">
        <h3 className="text-sm font-semibold text-slate-700 truncate" title={title}>
          {title}
        </h3>
        {subtitle && (
          <p className="mt-0.5 text-xs text-slate-400 truncate" title={subtitle}>
            {subtitle}
          </p>
        )}
      </div>
      <div className="w-full min-w-0 pt-3 overflow-x-auto scrolling-touch">
        {children}
      </div>
    </div>
  );
}