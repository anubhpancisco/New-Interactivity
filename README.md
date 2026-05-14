# Instructional Designer — practice interview (web)

Small **Vite + React + TypeScript** app that walks through a **10-question** practice interview between a hiring manager and a senior instructional designer. It is written for **corporate L&D** (global tech company, **India hub** context). This is an **unofficial preparation tool**: it is not affiliated with any employer and does not use employer trademarks.

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Host on GitHub (GitHub Pages)

This repo includes a workflow that **builds and deploys** the site to **GitHub Pages** when you push to `main`.

1. Push this project to a GitHub repository (any name).
2. In GitHub: **Settings → Pages → Build and deployment**, set **Source** to **GitHub Actions** (not “Deploy from a branch”).
3. Push to `main` (or run the **Deploy to GitHub Pages** workflow manually from the **Actions** tab).
4. After the workflow succeeds, open:

   `https://<your-username>.github.io/<repository-name>/`

If your default branch is not `main`, edit [`.github/workflows/deploy-github-pages.yml`](.github/workflows/deploy-github-pages.yml) and change the `branches` filter.

**Note:** Pages URLs use your **repository name** in the path. The build sets `VITE_BASE_PATH` automatically so assets load correctly.

### GitHub Codespaces (edit and preview in the browser)

Open the repo in a **Codespace**, then in the terminal: `npm install` → `npm run dev`. Use the **Ports** tab to open port **5173** in the browser. Nothing is deployed; it is a cloud dev session.

To create a production build:

```bash
npm run build
npm run preview
```

## How the flow works

1. **Questions 1–5:** You type each answer in a text box and submit. Your **first** answer is analyzed **only in the browser** (simple keyword scoring) to pick one of four follow-up paths: metrics, stakeholders, design trade-offs, or scale/reuse. Questions 2–5 use the curated manager prompts for that path. With **Facilitator mode** on, you can open optional example framings for each Part 1 question (the old sample answer text, read-only).
2. **Pivot:** A short screen before Part 2; copy explains that questions 6–10 will reference short excerpts from what you wrote in Part 1.
3. **Questions 6–10:** Each manager prompt starts with a bounded excerpt from the Part 1 answer at the same step (question 6 references your answer to question 1, and so on), then the broader scenario. You can type optional notes for yourself; nothing is sent to a server. **Facilitator mode** adds brief coaching notes for these items.
4. At the end you can **copy the transcript** (including your Part 2 notes where you added them).

All state stays in your browser unless you copy it out yourself.

## Project layout

- `src/interview/content.ts` — interview copy and branching content
- `src/interview/engine.ts` — branch inference from Q1 text and question resolution
- `src/interview/personalize.ts` — Part 2 prompts with excerpts from Part 1 answers
- `src/interview/types.ts` — shared types
- `src/App.tsx` — UI and flow
