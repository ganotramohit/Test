import type { PropsWithChildren } from 'react';
import clsx from 'clsx';

interface BadgeProps extends PropsWithChildren {
  variant?: 'default' | 'success' | 'warning' | 'neutral';
  className?: string;
}

const variantStyles: Record<NonNullable<BadgeProps['variant']>, string> = {
  default: 'bg-slate-900 text-white',
  success: 'bg-emerald-100 text-emerald-700 ring-1 ring-inset ring-emerald-200',
  warning: 'bg-amber-100 text-amber-700 ring-1 ring-inset ring-amber-200',
  neutral: 'bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200'
};

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-medium',
        variantStyles[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
