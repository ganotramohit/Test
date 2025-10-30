import { CheckCircle2, CircleAlert, CircleDashed } from 'lucide-react';
import type { AssignmentRecommendation, AssignmentInsight } from '../lib/types';
import { Badge } from './ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface RecommendationPanelProps {
  recommendations: AssignmentRecommendation[];
  insights: AssignmentInsight[];
}

const roleLabel: Record<AssignmentRecommendation['role'], string> = {
  driver: 'Driver',
  approver: 'Approver',
  contributor: 'Contributors',
  informed: 'Informed'
};

export function RecommendationPanel({ recommendations, insights }: RecommendationPanelProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <Card className="order-2 h-full lg:order-1">
        <CardHeader>
          <CardTitle>Recommended DACI assignments</CardTitle>
          <p className="mt-1 text-sm text-slate-600">
            AI-evaluated stakeholders ranked by expertise alignment, leadership, and decision influence.
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {recommendations.map(recommendation => (
            <div key={recommendation.role} className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    {roleLabel[recommendation.role]}
                  </p>
                  <p className="text-xs text-slate-500">
                    {recommendation.role === 'contributor'
                      ? 'Primary contributor plus next-best alternates'
                      : 'Top match with best available alternates'}
                  </p>
                </div>
                {recommendation.primary && (
                  <Badge variant="success" className="flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    {Math.round(recommendation.primary.normalizedScore)}%
                  </Badge>
                )}
              </div>
              <div className="rounded-lg border border-slate-200 bg-white/60">
                {recommendation.primary ? (
                  <div className="border-b border-slate-100 p-4">
                    <RoleRow
                      title={recommendation.primary.stakeholderName}
                      subtitle="Primary"
                      score={recommendation.primary.normalizedScore}
                      justification={recommendation.primary.justification}
                    />
                  </div>
                ) : (
                  <div className="p-4 text-sm text-slate-500">Not enough data to recommend a primary.</div>
                )}
                <div className="divide-y divide-slate-100">
                  {recommendation.alternates.map(alt => (
                    <div key={alt.stakeholderId} className="p-4">
                      <RoleRow
                        title={alt.stakeholderName}
                        subtitle="Alternate"
                        score={alt.normalizedScore}
                        justification={alt.justification}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="order-1 lg:order-2">
        <CardHeader>
          <CardTitle>Insights & guardrails</CardTitle>
          <p className="mt-1 text-sm text-slate-600">
            Key signals to validate with leadership before finalizing assignments.
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {insights.length === 0 ? (
            <div className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
              <CheckCircle2 className="h-5 w-5" />
              Balanced assignments with no critical blockers detected.
            </div>
          ) : (
            insights.map(insight => (
              <div
                key={insight.title}
                className="rounded-lg border border-slate-200 bg-white/60 p-4 text-sm text-slate-700"
              >
                <div className="flex items-start gap-3">
                  {insight.severity === 'critical' ? (
                    <CircleAlert className="mt-0.5 h-5 w-5 text-rose-500" />
                  ) : insight.severity === 'warning' ? (
                    <CircleAlert className="mt-0.5 h-5 w-5 text-amber-500" />
                  ) : (
                    <CircleDashed className="mt-0.5 h-5 w-5 text-slate-400" />
                  )}
                  <div>
                    <p className="font-semibold text-slate-900">{insight.title}</p>
                    <p className="mt-1 text-sm text-slate-600">{insight.description}</p>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}

interface RoleRowProps {
  title: string;
  subtitle: string;
  score: number;
  justification: string[];
}

function RoleRow({ title, subtitle, score, justification }: RoleRowProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-slate-900">{title}</p>
          <p className="text-xs text-slate-500">{subtitle}</p>
        </div>
        <span className="text-sm font-semibold text-slate-700">{Math.round(score)}%</span>
      </div>
      <ul className="space-y-1 text-xs text-slate-600">
        {justification.slice(0, 3).map(reason => (
          <li key={reason} className="flex items-start gap-2 leading-relaxed">
            <span className="mt-1 h-1.5 w-1.5 rounded-full bg-slate-400" />
            {reason}
          </li>
        ))}
      </ul>
    </div>
  );
}
