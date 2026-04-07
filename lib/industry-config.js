export const INDUSTRY_PROFILES = {
  k12Education: {
    id: 'k12Education',
    label: 'K-12 Education',
    shortLabel: 'K-12',
    audience: 'School leaders, district administrators, principals, and instructional leadership teams.',
    description:
      'Designed for schools and education systems balancing innovation, student safety, governance, and staff enablement.',
    headline:
      'Assess whether your school or district is ready to adopt AI responsibly across instruction, operations, and leadership.',
    priorities: ['Student privacy', 'Instructional integrity', 'Policy clarity', 'Teacher enablement'],
    resultLens:
      'Education readiness depends on instructional trust, student privacy, governance, and staff confidence — not just tool adoption.',
    recommendations: {
      strategyVision: 'Clarify where AI should support teaching, learning, family communication, and administrative efficiency without undermining instructional quality.',
      leadershipGovernance: 'Establish district or school-level ownership, acceptable-use expectations, and decision rights for AI tools and pilots.',
      dataReadiness: 'Map where student, staff, and operational data lives and define what can or cannot be used in AI-enabled workflows.',
      technologyInfrastructure: 'Ensure approved platforms, integration patterns, and device environments can support AI use without creating uneven access.',
      securityRiskCompliance: 'Review student privacy, vendor data handling, records obligations, and reputational exposure before broad rollout.',
      peopleSkillsChange: 'Provide practical teacher and staff guidance so AI adoption builds confidence rather than anxiety or inconsistency.',
      workflowIntegration: 'Focus first on time-saving administrative and educator workflows where value can be measured quickly.',
      trustEthicsHuman: 'Define where human judgment must remain central, especially in student-facing, disciplinary, and instructional decisions.',
    },
    roadmap: {
      day30: [
        'Identify the highest-priority school or district workflows for AI support.',
        'Draft interim guidance for staff use, student data, and approved tools.',
        'Name an internal owner or working group for AI readiness.'
      ],
      day60: [
        'Pilot AI in one instructional-adjacent and one operational workflow.',
        'Train school leaders and early adopters on practical, policy-aligned use.',
        'Review privacy, trust, and quality concerns surfaced during pilot use.'
      ],
      day90: [
        'Refine school or district AI policy based on pilot evidence.',
        'Expand enablement resources for teachers and staff.',
        'Publish a staged roadmap for broader responsible adoption.'
      ]
    }
  },
  nonprofits: {
    id: 'nonprofits',
    label: 'Nonprofits & Mission-Driven Organizations',
    shortLabel: 'Nonprofits',
    audience: 'Executive directors, operations leaders, program leads, and development teams.',
    description:
      'Built for lean organizations that need practical AI adoption without compromising mission, trust, or stewardship.',
    headline:
      'Evaluate whether your organization can adopt AI in ways that strengthen mission delivery, fundraising, and operational capacity.',
    priorities: ['Mission alignment', 'Capacity constraints', 'Donor trust', 'Operational efficiency'],
    resultLens:
      'Mission-driven AI adoption should strengthen capacity and service delivery while preserving trust, stewardship, and human judgment.',
    recommendations: {
      strategyVision: 'Tie AI adoption to mission outcomes, service delivery, fundraising effectiveness, or staff capacity — not novelty.',
      leadershipGovernance: 'Create lightweight ownership and approval mechanisms that fit lean teams without adding unnecessary bureaucracy.',
      dataReadiness: 'Clarify how donor, beneficiary, program, and operational data can support AI use safely and effectively.',
      technologyInfrastructure: 'Prioritize practical tools that fit current systems and staff capacity instead of building unnecessary complexity.',
      securityRiskCompliance: 'Protect donor, beneficiary, and internal data while reviewing vendor risk and reputational implications.',
      peopleSkillsChange: 'Reduce fear by showing where AI can reduce staff burden while preserving mission-centered work.',
      workflowIntegration: 'Start with workflows like grant support, stakeholder communication, research, and internal operations.',
      trustEthicsHuman: 'Define where human oversight remains essential, especially in beneficiary-facing and trust-sensitive decisions.',
    },
    roadmap: {
      day30: [
        'Identify 2–3 mission-critical workflows where AI could reduce burden or improve service.',
        'Define a lightweight acceptable-use and oversight model for staff.',
        'Surface data and trust constraints before experimentation expands.'
      ],
      day60: [
        'Pilot AI in one internal workflow and one outward-facing support workflow.',
        'Train managers and staff on approved use patterns.',
        'Establish simple reporting for outcomes, risks, and lessons learned.'
      ],
      day90: [
        'Decide where AI should be scaled, constrained, or avoided.',
        'Document a mission-aligned adoption roadmap.',
        'Translate results into board- and leadership-ready recommendations.'
      ]
    }
  },
  midMarketOperations: {
    id: 'midMarketOperations',
    label: 'Mid-Market Operations',
    shortLabel: 'Mid-Market',
    audience: 'CEOs, COOs, CIOs, operations executives, and functional leaders.',
    description:
      'Built for growing organizations that need disciplined AI adoption tied to workflow execution, ROI, and governance.',
    headline:
      'Measure whether your organization is ready to operationalize AI across core processes without creating tool sprawl or execution risk.',
    priorities: ['Workflow ROI', 'Cross-functional alignment', 'Scalable governance', 'Execution discipline'],
    resultLens:
      'Operational AI readiness depends on aligning high-value workflows, measurable business outcomes, and disciplined execution capacity.',
    recommendations: {
      strategyVision: 'Define where AI should improve cycle time, service quality, decision support, cost structure, or growth capacity.',
      leadershipGovernance: 'Clarify who approves tools, owns use cases, and governs cross-functional AI decisions.',
      dataReadiness: 'Prioritize integration and data quality issues that block high-value operational workflows.',
      technologyInfrastructure: 'Prepare APIs, automation layers, and controlled pilot environments that support repeatable rollout.',
      securityRiskCompliance: 'Ensure AI use does not outpace security review, privacy controls, or contractual obligations.',
      peopleSkillsChange: 'Equip managers and teams to adopt AI as a workflow capability, not just an individual productivity hack.',
      workflowIntegration: 'Anchor AI in specific functions such as operations, sales support, customer service, finance, or internal reporting.',
      trustEthicsHuman: 'Define where AI can accelerate decisions and where human review must remain a control point.',
    },
    roadmap: {
      day30: [
        'Prioritize workflow use cases based on measurable value and feasibility.',
        'Confirm executive sponsor and cross-functional owners.',
        'Map major readiness constraints blocking operational pilots.'
      ],
      day60: [
        'Launch one or two controlled pilots in high-friction workflows.',
        'Create success metrics tied to cost, time, quality, or throughput.',
        'Document governance and support requirements for broader rollout.'
      ],
      day90: [
        'Evaluate pilot outcomes and identify scale candidates.',
        'Standardize approved patterns, tools, and guardrails.',
        'Publish a practical operating roadmap for the next two quarters.'
      ]
    }
  },
  professionalServices: {
    id: 'professionalServices',
    label: 'Professional Services & Advisory Firms',
    shortLabel: 'Services',
    audience: 'Firm leaders, practice heads, operations leaders, and client delivery teams.',
    description:
      'Tailored for organizations where client trust, knowledge work quality, and workflow leverage matter more than simple automation.',
    headline:
      'Assess whether your firm is ready to use AI to improve delivery, knowledge work, and margin while protecting client trust.',
    priorities: ['Client confidentiality', 'Knowledge leverage', 'Quality control', 'Human review'],
    resultLens:
      'In professional services, AI readiness is about augmenting expertise and delivery quality without weakening trust or accountability.',
    recommendations: {
      strategyVision: 'Focus AI on client value, team leverage, quality, turnaround time, and delivery economics.',
      leadershipGovernance: 'Define who approves client-facing use, knowledge workflows, and vendor/tool decisions across the firm.',
      dataReadiness: 'Clarify what internal knowledge, templates, and client data can responsibly support AI-enabled work.',
      technologyInfrastructure: 'Use approved tools and integration patterns that fit delivery workflows without creating unmanaged risk.',
      securityRiskCompliance: 'Protect confidentiality, contractual obligations, and client trust through clear guardrails.',
      peopleSkillsChange: 'Train teams to use AI as an augmenting layer while maintaining expert review and delivery standards.',
      workflowIntegration: 'Start with proposal development, research synthesis, internal knowledge management, and delivery support workflows.',
      trustEthicsHuman: 'Be explicit about where human review, client transparency, and professional accountability are non-negotiable.',
    },
    roadmap: {
      day30: [
        'Identify delivery and internal workflows where AI can create leverage without increasing client risk.',
        'Define interim rules for approved tools, confidentiality, and review standards.',
        'Confirm sponsor ownership across operations and client delivery.'
      ],
      day60: [
        'Run targeted pilots in non-sensitive or tightly controlled workflows.',
        'Create review checkpoints for output quality and professional accountability.',
        'Document how teams should disclose or govern AI-assisted work where needed.'
      ],
      day90: [
        'Decide which workflows are ready for broader adoption.',
        'Package proven usage patterns into firm-wide guidance and enablement.',
        'Translate lessons into a strategic roadmap for AI-enabled service delivery.'
      ]
    }
  }
};

export const DEFAULT_INDUSTRY_ID = 'midMarketOperations';
