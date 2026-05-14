export type BranchKey = "metrics" | "stakeholders" | "design_tradeoffs" | "scale_reuse";

export type Phase =
  | "intro"
  | "part1"
  | "part1_guidance"
  | "pivot"
  | "part2"
  | "part2_guidance"
  | "done";

export type TranscriptRole = "manager" | "designer";

export type TranscriptLine = {
  role: TranscriptRole;
  text: string;
};

export type StepNumber = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

/** Local, rubric-based feedback for one answer. */
export type AnswerGuidance = {
  score: 1 | 2 | 3 | 4 | 5;
  /** True when the answer clears minimum substance and enough rubric themes. */
  satisfactory: boolean;
  verdict: string;
  strengths: string[];
  gaps: string[];
  suggestedAdditions: string[];
  /** What would move this response toward a 4–5 for this prompt. */
  moveTo45Hints: string[];
};

export type SessionTurn = {
  stepNumber: StepNumber;
  questionText: string;
  answerText: string;
  guidance: AnswerGuidance;
};

export type SessionSummary = {
  overallScore: 1 | 2 | 3 | 4 | 5;
  overallFeedback: string;
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
