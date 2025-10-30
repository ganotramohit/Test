import type { PropsWithChildren } from 'react';
import clsx from 'clsx';

interface CardProps extends PropsWithChildren {
  className?: string;
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={clsx('rounded-lg border border-slate-200 bg-white shadow-sm', className)}>{children}</div>
  );
}

export function CardHeader({ children, className }: CardProps) {
  return <div className={clsx('border-b border-slate-100 px-6 py-4', className)}>{children}</div>;
}

export function CardTitle({ children, className }: CardProps) {
  return <h2 className={clsx('text-base font-semibold text-slate-900', className)}>{children}</h2>;
}

export function CardDescription({ children, className }: CardProps) {
  return <p className={clsx('text-sm text-slate-600', className)}>{children}</p>;
}

export function CardContent({ children, className }: CardProps) {
  return <div className={clsx('px-6 py-5', className)}>{children}</div>;
}

export function CardFooter({ children, className }: CardProps) {
  return <div className={clsx('border-t border-slate-100 px-6 py-4', className)}>{children}</div>;
}
