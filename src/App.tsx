import { useState } from 'react';
import { RefreshCw, Rocket, ShieldAlert } from 'lucide-react';
import { Header } from './components/Header';
import { ProjectBrief } from './components/ProjectBrief';
import { ProjectForm } from './components/ProjectForm';
import { StakeholderTable } from './components/StakeholderTable';
import { StakeholderForm } from './components/StakeholderForm';
import { RecommendationPanel } from './components/RecommendationPanel';
import { CoverageMetrics } from './components/CoverageMetrics';
import { SummaryPanel } from './components/SummaryPanel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Button } from './components/ui/button';
import { Badge } from './components/ui/badge';
import { sampleContext } from './data/sampleData';
import { useAssignmentEngine } from './hooks/useAssignmentEngine';
import { calculateDecisionCycleRisk } from './lib/roleEngine';
import { Toaster, toast } from 'sonner';

export default function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const assignment = useAssignmentEngine(sampleContext);
  const { project, setProject, stakeholders, addStakeholder, removeStakeholder, result, run, lastRun } = assignment;

  const handleRun = () => {
    const output = run();
    toast.success('Role recommendations refreshed');
    if (output.insights.some(insight => insight.severity === 'critical')) {
      toast.warning('Review critical insights before finalizing assignments');
    }
  };

  const decisionRisk = calculateDecisionCycleRisk({ project, stakeholders }, result.recommendations);

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />
      <main className="mx-auto mt-8 flex max-w-6xl flex-col gap-8 px-6 pb-12">
        <section className="flex flex-col gap-6 lg:grid lg:grid-cols-[1.2fr_1fr]">
          <ProjectBrief project={project} />
          <div className="flex h-full flex-col gap-4">
            <ProjectForm project={project} onChange={setProject} />
            <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                    Assignment engine
                  </span>
                  <p className="text-sm text-slate-600">
                    Generates optimal DACI mapping across {stakeholders.length} stakeholders.
                  </p>
                </div>
                <Button variant="outline" onClick={handleRun} className="gap-2">
                  <RefreshCw className="h-4 w-4" /> Refresh recommendations
                </Button>
              </div>
              {lastRun ? (
                <p className="mt-2 text-xs text-slate-500">
                  Last recalculated {lastRun.toLocaleString()}
                </p>
              ) : (
                <p className="mt-2 text-xs text-slate-500">Using seeded sample data</p>
              )}
            </div>
            {decisionRisk ? (
              <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                <ShieldAlert className="mt-0.5 h-5 w-5" />
                <div>
                  <p className="font-semibold text-amber-800">{decisionRisk.title}</p>
                  <p className="text-amber-700/90">{decisionRisk.description}</p>
                </div>
              </div>
            ) : null}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <StakeholderTable stakeholders={stakeholders} onRemove={removeStakeholder} />
          <StakeholderForm onAdd={addStakeholder} />
        </section>

        <section className="rounded-xl border border-slate-200 bg-white/70 p-6 shadow-sm">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <TabsList>
                <TabsTrigger value="overview" className="gap-2">
                  <Rocket className="h-4 w-4" /> Overview
                </TabsTrigger>
                <TabsTrigger value="assignments" className="gap-2">
                  <Badge variant="neutral">DACI</Badge> Recommendations
                </TabsTrigger>
                <TabsTrigger value="analytics" className="gap-2">
                  Metrics
                </TabsTrigger>
              </TabsList>
              <div className="text-xs text-slate-500">
                {result.recommendations.length ? 'Assignments ready for review' : 'Run the engine to generate insights'}
              </div>
            </div>

            <TabsContent value="overview">
              <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
                <RecommendationPanel recommendations={result.recommendations} insights={result.insights} />
                <SummaryPanel summary={result.summary} />
              </div>
            </TabsContent>

            <TabsContent value="assignments">
              <RecommendationPanel recommendations={result.recommendations} insights={result.insights} />
            </TabsContent>

            <TabsContent value="analytics">
              <CoverageMetrics metrics={result.coverage} />
            </TabsContent>
          </Tabs>
        </section>
      </main>
      <Toaster position="top-right" richColors />
    </div>
  );
}
