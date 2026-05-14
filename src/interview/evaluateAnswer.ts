import type { AnswerGuidance, BranchKey, SessionSummary, SessionTurn } from "./types";
import { getPart1Rubric, getPart2Rubric, type QuestionRubric } from "./rubrics";

function normalizeAnswer(text: string): string {
  return text.trim().toLowerCase().replace(/\s+/g, " ");
}

function wordCount(text: string): number {
  const t = text.trim();
  if (!t) return 0;
  return t.split(/\s+/).filter(Boolean).length;
}

function themeMatched(normalized: string, signals: readonly string[]): boolean {
  return signals.some((s) => normalized.includes(s.trim().toLowerCase()));
}

function clampScore(n: number): 1 | 2 | 3 | 4 | 5 {
  const r = Math.round(n);
  if (r <= 1) return 1;
  if (r === 2) return 2;
  if (r === 3) return 3;
  if (r === 4) return 4;
  return 5;
}

function scoreFromRubric(wc: number, rubric: QuestionRubric, matchedCount: number): number {
  const n = rubric.themes.length;
  const ratio = n > 0 ? matchedCount / n : 0;
  if (wc === 0) return 1;

  const substance = Math.min(1, wc / Math.max(rubric.minWords, 15));
  const raw = 1 + 4 * ratio * (0.35 + 0.65 * substance);

  let penalized = raw;
  if (wc < 8) penalized = Math.min(penalized, 1.5);
  else if (wc < 15) penalized = Math.min(penalized, 2.25);
  else if (wc < rubric.minWords * 0.45) penalized = Math.min(penalized, 2.75);

  if (matchedCount === 0) penalized = Math.min(penalized, 2.5);

  return penalized;
}

function buildGuidanceFromRubric(answer: string, rubric: QuestionRubric): AnswerGuidance {
  const wc = wordCount(answer);
  const normalized = normalizeAnswer(answer);

  const strengths: string[] = [];
  const gaps: string[] = [];
  let matched = 0;

  for (const theme of rubric.themes) {
    if (themeMatched(normalized, theme.signals)) {
      matched += 1;
      strengths.push(theme.strengthLabel);
    } else {
      gaps.push(theme.missLabel);
    }
  }

  const scoreNum = scoreFromRubric(wc, rubric, matched);
  const score = clampScore(scoreNum);

  const satisfactory = wc >= rubric.minWords * 0.55 && matched >= Math.ceil(rubric.themes.length * 0.5) && score >= 3;

  let verdict: string;
  if (wc === 0) {
    verdict = "No answer was entered, so there is nothing to evaluate yet.";
  } else if (score >= 4) {
    verdict = "Strong response: you covered several signals the prompt is probing for with enough detail.";
  } else if (score === 3) {
    verdict = "Adequate response: add more concrete specifics and missing themes to reach a standout answer.";
  } else {
    verdict = "Thin response: expand with concrete examples, decisions, and trade-offs tied to the question.";
  }

  const suggestedAdditions = gaps.slice(0, 4);

  const moveTo45Hints = [...rubric.moveTo45Hints];
  if (matched < rubric.themes.length) {
    moveTo45Hints.push(`Address the missing angles: ${gaps.slice(0, 2).join(" ")}`);
  }

  return {
    score,
    satisfactory,
    verdict,
    strengths,
    gaps,
    suggestedAdditions,
    moveTo45Hints,
  };
}

export function evaluatePart1Answer(args: {
  part1Index: number;
  branch: BranchKey | null;
  answer: string;
}): AnswerGuidance {
  const rubric = getPart1Rubric(args.part1Index, args.branch);
  return buildGuidanceFromRubric(args.answer, rubric);
}

export function evaluatePart2Answer(args: { part2Index: number; answer: string }): AnswerGuidance {
  const rubric = getPart2Rubric(args.part2Index);
  return buildGuidanceFromRubric(args.answer, rubric);
}

