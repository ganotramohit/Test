import { useCallback, useMemo, useState } from 'react';
import { generateAssignments } from '../lib/roleEngine';
import type { AssignmentContext, EngineResult, ProjectRequirement, Stakeholder } from '../lib/types';

export function useAssignmentEngine(initialContext: AssignmentContext) {
  const [project, setProject] = useState<ProjectRequirement>(initialContext.project);
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>(initialContext.stakeholders);
  const [result, setResult] = useState<EngineResult>(() => generateAssignments(initialContext));
  const [lastRun, setLastRun] = useState<Date | null>(null);

  const context = useMemo<AssignmentContext>(
    () => ({ project, stakeholders }),
    [project, stakeholders]
  );

  const run = useCallback(() => {
    const output = generateAssignments(context);
    setResult(output);
    setLastRun(new Date());
    return output;
  }, [context]);

  const addStakeholder = useCallback((stakeholder: Stakeholder) => {
    setStakeholders(prev => [...prev, stakeholder]);
  }, []);

  const removeStakeholder = useCallback((id: string) => {
    setStakeholders(prev => prev.filter(stakeholder => stakeholder.id !== id));
  }, []);

  return {
    project,
    setProject,
    stakeholders,
    setStakeholders,
    addStakeholder,
    removeStakeholder,
    context,
    result,
    run,
    lastRun
  };
}
