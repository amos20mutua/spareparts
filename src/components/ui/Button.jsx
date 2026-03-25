import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const variants = {
  primary: 'bg-brand-700 text-white shadow-[0_18px_40px_-26px_rgba(16,77,164,0.85)] hover:bg-brand-800 focus:ring-brand-200',
  secondary: 'bg-white text-ink-900 ring-1 ring-inset ring-stone-300 hover:bg-stone-50 hover:ring-stone-400 focus:ring-stone-200',
  ghost: 'bg-transparent text-ink-700 hover:bg-stone-100 focus:ring-stone-200',
  accent: 'bg-accent text-white shadow-[0_18px_40px_-26px_rgba(234,125,35,0.85)] hover:bg-orange-600 focus:ring-orange-200',
};

const sizes = {
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-5 py-3 text-sm',
  sm: 'px-3.5 py-2 text-sm',
};

const Button = forwardRef(({ className, variant = 'primary', size = 'md', type = 'button', asChild = false, ...props }, ref) => {
  const Component = asChild ? 'span' : 'button';

  return (
    <Component
      ref={ref}
      type={asChild ? undefined : type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition duration-200 focus:outline-none focus:ring-4 disabled:cursor-not-allowed disabled:opacity-60 active:translate-y-px',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    />
  );
});

Button.displayName = 'Button';

export default Button;
