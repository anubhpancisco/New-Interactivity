import type { BranchKey } from "./types";

export type ThemeGroup = {
  /** Substrings matched against normalized answer (lowercase). */
  signals: readonly string[];
  /** Short bullet when this signal is present. */
  strengthLabel: string;
  /** Short bullet when this signal is absent. */
  missLabel: string;
};

export type QuestionRubric = {
  minWords: number;
  themes: readonly ThemeGroup[];
  /** Static hints for reaching a 4–5 on this prompt. */
  moveTo45Hints: readonly string[];
};

const Q1: QuestionRubric = {
  minWords: 45,
  themes: [
    {
      signals: ["audience", "learner", "role", "team", "for ", "who ", "population", "cohort", "region"],
      strengthLabel: "You named who the program was for.",
      missLabel: "Name the audience (roles, regions, or cohort size) so the scope is concrete.",
    },
    {
      signals: ["problem", "challenge", "goal", "outcome", "business", "need", "why ", "pain", "gap"],
      strengthLabel: "You connected the work to a business or performance problem.",
      missLabel: "State the business or performance problem this program addressed—not only activities you ran.",
    },
    {
      signals: ["owned", "led", "drove", "i ", "my ", "responsible", "accountable", "end-to-end"],
      strengthLabel: "You clarified what you personally owned versus what you partnered on.",
      missLabel: "Separate what you owned end-to-end from what SMEs, vendors, or partners owned.",
    },
    {
      signals: ["india", "global", "region", "timezone", "localization", "cross", "stakeholder", "matrix"],
      strengthLabel: "You referenced India/global collaboration or stakeholder complexity.",
      missLabel: "Add how working from India (or across regions) shaped coordination, async work, or trade-offs.",
    },
  ],
  moveTo45Hints: [
    "Use one tight story: audience → business problem → your ownership boundary → one partnership tension you navigated.",
    "Add a concrete artifact (pilot, rollout wave, governance cadence) instead of only listing responsibilities.",
  ],
};

function branchQ2(branch: BranchKey): QuestionRubric {
  const by: Record<BranchKey, QuestionRubric> = {
    metrics: {
      minWords: 40,
      themes: [
        {
          signals: ["success", "metric", "kpi", "outcome", "measure", "define", "align", "stakeholder"],
          strengthLabel: "You explained how success was defined with stakeholders.",
          missLabel: "Spell out how you aligned on success criteria before building content.",
        },
        {
          signals: ["not ", "avoid", "deprior", "trade-off", "perverse", "wrong", "incentive", "guardrail"],
          strengthLabel: "You discussed metrics you avoided or deprioritized.",
          missLabel: "Name at least one metric you deliberately did not optimize for and why (perverse incentives).",
        },
      ],
      moveTo45Hints: [
        "Give a named example of a metric you refused to chase and what behavior it would have rewarded.",
        "Tie metrics to decisions (iterate, scale, stop) rather than reporting for its own sake.",
      ],
    },
    stakeholders: {
      minWords: 40,
      themes: [
        {
          signals: ["stakeholder", "product", "sales", "sme", "legal", "tough", "difficult", "challenge"],
          strengthLabel: "You identified a challenging stakeholder group.",
          missLabel: "Name the hardest stakeholder group and what made them hard (speed vs depth, risk, etc.).",
        },
        {
          signals: ["week", "two week", "first", "cadence", "async", "workshop", "alignment", "glossary", "raci"],
          strengthLabel: "You described early moves to reduce thrash (cadence, artifacts, or decision rights).",
          missLabel: "Describe what you did in the first ~two weeks to build credibility without slowing SMEs.",
        },
      ],
      moveTo45Hints: [
        "Add one specific artifact (decision log, RACI slice, review SLA) and how it changed behavior.",
        "Mention how you protected SME time while still getting timely decisions.",
      ],
    },
    design_tradeoffs: {
      minWords: 40,
      themes: [
        {
          signals: ["module", "cut", "removed", "reduced", "bloat", "rule", "criteria", "ruthless"],
          strengthLabel: "You named what you cut and the rule behind it.",
          missLabel: "Pick one module or topic area you cut heavily and state the cut rule explicitly.",
        },
        {
          signals: ["valid", "scenario", "assessment", "perform", "pilot", "task", "error", "competenc"],
          strengthLabel: "You explained how you validated learners could still perform critical tasks.",
          missLabel: "Explain validation: scenarios, checks, pilots, or SME sign-off tied to critical tasks—not just opinion.",
        },
      ],
      moveTo45Hints: [
        "Connect cuts to failure modes or job tasks so the rationale feels evidence-based.",
        "Mention cognitive load, time-to-competency, or assessment validity if relevant.",
      ],
    },
    scale_reuse: {
      minWords: 40,
      themes: [
        {
          signals: ["template", "component", "architecture", "standard", "reuse", "library", "pattern"],
          strengthLabel: "You described what was standardized in the reusable design.",
          missLabel: "List non-negotiable reusable elements (templates, metadata, patterns) you enforced.",
        },
        {
          signals: ["not standard", "local", "flex", "exception", "cultural", "example", "anecdote", "relevance"],
          strengthLabel: "You noted what stayed flexible for local relevance.",
          missLabel: "Say what you intentionally did not standardize so local relevance or nuance survived.",
        },
      ],
      moveTo45Hints: [
        "Contrast the reusable spine vs swappable local layers with a concrete example.",
        "Mention governance or versioning so reuse does not silently fork.",
      ],
    },
  };
  return by[branch];
}

