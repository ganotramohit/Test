import { useMemo } from 'react';
import { Trash2, UsersRound } from 'lucide-react';
import type { Stakeholder } from '../lib/types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface StakeholderTableProps {
  stakeholders: Stakeholder[];
  onRemove?: (id: string) => void;
}

export function StakeholderTable({ stakeholders, onRemove }: StakeholderTableProps) {
  const byDepartment = useMemo(() => {
    return stakeholders.reduce<Record<string, Stakeholder[]>>((acc, stakeholder) => {
      const key = stakeholder.department;
      acc[key] = acc[key] ? [...acc[key], stakeholder] : [stakeholder];
      return acc;
    }, {});
  }, [stakeholders]);

  return (
    <Card>
      <CardHeader className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900/90 text-white">
            <UsersRound className="h-5 w-5" />
          </div>
          <div>
            <CardTitle>Stakeholder landscape</CardTitle>
            <p className="text-sm text-slate-600">{stakeholders.length} stakeholders in scope</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {Object.entries(byDepartment).map(([department, members]) => (
          <div key={department} className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">{department}</h3>
              <Badge variant="neutral">{members.length}</Badge>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {members.map(member => (
                <div
                  key={member.id}
                  className="rounded-lg border border-slate-200 bg-white/70 p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{member.name}</p>
                      <p className="text-xs uppercase tracking-wide text-slate-500">
                        {member.roleTitle}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-slate-500">
                        {member.seniority.replace('-', ' ')}
                      </span>
                      {onRemove ? (
                        <Button
                          type="button"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-slate-400 hover:text-rose-500"
                          onClick={() => onRemove(member.id)}
                          aria-label={`Remove ${member.name}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      ) : null}
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-600">
                    <DetailPill label="Influence" value={`${member.decisionInfluence}/5`} />
                    <DetailPill label="Leadership" value={`${member.leadershipScore}/5`} />
                    <DetailPill label="Availability" value={member.availability} />
                  </div>
                  <div className="mt-3 text-xs text-slate-600">
                    <p className="font-medium text-slate-700">Expertise focus</p>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {member.domainExpertise.map(item => (
                        <span
                          key={item}
                          className="rounded-full bg-slate-100 px-2 py-0.5 capitalize text-[11px] text-slate-600"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

interface DetailPillProps {
  label: string;
  value: string;
}

function DetailPill({ label, value }: DetailPillProps) {
  return (
    <span className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5">
      <span className="text-[10px] uppercase tracking-wide text-slate-500">{label}</span>
      <span className="text-xs font-semibold text-slate-700 capitalize">{value}</span>
    </span>
  );
}
