import { AssignmentContext } from '../lib/types';

export const sampleContext: AssignmentContext = {
  project: {
    id: 'project-q1-modernization',
    name: 'Unified Customer Experience Platform',
    domain: 'product',
    criticality: 'high',
    timeHorizon: 'mid-term',
    decisionType: 'strategic',
    urgency: 4,
    description:
      'Deliver an integrated experience across mobile, web, and in-store touchpoints with AI-assisted support.',
    successCriteria: [
      'Reduce customer effort score by 20%',
      'Launch cross-platform experiences by Q2',
      'Achieve NPS improvement of +10 points'
    ],
    requiredExpertise: ['customer experience', 'product strategy', 'platform architecture', 'data governance'],
    requiredDepartments: ['Product', 'Engineering', 'Operations']
  },
  stakeholders: [
    {
      id: 'sarah-chen',
      name: 'Sarah Chen',
      email: 'sarah.chen@company.com',
      roleTitle: 'Director of Product Strategy',
      department: 'Product',
      seniority: 'director',
      location: 'hybrid',
      experienceYears: 11,
      domainExpertise: ['product strategy', 'customer experience', 'data governance'],
      decisionInfluence: 5,
      leadershipScore: 5,
      collaborationScore: 4,
      availability: 'moderate',
      organizationalKnowledge: 5,
      recentDecisionsLed: 4
    },
    {
      id: 'michael-roberts',
      name: 'Michael Roberts',
      email: 'michael.roberts@company.com',
      roleTitle: 'Chief Operations Officer',
      department: 'Operations',
      seniority: 'c-suite',
      location: 'on-site',
      experienceYears: 18,
      domainExpertise: ['operations', 'process optimization', 'risk management'],
      decisionInfluence: 5,
      leadershipScore: 4,
      collaborationScore: 3,
      availability: 'limited',
      organizationalKnowledge: 5,
      recentDecisionsLed: 3
    },
    {
      id: 'emma-wilson',
      name: 'Emma Wilson',
      email: 'emma.wilson@company.com',
      roleTitle: 'Engineering Manager',
      department: 'Engineering',
      seniority: 'manager',
      location: 'remote',
      experienceYears: 8,
      domainExpertise: ['platform architecture', 'cloud infrastructure', 'systems design'],
      decisionInfluence: 4,
      leadershipScore: 4,
      collaborationScore: 5,
      availability: 'high',
      organizationalKnowledge: 3,
      recentDecisionsLed: 2
    },
    {
      id: 'james-park',
      name: 'James Park',
      email: 'james.park@company.com',
      roleTitle: 'Lead Data Scientist',
      department: 'Product',
      seniority: 'manager',
      location: 'remote',
      experienceYears: 7,
      domainExpertise: ['machine learning', 'data governance', 'analytics'],
      decisionInfluence: 3,
      leadershipScore: 3,
      collaborationScore: 4,
      availability: 'high',
      organizationalKnowledge: 3,
      recentDecisionsLed: 1
    },
    {
      id: 'lisa-anderson',
      name: 'Lisa Anderson',
      email: 'lisa.anderson@company.com',
      roleTitle: 'HR Business Partner',
      department: 'People',
      seniority: 'manager',
      location: 'hybrid',
      experienceYears: 10,
      domainExpertise: ['change management', 'org design', 'talent strategy'],
      decisionInfluence: 3,
      leadershipScore: 4,
      collaborationScore: 5,
      availability: 'moderate',
      organizationalKnowledge: 4,
      recentDecisionsLed: 2
    }
  ]
};