function branchQ3(branch: BranchKey): QuestionRubric {
  const by: Record<BranchKey, QuestionRubric> = {
    metrics: {
      minWords: 40,
      themes: [
        {
          signals: ["pilot", "ambiguous", "iterate", "measurement", "instrument", "sample", "region", "india"],
          strengthLabel: "You described how you handled ambiguous or divergent regional data.",
          missLabel: "Walk through when you iterated the solution vs the measurement vs pausing rollout.",
        },
        {
          signals: ["triangulat", "qualitative", "decision", "memo", "confidence", "hypothesis"],
          strengthLabel: "You mentioned triangulation, decision rules, or structured decision-making.",
          missLabel: "Add how you avoided over-reading noise (triangulation, pre-registered rules, or a decision memo).",
        },
      ],
      moveTo45Hints: [
        "Name one concrete fork in the road (e.g., India vs other regions) and the evidence you demanded before scaling.",
      ],
    },
    stakeholders: {
      minWords: 40,
      themes: [
        {
          signals: ["disagree", "conflict", "scope", "priorit", "facilitat", "decision", "trade-off"],
          strengthLabel: "You described a real disagreement and how you facilitated a decision.",
          missLabel: "Describe two stakeholders in tension and the facilitation move that unlocked a decision.",
        },
        {
          signals: ["ship", "mvp", "phase", "roadmap", "backlog", "trade", "defer"],
          strengthLabel: "You named what you traded off to keep delivery shippable.",
          missLabel: "State explicitly what dropped out of v1 or what you phased to protect the date.",
        },
      ],
      moveTo45Hints: [
        "Use outcomes language: what shipped, what stayed in backlog, and who owned the deferred scope.",
      ],
    },
    design_tradeoffs: {
      minWords: 40,
      themes: [
        {
          signals: ["sync", "async", "live", "virtual", "workshop", "instructor", "manager", "reinforc"],
          strengthLabel: "You split what belonged in sync vs async or manager-led paths.",
          missLabel: "Clarify what had to be synchronous vs what you pushed async or to managers—and why.",
        },
        {
          signals: ["practice", "feedback", "drill", "sense", "nuance", "negotiat"],
          strengthLabel: "You tied live time to practice, feedback, or nuance.",
          missLabel: "Explain what live time bought you that async could not (practice, negotiation, tricky trade-offs).",
        },
      ],
      moveTo45Hints: [
        "Tie the blend model to time budgets and learner readiness (prework, flipped flow).",
      ],
    },
    scale_reuse: {
      minWords: 40,
      themes: [
        {
          signals: ["quarter", "change", "workflow", "version", "drift", "update", "release", "owner"],
          strengthLabel: "You described an update workflow when content or policy churned.",
          missLabel: "Describe the operational workflow for frequent updates and who owns truth.",
        },
        {
          signals: ["silent", "field", "mismatch", "truth", "verify", "communication"],
          strengthLabel: "You addressed preventing drift between learning and the field.",
          missLabel: "Explain how you prevented silent drift between the course and what the field actually does.",
        },
      ],
      moveTo45Hints: [
        "Separate evergreen principles from volatile details and where volatile truth lives.",
      ],
    },
  };
  return by[branch];
}

