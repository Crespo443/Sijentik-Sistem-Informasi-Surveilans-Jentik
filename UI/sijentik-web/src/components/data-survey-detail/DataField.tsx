type DataFieldProps = {
  label: string;
  value: string;
  className?: string;
};

export function DataField({ label, value, className = "" }: DataFieldProps) {
  return (
    <div>
      <span className="text-xs font-medium text-text-muted mb-1 block">
        {label}
      </span>
      <div
        className={`text-sm text-text-main font-medium bg-white px-3 py-2 border border-border-subtle rounded flex items-center ${className}`}
      >
        {value}
      </div>
    </div>
  );
}
