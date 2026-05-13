# Instructional Designer — practice interview (web)

Small **Vite + React + TypeScript** app that walks through a **10-question** practice interview between a hiring manager and a senior instructional designer. It is written for **corporate L&D** (global tech company, **India hub** context). This is an **unofficial preparation tool**: it is not affiliated with any employer and does not use employer trademarks.

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

To create a production build:

```bash
npm run build
npm run preview
```

## How the flow works

1. **Questions 1–5:** You pick answers closest to what you would say. Your **first** choice sets one of four follow-up paths (metrics, stakeholders, design trade-offs, or scale/reuse). Questions 2–5 are specific to that path.
2. **Pivot:** A short break before broader questions.
3. **Questions 6–10:** Open-ended prompts with an optional notes field (nothing is sent to a server). Turn on **Facilitator mode** to see brief coaching notes for these items.
4. At the end you can **copy the transcript** (including your Part 2 notes).

All state stays in your browser unless you copy it out yourself.

## Project layout

- `src/interview/content.ts` — interview copy and branching content
- `src/interview/engine.ts` — helpers to resolve the current question
- `src/interview/types.ts` — shared types
- `src/App.tsx` — UI and flow
