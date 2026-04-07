import {
  ARCHETYPES,
  ASSESSMENT_CATEGORIES,
  MATURITY_LEVELS,
  SCALE_OPTIONS,
} from './assessment-config';

const SCORE_MAP = {
  1: 0,
  2: 25,
  3: 50,
  4: 75,
  5: 100,
  not_sure: 40,
};

const NOT_SURE_FACTOR = 0.85;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function round(value) {
  return Math.round(value);
}

export function getScaleOption(value) {
  return SCALE_OPTIONS.find((option) => option.value === value);
}

export function getMaturityLevel(score) {
  return (
    MATURITY_LEVELS.find((level) => score >= level.min && score <= level.max) ||
    MATURITY_LEVELS[MATURITY_LEVELS.length - 1]
  );
}

export function getArchetype({ overallScore, weakestCategoryScore, strongestCategoryScore }) {
  if (overallScore >= 85 && weakestCategoryScore >= 70) {
    return ARCHETYPES.find((item) => item.key === 'strategic-leader');
  }

  if (overallScore >= 65 && strongestCategoryScore >= 75) {
    return ARCHETYPES.find((item) => item.key === 'operational-builder');
  }

  if (overallScore >= 35 && weakestCategoryScore < 45) {
    return ARCHETYPES.find((item) => item.key === 'fragmented-experimenter');
  }

  return ARCHETYPES.find((item) => item.key === 'cautious-explorer');
}

export function computeCategoryScore(category, responses) {
  let total = 0;
  let answered = 0;
  let notSureCount = 0;

  category.questions.forEach((question) => {
    const value = responses[question.id];
    if (value === undefined || value === null) return;

    if (value === 'not_sure') {
      total += SCORE_MAP.not_sure;
      answered += 1;
      notSureCount += 1;
      return;
    }

    if (typeof value === 'number') {
      total += SCORE_MAP[value] ?? 0;
      answered += 1;
    }
  });

  if (!answered) {
    return {
      categoryId: category.id,
      categoryTitle: category.title,
      score: 0,
      weightedScore: 0,
      answered: 0,
      totalQuestions: category.questions.length,
      notSureCount: 0,
      completionRate: 0,
    };
  }

  const average = total / answered;
  const penaltyMultiplier = clamp(1 - (notSureCount / category.questions.length) * (1 - NOT_SURE_FACTOR), 0.72, 1);
  const score = round(average * penaltyMultiplier);

  return {
    categoryId: category.id,
    categoryTitle: category.title,
    score,
    weightedScore: score * category.weight,
    answered,
    totalQuestions: category.questions.length,
    notSureCount,
    completionRate: answered / category.questions.length,
  };
}

export function scoreAssessment(responses) {
  const categoryScores = ASSESSMENT_CATEGORIES.map((category) => computeCategoryScore(category, responses));

  const overallScore = round(
    categoryScores.reduce((sum, category) => sum + category.weightedScore, 0)
  );

  const sortedByScore = [...categoryScores].sort((a, b) => b.score - a.score);
  const strongest = sortedByScore.slice(0, 3);
  const weakest = [...sortedByScore].reverse().slice(0, 3);

  const maturity = getMaturityLevel(overallScore);
  const archetype = getArchetype({
    overallScore,
    weakestCategoryScore: weakest[0]?.score ?? 0,
    strongestCategoryScore: strongest[0]?.score ?? 0,
  });

  return {
    overallScore,
    categoryScores,
    maturity,
    archetype,
    strongest,
    weakest,
    completionRatio:
      categoryScores.reduce((sum, item) => sum + item.answered, 0) /
      ASSESSMENT_CATEGORIES.reduce((sum, item) => sum + item.questions.length, 0),
  };
}