function mean(nums: number[]): number {
  if (nums.length === 0) return 1;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

export function buildSessionSummary(turns: readonly SessionTurn[]): SessionSummary {
  if (turns.length === 0) {
    return {
      overallScore: 1,
      overallFeedback:
        "No responses were recorded. Run through the practice again and submit an answer at each step to receive scored feedback.",
    };
  }

  const scores = turns.map((t) => t.guidance.score);
  const overallScore = clampScore(mean(scores));

  const weak = turns.filter((t) => t.guidance.score <= 2);
  const mid = turns.filter((t) => t.guidance.score === 3);
  const strong = turns.filter((t) => t.guidance.score >= 4);

  const weakSteps = weak.map((t) => `Q${t.stepNumber}`).join(", ");
  const midSteps = mid.map((t) => `Q${t.stepNumber}`).join(", ");

  const repeatedGaps = new Map<string, number>();
  for (const t of turns) {
    for (const g of t.guidance.gaps) {
      repeatedGaps.set(g, (repeatedGaps.get(g) ?? 0) + 1);
    }
  }
  const topGaps = [...repeatedGaps.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([g]) => g);

  const hintPool: string[] = [];
  for (const t of turns) {
    hintPool.push(...t.guidance.moveTo45Hints);
  }
  const uniqueHints = [...new Set(hintPool)].slice(0, 5);

  let overallFeedback = `Overall interview performance: ${overallScore} out of 5 (local rubric; nothing was sent to a server). `;

  if (strong.length > 0) {
    overallFeedback += `You showed the strongest signal on ${strong.map((t) => `Q${t.stepNumber}`).join(", ")}. `;
  }
  if (weak.length > 0) {
    overallFeedback += `The largest opportunity is on ${weakSteps}: add concrete examples, named stakeholders, and explicit trade-offs. `;
  } else if (mid.length > 0) {
    overallFeedback += `Questions ${midSteps} were mid-pack—tighten stories with decisions, metrics, and what you personally owned. `;
  }

  if (overallScore < 4) {
    overallFeedback +=
      "To move into the 4–5 range across a real interview, aim for multi-sentence narratives with a clear situation, your action, and the outcome; name metrics or governance moves when the prompt invites them; and pre-bank 2–3 stories you can adapt without rambling. ";
  } else {
    overallFeedback +=
      "You are already in strong territory on this rubric. In a live interview, keep answers crisp: lead with the headline, then offer to go deeper. ";
  }

  if (topGaps.length > 0) {
    overallFeedback += `Themes to strengthen across answers: ${topGaps.join(" ")} `;
  }

  if (uniqueHints.length > 0) {
    overallFeedback += `Concrete upgrades to practice: ${uniqueHints.join(" ")}`;
  }

  return { overallScore, overallFeedback };
}

export function formatSessionForCopy(turns: readonly SessionTurn[], summary: SessionSummary): string {
  const blocks = turns.map((t) => {
    const g = t.guidance;
    return [
      `Question ${t.stepNumber} (hiring manager)`,
      t.questionText,
      "",
      "Your answer",
      t.answerText || "(empty)",
      "",
      `Score: ${g.score}/5 — ${g.satisfactory ? "Broadly satisfactory on this rubric" : "Below rubric bar for a standout answer"}`,
      `Verdict: ${g.verdict}`,
      g.strengths.length ? `Strengths:\n- ${g.strengths.join("\n- ")}` : "Strengths: (none flagged)",
      g.gaps.length ? `Gaps:\n- ${g.gaps.join("\n- ")}` : "Gaps: (none flagged)",
      g.suggestedAdditions.length
        ? `Consider adding:\n- ${g.suggestedAdditions.join("\n- ")}`
        : "",
      g.moveTo45Hints.length ? `Toward 4–5:\n- ${g.moveTo45Hints.join("\n- ")}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  });

  const footer = [
    "",
    "=== Overall ===",
    `Score: ${summary.overallScore}/5`,
    summary.overallFeedback,
  ].join("\n");

  return [...blocks, footer].join("\n\n---\n\n");
}
