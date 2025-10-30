import { differenceInCalendarDays } from 'date-fns';
import {
  AssignmentContext,
  AssignmentInsight,
  AssignmentRecommendation,
  CoverageMetric,
  DaciRole,
  EngineResult,
  ProjectRequirement,
  RoleScore,
  Stakeholder
} from './types';

type RoleWeightConfig = {
  expertise: number;
  leadership: number;
  influence: number;
  availability: number;
  collaboration: number;
  organizationalKnowledge: number;
  recency: number;
  seniority: number;
};

const ROLE_WEIGHTS: Record<DaciRole, RoleWeightConfig> = {
  driver: {
    expertise: 0.3,
    leadership: 0.2,
    influence: 0.15,
    availability: 0.15,
    collaboration: 0.05,
    organizationalKnowledge: 0.05,
    recency: 0.05,
    seniority: 0.05
  },
  approver: {
    expertise: 0.15,
    leadership: 0.2,
    influence: 0.3,
    availability: 0.05,
    collaboration: 0.05,
    organizationalKnowledge: 0.1,
    recency: 0.05,
    seniority: 0.1
  },
  contributor: {
    expertise: 0.35,
    leadership: 0.05,
    influence: 0.1,
    availability: 0.15,
    collaboration: 0.2,
    organizationalKnowledge: 0.05,
    recency: 0.05,
    seniority: 0.05
  },
  informed: {
    expertise: 0.1,
    leadership: 0.05,
    influence: 0.35,
    availability: 0.05,
    collaboration: 0.05,
    organizationalKnowledge: 0.25,
    recency: 0.05,
    seniority: 0.1
  }
};

const AVAILABILITY_SCORE: Record<Stakeholder['availability'], number> = {
  limited: 0.45,
  moderate: 0.75,
  high: 1
};

const SENIORITY_SCORE: Record<Stakeholder['seniority'], number> = {
  'individual-contributor': 0.4,
  manager: 0.6,
  director: 0.8,
  vp: 0.9,
  'c-suite': 1
};

const CRITICALITY_MULTIPLIER: Record<ProjectRequirement['criticality'], number> = {
  low: 0.9,
  medium: 1,
  high: 1.1
};

const URGENCY_MULTIPLIER: Record<ProjectRequirement['urgency'], number> = {
  1: 0.9,
  2: 0.95,
  3: 1,
  4: 1.05,
  5: 1.1
};

const ROLE_TITLES_FOR_APPROVER = ['director', 'vp', 'c-suite'];

const clamp = (value: number, min = 0, max = 100) => Math.min(max, Math.max(min, value));

function computeExpertiseMatch(stakeholder: Stakeholder, project: ProjectRequirement) {
  const { domainExpertise } = stakeholder;
  const { requiredExpertise, requiredDepartments } = project;
  const expertiseMatches = requiredExpertise.filter(exp =>
    domainExpertise.map(s => s.toLowerCase()).includes(exp.toLowerCase())
  ).length;
  const deptMatch = requiredDepartments.includes(stakeholder.department) ? 1 : 0;
  const expertiseScore = expertiseMatches / Math.max(requiredExpertise.length, 1);
  return (expertiseScore * 0.8 + deptMatch * 0.2) * 100;
}

function computeRecencyScore(stakeholder: Stakeholder, project: ProjectRequirement) {
  if (!stakeholder.recentDecisionsLed) return 40;
  const base = Math.min(5, stakeholder.recentDecisionsLed) / 5;
  const directionalBonus = project.decisionType === 'strategic' && stakeholder.recentDecisionsLed > 2 ? 0.15 : 0;
  return clamp((base + directionalBonus) * 100);
}

function availabilityModifier(project: ProjectRequirement) {
  return project.urgency >= 4 ? 1.1 : 1;
}

function applyConstraintsBoost(
  score: number,
  stakeholder: Stakeholder,
  role: DaciRole,
  context: AssignmentContext,
  justification: string[]
) {
  const { constraints } = context;
  if (constraints?.fixedAssignments?.[role]?.includes(stakeholder.id)) {
    justification.push('Required by constraint');
    return clamp(score + 40);
  }
  const avoid = constraints?.avoidPairings?.find(item => item.stakeholderId === stakeholder.id);
  if (avoid && role !== 'informed') {
    justification.push(`Reduced due to constraint: ${avoid.reason}`);
    return clamp(score * 0.5);
  }
  const prefer = constraints?.preferPairings?.find(
    item => item.stakeholderId === stakeholder.id && item.role === role
  );
  if (prefer) {
    justification.push(`Boosted: ${prefer.reason}`);
    return clamp(score + 10);
  }
  return score;
}

