import { type FormEvent, useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { z } from 'zod';
import type { Stakeholder } from '../lib/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';

interface StakeholderFormProps {
  onAdd: (stakeholder: Stakeholder) => void;
}

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  roleTitle: z.string().min(2),
  department: z.string().min(2),
  seniority: z.enum(['individual-contributor', 'manager', 'director', 'vp', 'c-suite']),
  location: z.enum(['on-site', 'remote', 'hybrid']),
  experienceYears: z.number().min(0).max(40),
  domainExpertise: z.array(z.string()).min(1),
  decisionInfluence: z.number().min(1).max(5),
  leadershipScore: z.number().min(1).max(5),
  collaborationScore: z.number().min(1).max(5),
  availability: z.enum(['limited', 'moderate', 'high']),
  organizationalKnowledge: z.number().min(1).max(5),
  recentDecisionsLed: z.number().min(0).max(10)
});

const initialState: Stakeholder = {
  id: '',
  name: '',
  email: '',
  roleTitle: '',
  department: '',
  seniority: 'manager',
  location: 'hybrid',
  experienceYears: 5,
  domainExpertise: [''],
  decisionInfluence: 3,
  leadershipScore: 3,
  collaborationScore: 4,
  availability: 'moderate',
  organizationalKnowledge: 3,
  recentDecisionsLed: 1
};

export function StakeholderForm({ onAdd }: StakeholderFormProps) {
  const [form, setForm] = useState<Stakeholder>(initialState);
  const [error, setError] = useState<string | null>(null);

  const update = <K extends keyof Stakeholder>(key: K, value: Stakeholder[K]) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const updateList = (value: string) => {
    const items = value.split(',').map(item => item.trim()).filter(Boolean);
    setForm(prev => ({ ...prev, domainExpertise: items.length ? items : [''] }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const parsed = schema.parse({
        ...form,
        domainExpertise: form.domainExpertise.filter(Boolean)
      });
      const stakeholder: Stakeholder = {
        ...parsed,
        id: crypto.randomUUID()
      };
      onAdd(stakeholder);
      setForm(initialState);
      setError(null);
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.issues.map(issue => issue.message).join(', '));
      } else {
        setError('Unable to add stakeholder.');
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add stakeholder</CardTitle>
        <p className="mt-1 text-sm text-slate-600">
          Include new people to broaden coverage. Provide comma-separated lists for expertise areas.
        </p>
      </CardHeader>
      <CardContent>
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Full name">
              <Input value={form.name} onChange={event => update('name', event.target.value)} required />
            </Field>
            <Field label="Work email">
              <Input value={form.email} onChange={event => update('email', event.target.value)} required />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Role title">
              <Input value={form.roleTitle} onChange={event => update('roleTitle', event.target.value)} required />
            </Field>
            <Field label="Department">
              <Input value={form.department} onChange={event => update('department', event.target.value)} required />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Seniority">
              <select
                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                value={form.seniority}
                onChange={event =>
                  update('seniority', event.target.value as Stakeholder['seniority'])
                }
              >
                <option value="individual-contributor">Individual contributor</option>
                <option value="manager">Manager</option>
                <option value="director">Director</option>
                <option value="vp">VP</option>
                <option value="c-suite">C-suite</option>
              </select>
            </Field>
            <Field label="Location">
              <select
                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                value={form.location}
                onChange={event => update('location', event.target.value as Stakeholder['location'])}
              >
                <option value="on-site">On-site</option>
                <option value="remote">Remote</option>
                <option value="hybrid">Hybrid</option>
              </select>
            </Field>
            <Field label="Experience (years)">
              <Input
                type="number"
                min={0}
                max={40}
                value={form.experienceYears}
                onChange={event => update('experienceYears', Number(event.target.value))}
              />
            </Field>
          </div>

          <Field label="Domain expertise">
            <Textarea
              value={form.domainExpertise.filter(Boolean).join(', ')}
              onChange={event => updateList(event.target.value)}
              placeholder="Product strategy, risk management, ..."
              rows={2}
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Decision influence">
              <SliderInput value={form.decisionInfluence} onChange={value => update('decisionInfluence', value)} />
            </Field>
            <Field label="Leadership">
              <SliderInput value={form.leadershipScore} onChange={value => update('leadershipScore', value)} />
            </Field>
            <Field label="Collaboration">
              <SliderInput value={form.collaborationScore} onChange={value => update('collaborationScore', value)} />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Availability">
              <select
                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
                value={form.availability}
                onChange={event => update('availability', event.target.value as Stakeholder['availability'])}
              >
                <option value="limited">Limited</option>
                <option value="moderate">Moderate</option>
                <option value="high">High</option>
              </select>
            </Field>
            <Field label="Organizational knowledge">
              <SliderInput
                value={form.organizationalKnowledge}
                onChange={value => update('organizationalKnowledge', value)}
              />
            </Field>
          </div>

          <Field label="Decisions led in last year">
            <Input
              type="number"
              min={0}
              max={10}
              value={form.recentDecisionsLed}
              onChange={event => update('recentDecisionsLed', Number(event.target.value))}
            />
          </Field>

          {error && <p className="text-sm text-rose-500">{error}</p>}

          <div className="flex justify-end">
            <Button type="submit" className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Add stakeholder
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

interface FieldProps {
  label: string;
  children: React.ReactNode;
}

function Field({ label, children }: FieldProps) {
  return (
    <label className="space-y-1 text-sm">
      <span className="block text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </span>
      {children}
    </label>
  );
}

interface SliderInputProps {
  value: number;
  onChange: (value: 1 | 2 | 3 | 4 | 5) => void;
}

function SliderInput({ value, onChange }: SliderInputProps) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="range"
        min={1}
        max={5}
        value={value}
        onChange={event => onChange(Number(event.target.value) as SliderInputProps['value'])}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200"
      />
      <span className="w-6 text-right text-xs font-semibold text-slate-700">{value}</span>
    </div>
  );
}
