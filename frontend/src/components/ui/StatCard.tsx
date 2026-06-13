interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
}

const StatCard = ({ title, value, subtitle }: StatCardProps) => (
  <div className="rounded-3xl bg-white p-6 shadow-sm">
    <div className="text-sm text-slate-500">{title}</div>
    <div className="mt-3 flex items-baseline justify-between gap-4">
      <div className="text-2xl font-semibold text-slate-900">{value}</div>
      {subtitle && <div className="text-sm text-slate-500">{subtitle}</div>}
    </div>
  </div>
);

export default StatCard;
