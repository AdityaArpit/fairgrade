export default function FormField({
  as = 'input',
  label,
  className = '',
  ...props
}) {
  const Component = as;

  return (
    <label className="block">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <Component
        className={`mt-2 w-full rounded-lg border border-slate-200 bg-white px-3.5 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 ${className}`}
        {...props}
      />
    </label>
  );
}
