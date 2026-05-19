# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Commands

```bash
npm run dev        # start the dev server (Express + Next.js together on port 4000)
npm run build      # build the Next.js frontend: next build ./views
npm start          # production: NODE_ENV=production node server.js
npm run lint       # run ESLint
```

No test framework is configured. There is no `npm test`.

The dev server must be running for any frontend or API work — there is no standalone Next.js dev mode. `npm run dev` starts both in one process.

---

## Architecture

### One process, two frameworks

`server.js` is the single entry point. It boots Next.js, then creates an Express app that:
1. Serves `/api/*` routes via `routes/apiRoutes.js`
2. Falls through all other requests to Next.js via `handle(req, res)`

The Next.js frontend lives entirely in `/views`. Express and Next.js share port 4000.

### The AI pipeline

This is the most important part of the codebase. Two files control all AI behavior:

**`models/prompts/modes.js`** — defines `FOUNDATION_PROMPT` (immutable base rules) and `MODE_PROMPTS` (5 teaching personalities: hint, logic, humanize, debug, optimize). The foundation prompt cannot be overridden by users through chat. When AI behavior feels wrong, fix the prompts here first.

**`controllers/api/chatController.js`** — assembles the full system prompt from foundation + mode + problem context + user code, then calls Groq (`llama-3.3-70b-versatile`). Also owns: the backend `PROBLEMS` object, rate limiting (10 req/min per IP), and the off-topic guard which runs *before* the AI call to save tokens.

### The PROBLEMS object lives in two places — keep them in sync

- **Backend** (`controllers/api/chatController.js`): needs `title`, `description`, `example`, `constraints`, `topics` (used by off-topic guard)
- **Frontend** (`views/app/compiler/page.jsx`): needs `id`, `title`, `difficulty`, `difficultyColor`, `difficultyBg`, `description`, `examples[]`, `constraints[]`, `edgeCases[]`, `starterCode` (python/javascript/java/cpp)

The two objects have different shapes. The backend shape is flat strings; the frontend shape uses arrays. Both must be updated when adding a problem.

### Frontend structure

Next.js App Router in `views/app/`. All new frontend files use `.jsx` — TypeScript (`.tsx`) only in files that already use it (`layout.tsx`, `page.tsx`).

The compiler page (`views/app/compiler/page.jsx`) is the core product: LeetCode-style layout with a draggable left/right split (description+AI tabs vs. editor+output), all state local via `useState`. Monaco Editor for code, Axios for API calls.

The landing page (`views/app/page.tsx`) is composed from section components in `views/components/landing/`. Each section is its own file.

### env files

Root `.env` — backend secrets (Groq key, MySQL credentials).
`views/.env.local` does not exist yet but is where NextAuth vars would go if auth is added.
Never commit either file.

---

## Key decisions

- **Groq over OpenAI/Anthropic** — free tier sufficient for prototype
- **No code execution** — Judge0 requires Docker, deferred until validated
- **Auth via NextAuth** — Google OAuth + email/password credentials both live. Signup → `/onboarding`, login → `/compiler`. Google vars in `views/.env.local`; DB vars in root `.env`.
- **No monetization yet** — deferred until 500 active users
- **No global state** — all state is local `useState` in each page component; no Redux/Zustand
- **Prompt engineering is the moat** — never fix AI behavior by changing code when fixing the prompt will do

---

## Rules

- Read every file before editing it
- New frontend files: `.jsx` only — no TypeScript
- AI behavior wrong → fix `models/prompts/modes.js` first, not `chatController.js`
- Adding a problem → update both PROBLEMS objects (backend + frontend)
- Never provide a complete end-to-end working solution to DSA problems (this is a tutor — the AI must never solve for the user)

- Google Auth is in `views/app/api/auth/[...nextauth]/route.ts`; AuthProvider in `views/components/shared/`
- Adding a user table column → update both `migrations/schema.sql` and `controllers/api/authController.js`
- Before every session: read TutorAI-Vault/01-Mistakes.md
- After every error: write it to TutorAI-Vault/01-Mistakes.md with format:
  ## [Date] — [Error summary]
  **Cause:** what caused it
  **Fix:** what fixed it
  **Files affected:** which files
  **Prevention:** how to avoid next time
- Never make a change that conflicts with a documented mistake in 01-Mistakes.md

---

## Obsidian Vault

A parallel Obsidian vault lives at:
`TutorAI-Vault/` (same level as TutorAIStack/)

Structure:
- `TutorAI-Vault/00-Architecture.md` — system design decisions
- `TutorAI-Vault/01-Mistakes.md` — recurring errors and their fixes
- `TutorAI-Vault/02-Decisions.md` — why things are built a certain way
- `TutorAI-Vault/03-ActiveWork.md` — what is currently being built

Before making ANY change:
1. Read `TutorAI-Vault/01-Mistakes.md`
2. Check if the change you are about to make matches a known mistake pattern
3. If it does — follow the documented fix instead

After making ANY change:
1. If an error occurred during the session, append it to `TutorAI-Vault/01-Mistakes.md`
2. If a new architectural decision was made, append it to `TutorAI-Vault/02-Decisions.md`