function computeRoleScore(
  stakeholder: Stakeholder,
  context: AssignmentContext,
  role: DaciRole
): RoleScore {
  const { project } = context;
  const weights = ROLE_WEIGHTS[role];
  const justification: string[] = [];
  const expertiseScore = computeExpertiseMatch(stakeholder, project);
  const leadershipScore = stakeholder.leadershipScore * 20;
  const influenceScore = stakeholder.decisionInfluence * 20;
  const availabilityScore = AVAILABILITY_SCORE[stakeholder.availability] * 100;
  const collaborationScore = stakeholder.collaborationScore * 20;
  const orgKnowledgeScore = stakeholder.organizationalKnowledge * 20;
  const recencyScore = computeRecencyScore(stakeholder, project);
  const seniorityScore = SENIORITY_SCORE[stakeholder.seniority] * 100;

  let composite =
    expertiseScore * weights.expertise +
    leadershipScore * weights.leadership +
    influenceScore * weights.influence +
    availabilityScore * weights.availability * availabilityModifier(project) +
    collaborationScore * weights.collaboration +
    orgKnowledgeScore * weights.organizationalKnowledge +
    recencyScore * weights.recency +
    seniorityScore * weights.seniority;

  if (role === 'approver' && !ROLE_TITLES_FOR_APPROVER.includes(stakeholder.seniority)) {
    composite *= 0.8;
    justification.push('Approver typically requires higher seniority');
  }

  composite *= CRITICALITY_MULTIPLIER[project.criticality];
  composite *= URGENCY_MULTIPLIER[project.urgency];

  const finalScore = applyConstraintsBoost(composite, stakeholder, role, context, justification);

  if (expertiseScore > 70) {
    justification.push('Strong expertise alignment');
  }
  if (availabilityScore > 80) {
    justification.push('High availability');
  }
  if (leadershipScore > 80 && role !== 'informed') {
    justification.push('Demonstrated leadership ability');
  }
  if (influenceScore > 80) {
    justification.push('High influence in organization');
  }

  return {
    stakeholderId: stakeholder.id,
    stakeholderName: stakeholder.name,
    role,
    score: composite,
    normalizedScore: clamp(finalScore),
    justification
  };
}

function selectPrimaryAndAlternates(scores: RoleScore[], existingAssignments: Set<string>) {
  const sorted = [...scores].sort((a, b) => b.normalizedScore - a.normalizedScore);
  const primary = sorted.find(candidate => !existingAssignments.has(candidate.stakeholderId)) || null;

  if (primary) {
    existingAssignments.add(primary.stakeholderId);
  }

  const alternates = sorted
    .filter(candidate => candidate.stakeholderId !== primary?.stakeholderId)
    .slice(0, 3);

  return { primary, alternates };
}

function computeCoverage(metrics: RoleScore[], context: AssignmentContext): CoverageMetric[] {
  const departments = new Set(context.project.requiredDepartments);
  const departmentCoverage = new Set(
    metrics
      .filter(score => score.normalizedScore > 60)
      .map(score => context.stakeholders.find(s => s.id === score.stakeholderId)?.department)
      .filter(Boolean) as string[]
  ).size;

  const expertiseCoverage = new Set(
    metrics
      .filter(score => score.normalizedScore > 65)
      .flatMap(score => context.stakeholders.find(s => s.id === score.stakeholderId)?.domainExpertise ?? [])
  );

  const totalExpertiseRequired = new Set(context.project.requiredExpertise);

  const coverage: CoverageMetric[] = [
    {
      label: 'Department coverage',
      value: Math.round((departmentCoverage / Math.max(departments.size, 1)) * 100),
      target: 80,
      description: 'Representation of required departments across top candidates'
    },
    {
      label: 'Expertise coverage',
      value: Math.round((expertiseCoverage.size / Math.max(totalExpertiseRequired.size, 1)) * 100),
      target: 85,
      description: 'Percentage of required expertise covered by top candidates'
    },
    {
      label: 'Leadership bench',
      value: Math.round(
        (metrics.filter(score => score.role !== 'informed' && score.normalizedScore > 75).length /
          Math.max(context.stakeholders.length, 1)) *
          100
      ),
      target: 60,
      description: 'Share of stakeholders capable of leadership roles for this decision'
    }
  ];

  return coverage;
}

