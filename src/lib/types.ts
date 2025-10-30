export type DaciRole = 'driver' | 'approver' | 'contributor' | 'informed';

export interface ProjectRequirement {
  id: string;
  name: string;
  domain: 'strategy' | 'product' | 'engineering' | 'marketing' | 'operations' | 'finance' | 'people';
  criticality: 'low' | 'medium' | 'high';
  timeHorizon: 'near-term' | 'mid-term' | 'long-term';
  decisionType: 'strategic' | 'tactical' | 'operational';
  urgency: 1 | 2 | 3 | 4 | 5;
  description: string;
  successCriteria: string[];
  requiredExpertise: string[];
  requiredDepartments: string[];
}

export interface Stakeholder {
  id: string;
  name: string;
  email: string;
  roleTitle: string;
  department: string;
  seniority: 'individual-contributor' | 'manager' | 'director' | 'vp' | 'c-suite';
  location: 'on-site' | 'remote' | 'hybrid';
  experienceYears: number;
  domainExpertise: string[];
  decisionInfluence: 1 | 2 | 3 | 4 | 5;
  leadershipScore: 1 | 2 | 3 | 4 | 5;
  collaborationScore: 1 | 2 | 3 | 4 | 5;
  availability: 'limited' | 'moderate' | 'high';
  organizationalKnowledge: 1 | 2 | 3 | 4 | 5;
  recentDecisionsLed: number;
}

export interface AssignmentContext {
  project: ProjectRequirement;
  stakeholders: Stakeholder[];
  constraints?: {
    fixedAssignments?: Partial<Record<DaciRole, string[]>>;
    avoidPairings?: Array<{ stakeholderId: string; reason: string }>;
    preferPairings?: Array<{ stakeholderId: string; role: DaciRole; reason: string }>;
  };
}

export interface RoleScore {
  stakeholderId: string;
  stakeholderName: string;
  role: DaciRole;
  score: number;
  normalizedScore: number;
  justification: string[];
}

export interface AssignmentRecommendation {
  role: DaciRole;
  primary: RoleScore | null;
  alternates: RoleScore[];
}

export interface AssignmentInsight {
  title: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface CoverageMetric {
  label: string;
  value: number;
  target?: number;
  description: string;
}

export interface EngineResult {
  recommendations: AssignmentRecommendation[];
  roleScores: RoleScore[];
  insights: AssignmentInsight[];
  coverage: CoverageMetric[];
  summary: string[];
}
