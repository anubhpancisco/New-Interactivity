import type { BranchKey, Part1Step, Part2Item } from "./types";

export const practiceMeta = {
  title: "Practice interview: Instructional Design Manager → Senior Instructional Designer",
  subtitle:
    "Corporate L&D context for a global technology company (India hub). Unofficial practice tool for interview preparation only.",
} as const;

export const pivotCopy = {
  headline: "Switching gears",
  body: "You have completed the first five typed responses. Questions 6–10 will reference excerpts from what you wrote. Answer as you would in a live interview.",
} as const;

const sharedQ1: Part1Step = {
  stepNumber: 1,
  managerQuestion:
    "Tell me about one learning program you owned end-to-end while working with stakeholders across regions. Keep it high level: who it was for, what business problem it addressed, and what you personally drove versus what you partnered on—especially from an India-based L&D perspective supporting global audiences.",
  facilitatorExamples: [
    "I led a global readiness rollout for customer-facing roles. The business problem was inconsistent execution after a major process change. I owned discovery, performance mapping, and evaluation design; I partnered with SMEs in multiple regions, vendor media, and our India L&D ops team for localization and LMS release windows.",
    "I ran a multi-quarter enablement track for a new internal playbook. The hardest part was alignment—sales, delivery, and product each had different definitions of ‘good.’ From India I coordinated async reviews and live workshops, owned the design standards, and facilitated governance so we did not ship seventeen versions of the truth.",
    "I redesigned a bloated curriculum into a blended path: short digital core, guided practice, and manager-led reinforcement. The problem was time-to-competency, not lack of slides. I personally rewrote objectives, cut redundant content, and rebuilt assessments so they measured decisions, not memorization.",
    "I built a reusable learning architecture for a portfolio that changes quarterly—templates, component library, and a maintenance model. I owned the standards and governance; SMEs owned accuracy. My focus was scale: fewer one-offs, cleaner updates, and predictable localization without fragmenting the experience.",
  ],
};

const metricsBranch: Part1Step[] = [
  {
    stepNumber: 2,
    managerQuestion:
      "You anchored this in performance and evaluation. Before you built anything, how did you define success with stakeholders—and which metrics were you willing to *not* optimize for, because they would have incentivized the wrong behavior?",
    facilitatorExamples: [
      "We aligned on a small set: quality of customer conversations in QA samples, cycle time to first credible delivery, and voluntary adoption of job aids. We explicitly deprioritized raw completion as a success metric once baseline compliance was met.",
      "We used a balanced scorecard: proficiency checks, observed behaviors in pilots, and leading indicators from CRM hygiene. We avoided ‘smile sheet averages’ as a primary gate because they reward entertainment, not transfer.",
      "We defined ‘good’ as fewer repeat escalations tied to the process change. Learning metrics were secondary unless they correlated with those escalations in pilot regions.",
    ],
  },
  {
    stepNumber: 3,
    managerQuestion:
      "When pilot data was ambiguous—or India results looked different from other regions—what was your process to decide whether to iterate the solution, iterate the measurement, or pause rollout?",
    facilitatorExamples: [
      "I triangulated: qualitative call listening, SME spot checks, and cohort comparisons. If measurement drift was the issue, we fixed instrumentation first. If behavior was inconsistent by region, we localized examples and manager enablement before touching the core model.",
      "We used pre-registered decision rules. If confidence intervals overlapped across regions, we treated it as ‘not proven yet’ and expanded pilot sample sizes rather than declaring victory.",
      "I escalated with a one-page decision memo: what we know, what we don’t, and the business risk of continuing. The worst outcome is shipping a story that data cannot support.",
    ],
  },
  {
    stepNumber: 4,
    managerQuestion:
      "How did you communicate results to leadership in a way that was honest about learning’s contribution—especially when stakeholders wanted a simple ROI story?",
    facilitatorExamples: [
      "I separated correlation from causation. I showed enabling metrics, guardrails, and counterfactual risks. If ROI was requested, I framed plausible mechanisms and what additional instrumentation we’d need—rather than inventing precision we didn’t have.",
      "I used a contribution narrative: what changed, what we controlled, what else moved in the business at the same time. I paired dashboards with plain-language limitations so executives didn’t walk away with false certainty.",
      "I aligned communications to decisions: continue, iterate, or stop. Metrics were in service of that decision, not a trophy slide.",
    ],
  },
  {
    stepNumber: 5,
    managerQuestion:
      "Last question on this thread: if you handed the program to another designer tomorrow, what is the single most important ‘metrics decision’ you would document so they do not accidentally reintroduce perverse incentives?",
    facilitatorExamples: [
      "Document the definition of ‘good performance,’ the leading vs lagging indicators we agreed to, and the explicit list of metrics we refused to chase. Also document how pilots were sampled so nobody re-interprets noise as signal.",
      "Write the evaluation protocol: instruments, baselines, biases, and known confounders. The goal is reproducibility—not a polished headline.",
      "Capture the stakeholder promises we made—and the promises we refused—about what learning could prove. That prevents retroactive moving of goalposts.",
    ],
  },
];