function buildInsights(
  recommendations: AssignmentRecommendation[],
  context: AssignmentContext
): AssignmentInsight[] {
  const insights: AssignmentInsight[] = [];
  const driver = recommendations.find(rec => rec.role === 'driver')?.primary;
  const approver = recommendations.find(rec => rec.role === 'approver')?.primary;

  if (driver && approver && driver.stakeholderId === approver.stakeholderId) {
    insights.push({
      title: 'Driver and Approver overlap',
      description:
        'The same individual is recommended for both Driver and Approver. Consider separating to maintain decision governance checks.',
      severity: 'warning'
    });
  }

  const contributorCount = recommendations.find(rec => rec.role === 'contributor')?.alternates.length ?? 0;
  if (contributorCount < 2) {
    insights.push({
      title: 'Limited contributor bench',
      description: 'Fewer than two strong contributor alternates identified. Evaluate whether more subject-matter experts are needed.',
      severity: 'warning'
    });
  }

  const highInfluence = context.stakeholders.filter(stakeholder => stakeholder.decisionInfluence >= 4);
  const informedRecommendation = recommendations.find(rec => rec.role === 'informed');
  if (informedRecommendation) {
    const informedIds = [
      ...(informedRecommendation.primary ? [informedRecommendation.primary.stakeholderId] : []),
      ...informedRecommendation.alternates.map(alt => alt.stakeholderId)
    ];

    const missingInfluencers = highInfluence.filter(stakeholder => !informedIds.includes(stakeholder.id));
    if (missingInfluencers.length) {
      insights.push({
        title: 'High influence stakeholders missing',
        description: `Ensure these influencers stay informed: ${missingInfluencers
          .map(person => person.name)
          .join(', ')}.`,
        severity: 'info'
      });
    }
  }

  return insights;
}

function buildSummary(recommendations: AssignmentRecommendation[], context: AssignmentContext): string[] {
  const driver = recommendations.find(rec => rec.role === 'driver')?.primary;
  const approver = recommendations.find(rec => rec.role === 'approver')?.primary;

  const summary: string[] = [];
  if (driver) {
    summary.push(
      `${driver.stakeholderName} is positioned as Driver based on leadership score ${
        context.stakeholders.find(s => s.id === driver.stakeholderId)?.leadershipScore
      }/5 and ${driver.justification[0]?.toLowerCase() ?? 'strong expertise alignment'}.`
    );
  }
  if (approver) {
    summary.push(
      `${approver.stakeholderName} emerges as Approver with high decision influence and organizational knowledge.`
    );
  }
  return summary;
}

export function generateAssignments(context: AssignmentContext): EngineResult {
  if (!context.stakeholders.length) {
    return {
      recommendations: [],
      roleScores: [],
      insights: [
        {
          title: 'No stakeholders provided',
          description: 'Add stakeholders with relevant expertise to generate role assignments.',
          severity: 'critical'
        }
      ],
      coverage: [],
      summary: []
    };
  }

  const roleScores: RoleScore[] = [];
  const roles: DaciRole[] = ['driver', 'approver', 'contributor', 'informed'];

  for (const stakeholder of context.stakeholders) {
    for (const role of roles) {
      roleScores.push(computeRoleScore(stakeholder, context, role));
    }
  }

  const recommendations: AssignmentRecommendation[] = [];
  const assignedStakeholders = new Set<string>();

  for (const role of roles) {
    const scoresForRole = roleScores.filter(score => score.role === role);
    const { primary, alternates } = selectPrimaryAndAlternates(scoresForRole, assignedStakeholders);

    if (primary && role !== 'informed') {
      assignedStakeholders.add(primary.stakeholderId);
    }

    recommendations.push({
      role,
      primary,
      alternates
    });
  }

  const coverage = computeCoverage(roleScores, context);
  const insights = buildInsights(recommendations, context);
  const summary = buildSummary(recommendations, context);

  return {
    recommendations,
    roleScores,
    insights,
    coverage,
    summary
  };
}

export function rankStakeholdersForRole(
  context: AssignmentContext,
  role: DaciRole
): RoleScore[] {
  return context.stakeholders
    .map(stakeholder => computeRoleScore(stakeholder, context, role))
    .sort((a, b) => b.normalizedScore - a.normalizedScore);
}

export function calculateDecisionCycleRisk(
  context: AssignmentContext,
  assignments: AssignmentRecommendation[]
): AssignmentInsight | null {
  const approver = assignments.find(rec => rec.role === 'approver')?.primary;
  if (!approver) return null;

  const stakeholder = context.stakeholders.find(s => s.id === approver.stakeholderId);
  if (!stakeholder) return null;

  if (stakeholder.availability === 'limited') {
    return {
      title: 'Decision cycle risk',
      description: `${stakeholder.name} has limited availability, which may extend decision timelines. Consider designating a backup approver.`,
      severity: 'warning'
    };
  }

  return null;
}

export function computeTimelinePressure(project: ProjectRequirement & { dueDate?: string; startDate?: string }) {
  if (!project.dueDate || !project.startDate) {
    return null;
  }
  const daysRemaining = differenceInCalendarDays(new Date(project.dueDate), new Date());
  const projectWindow = differenceInCalendarDays(new Date(project.dueDate), new Date(project.startDate));
  if (Number.isNaN(daysRemaining) || Number.isNaN(projectWindow) || projectWindow <= 0) {
    return null;
  }

  const utilization = clamp(((projectWindow - daysRemaining) / projectWindow) * 100);
  const pressure = utilization > 70 ? 'high' : utilization > 40 ? 'medium' : 'low';

  return {
    utilization,
    pressure
  };
}