function branchQ4(branch: BranchKey): QuestionRubric {
  const by: Record<BranchKey, QuestionRubric> = {
    metrics: {
      minWords: 40,
      themes: [
        {
          signals: ["leadership", "executive", "honest", "correlation", "causation", "roi", "limitation", "narrative"],
          strengthLabel: "You showed how you communicated limitations or contribution honestly.",
          missLabel: "Address how you talked about causation vs correlation and simple ROI asks from leadership.",
        },
        {
          signals: ["dashboard", "decision", "guardrail", "counterfactual", "risk"],
          strengthLabel: "You linked reporting to decisions or risks—not only headlines.",
          missLabel: "Tie communications to decisions (continue, iterate, stop) and known confounders.",
        },
      ],
      moveTo45Hints: [
        "Offer a phrase or framing you used with executives to resist false precision.",
      ],
    },
    stakeholders: {
      minWords: 40,
      themes: [
        {
          signals: ["async", "time zone", "timezone", "late", "meeting", "batch", "rotate", "recording", "summary"],
          strengthLabel: "You named async practices or how you protected time zones.",
          missLabel: "Add specific async collaboration practices or how you made global calls fair.",
        },
        {
          signals: ["artifact", "storyboard", "prototype", "sla", "turnaround", "feedback window"],
          strengthLabel: "You used artifacts or SLAs to speed SME review.",
          missLabel: "Mention artifacts (storyboards, annotated prototypes) or SLAs that reduced rework.",
        },
      ],
      moveTo45Hints: [
        "Give one example of a follow-the-sun or handoff pattern you used from India.",
      ],
    },
    design_tradeoffs: {
      minWords: 40,
      themes: [
        {
          signals: ["accessib", "wcag", "caption", "alt text", "keyboard", "inclusive", "vendor", "early"],
          strengthLabel: "You embedded accessibility early in the process.",
          missLabel: "Describe how accessibility was enforced before final QA (templates, gates, samples).",
        },
        {
          signals: ["represent", "culture", "bias", "scenario", "inclusive"],
          strengthLabel: "You mentioned inclusive scenarios or representation—not only technical a11y.",
          missLabel: "Add inclusion in scenarios (representation, stereotypes avoided) alongside technical checks.",
        },
      ],
      moveTo45Hints: [
        "Name a non-negotiable authoring rule your vendors or SMEs had to follow.",
      ],
    },
    scale_reuse: {
      minWords: 40,
      themes: [
        {
          signals: ["local", "translation", "locale", "cultural", "adapt", "reviewer", "equival"],
          strengthLabel: "You described how localization stayed equivalent, not forked.",
          missLabel: "Explain how you kept translation/adaptation from creating divergent experiences.",
        },
        {
          signals: ["intent", "rubric", "assessment", "global", "deviation"],
          strengthLabel: "You protected global learning intent or assessment equivalence.",
          missLabel: "Mention what stayed fixed globally (objectives, rubric) vs what could flex locally.",
        },
      ],
      moveTo45Hints: [
        "Reference modular core + local packs or a deviation registry if you used them.",
      ],
    },
  };
  return by[branch];
}

