export type BranchKey = "metrics" | "stakeholders" | "design_tradeoffs" | "scale_reuse";

export type Phase = "intro" | "part1" | "pivot" | "part2" | "done";

export type TranscriptRole = "manager" | "designer";

export type TranscriptLine = {
  role: TranscriptRole;
  text: string;
};

export type Part1Step = {
  /** 1–5 for progress display; Q1 is always step 1. */
  stepNumber: 1 | 2 | 3 | 4 | 5;
  managerQuestion: string;
  /** Optional sample framings; shown only in facilitator mode. */
  facilitatorExamples?: string[];
};

export type Part2Item = {
  stepNumber: 6 | 7 | 8 | 9 | 10;
  managerQuestion: string;
  /** Shown only in facilitator mode. */
  facilitatorNotes?: string;
};
