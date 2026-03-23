import { cn } from '@/lib/utils';

export function getNavLinkClass({ isActive }) {
  return cn('text-sm font-semibold transition', isActive ? 'text-brand-700' : 'text-ink-700 hover:text-brand-700');
}
