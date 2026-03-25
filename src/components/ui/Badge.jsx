import { cn } from '@/lib/utils';

const palette = {
  'In Stock': 'bg-ink-100 text-ink-800 ring-ink-200',
  'Low Stock': 'bg-ink-200 text-ink-800 ring-ink-300',
  'Out of Stock': 'bg-brand-100 text-brand-700 ring-brand-200',
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
