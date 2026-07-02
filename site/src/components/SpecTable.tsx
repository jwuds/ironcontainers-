export default function SpecTable({ specs }: { specs: [string, string][] }) {
  if (specs.length === 0) return null;

  return (
    <div className="border border-border-soft">
      <div className="bg-bg-raised-2 px-4 py-2 border-b border-border-soft">
        <span className="font-mono text-xs uppercase tracking-widest text-text-faint">
          Specifications
        </span>
      </div>
      <dl className="divide-y divide-border-soft">
        {specs.map(([label, value]) => (
          <div key={label} className="flex gap-4 px-4 py-2.5 text-sm">
            <dt className="w-2/5 shrink-0 text-text-muted">{label}</dt>
            <dd className="font-mono text-text">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
