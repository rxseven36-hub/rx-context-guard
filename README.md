# RX Context Guard

RX Context Guard is a local proof-of-concept that puts a builder-owned boundary in front of an AI agent's intended project change.

## Core journey

1. Define **DILAKUKEUN** (explicitly allowed work) and **ULAH DILAKUKEUN** (protected work).
2. Select a clearly labeled simulated AI intended action.
3. Review the proposed before/after change before execution.
4. The deterministic Guard checks protected rules first, then requires a match inside the allowed boundary.
5. Prohibited, outside-boundary, incomplete, or uncertain actions fail closed and remain unapplied.
6. After a block, the builder chooses **TOLAK**, **IZINKAN SEKALI**, or **IZINKAN SELAMA PROSES**.
7. Rejection writes local evidence with `decision: "REJECTED"` and `performed: false`.
8. Project identity and boundary rules persist in local JSON.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Verification

```bash
npm run verify:guard
npm run verify:permission
npm run verify:persistence
npm run typecheck
npm run lint
npm run build
```

## Architecture

- Next.js + TypeScript UI and local API routes.
- Deterministic Guard Engine in `lib/guard`.
- Simulated intended actions in `lib/simulator` are input only; they do not decide Guard outcomes.
- Local project context persistence in `data/project-context.json`.
- Runtime rejection evidence under `data/rejections/` is intentionally ignored by Git.
- No external AI API, cloud database, or authentication is required for this POC.

## Demo note

The current action source is deliberately a simulator, not a live coding-agent interception layer. Real-agent interception is deferred beyond this POC.