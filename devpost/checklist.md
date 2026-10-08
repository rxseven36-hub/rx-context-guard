---
doc: checklist
status: approved
---

# RX Context Guard â€” Build Checklist

Build mode: fast

## Slices

- [x] **1. Project boundary can be created, seen, and edited**
  Becomes usable: RX Context Guard runs locally and shows the project name, AI agent/model name, DILAKUKEUN rules, and ULAH DILAKUKEUN rules in the agreed serious dark-blue interface.
  Why now: This delivers the first usable end-to-end surface while including project bootstrap inside the slice instead of treating setup as separate work.
  PRD ref: `prd.md > The Core Journey`, `prd.md > Boundary Rules`
  Spec ref: `spec.md > Project Context Panel`, `spec.md > Boundary Rules Panel`, `spec.md > Look and Feel`, `spec.md > File Structure`
  Build: Bootstrap Next.js + TypeScript in the existing repository, create the main local interface, add editable project/agent context and boundary rules, and keep the first version in runtime state.
  Verify (mechanical): Run lint/type/build checks available from the generated project, start the dev server, and verify the main page responds without an application error.
  Learner check: Open RX Context Guard and confirm the project identity, DILAKUKEUN, and ULAH DILAKUKEUN areas look and behave like the protective workspace you intended.
  Commit: `Build initial RX Context Guard boundary workspace`

- [x] **2. A prohibited proposed change is stopped before execution**
  Becomes usable: A clearly labeled simulated AI action can propose a code/syntax change; RX Context Guard evaluates it with real deterministic logic and stops a prohibited action before simulated working state changes.
  Why now: This is the Unique Kernel. Proving the pre-execution block early is more important than adding surrounding features first.
  PRD ref: `prd.md > The Core Journey`, `prd.md > Guard Decision`
  Spec ref: `spec.md > AI Action Simulator`, `spec.md > Context Guard Engine`, `spec.md > Execution Pause Gate`
  Build: Add typed intended-action and guard-decision models, the AI Action Simulator, proposed-change visualization, deterministic boundary evaluation, and the execution pause gate. Visually distinguish proposed syntax from unchanged syntax. Invalid or uncertain evaluation must fail closed.
  Verify (mechanical): Run automated Guard tests proving an allowed action can proceed, a prohibited action returns BLOCK, blocked state is created before execution, and an invalid/uncertain decision cannot silently proceed; then run the project checks.
  Learner check: Trigger the prohibited demo action and confirm the highlighted proposed change stops on screen before it is applied.
  Commit: `Add pre-execution context guard kernel`

- [x] **3. The builder controls what happens after a block**
  Becomes usable: A blocked action remains paused until the builder chooses TOLAK, IZINKAN SEKALI, or IZINKAN SELAMA PROSES, with each permission scope enforced.
  Why now: Blocking alone is incomplete; this turns the Guard into the builder-controlled PAGER behavior defined in the product.
  PRD ref: `prd.md > Permission Decision`, `prd.md > The Core Journey`
  Spec ref: `spec.md > Permission Gate`, `spec.md > Execution Pause Gate`, `spec.md > Data Model`
  Build: Add the permission decision UI and real permission logic. TOLAK keeps the change unapplied; IZINKAN SEKALI authorizes only the pending action; IZINKAN SELAMA PROSES authorizes only the same kind of action in the same process and must not cover unrelated actions.
  Verify (mechanical): Run permission tests proving rejection remains blocked, one-time permission is consumed, same-process permission matches only its intended action kind/process, and unrelated actions require a new decision; run project checks.
  Learner check: At the early hands-on checkpoint, try all three decisions and confirm that work waits for you and never assumes permission.
  Commit: `Add builder permission gate`

- [x] **4. Boundaries survive restart and rejection leaves evidence**
  Becomes usable: Project identity and boundary rules survive closing/restarting the app, and TOLAK produces a written report confirming the rejected action was not performed.
  Why now: With the kernel and permission semantics proven, persistence and written evidence can now attach to stable behavior rather than speculative plumbing.
  PRD ref: `prd.md > Boundary Rules`, `prd.md > Rejection Report`
  Spec ref: `spec.md > Local Persistence Layer`, `spec.md > Rejection Report`, `spec.md > Data Model`
  Build: Add local JSON persistence for project/agent context and boundary rules, load it on startup, add rejection-report creation/display, and record performed=false for rejected actions. Surface storage failures instead of pretending a save succeeded.
  Verify (mechanical): Save project context and rules, restart the application and verify they reload; reject a prohibited action and verify the report records performed=false; run project checks.
  Learner check: Change a boundary rule, restart RX Context Guard, confirm it remains, then reject an action and read the written evidence shown by the app.
  Commit: `Persist boundaries and record rejection evidence`

- [x] **5. The complete guard journey is demo-ready**
  Becomes usable: The full POC can be demonstrated coherently from project context through proposed code change, Guard decision, pause, permission, and final result/report.
  Why now: All core behaviors already work independently; this slice integrates and polishes them without introducing a new product feature.
  PRD ref: `prd.md > The Core Journey`, `prd.md > What We're Building`
  Spec ref: `spec.md > The Core Journey Through the System`, `spec.md > Look and Feel`, `spec.md > Important Failure Modes`
  Build: Integrate the complete demo journey, tighten state/status messaging and the serious dark-blue presentation, make simulated behavior unmistakably labeled, handle the planned failure states clearly, and add/update README instructions for running the local POC.
  Verify (mechanical): Run the full automated test set plus lint/type/build checks, start the app, and exercise the complete boundary -> proposed action -> block -> permission -> result/report path without errors.
  Learner check: Perform the final demo journey as if recording Devpost and note anything broken, confusing, visually weak, or different from what you intended.
  Commit: `Complete RX Context Guard demo journey`

## Hands-on Checkpoints

- [x] Early usable behavior explored â€” after Slice 3, builder tests the real block and all three permission decisions
- [x] Final kick-the-tires exploration and feedback completed â€” after Slice 5

## Final Review

- [x] Final review complete â€” feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [x] Learning activity complete â€” focused walkthrough of one proposed action from simulator through Guard, pause gate, and permission result
- [x] Optional edit and transfer reflection addressed â€” offered/declined/already covered/not applicable as appropriate
- [x] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: Focused evidence-based walkthrough of the simulator -> Guard Engine -> execution/pause -> builder permission path, grounded in finished code and passing Guard/permission verification.
Route and stops: `lib/simulator/actions.ts` (`simulatedActions`) -> `lib/guard/engine.ts` (`evaluateAction`) -> `lib/guard/execution.ts` / `lib/guard/permissions.ts` with UI wiring in `components/BoundaryWorkspace.tsx`.
Edit outcome: No optional code edit retained; the finished kernel remained frozen after submission-facing UI polish.
Reflection: Transfer question answered; final authority remains with the builder/operator when the concept is connected to a real AI agent.
Activity mode: Evidence-based recap of work already completed during build, followed by a finished-code reference map.

## Revisions

### Final learner confirmation

- Builder confirmed Allow Once, Allow for Process, and Reject were tested.
- Builder confirmed the proof of concept behaves as intended.
- Builder confirmed readiness for submission without additional changes.
- Learning walkthrough identified the Guard Engine, UI decision flow, and rejection evidence.
- No optional code edit was required.
- This is a simulated proof of concept, not a live AI-agent integration.
