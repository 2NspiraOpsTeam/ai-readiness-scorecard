'use client';

import { useEffect, useMemo, useState } from 'react';
import {
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ASSESSMENT_CATEGORIES, SCALE_OPTIONS } from '@/lib/assessment-config';
import { DEFAULT_INDUSTRY_ID, INDUSTRY_PROFILES } from '@/lib/industry-config';
import { QUESTION_OVERRIDES } from '@/lib/question-overrides';
import { INDUSTRY_QUESTION_SETS } from '@/lib/question-sets';
import { BRAND } from '@/lib/brand-config';
import { RESULT_NARRATIVES } from '@/lib/result-narratives';
import { AI_EXPERIENCE_OPTIONS, ORG_SIZE_OPTIONS, ROLE_OPTIONS } from '@/lib/org-profile-config';
import {
  generateExecutiveSummary,
  generateNextSteps,
  generatePriorityGaps,
  generateRoadmap,
  generateStrengths,
  getCompletionStats,
  scoreAssessment,
} from '@/lib/scoring';
import { Pill, SectionHeader, StatCard } from '@/components/ui';

const STORAGE_KEY = 'ai-readiness-scorecard-v1';
const COLORS = ['#7c9cff', '#4ee3c1', '#94a3b8', '#64748b', '#c4b5fd'];

function getInitialState() {
  if (typeof window === 'undefined') {
    return {
      responses: {},
      industryId: DEFAULT_INDUSTRY_ID,
      orgProfile: {
        organizationName: '',
        role: '',
        organizationSize: '',
        aiExperience: '',
        email: '',
      },
    };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return {
        responses: {},
        industryId: DEFAULT_INDUSTRY_ID,
        orgProfile: {
          organizationName: '',
          role: '',
          organizationSize: '',
          aiExperience: '',
          email: '',
        },
      };
    }

    const parsed = JSON.parse(raw);
    return {
      responses: parsed.responses || {},
      industryId: parsed.industryId || DEFAULT_INDUSTRY_ID,
      orgProfile: parsed.orgProfile || {
        organizationName: '',
        role: '',
        organizationSize: '',
        aiExperience: '',
        email: '',
      },
    };
  } catch {
    return {
      responses: {},
      industryId: DEFAULT_INDUSTRY_ID,
      orgProfile: {
        organizationName: '',
        role: '',
        organizationSize: '',
        aiExperience: '',
        email: '',
      },
    };
  }
}

function formatPercent(value) {
  return `${value}%`;
}

