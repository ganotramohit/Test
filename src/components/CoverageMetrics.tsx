import type { CoverageMetric } from '../lib/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface CoverageMetricsProps {
  metrics: CoverageMetric[];
}

export function CoverageMetrics({ metrics }: CoverageMetricsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Coverage diagnostics</CardTitle>
        <p className="mt-1 text-sm text-slate-600">
          Alignment between project requirements and stakeholder portfolio.
        </p>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-3">
        {metrics.map(metric => (
          <div key={metric.label} className="rounded-lg border border-slate-200 bg-white/50 p-4 shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {metric.label}
            </p>
            <div className="mt-2 flex items-end gap-2">
              <span className="text-2xl font-semibold text-slate-900">{metric.value}%</span>
              {metric.target ? (
                <Badge variant={metric.value >= metric.target ? 'success' : 'warning'}>
                  Target {metric.target}%
                </Badge>
              ) : null}
            </div>
            <p className="mt-2 text-xs leading-relaxed text-slate-500">{metric.description}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
