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
const COLORS = ['#1d4ed8', '#0f766e', '#334155', '#64748b', '#94a3b8'];

function getInitialState() {
  if (typeof window === 'undefined') {
    return { responses: {}, industryId: DEFAULT_INDUSTRY_ID };
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return { responses: {}, industryId: DEFAULT_INDUSTRY_ID };
    }

    const parsed = JSON.parse(raw);
    if (parsed && parsed.responses) {
      return {
        responses: parsed.responses || {},
        industryId: parsed.industryId || DEFAULT_INDUSTRY_ID,
      };
    }

    return { responses: parsed || {}, industryId: DEFAULT_INDUSTRY_ID };
  } catch {
    return { responses: {}, industryId: DEFAULT_INDUSTRY_ID };
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

function QuestionCard({ question, value, onChange }) {
  return (
    <div className="panel" style={{ padding: 20 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginBottom: 16 }}>
        <div style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.55 }}>{question.prompt}</div>
      </div>
      <div className="question-scale">
        {SCALE_OPTIONS.map((option) => {
          const active = value === option.value;
          return (
            <button
              key={String(option.value)}
              type="button"
              className={`choice-pill ${active ? 'active' : ''}`}
              onClick={() => onChange(question.id, option.value)}
            >
              <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>{option.label}</div>
              <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 3 }}>{option.shortLabel}</div>
              <div className="muted" style={{ fontSize: 12, lineHeight: 1.35 }}>{option.description}</div>
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
    <div className="grid" style={{ gridTemplateColumns: '1.15fr 0.85fr' }}>
      <div className="panel" style={{ padding: 20, minHeight: 380 }}>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 18 }}>Category performance</div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 24, bottom: 0, left: 18 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.18)" />
            <XAxis type="number" domain={[0, 100]} stroke="#64748b" />
            <YAxis type="category" dataKey="short" stroke="#64748b" width={110} />
            <Tooltip />
            <Bar dataKey="score" radius={[0, 10, 10, 0]}>
              {chartData.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="panel" style={{ padding: 20, minHeight: 380 }}>
        <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 18 }}>Readiness shape</div>
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart outerRadius="72%" data={chartData}>
            <PolarGrid stroke="rgba(148,163,184,0.22)" />
            <PolarAngleAxis dataKey="short" tick={{ fill: '#475569', fontSize: 12 }} />
            <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
            <Radar dataKey="score" stroke="#1d4ed8" fill="#1d4ed8" fillOpacity={0.2} strokeWidth={2} />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function ResultsView({ responses, industryProfile, onEdit }) {
  const results = useMemo(() => scoreAssessment(responses), [responses]);
  const summary = useMemo(() => generateExecutiveSummary(results), [results]);
  const strengths = useMemo(() => generateStrengths(results), [results]);
  const gaps = useMemo(() => generatePriorityGaps(results, industryProfile), [results, industryProfile]);
  const nextSteps = useMemo(() => generateNextSteps(results, industryProfile), [results, industryProfile]);
  const roadmap = useMemo(() => generateRoadmap(results, industryProfile), [results, industryProfile]);

  return (
    <div className="grid" style={{ gap: 24 }}>
      <div className="card" style={{ padding: 28 }}>
        <SectionHeader
          eyebrow="Executive Results Dashboard"
          title="AI Readiness results"
          description={`A strategic view of organizational readiness across governance, people, workflows, infrastructure, and trust for ${industryProfile.label}.`}
          actions={<button className="button-secondary" onClick={onEdit}>Edit responses</button>}
        />

        <div className="grid" style={{ gridTemplateColumns: '280px 1fr', marginTop: 28, alignItems: 'center' }}>
          <ScoreRing score={results.overallScore} label="Overall Score" />
          <div className="grid" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
            <StatCard label="Maturity level" value={results.maturity.label} helper={results.maturity.summary} />
            <StatCard label="Sector" value={industryProfile.label} helper={industryProfile.audience} />
            <StatCard label="Assessment completion" value={formatPercent(Math.round(results.completionRatio * 100))} helper="Includes answered and not-sure responses." />
          </div>
        </div>
      </div>

      <CategoryBreakdown results={results} />

      <div className="grid" style={{ gridTemplateColumns: '1.1fr 0.9fr' }}>
        <div className="panel" style={{ padding: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16, flexWrap: 'wrap' }}>
            <Pill tone="blue">Executive summary</Pill>
            <Pill>{results.maturity.label}</Pill>
            <Pill tone="green">{results.archetype.label}</Pill>
          </div>
          <p style={{ margin: 0, fontSize: 17, lineHeight: 1.8 }}>{summary}</p>
          <p className="muted" style={{ marginTop: 14, marginBottom: 0, lineHeight: 1.7 }}>
            {industryProfile.resultLens}
          </p>
          <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', marginTop: 22 }}>
            <div className="panel" style={{ padding: 18 }}>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>Strengths</div>
              <p className="muted" style={{ margin: 0, lineHeight: 1.65 }}>{results.maturity.strengths}</p>
            </div>
            <div className="panel" style={{ padding: 18 }}>
              <div style={{ fontWeight: 700, marginBottom: 8 }}>Watchouts</div>
              <p className="muted" style={{ margin: 0, lineHeight: 1.65 }}>{results.maturity.warning}</p>
            </div>
          </div>
        </div>

        <div className="panel" style={{ padding: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 14 }}>Category detail</div>
          <div className="grid">
            {results.categoryScores.map((category) => (
              <div key={category.categoryId} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600 }}>{category.categoryTitle}</div>
                  <div className="progress-bar" style={{ marginTop: 8 }}>
                    <span style={{ width: `${category.score}%` }} />
                  </div>
                </div>
                <div style={{ fontWeight: 700 }}>{category.score}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
        <div className="panel" style={{ padding: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 14 }}>Top 3 strengths</div>
          <ul className="list-clean">
            {strengths.map((item) => (
              <li key={item.title}>
                <span className="dot" style={{ background: '#0f766e' }} />
                <div>
                  <div style={{ fontWeight: 600 }}>{item.title}</div>
                  <div className="muted" style={{ lineHeight: 1.6 }}>{item.text}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        <div className="panel" style={{ padding: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 14 }}>Top 3 priority gaps</div>
          <ul className="list-clean">
            {gaps.map((item) => (
              <li key={item.title}>
                <span className="dot" style={{ background: '#b42318' }} />
                <div>
                  <div style={{ fontWeight: 600 }}>{item.title}</div>
                  <div className="muted" style={{ lineHeight: 1.6 }}>{item.text}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '0.95fr 1.05fr' }}>
        <div className="panel" style={{ padding: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 14 }}>Recommended next steps</div>
          <ul className="list-clean">
            {nextSteps.map((step) => (
              <li key={step}>
                <span className="dot" style={{ background: '#1d4ed8' }} />
                <div className="muted" style={{ lineHeight: 1.6 }}>{step}</div>
              </li>
            ))}
          </ul>
        </div>

        <div className="panel" style={{ padding: 24 }}>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 14 }}>30-60-90 day roadmap</div>
          <div className="grid" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
            {[
              { label: '30 Days', items: roadmap.day30 },
              { label: '60 Days', items: roadmap.day60 },
              { label: '90 Days', items: roadmap.day90 },
            ].map((phase) => (
              <div key={phase.label} className="panel" style={{ padding: 16 }}>
                <div style={{ fontWeight: 700, marginBottom: 12 }}>{phase.label}</div>
                <ul className="list-clean" style={{ gap: 10 }}>
                  {phase.items.map((item) => (
                    <li key={item}>
                      <span className="dot" style={{ background: '#0f766e' }} />
                      <div className="muted" style={{ fontSize: 14, lineHeight: 1.5 }}>{item}</div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="export-sheet">
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap', marginBottom: 18 }}>
          <div>
            <div className="eyebrow">Export-friendly executive memo</div>
            <h3 style={{ fontSize: 28, margin: '14px 0 8px', letterSpacing: '-0.03em' }}>AI Readiness Scorecard report</h3>
            <p className="muted" style={{ margin: 0, maxWidth: 760, lineHeight: 1.7 }}>
              This section is intentionally structured for future PDF export, print styling, or downstream report generation.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button className="button-secondary" onClick={() => window.print()}>Print / Save PDF</button>
            <button className="button-ghost" type="button">Email me my report</button>
          </div>
        </div>

        <div className="grid" style={{ gridTemplateColumns: '260px 1fr', alignItems: 'start' }}>
          <div className="panel" style={{ padding: 18 }}>
            <div className="muted" style={{ fontSize: 13, fontWeight: 600 }}>Overall AI Readiness Score</div>
            <div style={{ fontSize: 56, fontWeight: 700, letterSpacing: '-0.05em', marginTop: 8 }}>{results.overallScore}</div>
            <div style={{ marginTop: 10, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <Pill tone="blue">{results.maturity.label}</Pill>
              <Pill>{industryProfile.shortLabel}</Pill>
            </div>
          </div>
          <div className="panel" style={{ padding: 18 }}>
            <div style={{ fontWeight: 700, marginBottom: 10 }}>Executive summary</div>
            <p style={{ margin: 0, lineHeight: 1.75 }}>{summary}</p>
            <p className="muted" style={{ marginTop: 12, marginBottom: 0, lineHeight: 1.65 }}>{industryProfile.resultLens}</p>
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
  const [currentStep, setCurrentStep] = useState(0);
  const [showResults, setShowResults] = useState(false);

  useEffect(() => {
    const saved = getInitialState();
    setResponses(saved.responses || {});
    setIndustryId(saved.industryId || DEFAULT_INDUSTRY_ID);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ responses, industryId }));
  }, [responses, industryId]);

  const industryCategories = INDUSTRY_QUESTION_SETS[industryId] || ASSESSMENT_CATEGORIES;
  const currentCategory = industryCategories[currentStep];
  const industryProfile = INDUSTRY_PROFILES[industryId] || INDUSTRY_PROFILES[DEFAULT_INDUSTRY_ID];
  const questionOverrides = QUESTION_OVERRIDES[industryId] || {};
  const displayCategory = {
    ...currentCategory,
    questions: currentCategory.questions.map((question) => ({
      ...question,
      prompt: questionOverrides[question.id] || question.prompt,
    })),
  };
  const completion = getCompletionStats(responses);
  const isLastStep = currentStep === ASSESSMENT_CATEGORIES.length - 1;

  const categoryCompletion = useMemo(() => {
    return industryCategories.map((category) => {
      const answered = category.questions.filter((question) => responses[question.id] !== undefined).length;
      return {
        id: category.id,
        title: category.shortTitle,
        answered,
        total: category.questions.length,
        percent: Math.round((answered / category.questions.length) * 100),
      };
    });
  }, [responses, industryCategories]);

  function updateResponse(questionId, value) {
    setResponses((current) => ({ ...current, [questionId]: value }));
  }

  function clearAssessment() {
    setResponses({});
    setIndustryId(DEFAULT_INDUSTRY_ID);
    setCurrentStep(0);
    setShowResults(false);
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }

  function handleNext() {
    if (isLastStep) {
      setShowResults(true);
      return;
    }
    setCurrentStep((step) => Math.min(step + 1, ASSESSMENT_CATEGORIES.length - 1));
  }

  if (!started) {
    return (
      <div className="page-shell">
        <div className="container grid" style={{ gap: 28 }}>
          <div className="card" style={{ padding: 34 }}>
            <div className="eyebrow">Executive assessment tool</div>
            <div className="grid" style={{ gridTemplateColumns: '1.15fr 0.85fr', alignItems: 'center', marginTop: 22 }}>
              <div>
                <h1 className="hero-title">AI Readiness Scorecard</h1>
                <p className="muted" style={{ fontSize: 18, lineHeight: 1.8, maxWidth: 720 }}>
                  Evaluate whether your organization is prepared to adopt AI responsibly, effectively, and strategically across leadership, governance, people, workflows, and infrastructure.
                </p>

                <div className="panel" style={{ padding: 18, marginTop: 24, maxWidth: 780 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Select your sector</div>
                  <div className="grid" style={{ gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
                    {Object.values(INDUSTRY_PROFILES).map((profile) => {
                      const active = profile.id === industryId;
                      return (
                        <button
                          key={profile.id}
                          type="button"
                          className="panel"
                          onClick={() => setIndustryId(profile.id)}
                          style={{
                            padding: 16,
                            textAlign: 'left',
                            borderColor: active ? 'rgba(29,78,216,0.35)' : undefined,
                            background: active ? 'rgba(29,78,216,0.06)' : '#fff',
                          }}
                        >
                          <div style={{ fontWeight: 700 }}>{profile.label}</div>
                          <div className="muted" style={{ marginTop: 6, lineHeight: 1.55, fontSize: 14 }}>{profile.description}</div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 28 }}>
                  <button className="button-primary" onClick={() => setStarted(true)}>Start Assessment</button>
                  <a className="button-secondary" href="#product-overview">View product overview</a>
                </div>
              </div>
              <div className="panel" style={{ padding: 24 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1d4ed8', marginBottom: 16 }}>{industryProfile.label}</div>
                <ul className="list-clean">
                  {[
                    industryProfile.headline,
                    `Primary priorities: ${industryProfile.priorities.join(', ')}`,
                    'Executive maturity tier and category-level performance breakdown',
                    'Priority gaps, strengths, and next steps',
                    'A recommended 30-60-90 day roadmap',
                  ].map((item) => (
                    <li key={item}>
                      <span className="dot" style={{ background: '#1d4ed8' }} />
                      <div className="muted" style={{ lineHeight: 1.6 }}>{item}</div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div id="product-overview" className="grid" style={{ gridTemplateColumns: 'repeat(3, minmax(0, 1fr))' }}>
            <StatCard label="Audience" value={industryProfile.shortLabel} helper={industryProfile.audience} />
            <StatCard label="Assessment scope" value="8 Categories" helper="Covers strategy, governance, data, technology, risk, people, workflows, and trust." />
            <StatCard label="Experience" value="Industry-aware" helper="Tailored guidance and roadmap framing based on the sector you select." />
          </div>
        </div>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="page-shell">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 14, marginBottom: 20, flexWrap: 'wrap' }}>
            <div>
              <div className="eyebrow">Assessment complete</div>
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button className="button-secondary" onClick={() => setShowResults(false)}>Back to assessment</button>
              <button className="button-ghost" onClick={clearAssessment}>Reset assessment</button>
            </div>
          </div>
          <ResultsView responses={responses} industryProfile={industryProfile} onEdit={() => setShowResults(false)} />
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="container grid" style={{ gap: 22 }}>
        <div className="card" style={{ padding: 28 }}>
          <SectionHeader
            eyebrow={`Multi-step readiness assessment · ${industryProfile.label}`}
            title={displayCategory.title}
            description={displayCategory.description}
            actions={<Pill tone="blue">Step {currentStep + 1} of {ASSESSMENT_CATEGORIES.length}</Pill>}
          />

          <div className="panel" style={{ padding: 16, marginTop: 20 }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>{industryProfile.label}</div>
            <div className="muted" style={{ lineHeight: 1.6 }}>{industryProfile.resultLens}</div>
          </div>

          <div style={{ marginTop: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, gap: 12, flexWrap: 'wrap' }}>
              <div className="muted">Overall completion</div>
              <div style={{ fontWeight: 600 }}>{completion.answeredQuestions} / {completion.totalQuestions} responses</div>
            </div>
            <div className="progress-bar"><span style={{ width: `${completion.progressPercent}%` }} /></div>
          </div>

          <div className="grid" style={{ gridTemplateColumns: 'repeat(4, minmax(0, 1fr))', marginTop: 20 }}>
            {categoryCompletion.map((item, index) => (
              <button
                key={item.id}
                type="button"
                className="panel"
                onClick={() => setCurrentStep(index)}
                style={{
                  padding: 16,
                  textAlign: 'left',
                  borderColor: index === currentStep ? 'rgba(29,78,216,0.35)' : undefined,
                  background: index === currentStep ? 'rgba(29,78,216,0.06)' : undefined,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center' }}>
                  <div style={{ fontWeight: 600 }}>{item.title}</div>
                  <div className="muted" style={{ fontSize: 12 }}>{item.percent}%</div>
                </div>
                <div className="progress-bar" style={{ marginTop: 10 }}><span style={{ width: `${item.percent}%` }} /></div>
              </button>
            ))}
          </div>
        </div>

        <div className="grid">
          {displayCategory.questions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              value={responses[question.id]}
              onChange={updateResponse}
            />
          ))}
        </div>

        <div className="card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
            <div className="muted" style={{ maxWidth: 720, lineHeight: 1.65 }}>
              “Not sure” is allowed and is scored conservatively so uncertain answers do not overstate readiness. This keeps the result useful even when some details are still being clarified.
            </div>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              <button
                className="button-ghost"
                onClick={() => setCurrentStep((step) => Math.max(step - 1, 0))}
                disabled={currentStep === 0}
              >
                Previous
              </button>
              <button className="button-primary" onClick={handleNext}>
                {isLastStep ? 'View Results' : 'Next Section'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
