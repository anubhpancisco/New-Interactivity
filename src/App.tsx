import { useMemo, useState } from "react";
import { interview, pivotCopy, practiceMeta } from "./interview/content";
import { buildSessionSummary, evaluatePart1Answer, evaluatePart2Answer, formatSessionForCopy } from "./interview/evaluateAnswer";
import { getPart1Question, inferBranchFromFreeText } from "./interview/engine";
import { buildPersonalizedPart2 } from "./interview/personalize";
import type { AnswerGuidance, BranchKey, Part2Item, Phase, SessionSummary, SessionTurn, StepNumber } from "./interview/types";

function roleLabel(role: "manager" | "designer"): string {
  return role === "manager" ? "Hiring manager" : "You (instructional designer)";
}

type GuidancePending = {
  part: "part1" | "part2";
  stepNumber: StepNumber;
  questionText: string;
  answerText: string;
  guidance: AnswerGuidance;
};

function Progress({ currentStep }: { currentStep: number }) {
  const total = 10;
  const pct = Math.round((currentStep / total) * 100);
  return (
    <div className="progressWrap" aria-label={`Interview progress: question ${currentStep} of ${total}`}>
      <div className="progressMeta">
        <span>
          Question {currentStep} / {total}
        </span>
        <span className="muted">{pct}%</span>
      </div>
      <div className="progressBar" role="presentation">
        <div className="progressFill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function GuidanceReview({
  pending,
  continueLabel,
  onContinue,
}: {
  pending: GuidancePending;
  continueLabel: string;
  onContinue: () => void;
}) {
  const g = pending.guidance;
  return (
    <section className="card">
      <Progress currentStep={pending.stepNumber} />
      <h2 className="guidanceHeading">Feedback on your answer</h2>
      <p className="muted small">
        This guidance is generated locally from a fixed rubric (keywords and length). It is not a human interviewer and
        nothing is sent to a server.
      </p>
      <div className="scoreChip" aria-live="polite">
        <span className="scoreValue">{g.score}</span>
        <span className="scoreOut">/ 5</span>
        <span className={`scoreBadge ${g.satisfactory ? "scoreOk" : "scoreWarn"}`}>
          {g.satisfactory ? "Satisfactory on rubric" : "Room to strengthen"}
        </span>
      </div>
      <div className="guidancePanel" role="status">
        <p className="verdict">{g.verdict}</p>
        {g.strengths.length > 0 && (
          <div className="guidanceBlock">
            <div className="guidanceLabel">What worked</div>
            <ul className="guidanceList">
              {g.strengths.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        )}
        {g.gaps.length > 0 && (
          <div className="guidanceBlock">
            <div className="guidanceLabel">Gaps vs this prompt</div>
            <ul className="guidanceList">
              {g.gaps.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        )}
        {g.suggestedAdditions.length > 0 && (
          <div className="guidanceBlock">
            <div className="guidanceLabel">Consider adding</div>
            <ul className="guidanceList">
              {g.suggestedAdditions.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        )}
        {g.moveTo45Hints.length > 0 && (
          <div className="guidanceBlock">
            <div className="guidanceLabel">Toward a 4–5 answer</div>
            <ul className="guidanceList">
              {g.moveTo45Hints.map((s, i) => (
                <li key={i}>{s}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="row">
        <button type="button" className="primary" onClick={onContinue}>
          {continueLabel}
        </button>
      </div>
    </section>
  );
}

export default function App() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [branch, setBranch] = useState<BranchKey | null>(null);
  const [part1Index, setPart1Index] = useState(0);
  const [part1AnswerDraft, setPart1AnswerDraft] = useState("");
  const [part1Answers, setPart1Answers] = useState<string[]>([]);
  const [part2Index, setPart2Index] = useState(0);
  const [sessionTurns, setSessionTurns] = useState<SessionTurn[]>([]);
  const [sessionSummary, setSessionSummary] = useState<SessionSummary | null>(null);
  const [guidancePending, setGuidancePending] = useState<GuidancePending | null>(null);
  const [facilitatorMode, setFacilitatorMode] = useState(false);
  const [part2Notes, setPart2Notes] = useState("");

  const personalizedPart2 = useMemo((): Part2Item[] | null => {
    if (part1Answers.length !== 5) return null;
    return buildPersonalizedPart2(interview.part2, part1Answers);
  }, [part1Answers]);

  const currentStepNumber = useMemo(() => {
    if (phase === "intro") return 0;
    if (phase === "part1" || phase === "part1_guidance") return part1Index + 1;
    if (phase === "pivot") return 5;
    if (phase === "part2" || phase === "part2_guidance") return 6 + part2Index;
    return 10;
  }, [phase, part1Index, part2Index]);

  const part1Question = useMemo(() => {
    if (phase !== "part1") return null;
    return getPart1Question({ branch, part1Index });
  }, [phase, branch, part1Index]);

  const part2Question = useMemo(() => {
    if (phase !== "part2" || !personalizedPart2) return null;
    return personalizedPart2[part2Index] ?? null;
  }, [phase, personalizedPart2, part2Index]);

  function startInterview() {
    setBranch(null);
    setPart1Index(0);
    setPart1AnswerDraft("");
    setPart1Answers([]);
    setPart2Index(0);
    setPart2Notes("");
    setSessionTurns([]);
    setSessionSummary(null);
    setGuidancePending(null);
    setPhase("part1");
  }

  function submitPart1Answer() {
    if (phase !== "part1" || !part1Question) return;
    const text = part1AnswerDraft.trim();
    if (!text) return;

    const guidance = evaluatePart1Answer({
      part1Index,
      branch: part1Index === 0 ? null : branch,
      answer: text,
    });

    setGuidancePending({
      part: "part1",
      stepNumber: part1Question.stepNumber,
      questionText: part1Question.managerQuestion,
      answerText: text,
      guidance,
    });
    setPart1AnswerDraft("");
    setPhase("part1_guidance");
  }

  function continueFromPart1Guidance() {
    if (!guidancePending || guidancePending.part !== "part1") return;

    const turn: SessionTurn = {
      stepNumber: guidancePending.stepNumber,
      questionText: guidancePending.questionText,
      answerText: guidancePending.answerText,
      guidance: guidancePending.guidance,
    };
    const nextTurns = [...sessionTurns, turn];
    setSessionTurns(nextTurns);
    setPart1Answers((prev) => [...prev, guidancePending.answerText]);
    if (part1Index === 0) {
      setBranch(inferBranchFromFreeText(guidancePending.answerText));
    }

    setGuidancePending(null);

    if (part1Index >= 4) {
      setPhase("pivot");
      return;
    }
    setPart1Index(part1Index + 1);
    setPhase("part1");
  }

  function continueFromPivot() {
    if (part1Answers.length !== 5) return;
    setPart2Index(0);
    setPart2Notes("");
    setPhase("part2");
  }

  function submitPart2Answer() {
    if (phase !== "part2" || !part2Question) return;
    if (part1Answers.length !== 5) return;

    const answerText = part2Notes.trim();
    const guidance = evaluatePart2Answer({ part2Index, answer: answerText });

    setGuidancePending({
      part: "part2",
      stepNumber: part2Question.stepNumber,
      questionText: part2Question.managerQuestion,
      answerText,
      guidance,
    });
    setPart2Notes("");
    setPhase("part2_guidance");
  }

  function continueFromPart2Guidance() {
    if (!guidancePending || guidancePending.part !== "part2") return;

    const turn: SessionTurn = {
      stepNumber: guidancePending.stepNumber,
      questionText: guidancePending.questionText,
      answerText: guidancePending.answerText,
      guidance: guidancePending.guidance,
    };
    const nextTurns = [...sessionTurns, turn];
    setSessionTurns(nextTurns);
    setGuidancePending(null);

    if (part2Index >= 4) {
      setSessionSummary(buildSessionSummary(nextTurns));
      setPhase("done");
      return;
    }
    setPart2Index(part2Index + 1);
    setPhase("part2");
  }

  async function copyTranscript() {
    if (!sessionSummary) return;
    const text = formatSessionForCopy(sessionTurns, sessionSummary);
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      window.prompt("Copy transcript:", text);
    }
  }

  function exitToIntro() {
    setPhase("intro");
    setBranch(null);
    setPart1Index(0);
    setPart1AnswerDraft("");
    setPart1Answers([]);
    setPart2Index(0);
    setSessionTurns([]);
    setSessionSummary(null);
    setGuidancePending(null);
    setPart2Notes("");
  }

  const part1SubmitDisabled = !part1AnswerDraft.trim();

  const part1GuidanceContinueLabel = part1Index >= 4 ? "Continue to Part 1 wrap-up" : "Continue to next question";
  const part2GuidanceContinueLabel = part2Index >= 4 ? "View full results" : "Continue to next question";

  return (
    <div className="appShell">
      <header className="appHeader">
        <div>
          <h1 className="title">{practiceMeta.title}</h1>
          <p className="subtitle">{practiceMeta.subtitle}</p>
        </div>
        <label className="toggle">
          <input
            type="checkbox"
            checked={facilitatorMode}
            onChange={(e) => setFacilitatorMode(e.target.checked)}
          />
          Facilitator mode
        </label>
      </header>

      <main className="appMain">
        {phase === "intro" && (
          <section className="card">
            <h2>How this practice flow works</h2>
            <ul className="list">
              <li>
                <strong>Questions 1–5:</strong> type your own answers in the text box for each question. Your first response is
                analyzed locally (keywords only) to pick a follow-up path: metrics, stakeholders, design trade-offs, or
                scale/reuse. Nothing you type is sent to a server.
              </li>
              <li>
                After each answer you will see <strong>local rubric feedback</strong> (score /5 and coaching bullets) before the
                next question.
              </li>
              <li>
                <strong>Questions 6–10:</strong> each question opens with a short excerpt from the answer you gave at the same
                step earlier (question 6 references answer 1, and so on), then asks a broader scenario. Answer in your own words.
              </li>
              <li>
                At the end you get a <strong>transcript with guidance per question</strong> plus an <strong>overall score out of
                5</strong> and narrative suggestions for reaching a stronger band.
              </li>
            </ul>
            <p className="fineprint">
              This is an unofficial practice tool. It is not affiliated with any employer, and it does not predict real interview
              questions.
            </p>
            <button type="button" className="primary" onClick={startInterview}>
              Start practice interview
            </button>
          </section>
        )}

        {phase === "part1" && part1Question && (
          <section className="card">
            <Progress currentStep={currentStepNumber} />
            <div className="roleBlock">
              <div className="roleTag">{roleLabel("manager")}</div>
              <p className="question">{part1Question.managerQuestion}</p>
            </div>
            <div className="roleBlock">
              <div className="roleTag">{roleLabel("designer")}</div>
              <p className="muted small">
                Type how you would answer out loud. Submit to see local feedback, then continue. Your first answer shapes the
                interviewer’s follow-up path.
              </p>
              {facilitatorMode && part1Question.facilitatorExamples && part1Question.facilitatorExamples.length > 0 && (
                <details className="facilitator">
                  <summary>Example framings (optional reference)</summary>
                  <ul className="exampleList">
                    {part1Question.facilitatorExamples.map((ex, i) => (
                      <li key={i}>{ex}</li>
                    ))}
                  </ul>
                </details>
              )}
              <label className="notesLabel" htmlFor="part1answer">
                Your answer
              </label>
              <textarea
                id="part1answer"
                className="notes part1Answer"
                rows={8}
                value={part1AnswerDraft}
                onChange={(e) => setPart1AnswerDraft(e.target.value)}
                placeholder="Nothing here leaves your browser."
              />
              <div className="row">
                <button type="button" className="primary" disabled={part1SubmitDisabled} onClick={submitPart1Answer}>
                  Submit for feedback
                </button>
              </div>
            </div>
          </section>
        )}

        {phase === "part1_guidance" && guidancePending && (
          <GuidanceReview pending={guidancePending} continueLabel={part1GuidanceContinueLabel} onContinue={continueFromPart1Guidance} />
        )}

        {phase === "pivot" && (
          <section className="card">
            <Progress currentStep={currentStepNumber} />
            <div className="pivotBanner" role="status">
              <h2>{pivotCopy.headline}</h2>
              <p>{pivotCopy.body}</p>
            </div>
            <button type="button" className="primary" onClick={continueFromPivot} disabled={part1Answers.length !== 5}>
              Continue to question 6
            </button>
          </section>
        )}

        {phase === "part2" && part2Question && (
          <section className="card">
            <Progress currentStep={currentStepNumber} />
            <div className="roleBlock">
              <div className="roleTag">{roleLabel("manager")}</div>
              <p className="question">{part2Question.managerQuestion}</p>
            </div>
            {facilitatorMode && part2Question.facilitatorNotes && (
              <details className="facilitator">
                <summary>Facilitator notes (signals of a strong answer)</summary>
                <p>{part2Question.facilitatorNotes}</p>
              </details>
            )}
            <label className="notesLabel" htmlFor="part2notes">
              Your answer
            </label>
            <textarea
              id="part2notes"
              className="notes"
              rows={6}
              value={part2Notes}
              onChange={(e) => setPart2Notes(e.target.value)}
              placeholder="Type how you would answer out loud. You may submit empty once to see the rubric response—nothing leaves your browser."
            />
            <div className="row">
              <button type="button" className="primary" onClick={submitPart2Answer}>
                Submit for feedback
              </button>
            </div>
          </section>
        )}

        {phase === "part2_guidance" && guidancePending && (
          <GuidanceReview pending={guidancePending} continueLabel={part2GuidanceContinueLabel} onContinue={continueFromPart2Guidance} />
        )}

        {phase === "done" && sessionSummary && (
          <section className="card">
            <h2>Practice session complete</h2>
            <div className="overallSummary" aria-label="Overall interview performance">
              <div className="overallScoreRow">
                <span className="overallLabel">Overall performance (rubric)</span>
                <span className="overallScoreNum">
                  {sessionSummary.overallScore}
                  <span className="overallScoreOut">/5</span>
                </span>
              </div>
              <p className="overallFeedback">{sessionSummary.overallFeedback}</p>
            </div>
            <p className="muted">Copy the full report below, or restart to run again.</p>
            <div className="row">
              <button type="button" className="secondary" onClick={copyTranscript}>
                Copy full report
              </button>
              <button type="button" className="secondary" onClick={startInterview}>
                Restart
              </button>
            </div>
            <div className="transcript sessionReport" aria-label="Interview transcript with per-question guidance">
              {sessionTurns.map((t) => (
                <article key={t.stepNumber} className="sessionTurn">
                  <div className="sessionTurnHead">
                    <span className="turnStep">Question {t.stepNumber}</span>
                    <span className={`turnScore turnScore${t.guidance.score}`}>{t.guidance.score}/5</span>
                  </div>
                  <div className="roleTag inline">{roleLabel("manager")}</div>
                  <p className="sessionQuestion">{t.questionText}</p>
                  <div className="roleTag inline">{roleLabel("designer")}</div>
                  <p className="sessionAnswer">{t.answerText || "(No text entered.)"}</p>
                  <div className="guidanceInline">
                    <div className="guidanceLabel">Guidance</div>
                    <p className="verdict smallVerdict">{t.guidance.verdict}</p>
                    {t.guidance.strengths.length > 0 && (
                      <ul className="guidanceList compact">
                        {t.guidance.strengths.map((s, i) => (
                          <li key={`s-${i}`}>
                            <strong>Worked:</strong> {s}
                          </li>
                        ))}
                      </ul>
                    )}
                    {t.guidance.gaps.length > 0 && (
                      <ul className="guidanceList compact">
                        {t.guidance.gaps.map((s, i) => (
                          <li key={`g-${i}`}>
                            <strong>Gap:</strong> {s}
                          </li>
                        ))}
                      </ul>
                    )}
                    <ul className="guidanceList compact">
                      {t.guidance.moveTo45Hints.map((s, i) => (
                        <li key={`h-${i}`}>
                          <strong>Toward 4–5:</strong> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>

      {(phase === "part1" ||
        phase === "part1_guidance" ||
        phase === "pivot" ||
        phase === "part2" ||
        phase === "part2_guidance") && (
        <footer className="appFooter">
          <button type="button" className="linkish" onClick={exitToIntro}>
            Exit to intro
          </button>
        </footer>
      )}
    </div>
  );
}