const stakeholdersBranch: Part1Step[] = [
  {
    stepNumber: 2,
    managerQuestion:
      "You emphasized cross-functional alignment. Who was the most challenging stakeholder group, and what did you do in the first two weeks to reduce thrash without slowing credibility with SMEs?",
    facilitatorExamples: [
      "Product wanted exhaustive depth; sales needed speed. I created a decision rights matrix and a weekly async review cadence with explicit turnaround times. Early win: a shared glossary and ‘source of truth’ map so debates became about evidence, not opinion.",
      "Legal/compliance was cautious about anything that looked like ‘advice.’ I co-developed safe language patterns and scenario boundaries with them up front, rather than surprising them at the end.",
      "Field managers were skeptical. I interviewed ten managers, translated their objections into design requirements, and brought two of them into pilot design reviews as partners—not as token reviewers.",
    ],
  },
  {
    stepNumber: 3,
    managerQuestion:
      "Describe a moment where two powerful stakeholders disagreed on scope. How did you facilitate a decision, and what did you trade off to keep the program shippable?",
    facilitatorExamples: [
      "We had a classic ‘everything is critical’ conflict. I forced prioritization using impact and risk: what breaks revenue, what breaks trust, what is nice-to-have. We shipped the critical path first and parked the rest in a transparent backlog with owners.",
      "I reframed the fight as a user-journey problem. When stakeholders saw the same learner timeline, they conceded that not every concept belongs in v1. We used a phased roadmap tied to business milestones.",
      "I brought data from pilots and support tickets. Disagreements cooled when the pain was no longer abstract. The trade-off was ego: some teams had to accept their pet module was not v1.",
    ],
  },
  {
    stepNumber: 4,
    managerQuestion:
      "Working from India with global SMEs and leadership, what practices made async collaboration fair, fast, and respectful—without burning people out in late-night calls?",
    facilitatorExamples: [
      "I default to async artifacts with tight feedback windows, and I batch live sessions for decisions only. I rotate meeting times when live is unavoidable, and I record concise decision summaries so nobody re-litigates.",
      "I invest heavily in storyboards and annotated prototypes so SMEs can react quickly. I also set SLAs: what we need from them, by when, and what happens if we miss—scope reduces or dates move, visibly.",
      "I build ‘follow-the-sun’ handoffs: India prepares structure and drafts; other regions validate examples; we merge with version control discipline. Respect means clarity, not unlimited availability.",
    ],
  },
  {
    stepNumber: 5,
    managerQuestion:
      "What governance artifact are you most proud of from that program—something that made the work more scalable for the next initiative?",
    facilitatorExamples: [
      "A lightweight design decision log plus a RACI for content accuracy vs instructional risk. It prevented random rewrites late in QA.",
      "A style guide for scenarios: tone, representation, and what we never simulate in customer interactions. It made localization and ethics reviews faster.",
      "A stakeholder intake template that forced problem statements, constraints, and success signals before anyone opened Storyline.",
    ],
  },
];

