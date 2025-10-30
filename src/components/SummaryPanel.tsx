import { Lightbulb, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface SummaryPanelProps {
  summary: string[];
}

export function SummaryPanel({ summary }: SummaryPanelProps) {
  return (
    <Card>
      <CardHeader className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-white">
          <Lightbulb className="h-5 w-5" />
        </div>
        <div>
          <CardTitle>Executive brief</CardTitle>
          <p className="text-sm text-slate-600">Highlights to socialize with decision-makers.</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {summary.length === 0 ? (
          <p className="text-sm text-slate-600">Run the engine to generate a summary.</p>
        ) : (
          summary.map(point => (
            <div key={point} className="flex items-start gap-3 text-sm text-slate-700">
              <Target className="mt-0.5 h-4 w-4 text-slate-400" />
              <p>{point}</p>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
