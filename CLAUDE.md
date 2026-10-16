# CLAUDE.md

Guidance for AI coding assistants working in this repository.

## What this is

TutorAI is a LeetCode-style DSA practice platform with an AI tutor. The production app is the Next.js project in `views/`, deployed to Vercel. All production API logic lives in `views/app/api/`.

## Commands (run inside `views/`)

```bash
npm install
npm run dev          # http://localhost:3000
npm run build
npx tsc --noEmit     # type-check
npx eslint .         # lint (`next lint` was removed in Next 16)
```

There is no automated test suite yet. Tests (Vitest) are planned.

## Legacy code

`server.js`, `routes/`, `controllers/`, `models/` and `config/` in the repo root are a legacy local Express server. They are not used in production and partly duplicate the API in `views/app/api/`. Do not add new features there. Prefer `views/` for all work.

## Architecture

- **AI tutor:** `views/lib/prompts/modes.ts` holds the foundation prompt and the five mode prompts (hint, logic, humanize, debug, optimize). `views/app/api/chat/route.ts` assembles the system prompt (foundation + mode + problem context + user code) and calls Groq. Fix AI behaviour in the prompts first.
- **Code execution:** `views/app/api/execute/route.ts` wraps user code in a per-problem test harness and runs it on Judge0 CE. Test cases are keyed by problem id.
- **Credits:** `views/lib/credits.ts` and `views/lib/pricing.ts`. AI interactions spend credits; credits come from a daily allowance, packs, or subscriptions.
- **Payments:** `views/app/api/payments/` (`create-order`, `verify`, `webhook`) with Razorpay. Signatures are verified server-side.
- **Auth:** NextAuth v4 in `views/app/api/auth/[...nextauth]/route.ts` (Google OAuth + credentials).
- **Database:** Supabase (PostgreSQL) through `views/lib/db.ts`. SQL lives in `migrations/` and `views/lib/setupCredits.sql`.

## Adding a problem

Problem data exists in three places and they must stay in sync:
1. `views/lib/problems.js` (id, title, difficulty, pattern)
2. `views/app/api/chat/route.ts` (`PROBLEMS`: description, example, constraints, topic keywords)
3. `views/app/api/execute/route.ts` (test cases and function names per language)

## Conventions

- Never commit `.env*` files except `.env.example`.
- Payment and credit logic must be idempotent and must not trust client-supplied item ids or amounts.
- Keep Supabase service-key usage server-side only.
