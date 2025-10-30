import { BrainCircuit, Compass } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b border-slate-200 bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-900 text-white">
            <BrainCircuit className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-900">DACI Role Assignment Assistant</h1>
            <p className="text-sm text-slate-600">
              Intelligence to orchestrate Drivers, Approvers, Contributors, and Informed stakeholders with confidence.
            </p>
          </div>
        </div>
        <div className="hidden items-center rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-600 md:flex">
          <Compass className="mr-2 h-4 w-4" />
          Decision intelligence mode
        </div>
      </div>
    </header>
  );
}