function branchQ5(branch: BranchKey): QuestionRubric {
  const by: Record<BranchKey, QuestionRubric> = {
    metrics: {
      minWords: 35,
      themes: [
        {
          signals: ["document", "handoff", "definition", "protocol", "baseline", "bias", "instrument"],
          strengthLabel: "You named what you would document for the next owner.",
          missLabel: "Name the single most important metrics decision to document (definitions, baselines, or anti-metrics).",
        },
        {
          signals: ["perverse", "incentive", "pilot", "sample", "reproduc"],
          strengthLabel: "You warned about incentives, sampling, or reproducibility.",
          missLabel: "Call out perverse incentives or sampling pitfalls the next designer must not reintroduce.",
        },
      ],
      moveTo45Hints: [
        "Be specific enough that a new owner could rebuild the evaluation approach without guessing.",
      ],
    },
    stakeholders: {
      minWords: 35,
      themes: [
        {
          signals: ["governance", "raci", "decision log", "template", "intake", "style guide", "artifact"],
          strengthLabel: "You named a governance artifact you are proud of.",
          missLabel: "Name one governance artifact (RACI slice, decision log, intake template) and why it scaled.",
        },
        {
          signals: ["next", "reuse", "prevent", "scale", "initiative"],
          strengthLabel: "You connected the artifact to the next initiative or reduced thrash.",
          missLabel: "Explain how that artifact made the next program faster, safer, or less political.",
        },
      ],
      moveTo45Hints: [
        "Tie the artifact to a recurring pain it prevents (late surprises, random rewrites, misalignment).",
      ],
    },
    design_tradeoffs: {
      minWords: 35,
      themes: [
        {
          signals: ["assessment", "valid", "scenario", "branching", "evidence", "political", "cost"],
          strengthLabel: "You described a costly validity choice (scenarios, evidence tasks, distractor work).",
          missLabel: "Pick one assessment validity move and why it was expensive in time or political capital.",
        },
        {
          signals: ["sme", "coverage", "trivia", "multiple choice", "rubric"],
          strengthLabel: "You referenced trade-offs with SMEs or coverage pressure.",
          missLabel: "Contrast what SMEs wanted vs what validity required—and how you negotiated it.",
        },
      ],
      moveTo45Hints: [
        "Quantify impact if you can (error types reduced, pilot results) to justify the expensive choice.",
      ],
    },
    scale_reuse: {
      minWords: 35,
      themes: [
        {
          signals: ["owner", "maintenance", "ops", "product", "ld", "cadence", "hygiene"],
          strengthLabel: "You clarified who owns maintenance after launch.",
          missLabel: "State who owns accuracy vs experience after launch and the operating cadence.",
        },
        {
          signals: ["redesign", "signal", "metric", "support ticket", "search", "persist"],
          strengthLabel: "You named signals that trigger redesign vs routine updates.",
          missLabel: "Give a signal that means redesign (clustered failures, behavior drift)—not only content edits.",
        },
      ],
      moveTo45Hints: [
        "Separate hygiene updates from redesign triggers with a concrete example.",
      ],
    },
  };
  return by[branch];
}

export function getPart1Rubric(part1Index: number, branch: BranchKey | null): QuestionRubric {
  if (part1Index === 0) return Q1;
  if (!branch) throw new Error("Branch required for Part 1 rubric after Q1.");
  if (part1Index === 1) return branchQ2(branch);
  if (part1Index === 2) return branchQ3(branch);
  if (part1Index === 3) return branchQ4(branch);
  if (part1Index === 4) return branchQ5(branch);
  throw new Error(`Invalid part1Index for rubric: ${part1Index}`);
}

