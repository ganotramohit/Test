import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import type { ProjectRequirement } from '../lib/types';

interface ProjectBriefProps {
  project: ProjectRequirement;
}

const labelMap: Record<ProjectRequirement['domain'], string> = {
  strategy: 'Strategy',
  product: 'Product',
  engineering: 'Engineering',
  marketing: 'Marketing',
  operations: 'Operations',
  finance: 'Finance',
  people: 'People & Culture'
};

export function ProjectBrief({ project }: ProjectBriefProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{project.name}</span>
          <Badge className="capitalize" variant="neutral">
            {labelMap[project.domain]}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div>
          <p className="text-slate-600">{project.description}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <ProjectDetail label="Decision type" value={project.decisionType} />
          <ProjectDetail label="Criticality" value={project.criticality} />
          <ProjectDetail label="Time horizon" value={project.timeHorizon} />
          <ProjectDetail label="Urgency" value={`${project.urgency}/5`} />
        </div>
        <div>
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Success criteria
          </h3>
          <ul className="mt-2 space-y-1">
            {project.successCriteria.map(item => (
              <li key={item} className="flex items-center gap-2 text-slate-600">
                <span className="h-1.5 w-1.5 rounded-full bg-slate-400" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <ChipGroup label="Required expertise" items={project.requiredExpertise} />
          <ChipGroup label="Departments" items={project.requiredDepartments} />
        </div>
      </CardContent>
    </Card>
  );
}

interface ProjectDetailProps {
  label: string;
  value: string;
}

function ProjectDetail({ label, value }: ProjectDetailProps) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="text-sm font-medium capitalize text-slate-900">{value}</p>
    </div>
  );
}

interface ChipGroupProps {
  label: string;
  items: string[];
}

function ChipGroup({ label, items }: ChipGroupProps) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {items.map(item => (
          <span key={item} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-700">
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