export function generateExecutiveSummary(results, context = {}) {
  const { overallScore, maturity, strongest, weakest, archetype } = results;
  const orgName = context?.orgProfile?.organizationName;
  const role = context?.orgProfile?.role;
  const size = context?.orgProfile?.organizationSize;
  const contextPrefix = [orgName, role, size].filter(Boolean).join(' · ');
  const topStrength = strongest[0]?.categoryTitle || 'core alignment';
  const topGap = weakest[0]?.categoryTitle || 'operational consistency';

  if (overallScore < 40) {
    return `${contextPrefix ? `${contextPrefix}: ` : ''}The organization appears to be in an early stage of AI readiness. Interest is likely present, but the operating conditions required for responsible execution are still forming. ${topStrength} offers a useful starting point, yet ${topGap} is likely to constrain progress unless leadership addresses it explicitly before expanding experimentation.`;
  }

  if (overallScore < 70) {
    return `${contextPrefix ? `${contextPrefix}: ` : ''}The organization shows credible momentum toward AI adoption, but readiness remains uneven. ${topStrength} is helping create forward movement, while ${topGap} represents a meaningful constraint on scale, trust, or execution quality. The next phase should focus on converting scattered readiness into a more disciplined operating model.`;
  }

  return `${contextPrefix ? `${contextPrefix}: ` : ''}The organization demonstrates a solid base for responsible AI adoption. ${topStrength} is operating as a relative strength, and the overall posture suggests the business can move beyond isolated pilots toward practical integration. Continued attention to ${topGap} will help ensure growth in AI capability remains governed, trusted, and measurable.`;
}

export function generatePriorityGaps(results, industryProfile) {
  const gapMap = {
    'Strategy & Vision': 'Clarify where AI should create business value and align leadership around a focused roadmap.',
    'Leadership & Governance': 'Tighten ownership, decision rights, and policy mechanisms before scaling AI activity.',
    'Data Readiness': 'Improve data quality, accessibility, and integration to support reliable AI use cases.',
    'Technology & Infrastructure': 'Strengthen the technical foundation required to pilot and operationalize AI without disruption.',
    'Security, Risk & Compliance': 'Formalize privacy, security, and risk controls so AI adoption does not outpace oversight.',
    'People, Skills & Change Readiness': 'Build workforce confidence and change readiness so adoption succeeds beyond the pilot stage.',
    'Workflow & Operational Integration': 'Anchor AI in real workflows with owners, metrics, and operational accountability.',
    'Trust, Ethics & Human-Centered Design': 'Define where human oversight, transparency, and trust standards must guide AI use.',
  };

  const industryMap = {
    'Strategy & Vision': industryProfile?.recommendations?.strategyVision,
    'Leadership & Governance': industryProfile?.recommendations?.leadershipGovernance,
    'Data Readiness': industryProfile?.recommendations?.dataReadiness,
    'Technology & Infrastructure': industryProfile?.recommendations?.technologyInfrastructure,
    'Security, Risk & Compliance': industryProfile?.recommendations?.securityRiskCompliance,
    'People, Skills & Change Readiness': industryProfile?.recommendations?.peopleSkillsChange,
    'Workflow & Operational Integration': industryProfile?.recommendations?.workflowIntegration,
    'Trust, Ethics & Human-Centered Design': industryProfile?.recommendations?.trustEthicsHuman,
  };

  return results.weakest.map((item) => ({
    title: item.categoryTitle,
    text:
      industryMap[item.categoryTitle] ||
      gapMap[item.categoryTitle] ||
      'Strengthen this area before expanding AI adoption further.',
  }));
}

export function generateStrengths(results) {
  return results.strongest.map((item) => ({
    title: item.categoryTitle,
    text: `${item.categoryTitle} is comparatively well positioned and can serve as a practical foundation for the next phase of AI adoption.`,
  }));
}

