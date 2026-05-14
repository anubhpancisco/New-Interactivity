import type { BranchKey, Part1Step, Part2Item } from "./types";
import { interview } from "./content";

const BRANCH_KEYWORDS: Record<BranchKey, readonly string[]> = {
  metrics: [
    "metric",
    "kpi",
    "roi",
    "evaluation",
    "measurement",
    "measure",
    "data",
    "pilot",
    "baseline",
    "dashboard",
    "analytics",
    "correlation",
    "proficiency",
    "instrument",
    "sample size",
  ],
  stakeholders: [
    "stakeholder",
    "alignment",
    "governance",
    "raci",
    "sales",
    "product",
    "legal",
    "compliance",
    "negotiation",
    "consensus",
    "workshop",
    "cross-functional",
    "facilitat",
    "sme",
  ],
  design_tradeoffs: [
    "blended",
    "curriculum",
    "assessment",
    "accessibility",
    "cognitive",
    "scenario",
    "module",
    "bloat",
    "instructional",
    "objective",
    "job aid",
    "time-to-competency",
    "assess",
    "curricula",
  ],
  scale_reuse: [
    "scale",
    "reuse",
    "template",
    "localization",
    "localisation",
    "maintenance",
    "architecture",
    "component",
    "version",
    "portfolio",
    "quarterly",
    "governance",
    "library",
  ],
};

/** When scores tie, first branch in this list wins; when all scores are zero, returns stakeholders. */
const BRANCH_ORDER: readonly BranchKey[] = ["metrics", "stakeholders", "design_tradeoffs", "scale_reuse"];

export function getPart1Question(args: {
  branch: BranchKey | null;
  /** 0 = shared Q1; 1–4 = branch-specific Q2–Q5 */
  part1Index: number;
}): Part1Step {
  const { branch, part1Index } = args;
  if (part1Index === 0) {
    return interview.part1.sharedQ1;
  }
  if (!branch) {
    throw new Error("Branch is required after Q1.");
  }
  const row = interview.part1.byBranch[branch][part1Index - 1];
  if (!row) {
    throw new Error(`Missing Part 1 content for branch=${branch}, index=${part1Index}`);
  }
  return row;
}

export function getPart2Question(index: number): Part2Item {
  const q = interview.part2[index];
  if (!q) {
    throw new Error(`Missing Part 2 question at index=${index}`);
  }
  return q;
}

export function inferBranchFromFreeText(text: string): BranchKey {
  const normalized = text.toLowerCase().replace(/\s+/g, " ");
  const scores: Record<BranchKey, number> = {
    metrics: 0,
    stakeholders: 0,
    design_tradeoffs: 0,
    scale_reuse: 0,
  };
  for (const branch of BRANCH_ORDER) {
    for (const kw of BRANCH_KEYWORDS[branch]) {
      let idx = 0;
      while (idx < normalized.length) {
        const found = normalized.indexOf(kw, idx);
        if (found === -1) break;
        scores[branch] += 1;
        idx = found + kw.length;
      }
    }
  }
  const total = BRANCH_ORDER.reduce((sum, b) => sum + scores[b], 0);
  if (total === 0) return "stakeholders";

  let best: BranchKey = BRANCH_ORDER[0];
  for (const branch of BRANCH_ORDER) {
    if (scores[branch] > scores[best]) best = branch;
  }
  return best;
}
