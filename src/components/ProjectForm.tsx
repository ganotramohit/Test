import { useMemo } from 'react';
import type { ProjectRequirement } from '../lib/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';

interface ProjectFormProps {
  project: ProjectRequirement;
  onChange: (project: ProjectRequirement) => void;
}

export function ProjectForm({ project, onChange }: ProjectFormProps) {
  const urgencyOptions = useMemo(() => [1, 2, 3, 4, 5], []);

  const update = <K extends keyof ProjectRequirement>(key: K, value: ProjectRequirement[K]) => {
    onChange({ ...project, [key]: value });
  };

  const updateList = (key: keyof Pick<ProjectRequirement, 'requiredExpertise' | 'requiredDepartments'>, value: string) => {
    const values = value.split(',').map(item => item.trim()).filter(Boolean);
    onChange({ ...project, [key]: values });
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Project alignment</CardTitle>
        <p className="mt-1 text-sm text-slate-600">Describe the decision so the engine understands context.</p>
      </CardHeader>
      <CardContent className="space-y-5 text-sm">
        <div className="space-y-2">
          <Label htmlFor="project-name">Project name</Label>
          <Input
            id="project-name"
            value={project.name}
            onChange={event => update('name', event.target.value)}
            placeholder="Unified customer experience platform"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="project-description">Problem statement</Label>
          <Textarea
            id="project-description"
            value={project.description}
            onChange={event => update('description', event.target.value)}
            rows={4}
            placeholder="Summarize the decision that needs DACI coverage"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="decision-type">Decision type</Label>
            <select
              id="decision-type"
              className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              value={project.decisionType}
              onChange={event => update('decisionType', event.target.value as ProjectRequirement['decisionType'])}
            >
              <option value="strategic">Strategic</option>
              <option value="tactical">Tactical</option>
              <option value="operational">Operational</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="project-domain">Domain</Label>
            <select
              id="project-domain"
              className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              value={project.domain}
              onChange={event => update('domain', event.target.value as ProjectRequirement['domain'])}
            >
              <option value="strategy">Strategy</option>
              <option value="product">Product</option>
              <option value="engineering">Engineering</option>
              <option value="marketing">Marketing</option>
              <option value="operations">Operations</option>
              <option value="finance">Finance</option>
              <option value="people">People & Culture</option>
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="criticality">Criticality</Label>
            <select
              id="criticality"
              className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              value={project.criticality}
              onChange={event => update('criticality', event.target.value as ProjectRequirement['criticality'])}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="time-horizon">Time horizon</Label>
            <select
              id="time-horizon"
              className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
              value={project.timeHorizon}
              onChange={event => update('timeHorizon', event.target.value as ProjectRequirement['timeHorizon'])}
            >
              <option value="near-term">Near-term</option>
              <option value="mid-term">Mid-term</option>
              <option value="long-term">Long-term</option>
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="urgency">Urgency</Label>
          <div className="flex items-center gap-3">
            {urgencyOptions.map(option => (
              <button
                key={option}
                type="button"
                className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold transition-colors ${
                  project.urgency === option
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                }`}
                onClick={() => update('urgency', option as ProjectRequirement['urgency'])}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="success-criteria">Success criteria</Label>
          <Textarea
            id="success-criteria"
            value={project.successCriteria.join('\n')}
            onChange={event =>
              onChange({ ...project, successCriteria: event.target.value.split('\n').filter(Boolean) })
            }
            rows={3}
            placeholder="Enter one per line"
          />
        </div>

        <div className="space-y-2">
          <Label>Required expertise</Label>
          <Input
            value={project.requiredExpertise.join(', ')}
            onChange={event => updateList('requiredExpertise', event.target.value)}
            placeholder="Platform architecture, customer experience, ..."
          />
        </div>

        <div className="space-y-2">
          <Label>Required departments</Label>
          <Input
            value={project.requiredDepartments.join(', ')}
            onChange={event => updateList('requiredDepartments', event.target.value)}
            placeholder="Product, Engineering, Operations"
          />
        </div>
      </CardContent>
    </Card>
  );
}
