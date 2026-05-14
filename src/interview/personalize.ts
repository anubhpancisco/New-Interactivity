import type { Part2Item } from "./types";

const EXCERPT_MAX = 180;
const NEUTRAL_LEAD = "In an earlier response you noted your program context.";

/** Collapses whitespace and caps length for safe embedding in manager prompts (plain text only). */
export function excerptForPrompt(raw: string, maxLen = EXCERPT_MAX): string {
  const collapsed = raw.trim().replace(/\s+/g, " ");
  if (!collapsed) return "";
  if (collapsed.length <= maxLen) return collapsed;
  return `${collapsed.slice(0, maxLen - 1)}…`;
}

// Q6 references part1Answers[0], Q7 → [1], …, Q10 → [4] (same index as Part 2 array position).
export function buildPersonalizedPart2(
  base: readonly Part2Item[],
  part1Answers: readonly string[],
): Part2Item[] {
  return base.map((item, i) => {
    const source = part1Answers[i] ?? "";
    const excerpt = excerptForPrompt(source);
    const prefix = excerpt ? `Earlier you wrote: "${excerpt}"\n\n` : `${NEUTRAL_LEAD}\n\n`;
    return {
      ...item,
      managerQuestion: `${prefix}${item.managerQuestion}`,
    };
  });
}