function ScoreRing({ score, label }) {
  const angle = `${Math.max(0, Math.min(100, score)) * 3.6}deg`;
  return (
    <div style={{ display: 'grid', justifyItems: 'center', gap: 14 }}>
      <div className="score-ring" style={{ '--score-angle': angle }}>
        <div className="score-ring__inner">
          <div>
            <div style={{ fontSize: 48, fontWeight: 700, letterSpacing: '-0.05em' }}>{score}</div>
            <div className="muted" style={{ fontSize: 14 }}>{label}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function OrgProfileStep({ orgProfile, setOrgProfile }) {
  function updateField(field, value) {
    setOrgProfile((current) => ({ ...current, [field]: value }));
  }

  return (
    <div className="card" style={{ padding: 24 }}>
      <SectionHeader
        eyebrow="Organization profile"
        title="Make the results more relevant"
        description="Add a little context so the scorecard can frame recommendations and executive summaries more intelligently."
      />
      <div className="three-col" style={{ marginTop: 20 }}>
        <div className="panel" style={{ padding: 16 }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Organization name</div>
          <input value={orgProfile.organizationName} onChange={(e) => updateField('organizationName', e.target.value)} placeholder="Example: 2Nspira" style={{ width: '100%', minHeight: 46, borderRadius: 12, border: '1px solid rgba(148,163,184,0.24)', background: 'rgba(255,255,255,0.04)', color: '#edf2ff', padding: '0 14px' }} />
        </div>
        <div className="panel" style={{ padding: 16 }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Role</div>
          <select value={orgProfile.role} onChange={(e) => updateField('role', e.target.value)} style={{ width: '100%', minHeight: 46, borderRadius: 12, border: '1px solid rgba(148,163,184,0.24)', background: '#0e1728', color: '#edf2ff', padding: '0 14px' }}>
            <option value="">Select role</option>
            {ROLE_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>
        <div className="panel" style={{ padding: 16 }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Organization size</div>
          <select value={orgProfile.organizationSize} onChange={(e) => updateField('organizationSize', e.target.value)} style={{ width: '100%', minHeight: 46, borderRadius: 12, border: '1px solid rgba(148,163,184,0.24)', background: '#0e1728', color: '#edf2ff', padding: '0 14px' }}>
            <option value="">Select size</option>
            {ORG_SIZE_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>
        <div className="panel" style={{ padding: 16 }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>AI maturity today</div>
          <select value={orgProfile.aiExperience} onChange={(e) => updateField('aiExperience', e.target.value)} style={{ width: '100%', minHeight: 46, borderRadius: 12, border: '1px solid rgba(148,163,184,0.24)', background: '#0e1728', color: '#edf2ff', padding: '0 14px' }}>
            <option value="">Select current level</option>
            {AI_EXPERIENCE_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
          </select>
        </div>
        <div className="panel" style={{ padding: 16 }}>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>Email (optional)</div>
          <input value={orgProfile.email} onChange={(e) => updateField('email', e.target.value)} placeholder="name@organization.com" style={{ width: '100%', minHeight: 46, borderRadius: 12, border: '1px solid rgba(148,163,184,0.24)', background: 'rgba(255,255,255,0.04)', color: '#edf2ff', padding: '0 14px' }} />
        </div>
      </div>
    </div>
  );
}

function QuestionCard({ question, value, onChange }) {
  return (
    <div className="panel" style={{ padding: 20 }}>
      <div style={{ marginBottom: 16 }}>
        <div style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.6 }}>{question.prompt}</div>
        {question.helper ? (
          <div className="muted" style={{ marginTop: 8, fontSize: 13, lineHeight: 1.55 }}>{question.helper}</div>
        ) : null}
      </div>
      <div className="question-scale">
        {SCALE_OPTIONS.map((option) => {
          const active = value === option.value;
          return (
            <button key={String(option.value)} type="button" className={`choice-pill ${active ? 'active' : ''}`} onClick={() => onChange(question.id, option.value)}>
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{option.label}</div>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 3 }}>{option.shortLabel}</div>
              <div className="muted" style={{ fontSize: 12, lineHeight: 1.4 }}>{option.description}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CategoryBreakdown({ results }) {
  const chartData = results.categoryScores.map((item) => ({
    name: item.categoryTitle.replace(' & ', ' / '),
    score: item.score,
    short: ASSESSMENT_CATEGORIES.find((category) => category.id === item.categoryId)?.shortTitle,
  }));

  return (
    <div className="two-col">
      <div className="panel" style={{ padding: 20, minHeight: 380 }}>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 18 }}>Category performance</div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 24, bottom: 0, left: 18 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.18)" />
            <XAxis type="number" domain={[0, 100]} stroke="#94a3b8" />
            <YAxis type="category" dataKey="short" stroke="#94a3b8" width={110} />
            <Tooltip />
            <Bar dataKey="score" radius={[0, 10, 10, 0]}>
              {chartData.map((_, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="panel" style={{ padding: 20, minHeight: 380 }}>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 18 }}>Readiness shape</div>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart outerRadius="72%" data={chartData}>
            <PolarGrid stroke="rgba(148,163,184,0.22)" />
            <PolarAngleAxis dataKey="short" tick={{ fill: '#a8b3cf', fontSize: 12 }} />
            <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
            <Radar dataKey="score" stroke="#7c9cff" fill="#7c9cff" fillOpacity={0.24} strokeWidth={2} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function ResultsView({ responses, orgProfile, industryId, industryProfile, onEdit }) {
  const results = useMemo(() => scoreAssessment(responses), [responses]);
  const summary = useMemo(() => generateExecutiveSummary(results, { orgProfile }), [results, orgProfile]);
  const strengths = useMemo(() => generateStrengths(results), [results]);
  const gaps = useMemo(() => generatePriorityGaps(results, industryProfile), [results, industryProfile]);
  const nextSteps = useMemo(() => generateNextSteps(results, industryProfile), [results, industryProfile]);
  const roadmap = useMemo(() => generateRoadmap(results, industryProfile), [results, industryProfile]);
  const narrative = RESULT_NARRATIVES[industryId] || {};
  const contactHref = `mailto:${BRAND.contactEmail}?subject=${encodeURIComponent(BRAND.contactSubject)}&body=${encodeURIComponent(`Hello 2Nspira,\n\nI completed the AI Readiness Scorecard and would like to discuss next steps.\n\nOrganization: ${orgProfile.organizationName || ''}\nSector: ${industryProfile.label}\nRole: ${orgProfile.role || ''}\nOrganization Size: ${orgProfile.organizationSize || ''}\nAI Experience: ${orgProfile.aiExperience || ''}\nEmail: ${orgProfile.email || ''}\nOverall Score: ${results.overallScore}\nMaturity Level: ${results.maturity.label}\n\nPlease follow up with me regarding advisory support.\n`)}`;
  const reportRequestHref = `mailto:${BRAND.contactEmail}?subject=${encodeURIComponent('AI Readiness Scorecard Report Request')}&body=${encodeURIComponent(`Hello 2Nspira,\n\nPlease send me a follow-up regarding my AI Readiness Scorecard results.\n\nOrganization: ${orgProfile.organizationName || ''}\nSector: ${industryProfile.label}\nRole: ${orgProfile.role || ''}\nOrganization Size: ${orgProfile.organizationSize || ''}\nAI Experience: ${orgProfile.aiExperience || ''}\nEmail: ${orgProfile.email || ''}\nOverall Score: ${results.overallScore}\nMaturity Level: ${results.maturity.label}\n\nThank you.\n`)}`;

  return (
    <div className="grid" style={{ gap: 24 }}>
      <div className="card" style={{ padding: 28 }}>
        <SectionHeader eyebrow="Executive Results Dashboard" title="AI Readiness results" description={`A strategic view of organizational readiness across governance, people, workflows, infrastructure, and trust for ${industryProfile.label}.`} actions={<button className="button-secondary" onClick={onEdit}>Edit responses</button>} />

        <div className="results-hero" style={{ marginTop: 28, alignItems: 'center' }}>
          <ScoreRing score={results.overallScore} label="Overall Score" />
          <div className="three-col">
            <StatCard label="Maturity level" value={results.maturity.label} helper={results.maturity.summary} />
            <StatCard label="Sector" value={industryProfile.label} helper={industryProfile.audience} />
            <StatCard label="Assessment completion" value={formatPercent(Math.round(results.completionRatio * 100))} helper="Includes answered and not-sure responses." />
          </div>
        </div>
      </div>

      <div className="three-col">
        <StatCard label="Organization" value={orgProfile.organizationName || 'Not provided'} helper={orgProfile.role || 'Role not provided'} />
        <StatCard label="Organization size" value={orgProfile.organizationSize || 'Not provided'} helper={orgProfile.aiExperience || 'AI experience not provided'} />
        <StatCard label="Readiness archetype" value={results.archetype.label} helper={results.archetype.description} />
      </div>

      <div className="panel" style={{ padding: 24 }}>
        <div className="eyebrow">Methodology</div>
        <p style={{ margin: '14px 0 0', lineHeight: 1.8 }}>
          This scorecard evaluates AI readiness across 8 weighted categories covering strategy, governance, data, technology, risk, people, workflow integration, and trust. Scores are intended to support executive discussion and practical prioritization — not just tool selection.
        </p>
      </div>

      <CategoryBreakdown results={results} />

      <div className="two-col">
        <div className="panel" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
            <Pill tone="blue">Executive summary</Pill>
            <Pill>{results.maturity.label}</Pill>
            <Pill tone="green">{results.archetype.label}</Pill>
          </div>
          <p style={{ margin: 0, fontSize: 17, lineHeight: 1.85 }}>{summary}</p>
          <p className="muted" style={{ marginTop: 14, marginBottom: 0, lineHeight: 1.75 }}>{industryProfile.resultLens}</p>
        </div>

        <div className="panel" style={{ padding: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 14 }}>Category detail</div>
          <div className="grid">
            {results.categoryScores.map((category) => (
              <div key={category.categoryId} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{category.categoryTitle}</div>
                  <div className="progress-bar" style={{ marginTop: 8 }}><span style={{ width: `${category.score}%` }} /></div>
                </div>
                <div style={{ fontWeight: 700 }}>{category.score}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="two-col">
        <div className="panel" style={{ padding: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 14 }}>{narrative.strengthsLabel || 'Top 3 strengths'}</div>
          <ul className="list-clean">{strengths.map((item) => <li key={item.title}><span className="dot" style={{ background: '#4ee3c1' }} /><div><div style={{ fontWeight: 600 }}>{item.title}</div><div className="muted" style={{ lineHeight: 1.7 }}>{item.text}</div></div></li>)}</ul>
        </div>

        <div className="panel" style={{ padding: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 14 }}>{narrative.gapsLabel || 'Top 3 priority gaps'}</div>
          <ul className="list-clean">{gaps.map((item) => <li key={item.title}><span className="dot" style={{ background: '#ff8b8b' }} /><div><div style={{ fontWeight: 600 }}>{item.title}</div><div className="muted" style={{ lineHeight: 1.7 }}>{item.text}</div></div></li>)}</ul>
        </div>
      </div>

      <div className="two-col">
        <div className="panel" style={{ padding: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 14 }}>{narrative.nextStepsLabel || 'Recommended next steps'}</div>
          <ul className="list-clean">{nextSteps.map((step) => <li key={step}><span className="dot" style={{ background: '#7c9cff' }} /><div className="muted" style={{ lineHeight: 1.7 }}>{step}</div></li>)}</ul>
        </div>

        <div className="panel" style={{ padding: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 14 }}>30-60-90 day roadmap</div>
          <div className="three-col">{[{ label: '30 Days', items: roadmap.day30 }, { label: '60 Days', items: roadmap.day60 }, { label: '90 Days', items: roadmap.day90 }].map((phase) => <div key={phase.label} className="panel" style={{ padding: 16 }}><div style={{ fontWeight: 700, marginBottom: 12 }}>{phase.label}</div><ul className="list-clean" style={{ gap: 10 }}>{phase.items.map((item) => <li key={item}><span className="dot" style={{ background: '#4ee3c1' }} /><div className="muted" style={{ fontSize: 14, lineHeight: 1.55 }}>{item}</div></li>)}</ul></div>)}</div>
        </div>
      </div>

      <div className="panel" style={{ padding: 24 }}>
        <div className="eyebrow">{BRAND.company} Advisory</div>
        <h3 style={{ fontSize: 28, margin: '14px 0 10px', letterSpacing: '-0.03em' }}>{BRAND.advisoryCtaTitle}</h3>
        <p className="muted" style={{ margin: 0, maxWidth: 840, lineHeight: 1.75 }}>{BRAND.advisoryCtaBody}</p>
        <div className="two-col" style={{ marginTop: 18 }}>
          <div className="panel" style={{ padding: 16 }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Report follow-up</div>
            <div className="muted" style={{ lineHeight: 1.65 }}>
              Use your scorecard results to request a follow-up conversation or a summary report from 2Nspira.
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 16 }}>
              <a className="button-primary" href={reportRequestHref}>Email me my follow-up</a>
            </div>
          </div>
          <div className="panel" style={{ padding: 16 }}>
            <div style={{ fontWeight: 700, marginBottom: 8 }}>Talk with 2Nspira</div>
            <div className="muted" style={{ lineHeight: 1.65 }}>
              Reach out directly with your organization context and score so 2Nspira can recommend next steps.
            </div>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 16 }}>
              <a className="button-primary" href={contactHref}>{BRAND.advisoryPrimary}</a>
              <a className="button-secondary" href={contactHref}>{BRAND.advisorySecondary}</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AssessmentExperience() {
  const [started, setStarted] = useState(false);
  const [responses, setResponses] = useState({});
  const [industryId, setIndustryId] = useState(DEFAULT_INDUSTRY_ID);
  const [orgProfile, setOrgProfile] = useState({ organizationName: '', role: '', organizationSize: '', aiExperience: '', email: '' });
  const [currentStep, setCurrentStep] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [singleQuestionMode, setSingleQuestionMode] = useState(true);
  const [questionIndex, setQuestionIndex] = useState(0);

  useEffect(() => {
    const saved = getInitialState();
    setResponses(saved.responses || {});
    setIndustryId(saved.industryId || DEFAULT_INDUSTRY_ID);
    setOrgProfile(saved.orgProfile || { organizationName: '', role: '', organizationSize: '', aiExperience: '', email: '' });
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ responses, industryId, orgProfile }));
  }, [responses, industryId, orgProfile]);

  const industryCategories = INDUSTRY_QUESTION_SETS[industryId] || ASSESSMENT_CATEGORIES;
  const currentCategory = industryCategories[currentStep];
  const industryProfile = INDUSTRY_PROFILES[industryId] || INDUSTRY_PROFILES[DEFAULT_INDUSTRY_ID];
  const questionOverrides = QUESTION_OVERRIDES[industryId] || {};
  const displayCategory = {
    ...currentCategory,
    questions: currentCategory.questions.map((question) => ({ ...question, prompt: questionOverrides[question.id] || question.prompt })),
  };
  const completion = getCompletionStats(responses);
  const isLastStep = currentStep === ASSESSMENT_CATEGORIES.length - 1;
  const visibleQuestions = singleQuestionMode ? [displayCategory.questions[Math.min(questionIndex, displayCategory.questions.length - 1)]].filter(Boolean) : displayCategory.questions;

  const categoryCompletion = useMemo(() => industryCategories.map((category) => {
    const answered = category.questions.filter((question) => responses[question.id] !== undefined).length;
    return { id: category.id, title: category.shortTitle, answered, total: category.questions.length, percent: Math.round((answered / category.questions.length) * 100) };
  }), [responses, industryCategories]);

  function updateResponse(questionId, value) { setResponses((current) => ({ ...current, [questionId]: value })); }

  function clearAssessment() {
    setResponses({});
    setIndustryId(DEFAULT_INDUSTRY_ID);
    setOrgProfile({ organizationName: '', role: '', organizationSize: '', aiExperience: '', email: '' });
    setCurrentStep(0);
    setQuestionIndex(0);
    setShowResults(false);
    if (typeof window !== 'undefined') window.localStorage.removeItem(STORAGE_KEY);
  }

  function handleNext() {
    if (singleQuestionMode && questionIndex < displayCategory.questions.length - 1) {
      setQuestionIndex((value) => value + 1);
      return;
    }
    if (isLastStep) {
      setShowResults(true);
      return;
    }
    setCurrentStep((step) => Math.min(step + 1, ASSESSMENT_CATEGORIES.length - 1));
    setQuestionIndex(0);
  }

  function handlePrevious() {
    if (singleQuestionMode && questionIndex > 0) {
      setQuestionIndex((value) => Math.max(value - 1, 0));
      return;
    }
    setCurrentStep((step) => Math.max(step - 1, 0));
    setQuestionIndex(0);
  }

  if (!started) {
    return (
      <div className="page-shell">
        <div className="container grid" style={{ gap: 28 }}>
          <div className="card" style={{ padding: 28 }}>
            <div className="eyebrow">Executive assessment tool</div>
            <div className="hero-grid" style={{ alignItems: 'center', marginTop: 22 }}>
              <div>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                    <img src="/2nspira-logo.png" alt="2Nspira logo" style={{ width: 84, height: 84, objectFit: 'contain' }} />
                    <div className="eyebrow">{BRAND.company}</div>
                  </div>
                  <div className="badge" style={{ background: 'rgba(78,227,193,0.1)', color: '#bff8eb' }}>{BRAND.tagline}</div>
                </div>
                <h1 className="hero-title">{BRAND.product}</h1>
                <p className="muted" style={{ fontSize: 18, lineHeight: 1.8, maxWidth: 720 }}>{BRAND.subtagline}</p>

                <div className="panel" style={{ padding: 18, marginTop: 24, maxWidth: 780 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Select your sector</div>
                  <div className="sector-grid">{Object.values(INDUSTRY_PROFILES).map((profile) => {
                    const active = profile.id === industryId;
                    return <button key={profile.id} type="button" className="panel sector-card" onClick={() => setIndustryId(profile.id)} style={{ borderColor: active ? 'rgba(124,156,255,0.48)' : undefined, background: active ? 'linear-gradient(180deg, rgba(124,156,255,0.16), rgba(124,156,255,0.08))' : undefined }}><div style={{ fontWeight: 700, color: '#f3f6ff' }}>{profile.label}</div><div className="muted" style={{ marginTop: 6, lineHeight: 1.55, fontSize: 14 }}>{profile.description}</div></button>;
                  })}</div>
                </div>

                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 28 }}>
                  <button className="button-primary" onClick={() => setStarted(true)}>{BRAND.ctaPrimary}</button>
                  <a className="button-secondary" href="#product-overview">{BRAND.ctaSecondary}</a>
                </div>
              </div>
              <div className="panel" style={{ padding: 24 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#f3f6ff', marginBottom: 16 }}>{industryProfile.label}</div>
                <ul className="list-clean">{[industryProfile.headline, `Primary priorities: ${industryProfile.priorities.join(', ')}`, 'Executive maturity tier and category-level performance breakdown', 'Priority gaps, strengths, and next steps', 'A recommended 30-60-90 day roadmap'].map((item) => <li key={item}><span className="dot" style={{ background: '#7c9cff' }} /><div className="muted" style={{ lineHeight: 1.65 }}>{item}</div></li>)}</ul>
              </div>
            </div>
          </div>

          <div id="product-overview" className="three-col">
            <StatCard label="Audience" value={industryProfile.shortLabel} helper={industryProfile.audience} />
            <StatCard label="Assessment scope" value="8 Categories" helper="Covers strategy, governance, data, technology, risk, people, workflows, and trust." />
            <StatCard label="Experience" value="Premium MVP" helper="Tailored sector logic with an executive-style scoring and roadmap experience." />
          </div>

          <OrgProfileStep orgProfile={orgProfile} setOrgProfile={setOrgProfile} />

          <div className="panel" style={{ padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <img src="/2nspira-logo.png" alt="2Nspira logo" style={{ width: 34, height: 34, objectFit: 'contain' }} />
              <div className="eyebrow">Why 2Nspira built this</div>
            </div>
            <p style={{ margin: '14px 0 0', lineHeight: 1.8, maxWidth: 980 }}>{BRAND.footerNote}</p>
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    return <div className="page-shell"><div className="container"><div style={{ display: 'flex', justifyContent: 'space-between', gap: 14, marginBottom: 20, flexWrap: 'wrap' }}><div><div className="eyebrow">Assessment complete</div></div><div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}><button className="button-secondary" onClick={() => setShowResults(false)}>Back to assessment</button><button className="button-ghost" onClick={clearAssessment}>Reset assessment</button></div></div><ResultsView responses={responses} orgProfile={orgProfile} industryId={industryId} industryProfile={industryProfile} onEdit={() => setShowResults(false)} /></div></div>;
  }

  return (
    <div className="page-shell">
      <div className="container grid" style={{ gap: 22 }}>
        <OrgProfileStep orgProfile={orgProfile} setOrgProfile={setOrgProfile} />

        <div className="card" style={{ padding: 24 }}>
          <SectionHeader eyebrow={`Multi-step readiness assessment · ${industryProfile.label}`} title={displayCategory.title} description={displayCategory.description} actions={<Pill tone="blue">Step {currentStep + 1} of {ASSESSMENT_CATEGORIES.length}</Pill>} />

          <div className="panel" style={{ padding: 16, marginTop: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
              <div><div style={{ fontWeight: 700, marginBottom: 6, color: '#f3f6ff' }}>{industryProfile.label}</div><div className="muted" style={{ lineHeight: 1.65 }}>{industryProfile.resultLens}</div></div>
              <button className="button-ghost" type="button" onClick={() => setSingleQuestionMode((v) => !v)}>{singleQuestionMode ? 'Show all questions' : 'Focus mode'}</button>
            </div>
          </div>

          <div style={{ marginTop: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, gap: 12, flexWrap: 'wrap' }}><div className="muted">Overall completion</div><div style={{ fontWeight: 600 }}>{completion.answeredQuestions} / {completion.totalQuestions} responses</div></div>
            <div className="progress-bar"><span style={{ width: `${completion.progressPercent}%` }} /></div>
          </div>

          <div className="four-col" style={{ marginTop: 20 }}>{categoryCompletion.map((item, index) => <button key={item.id} type="button" className="panel" onClick={() => { setCurrentStep(index); setQuestionIndex(0); }} style={{ padding: 16, textAlign: 'left', borderColor: index === currentStep ? 'rgba(124,156,255,0.45)' : undefined, background: index === currentStep ? 'rgba(124,156,255,0.08)' : undefined }}><div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center' }}><div style={{ fontWeight: 600 }}>{item.title}</div><div className="muted" style={{ fontSize: 12 }}>{item.percent}%</div></div><div className="progress-bar" style={{ marginTop: 10 }}><span style={{ width: `${item.percent}%` }} /></div></button>)}</div>
        </div>

        {singleQuestionMode ? <div className="panel" style={{ padding: 18 }}><div className="eyebrow">Focused question mode</div><div style={{ marginTop: 12, fontWeight: 700 }}>Question {questionIndex + 1} of {displayCategory.questions.length}</div></div> : null}

        <div className="grid">{visibleQuestions.map((question) => <QuestionCard key={question.id} question={question} value={responses[question.id]} onChange={updateResponse} />)}</div>

        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <div className="muted" style={{ maxWidth: 720, lineHeight: 1.7 }}>“Not sure” is allowed and is scored conservatively so uncertain answers do not overstate readiness. This keeps the result useful even when some details are still being clarified.</div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button className="button-ghost" onClick={handlePrevious} disabled={currentStep === 0 && questionIndex === 0}>Previous</button>
              <button className="button-primary" onClick={handleNext}>{isLastStep && (!singleQuestionMode || questionIndex === displayCategory.questions.length - 1) ? 'View Results' : 'Next'}</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