export function generateNextSteps(results, industryProfile) {
  const steps = [];
  const weakestIds = new Set(results.weakest.map((item) => item.categoryId));

  if (weakestIds.has('strategyVision')) {
    steps.push('Define a short list of enterprise-priority AI use cases tied to measurable outcomes.');
  }
  if (weakestIds.has('leadershipGovernance')) {
    steps.push('Establish executive ownership, approval criteria, and decision rights for AI initiatives.');
  }
  if (weakestIds.has('dataReadiness')) {
    steps.push('Identify the core systems and datasets required for high-value use cases, then address the biggest quality gaps.');
  }
  if (weakestIds.has('securityRiskCompliance')) {
    steps.push('Create a lightweight AI risk review covering privacy, vendor risk, data handling, and auditability.');
  }
  if (weakestIds.has('peopleSkillsChange')) {
    steps.push('Launch role-specific enablement for leaders and frontline teams to reduce confusion and improve adoption confidence.');
  }
  if (weakestIds.has('workflowIntegration')) {
    steps.push('Select one or two workflows where AI can be embedded with clear owners and measurable value.');
  }
  if (weakestIds.has('trustEthicsHuman')) {
    steps.push('Document where human-in-the-loop review is mandatory and how trust principles will be upheld.');
  }
  if (weakestIds.has('technologyInfrastructure')) {
    steps.push('Prepare a controlled pilot environment with approved tools, integration patterns, and operational guardrails.');
  }

  if (industryProfile?.priorities?.length) {
    steps.unshift(`Prioritize AI initiatives around ${industryProfile.priorities.slice(0, 2).join(' and ')}.`);
  }

  if (steps.length < 4) {
    steps.push('Create a cross-functional AI readiness working group to review progress monthly.');
  }

  return steps.slice(0, 5);
}

export function generateRoadmap(results, industryProfile) {
  if (industryProfile?.roadmap) {
    return industryProfile.roadmap;
  }

  const weakestTitles = results.weakest.map((item) => item.categoryTitle.toLowerCase());

  return {
    day30: [
      'Confirm executive sponsor and assessment owner.',
      'Prioritize 2–3 AI opportunities linked to real business outcomes.',
      `Document current-state gaps across ${weakestTitles.slice(0, 2).join(' and ') || 'core readiness domains'}.`,
    ],
    day60: [
      'Stand up governance guardrails for approvals, risk review, and acceptable use.',
      'Prepare one controlled pilot with clear success metrics, ownership, and reporting cadence.',
      'Begin targeted enablement for leaders and operational teams involved in the pilot.',
    ],
    day90: [
      'Review pilot outcomes against baseline performance and trust criteria.',
      'Decide whether to scale, redesign, or stop the pilot based on evidence.',
      'Publish a practical AI operating roadmap for the next 2–3 quarters.',
    ],
  };
}

export function generateContextualInsights(results, orgProfile = {}, industryProfile) {
  const insights = [];

  if (orgProfile.organizationSize && orgProfile.organizationSize.includes('1–10')) {
    insights.push('For very small organizations, leadership clarity and workflow focus usually matter more than formal enterprise structure.');
  }
  if (orgProfile.organizationSize && (orgProfile.organizationSize.includes('201') || orgProfile.organizationSize.includes('1,000'))) {
    insights.push('At larger organizational scale, governance, change management, and cross-functional coordination become more critical than isolated experimentation.');
  }
  if (orgProfile.aiExperience === 'Just beginning') {
    insights.push('Your profile suggests this organization may still be translating curiosity about AI into concrete operating priorities.');
  }
  if (orgProfile.aiExperience === 'Running early pilots' || orgProfile.aiExperience === 'Using AI in several workflows') {
    insights.push('This organization appears to be moving beyond curiosity, which increases the importance of governance, accountability, and repeatability.');
  }
  if (orgProfile.regulatedEnvironment === 'Yes') {
    insights.push('Because this organization operates in a regulated environment, trust, review discipline, and documentation should be treated as core readiness factors rather than secondary controls.');
  }
  if (industryProfile?.label) {
    insights.push(`Relative to ${industryProfile.label}, the strongest strategic advantage will come from aligning AI efforts with the operating realities of that sector rather than copying general-purpose playbooks.`);
  }

  return insights.slice(0, 4);
}

export function getCompletionStats(responses) {
  const totalQuestions = ASSESSMENT_CATEGORIES.reduce((sum, category) => sum + category.questions.length, 0);
  const answeredQuestions = Object.values(responses).filter((value) => value !== undefined && value !== null).length;
  return {
    totalQuestions,
    answeredQuestions,
    progressPercent: round((answeredQuestions / totalQuestions) * 100),
  };
}
