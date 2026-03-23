import { cn } from '@/lib/utils';

const palette = {
  'In Stock': 'bg-emerald-100 text-emerald-800 ring-emerald-200',
  'Low Stock': 'bg-amber-100 text-amber-800 ring-amber-200',
  'Out of Stock': 'bg-rose-100 text-rose-800 ring-rose-200',
  default: 'bg-ink-100 text-ink-700 ring-ink-200',
};

export default function Badge({ children, className }) {
  const theme = palette[children] || palette.default;
  return (
    <span className={cn('inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.08em] ring-1 ring-inset', theme, className)}>
      {children}
    </span>
  );
}
