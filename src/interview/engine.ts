import type { BranchKey, Part1Step, Part2Item } from "./types";
import { interview } from "./content";

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

export function resolveBranchFromQ1OptionId(optionId: string): BranchKey {
  const map: Record<string, BranchKey> = {
    q1_metrics: "metrics",
    q1_stakeholders: "stakeholders",
    q1_design: "design_tradeoffs",
    q1_scale: "scale_reuse",
  };
  const branch = map[optionId];
  if (!branch) {
    throw new Error(`Unknown Q1 option id: ${optionId}`);
  }
  return branch;
}
