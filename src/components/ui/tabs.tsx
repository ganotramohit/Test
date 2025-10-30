import * as TabsPrimitive from '@radix-ui/react-tabs';
import clsx from 'clsx';

export const Tabs = TabsPrimitive.Root;

export const TabsList = ({ className, ...props }: TabsPrimitive.TabsListProps) => (
  <TabsPrimitive.List
    className={clsx(
      'inline-flex h-10 items-center justify-center rounded-md bg-slate-100 p-1 text-slate-600',
      className
    )}
    {...props}
  />
);

export const TabsTrigger = ({ className, ...props }: TabsPrimitive.TabsTriggerProps) => (
  <TabsPrimitive.Trigger
    className={clsx(
      'inline-flex min-w-[120px] items-center justify-center gap-2 rounded px-3 py-2 text-sm font-medium transition-all data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm',
      className
    )}
    {...props}
  />
);

export const TabsContent = ({ className, ...props }: TabsPrimitive.TabsContentProps) => (
  <TabsPrimitive.Content className={clsx('mt-6 focus-visible:outline-none', className)} {...props} />
);