const PART2_RUBRICS: readonly QuestionRubric[] = [
  {
    minWords: 55,
    themes: [
      {
        signals: ["week", "plan", "day", "first", "stake", "clarif", "outcome", "align"],
        strengthLabel: "You outlined an early plan with clarity on outcomes.",
        missLabel: "Spell out a first-week plan: discovery, alignment, and smallest slice of value.",
      },
      {
        signals: ["escalat", "governance", "chain", "risk", "document", "evidence"],
        strengthLabel: "You described escalation principles tied to governance or evidence.",
        missLabel: "Describe escalation principles (when, to whom, with what evidence) without blame.",
      },
      {
        signals: ["relationship", "trust", "negotiat", "trade-off", "quality", "protect"],
        strengthLabel: "You balanced relationship/trust with quality risk.",
        missLabel: "Explain how you protect quality while preserving the relationship (options, trade-offs, co-owning risk).",
      },
    ],
    moveTo45Hints: [
      "Offer a smallest-viable-slice proposal and a pre-agreed escalation path before pressure hits.",
    ],
  },
  {
    minWords: 55,
    themes: [
      {
        signals: ["investigat", "hypothesis", "driver", "confound", "segment", "data"],
        strengthLabel: "You explained how you investigated conflicting signals.",
        missLabel: "Describe the investigation steps (drivers, segments, confounders) you used.",
      },
      {
        signals: ["flat", "improv", "contradict", "opposite", "disconnect"],
        strengthLabel: "You engaged with the tension between learning metrics and business outcomes.",
        missLabel: "Name the tension you saw (flat learning vs improved business or the reverse) explicitly.",
      },
      {
        signals: ["leadership", "claim", "integrity", "honest", "limit", "narrative"],
        strengthLabel: "You showed how you communicated limits of L&D claims to leadership.",
        missLabel: "Explain how you presented conclusions without overstating what learning caused.",
      },
    ],
    moveTo45Hints: [
      "Separate correlation from causation and propose better measures if the wrong ones were watched.",
    ],
  },
  {
    minWords: 50,
    themes: [
      {
        signals: ["sensitive", "pii", "classification", "minimiz", "anonym", "redact", "consent"],
        strengthLabel: "You referenced data sensitivity, minimization, or classification.",
        missLabel: "Name principles for sensitive data (minimization, classification, anonymization, consent).",
      },
      {
        signals: ["scenario", "recording", "screenshot", "synthetic", "mask", "secure"],
        strengthLabel: "You addressed scenarios, recordings, or artifacts and how you kept them safe.",
        missLabel: "Cover scenarios/recordings/screenshots: what you avoid, mask, or synthesize.",
      },
      {
        signals: ["global", "policy", "retention", "jurisdiction", "enterprise"],
        strengthLabel: "You acknowledged enterprise/global policy context.",
        missLabel: "Mention retention, tooling, or policy alignment for a global enterprise.",
      },
    ],
    moveTo45Hints: [
      "Give a concrete rule of thumb you follow when real customer data would be risky in learning assets.",
    ],
  },
  {
    minWords: 50,
    themes: [
      {
        signals: ["scope", "mvp", "phase", "negotiat", "trade-off", "definition of done", "done"],
        strengthLabel: "You negotiated scope, phases, or definition of done.",
        missLabel: "Explain how you negotiate scope and definition of done when speed pressures quality.",
      },
      {
        signals: ["risk", "explicit", "document", "quality gate", "consequence"],
        strengthLabel: "You made risks explicit and tied quality to consequences.",
        missLabel: "Document risks of cutting corners and tie quality gates to real consequences.",
      },
      {
        signals: ["partner", "yes", "triag", "alternative", "options"],
        strengthLabel: "You framed options rather than only saying no.",
        missLabel: "Show how you partner on triage with options—not only refusal.",
      },
    ],
    moveTo45Hints: [
      "Use phased delivery with a clear MVP learning product and visible trade-offs on the roadmap.",
    ],
  },
  {
    minWords: 45,
    themes: [
      {
        signals: ["manager", "support", "air cover", "access", "clarity", "coach"],
        strengthLabel: "You stated what you need from a manager to do your best work.",
        missLabel: "Be explicit about what you need from your manager (clarity, access, escalation support).",
      },
      {
        signals: ["ai", "assist", "review", "validat", "bias", "ip", "security", "responsible"],
        strengthLabel: "You addressed responsible AI use (review, validation, risk).",
        missLabel: "Name how you are learning responsible AI workflows (review, bias, IP/security).",
      },
    ],
    moveTo45Hints: [
      "Connect manager support to global stakeholder realities (time zones, governance, visibility).",
    ],
  },
];

export function getPart2Rubric(part2Index: number): QuestionRubric {
  const r = PART2_RUBRICS[part2Index];
  if (!r) throw new Error(`Missing Part 2 rubric at index ${part2Index}`);
  return r;
}
