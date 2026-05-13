import { useMemo, useState } from "react";
import { pivotCopy, practiceMeta } from "./interview/content";
import { getPart1Question, getPart2Question, resolveBranchFromQ1OptionId } from "./interview/engine";
import type { AnswerOption, BranchKey, Phase, TranscriptLine } from "./interview/types";

function roleLabel(role: TranscriptLine["role"]): string {
  return role === "manager" ? "Hiring manager" : "You (instructional designer)";
}

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

export default function App() {
  const [phase, setPhase] = useState<Phase>("intro");
  const [branch, setBranch] = useState<BranchKey | null>(null);
  const [part1Index, setPart1Index] = useState(0);
  const [part2Index, setPart2Index] = useState(0);
  const [transcript, setTranscript] = useState<TranscriptLine[]>([]);
  const [facilitatorMode, setFacilitatorMode] = useState(false);
  const [part2Notes, setPart2Notes] = useState("");

  const currentStepNumber = useMemo(() => {
    if (phase === "intro") return 0;
    if (phase === "part1") return part1Index + 1;
    if (phase === "pivot") return 5;
    if (phase === "part2") return 6 + part2Index;
    return 10;
  }, [phase, part1Index, part2Index]);

  const part1Question = useMemo(() => {
    if (phase !== "part1") return null;
    return getPart1Question({ branch, part1Index });
  }, [phase, branch, part1Index]);

  const part2Question = useMemo(() => {
    if (phase !== "part2") return null;
    return getPart2Question(part2Index);
  }, [phase, part2Index]);

  function appendLines(lines: TranscriptLine[]) {
    setTranscript((prev) => [...prev, ...lines]);
  }

  function startInterview() {
    const q = getPart1Question({ branch: null, part1Index: 0 });
    setBranch(null);
    setPart1Index(0);
    setPart2Index(0);
    setPart2Notes("");
    setPhase("part1");
    setTranscript([{ role: "manager", text: q.managerQuestion }]);
  }

  function choosePart1Answer(option: AnswerOption) {
    if (phase !== "part1") return;
    const lines: TranscriptLine[] = [{ role: "designer", text: option.intervieweeText }];

    if (part1Index === 4) {
      appendLines(lines);
      setPhase("pivot");
      return;
    }

    const nextBranch = part1Index === 0 ? resolveBranchFromQ1OptionId(option.id) : branch;
    if (part1Index === 0) setBranch(nextBranch);

    const nextIndex = part1Index + 1;
    const nextQ = getPart1Question({ branch: nextBranch, part1Index: nextIndex });
    lines.push({ role: "manager", text: nextQ.managerQuestion });

    appendLines(lines);
    setPart1Index(nextIndex);
  }

  function continueFromPivot() {
    const q = getPart2Question(0);
    appendLines([{ role: "manager", text: q.managerQuestion }]);
    setPart2Index(0);
    setPart2Notes("");
    setPhase("part2");
  }

  function continuePart2() {
    if (phase !== "part2") return;
    const note = part2Notes.trim();
    const lines: TranscriptLine[] = [];
    if (note) lines.push({ role: "designer", text: note });

    if (part2Index >= 4) {
      appendLines(lines);
      setPhase("done");
      return;
    }

    const nextIndex = part2Index + 1;
    const nextQ = getPart2Question(nextIndex);
    lines.push({ role: "manager", text: nextQ.managerQuestion });
    appendLines(lines);
    setPart2Index(nextIndex);
    setPart2Notes("");
  }

  async function copyTranscript() {
    const text = transcript.map((l) => `${roleLabel(l.role)}:\n${l.text}`).join("\n\n");
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Fallback for restricted clipboard contexts
      window.prompt("Copy transcript:", text);
    }
  }

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
                <strong>Questions 1–5:</strong> your first answer sets the interviewer’s follow-up path (metrics, stakeholders,
                design trade-offs, or scale/reuse). Each next question is written to respond to that path.
              </li>
              <li>
                <strong>Questions 6–10:</strong> a deliberate pivot to broader scenarios that should not depend on the earlier
                storyline—useful for probing role readiness in a large corporate L&D setting.
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
              <p className="muted small">Choose the response closest to what you would say. This selects the manager’s next follow-up.</p>
              <div className="options">
                {part1Question.options.map((opt) => (
                  <button key={opt.id} type="button" className="option" onClick={() => choosePart1Answer(opt)}>
                    {opt.intervieweeText}
                  </button>
                ))}
              </div>
            </div>
          </section>
        )}

        {phase === "pivot" && (
          <section className="card">
            <Progress currentStep={currentStepNumber} />
            <div className="pivotBanner" role="status">
              <h2>{pivotCopy.headline}</h2>
              <p>{pivotCopy.body}</p>
            </div>
            <button type="button" className="primary" onClick={continueFromPivot}>
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
              Your answer (optional notes for yourself)
            </label>
            <textarea
              id="part2notes"
              className="notes"
              rows={6}
              value={part2Notes}
              onChange={(e) => setPart2Notes(e.target.value)}
              placeholder="Type how you would answer out loud. Nothing here leaves your browser."
            />
            <div className="row">
              <button type="button" className="primary" onClick={continuePart2}>
                {part2Index >= 4 ? "Finish" : "Continue"}
              </button>
            </div>
          </section>
        )}

        {phase === "done" && (
          <section className="card">
            <h2>Practice session complete</h2>
            <p className="muted">You can copy the transcript below (including your Part 2 notes where you added them).</p>
            <div className="row">
              <button type="button" className="secondary" onClick={copyTranscript}>
                Copy transcript
              </button>
              <button type="button" className="secondary" onClick={startInterview}>
                Restart
              </button>
            </div>
            <pre className="transcript" aria-label="Interview transcript">
              {transcript.map((l, i) => (
                <div key={i} className="transcriptBlock">
                  <div className="roleTag inline">{roleLabel(l.role)}</div>
                  <div>{l.text}</div>
                </div>
              ))}
            </pre>
          </section>
        )}
      </main>

      {(phase === "part1" || phase === "pivot" || phase === "part2") && (
        <footer className="appFooter">
          <button
            type="button"
            className="linkish"
            onClick={() => {
              setPhase("intro");
              setBranch(null);
              setPart1Index(0);
              setPart2Index(0);
              setTranscript([]);
              setPart2Notes("");
            }}
          >
            Exit to intro
          </button>
        </footer>
      )}
    </div>
  );
}
