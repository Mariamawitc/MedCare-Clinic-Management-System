import type { ReactNode } from 'react';

export type DataColumn = string;
export type DataRow = string[];

export const SectionHeading = ({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: ReactNode }) => (
  <div className="mb-4 flex flex-wrap items-end justify-between gap-3"><div>{eyebrow && <p className="text-xs font-semibold uppercase tracking-[0.16em] text-blue-700">{eyebrow}</p>}<h2 className="mt-1 text-xl font-bold text-slate-900">{title}</h2></div>{action}</div>
);

export const MetricCard = ({ label, value, note, icon, tone = 'blue', onClick }: { label: string; value: string; note: string; icon: string; tone?: 'blue' | 'green' | 'amber' | 'violet' | 'rose'; onClick?: () => void }) => {
  const tones = { blue: 'bg-blue-50 text-blue-700', green: 'bg-emerald-50 text-emerald-700', amber: 'bg-amber-50 text-amber-700', violet: 'bg-violet-50 text-violet-700', rose: 'bg-rose-50 text-rose-700' };
  const classes = `group w-full rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${onClick ? 'cursor-pointer' : ''}`;
  const content = <><div className="flex items-start justify-between gap-3"><span className="text-sm font-medium text-slate-500">{label}</span><span className={`grid h-10 w-10 place-items-center rounded-xl text-lg ${tones[tone]}`}>{icon}</span></div><p className="mt-3 text-2xl font-bold text-slate-900">{value}</p><p className="mt-1 text-xs text-slate-500">{note}</p></>;
  return onClick ? <button type="button" onClick={onClick} className={classes}>{content}</button> : <div className={classes}>{content}</div>;
};

export const DataTable = ({ headers, rows, empty = 'No records to display.' }: { headers: DataColumn[]; rows: DataRow[]; empty?: string }) => (
  <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm"><table className="min-w-full divide-y divide-slate-200 text-left text-sm"><thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500"><tr>{headers.map((header) => <th key={header} scope="col" className="whitespace-nowrap px-5 py-3 font-semibold">{header}</th>)}</tr></thead><tbody className="divide-y divide-slate-100 text-slate-700">{rows.length ? rows.map((row, index) => <tr key={`${row[0]}-${index}`} className="hover:bg-slate-50">{row.map((cell, cellIndex) => <td key={`${index}-${cellIndex}`} className="whitespace-nowrap px-5 py-3.5">{cell}</td>)}</tr>) : <tr><td className="px-5 py-8 text-center text-slate-500" colSpan={headers.length}>{empty}</td></tr>}</tbody></table></div>
);

export const Notice = ({ children, tone = 'blue' }: { children: ReactNode; tone?: 'blue' | 'green' | 'amber' }) => {
  const tones = { blue: 'border-blue-100 bg-blue-50 text-blue-900', green: 'border-emerald-100 bg-emerald-50 text-emerald-900', amber: 'border-amber-100 bg-amber-50 text-amber-900' };
  return <div role="status" className={`rounded-xl border px-4 py-3 text-sm ${tones[tone]}`}>{children}</div>;
};

export const PrimaryButton = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => <button {...props} className={`rounded-xl bg-blue-700 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${props.className || ''}`}>{children}</button>;

export const SecondaryButton = ({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) => <button {...props} className={`rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${props.className || ''}`}>{children}</button>;
