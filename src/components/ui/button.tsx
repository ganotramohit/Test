import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import clsx from 'clsx';

const baseStyles =
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60';

const variants = {
  primary: 'bg-slate-900 text-white hover:bg-slate-800',
  secondary: 'bg-white text-slate-900 border border-slate-200 hover:bg-slate-50',
  outline: 'border border-slate-200 text-slate-900 hover:bg-slate-50',
  ghost: 'hover:bg-slate-100 text-slate-700'
} satisfies Record<string, string>;

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  variant?: keyof typeof variants;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp ref={ref} className={clsx(baseStyles, variants[variant], className)} {...props} />
    );
  }
);

Button.displayName = 'Button';