const designBranch: Part1Step[] = [
  {
    stepNumber: 2,
    managerQuestion:
      "You focused on time-to-competency and reducing bloat. Walk me through one specific module you cut heavily. What rule did you use to decide what survived, and how did you validate learners could still perform the critical tasks?",
    facilitatorExamples: [
      "I used a ‘perform-or-reference’ rule: if it was not required to make a correct decision in the top ten failure modes, it moved to a searchable reference library. Validation was scenario-based checks plus SME sign-off on the failure-mode map.",
      "I cut anything that repeated what a good job aid already supports in the flow of work. Survival test: can the learner explain when to use the aid versus when to escalate? If not, the module still failed.",
      "I used cognitive load as the lens: reduce extraneous load first. We validated with targeted user tests measuring time-on-task and error patterns—not just preference surveys.",
    ],
  },
  {
    stepNumber: 3,
    managerQuestion:
      "In a blended design, how did you decide what must be synchronous—and what did you intentionally push to async or manager-led reinforcement?",
    facilitatorExamples: [
      "Synchronous time was for sense-making, tricky trade-offs, and practice with feedback. Async carried facts, procedures, and prework. Manager-led reinforcement carried accountability and local examples.",
      "Anything that required negotiation or nuance stayed live. Anything that was ‘know/recall’ went async with retrieval practice. I protected live time like a budget line item.",
      "We used a flipped model: async built baseline literacy; workshops were drills. If people showed up unprepared, we redesigned the async chunk—blame the design, not the learner.",
    ],
  },
  {
    stepNumber: 4,
    managerQuestion:
      "How do you build accessibility and inclusive design into your process early—especially when media vendors and SMEs are moving fast?",
    facilitatorExamples: [
      "Non-negotiables live in templates: structure, alt text expectations, contrast checks, keyboard paths for interactives, and captions. I bake checks into storyboard review gates, not end-of-line QA surprises.",
      "I involve accessibility review on representative samples early, then scale patterns. I also coach SMEs on inclusive scenarios: who is shown as competent, what stereotypes we avoid, and how examples travel across cultures.",
      "I prioritize ‘accessible by default’ authoring practices and reduce exotic interaction types. Speed with integrity beats flashy interactions that break assistive tech.",
    ],
  },
  {
    stepNumber: 5,
    managerQuestion:
      "What is one assessment design choice you made that increased validity—something another team might have skipped because it was expensive in time or political capital?",
    facilitatorExamples: [
      "We replaced a multiple-choice trivia bank with branching scenarios scored against observable decision criteria. It cost political capital with SMEs who wanted ‘coverage,’ but it matched the job.",
      "We used structured workplace evidence tasks with manager attestation for a subset of roles. Expensive to operationalize, but it connected learning to reality.",
      "We piloted distractor analysis and revised wrong answers that taught the wrong mental model. Sounds small, but it catches ‘false confidence’ early.",
    ],
  },
];

