export const INDUSTRY_PROFILES = {
  educationalInstitutions: {
    id: 'educationalInstitutions',
    label: 'Educational Institutions',
    shortLabel: 'Education',
    audience: 'Schools, districts, higher education teams, training organizations, and education leaders.',
    description:
      'Designed for institutions balancing innovation, learner trust, privacy, governance, and staff enablement.',
    headline:
      'Assess whether your institution is ready to adopt AI responsibly across teaching, operations, leadership, and communication.',
    priorities: ['Learner trust', 'Privacy', 'Policy clarity', 'Staff enablement'],
    resultLens:
      'Educational AI readiness depends on trust, privacy, governance, and human-centered implementation — not just access to tools.',
    recommendations: {
      strategyVision: 'Clarify where AI should support learning, administration, communication, and institutional effectiveness without undermining quality or trust.',
      leadershipGovernance: 'Establish institutional ownership, acceptable-use expectations, and decision rights for AI-enabled tools and pilots.',
      dataReadiness: 'Map where student, staff, and operational data lives and define what can or cannot be used in AI-supported workflows.',
      technologyInfrastructure: 'Ensure approved platforms, device environments, and integrations can support AI use without creating access or support issues.',
      securityRiskCompliance: 'Review privacy, vendor data handling, records obligations, and reputational exposure before broad rollout.',
      peopleSkillsChange: 'Provide practical guidance so faculty, staff, and administrators build confidence instead of confusion.',
      workflowIntegration: 'Focus first on high-value academic, communication, and administrative workflows where value can be measured clearly.',
      trustEthicsHuman: 'Define where human judgment must remain central, especially in learner-facing, evaluative, or high-sensitivity decisions.',
    },
    roadmap: {
      day30: [
        'Identify the highest-priority educational and administrative workflows for AI support.',
        'Draft interim guidance for staff use, sensitive data, and approved tools.',
        'Name an internal owner or working group for institutional AI readiness.'
      ],
      day60: [
        'Pilot AI in one academic-adjacent and one operational workflow.',
        'Train leaders and early adopters on practical, policy-aligned use.',
        'Review privacy, trust, and quality concerns surfaced during pilot use.'
      ],
      day90: [
        'Refine policy and guidance based on pilot evidence.',
        'Expand enablement resources for faculty and staff.',
        'Publish a staged roadmap for broader responsible adoption.'
      ]
    }
  },
  nonprofits: {
    id: 'nonprofits',
    label: 'Nonprofits',
    shortLabel: 'Nonprofits',
    audience: 'Mission-driven organizations, foundations, community organizations, executive directors, and operations teams.',
    description:
      'Built for lean organizations that need practical AI adoption without compromising mission, stewardship, or trust.',
    headline:
      'Evaluate whether your organization can adopt AI in ways that strengthen mission delivery, fundraising, communications, and operational capacity.',
    priorities: ['Mission alignment', 'Capacity constraints', 'Donor trust', 'Operational efficiency'],
    resultLens:
      'Mission-driven AI adoption should strengthen capacity and service delivery while preserving trust, stewardship, and human judgment.',
    recommendations: {
      strategyVision: 'Tie AI adoption to mission outcomes, service delivery, fundraising effectiveness, or staff capacity rather than novelty.',
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
        'Translate results into leadership-ready recommendations.'
      ]
    }
  },
  smallBusinesses: {
    id: 'smallBusinesses',
    label: 'Small Businesses',
    shortLabel: 'Small Biz',
    audience: 'Owner-led businesses, small teams, operators, and growing companies with limited time and resources.',
    description:
      'Built for practical businesses that need AI to create efficiency, consistency, and leverage without adding complexity.',
    headline:
      'Measure whether your business is ready to use AI in day-to-day operations, customer workflows, marketing, and internal execution.',
    priorities: ['Time savings', 'Revenue leverage', 'Simplicity', 'Practical adoption'],
    resultLens:
      'Small business AI readiness is about practical value, ease of use, workflow fit, and trust — not enterprise complexity.',
    recommendations: {
      strategyVision: 'Define where AI should save time, increase consistency, improve customer responsiveness, or support growth.',
      leadershipGovernance: 'Clarify who approves tools, how staff should use them, and what guardrails are needed for safe adoption.',
      dataReadiness: 'Identify the core systems, customer data, and business information needed for useful AI workflows.',
      technologyInfrastructure: 'Focus on simple, reliable tools that fit your current systems without creating operational mess.',
      securityRiskCompliance: 'Use lightweight but real controls for privacy, vendor review, and appropriate data handling.',
      peopleSkillsChange: 'Train staff in practical use cases so AI becomes a productivity asset rather than a source of confusion.',
      workflowIntegration: 'Start with repeatable business workflows such as communication, scheduling, marketing, intake, or reporting.',
      trustEthicsHuman: 'Define where people must still review customer-facing, financial, or sensitive decisions before action is taken.',
    },
    roadmap: {
      day30: [
        'Identify the top 2–3 repetitive workflows where AI could save time or improve consistency.',
        'Choose a small number of approved tools and define simple usage guardrails.',
        'Name one owner to oversee adoption and learning.'
      ],
      day60: [
        'Pilot AI in customer communication, internal admin, or marketing support workflows.',
        'Train the team on approved use cases and review expectations.',
        'Measure time saved, quality changes, and operational fit.'
      ],
      day90: [
        'Expand the most useful workflows and retire weak ones.',
        'Document practical team standards for ongoing use.',
        'Create a simple roadmap for the next phase of business adoption.'
      ]
    }
  },
  itTeams: {
    id: 'itTeams',
    label: 'IT Teams',
    shortLabel: 'IT Teams',
    audience: 'IT leaders, CIOs, CTOs, security teams, infrastructure teams, and internal technology groups.',
    description:
      'Tailored for teams that must balance enablement, governance, security, infrastructure, and supportability.',
    headline:
      'Assess whether your IT organization is ready to support responsible AI adoption across systems, teams, and enterprise workflows.',
    priorities: ['Security', 'Governance', 'Supportability', 'Scalable enablement'],
    resultLens:
      'IT readiness for AI depends on governance, security, infrastructure, data discipline, and a manageable support model.',
    recommendations: {
      strategyVision: 'Clarify how AI supports enterprise capabilities, internal efficiency, service quality, and technology strategy.',
      leadershipGovernance: 'Define ownership, review standards, approved tools, and decision rights across AI-related technology choices.',
      dataReadiness: 'Ensure systems, data classification, and integration readiness can support AI without weakening controls.',
      technologyInfrastructure: 'Prepare APIs, integration layers, cloud patterns, and support models for controlled AI adoption.',
      securityRiskCompliance: 'Formalize privacy, vendor risk, logging, access control, and review standards before scale.',
      peopleSkillsChange: 'Equip IT leaders and technical teams to support adoption without becoming a bottleneck or shadow-IT cleanup function.',
      workflowIntegration: 'Target service desk, documentation, reporting, automation, and internal support workflows first.',
      trustEthicsHuman: 'Define where approvals, auditability, and human review remain mandatory in sensitive workflows.',
    },
    roadmap: {
      day30: [
        'Confirm AI governance owner and approved evaluation criteria for tools and use cases.',
        'Identify the highest-value internal workflows for controlled AI pilots.',
        'Document baseline security, privacy, and infrastructure requirements.'
      ],
      day60: [
        'Pilot AI in one or two internal IT or enterprise-support workflows.',
        'Establish logging, review, and support expectations.',
        'Train technical leads on the approved operating model.'
      ],
      day90: [
        'Evaluate pilot outcomes for value, risk, and support burden.',
        'Standardize approved tools and rollout patterns.',
        'Publish a practical IT enablement roadmap for broader organizational use.'
      ]
    }
  },
  creativeTeams: {
    id: 'creativeTeams',
    label: 'Creative Teams',
    shortLabel: 'Creative',
    audience: 'Agencies, creative studios, content teams, designers, marketers, and media teams.',
    description:
      'Designed for teams using AI to accelerate content, ideation, production, and client-facing creative workflows.',
    headline:
      'Evaluate whether your team is ready to use AI across content, design, ideation, and production without sacrificing quality or trust.',
    priorities: ['Creative quality', 'Speed', 'Brand trust', 'Workflow leverage'],
    resultLens:
      'Creative AI readiness depends on workflow fit, quality control, IP awareness, and clear human review standards.',
    recommendations: {
      strategyVision: 'Clarify where AI should speed up ideation, production, editing, or content operations while protecting quality and brand standards.',
      leadershipGovernance: 'Set expectations for approved tools, brand usage, review standards, and client-facing application.',
      dataReadiness: 'Determine what brand assets, internal knowledge, and creative materials can responsibly support AI workflows.',
      technologyInfrastructure: 'Use tools and file workflows that fit your creative stack without causing versioning or process chaos.',
      securityRiskCompliance: 'Address IP, client confidentiality, rights management, and vendor exposure before scaling AI use.',
      peopleSkillsChange: 'Help creative staff use AI as an accelerator without eroding confidence, craft, or accountability.',
      workflowIntegration: 'Start with ideation, drafts, revisions, repurposing, research, and production support workflows.',
      trustEthicsHuman: 'Define where human review must remain central for quality, originality, and stakeholder trust.',
    },
    roadmap: {
      day30: [
        'Identify the content and production workflows where AI can create the most leverage.',
        'Define guardrails for brand quality, IP, and client-facing usage.',
        'Select a small set of approved tools for pilot use.'
      ],
      day60: [
        'Pilot AI in ideation, drafting, or production-support workflows.',
        'Train leads on review expectations and quality-control standards.',
        'Measure turnaround improvements and quality impact.'
      ],
      day90: [
        'Scale the workflows that improve speed without reducing trust or quality.',
        'Document team standards for creative AI use.',
        'Create a roadmap for broader workflow integration.'
      ]
    }
  },
  professionalServices: {
    id: 'professionalServices',
    label: 'Professional Services',
    shortLabel: 'Prof. Services',
    audience: 'Consultancies, advisory firms, law/accounting-adjacent firms, and client-service organizations.',
    description:
      'Tailored for organizations where client trust, knowledge work quality, and workflow leverage matter more than simple automation.',
    headline:
      'Assess whether your firm is ready to use AI to improve delivery, knowledge work, and margin while protecting client trust.',
    priorities: ['Client trust', 'Knowledge leverage', 'Quality control', 'Human review'],
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

export const DEFAULT_INDUSTRY_ID = 'smallBusinesses';
