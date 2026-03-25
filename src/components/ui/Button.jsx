import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

const variants = {
  primary: 'bg-brand-500 text-white shadow-[0_18px_40px_-26px_rgba(230,57,70,0.7)] hover:bg-brand-600 focus:ring-brand-200',
  secondary: 'bg-white text-ink-900 ring-1 ring-inset ring-ink-200 hover:bg-ink-50 hover:ring-ink-300 focus:ring-ink-200',
  ghost: 'bg-transparent text-ink-700 hover:bg-ink-100 focus:ring-ink-200',
  accent: 'bg-ink-800 text-white shadow-[0_18px_40px_-26px_rgba(11,11,13,0.55)] hover:bg-ink-900 focus:ring-ink-200',
};

const sizes = {
  lg: 'px-4.5 py-2.75 text-sm',
  md: 'px-4 py-2.25 text-sm',
  sm: 'px-3 py-1.75 text-[13px]',
  xs: 'px-2.5 py-1.5 text-[12px]',
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