const scaleBranch: Part1Step[] = [
  {
    stepNumber: 2,
    managerQuestion:
      "You emphasized reuse and a maintenance model. What were the non-negotiable components of your reusable architecture, and what did you intentionally *not* standardize because it killed local relevance?",
    facilitatorExamples: [
      "Non-negotiable: objective taxonomy, assessment patterns, branding shells, versioning rules, and accessibility patterns. We did not standardize customer anecdotes—those stayed locally authored within guardrails.",
      "We standardized structure and metadata; we kept flexible ‘example slots’ and optional deep dives. The architecture was a spine, not a straitjacket.",
      "We standardized navigation and component types to reduce cognitive load for learners across products. We allowed localized terminology where markets differed, controlled by a glossary workflow.",
    ],
  },
  {
    stepNumber: 3,
    managerQuestion:
      "When the underlying product or policy changed quarterly, what was your update workflow—and how did you prevent ‘silent drift’ where the course says one thing and the field does another?",
    facilitatorExamples: [
      "We tied learning releases to product communications with a single owner for content truth. Changes flowed through a lightweight change request with impact tagging: cosmetic vs performance-critical.",
      "We used versioned micro-updates with visible ‘last verified’ cues in the UI where appropriate, plus a maintenance calendar. Silent drift was treated as an incident, not housekeeping.",
      "We separated evergreen principles from volatile details and pushed volatile details to managed reference surfaces. Courses taught how to navigate truth, not a snapshot that ages instantly.",
    ],
  },
  {
    stepNumber: 4,
    managerQuestion:
      "Localization at scale: what did you do to keep translation and cultural adaptation from creating four different learning experiences that still claim to be ‘the same program’?",
    facilitatorExamples: [
      "We defined a global learning intent and ‘localization budget’: what can change (examples, tone, regulatory callouts) and what cannot (objectives, critical decisions, assessment rubric).",
      "We used in-country reviewers for examples and imagery, but kept assessment constructs stable. We tracked deviations in a registry so we knew where equivalency might differ.",
      "We invested in modular assets: shared core + swappable local packs. It costs more up front, but it prevents forked courses over time.",
    ],
  },
  {
    stepNumber: 5,
    managerQuestion:
      "Who owns maintenance after launch in your model—and what metric or signal tells you the learning ecosystem needs a redesign, not just an update?",
    facilitatorExamples: [
      "Product owners own accuracy; L&D owns experience and instrumentation. A redesign signal is persistent performance issues clustered in the same decision step despite content updates and support interventions.",
      "A joint operating cadence: monthly hygiene review, quarterly deep dive. Redesign triggers when the job itself changes—not when someone dislikes a font.",
      "We watch learner search behavior and time-to-answer in practice tasks. When people brute-force or guess patterns, the design is lying about mastery.",
    ],
  },
];

const part2: Part2Item[] = [
  {
    stepNumber: 6,
    managerQuestion:
      "Imagine you join a matrixed organization where you have responsibility but limited authority. You need a critical deliverable from a peer leader who is overloaded and deprioritizes your work. What is your first week plan, what principles guide your escalation, and how do you protect relationships while protecting quality?",
    facilitatorNotes:
      "Strong answers: clarify shared outcomes, propose smallest viable slice, offer trade-offs, document risks without blame, escalate along agreed governance, keep evidence-based tone.",
  },
  {
    stepNumber: 7,
    managerQuestion:
      "Tell me about a time business outcomes improved while learning metrics looked flat—or the opposite. How did you investigate, what did you conclude, and how did you present that to leadership without overstating what L&D can claim?",
    facilitatorNotes:
      "Strong answers: separate drivers, discuss confounders, propose better measures, avoid vanity metrics, show integrity over hero narrative.",
  },
  {
    stepNumber: 8,
    managerQuestion:
      "When building learning for internal audiences, what principles do you follow for handling sensitive information in scenarios, recordings, screenshots, and learner-generated work—especially in a highly connected global enterprise?",
    facilitatorNotes:
      "Strong answers: data minimization, classification awareness, anonymization, safe synthetic examples, secure tooling, no ‘surprise’ real customer data, clear retention.",
  },
  {
    stepNumber: 9,
    managerQuestion:
      "If leadership demands faster turnaround than instructional quality allows, what is your approach to negotiate scope, risk, and definition of done—without becoming the team that always says no?",
    facilitatorNotes:
      "Strong answers: phased delivery, MVP learning product, explicit risks, quality gates tied to consequences, partner on triage, document trade-offs.",
  },
  {
    stepNumber: 10,
    managerQuestion:
      "What do you need from your manager to do your best work in a corporate L&D role in India supporting global stakeholders—and what are you intentionally learning in the next 12 months about AI-assisted instructional design workflows?",
    facilitatorNotes:
      "Strong answers: clarity, air cover, access, coaching; responsible AI use: review, validation, bias checks, IP/security awareness, speed with safeguards.",
  },
];

export const interview = {
  part1: {
    sharedQ1,
    byBranch: {
      metrics: metricsBranch,
      stakeholders: stakeholdersBranch,
      design_tradeoffs: designBranch,
      scale_reuse: scaleBranch,
    } satisfies Record<BranchKey, Part1Step[]>,
  },
  part2,
} as const;
