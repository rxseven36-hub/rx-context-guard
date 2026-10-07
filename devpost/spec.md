---
doc: spec
status: approved
---

# RX Context Guard â€” Technical Spec

## How This Works, In Plain Language

RX Context Guard is a local proof-of-concept application that places a real protective decision layer between a simulated AI agent action and a project change.

The AI-agent activity is simulated for this POC, but the guard itself is not simulated.

The builder defines:
- the AI agent/model name;
- the project name;
- **DILAKUKEUN** rules;
- **ULAH DILAKUKEUN** rules.

The simulator presents an intended AI coding action. When it proposes a code or syntax change, the proposed change is shown before it is applied, and the part about to change is visually distinguished.

That intended action is sent to the Context Guard Engine.

If the action is inside the agreed boundary, the simulated work may continue.

If the action violates the boundary, work stops before the proposed project change is applied. The builder must explicitly choose:
- **TOLAK**
- **IZINKAN SEKALI**
- **IZINKAN SELAMA PROSES**

Nothing continues while a blocked action is waiting for permission.

If the builder rejects the action, the proposed change is not applied and the system produces a written report confirming that the rejected action was not performed.

If the builder allows it once, only that blocked action may continue.

If the builder allows it during the process, the same kind of action may continue while it belongs to that same process. A different out-of-bound action must stop and request permission again.

The project boundary is stored locally so closing and reopening RX Context Guard does not erase the project name or its **DILAKUKEUN / ULAH DILAKUKEUN** rules.

This shape is intentionally small: it proves the protective guard behavior without requiring a real AI-agent integration, cloud deployment, external database, or API key.

PRD refs:
- `prd.md > The Core Journey`
- `prd.md > Boundary Rules`
- `prd.md > Guard Decision`
- `prd.md > Permission Decision`
- `prd.md > Rejection Report`

## The Core Journey Through the System

PRD ref: `prd.md > The Core Journey`.

1. The builder opens RX Context Guard in a local browser.
2. The application loads the saved local project context.
3. The builder sees the AI agent/model name and project name.
4. The builder creates or reviews the project's **DILAKUKEUN** and **ULAH DILAKUKEUN** rules.
5. Changes to the project boundary are saved to local JSON persistence.
6. The demo simulator produces a clearly labeled simulated AI intended action.
7. The proposed code/syntax change is displayed before execution, with the proposed changed portion visually distinguished.
8. The intended action is passed to the Context Guard Engine.
9. The Guard evaluates the action against the active boundary.
10. If it is inside the boundary, the Guard returns **ALLOW** and the simulated process continues.
11. If it violates the boundary, the Guard returns **BLOCK**.
12. A blocked action enters a paused state before the proposed change is applied.
13. The interface shows the blocked action and waits for the builder.
14. The builder chooses **TOLAK**, **IZINKAN SEKALI**, or **IZINKAN SELAMA PROSES**.
15. **TOLAK** keeps the proposed change unapplied and creates a written rejection report.
16. **IZINKAN SEKALI** permits only the current blocked action and then consumes that permission.
17. **IZINKAN SELAMA PROSES** records a process-scoped permission for the same kind of action in the current simulated process.
18. If a later action is materially different from the permitted action, the previous permission does not cover it and the Guard blocks again.
19. The builder can inspect the resulting state and written report to verify that the Guard respected the decision.

## Stack

### Next.js

Next.js provides the local web application and application-side endpoints needed by the POC.

Chosen because the UI and local application logic can live in one small project and run locally for the required demo.

Accepted tradeoff: this POC is not being designed as a production multi-user service.

Documentation: https://nextjs.org/docs

Exact installed version will be recorded and verified during the initial build bootstrap rather than invented in this specification.

### React

React provides the interactive dashboard, simulator, blocked-action state, permission controls, and report display through the Next.js application.

Documentation: https://react.dev/

The exact installed version follows the compatible version installed by the chosen Next.js bootstrap and will be verified during build.

### TypeScript

TypeScript defines the project boundary, intended actions, guard decisions, permissions, and reports with explicit data shapes.

Chosen to make the Guard Engine contract easier to reason about and verify.

Documentation: https://www.typescriptlang.org/docs/

Exact installed version will be verified during build.

### Local JSON Persistence

A JSON file inside the local application's data area stores the persistent project context.

It stores the project identity and boundary rules needed when the builder closes and reopens the application.

No external database is required for this POC.

This is intentionally a local single-user persistence mechanism, not a production database design.

## Where It Runs and How Someone Tries It

RX Context Guard runs locally on the builder's Windows laptop.

Runtime surfaces:
- a local Next.js process;
- a browser displaying the RX Context Guard interface;
- local JSON persistence inside the project workspace.

No cloud deployment is required for the POC.

No external AI API key is required because AI-agent activity is explicitly simulated.

Expected development start flow after the build exists:

```text
npm install
npm run dev
```

Then open the local URL reported by Next.js, normally:

```text
http://localhost:3000
```

The exact URL/port reported by the running application is authoritative if the default port is unavailable.

For the Devpost demo recording, the builder starts the local application, opens the browser interface, and demonstrates:

```text
boundary -> proposed AI action -> guard check -> block -> permission decision -> result/report
```

Submission still requires a short demo video and a public GitHub repository. Deployment remains optional.

## Look and Feel

Implements `prd.md > Look and Feel`.

The interface must have a serious, firm, professional character.

The established primary visual direction is **slightly dark blue**.

The interface should feel like a protective monitoring surface rather than a playful or generic AI application.

The design should make these moments visually easy to distinguish:
- normal project context;
- a proposed code/syntax change;
- an allowed action;
- a paused or blocked action;
- a permission decision;
- a rejection report.

The exact status colors and typography were not selected by the learner. Implementation may choose restrained supporting styling consistent with the established serious, slightly dark-blue direction, without changing that product identity.

## Components

### Project Context Panel

Displays and edits the active AI agent/model name and project name.

Connects to local persistence so the active project context survives application restart.

PRD ref: `prd.md > Project and Agent Context`.

### Boundary Rules Panel

Displays and edits:
- **DILAKUKEUN**
- **ULAH DILAKUKEUN**

Changes are persisted locally.

The builder is the source of these rules; the application must not silently invent project boundaries.

PRD ref: `prd.md > Boundary Rules`.

### AI Action Simulator

Produces clearly labeled simulated AI intended actions for the proof of concept.

It presents proposed code/syntax activity in a way that allows the builder to see the intended change before it is applied.

The portion proposed for modification is visually distinguished.

The simulator provides input to the real Context Guard Engine; it does not decide whether an action is allowed.

PRD refs:
- `prd.md > The Core Journey`
- `prd.md > Guard Decision`.

### Context Guard Engine

This is the core POC kernel.

It receives:
- the current boundary;
- the intended action;
- relevant current-process permission.

It produces a guard decision before the simulated project change is applied.

Possible decisions include:
- **ALLOW**
- **BLOCK**
- **ALLOW_BY_ONE_TIME_PERMISSION**
- **ALLOW_BY_PROCESS_PERMISSION**

The Guard Engine must be implemented as real deterministic application logic for the POC and must be independently testable.

PRD ref: `prd.md > Guard Decision`.

### Execution Pause Gate

Prevents a blocked simulated action from being applied while permission is unresolved.

A blocked action remains pending until the builder explicitly makes a decision.

The proposed change must not be committed to the simulated working state before this gate resolves.

PRD refs:
- `prd.md > Guard Decision`
- `prd.md > Permission Decision`.

### Permission Gate

Receives the builder's explicit decision for a blocked action.

Supported decisions:
- **TOLAK**
- **IZINKAN SEKALI**
- **IZINKAN SELAMA PROSES**

One-time permission applies only to the current action.

Process permission applies only to the same kind of action while it remains within the same current process.

A materially different prohibited action must return to the blocked state for a new decision.

PRD ref: `prd.md > Permission Decision`.

### Rejection Report

Creates and displays a written record when the builder chooses **TOLAK**.

The report records:
- the rejected intended action;
- that permission was denied;
- confirmation that the rejected action was not performed.

PRD ref: `prd.md > Rejection Report`.

### Local Persistence Layer

Reads and writes persistent project context to a local JSON file.

The initial persistent scope is limited to the project identity and builder-defined boundary rules required by the POC.

It does not introduce an external database.

PRD refs:
- `prd.md > Project and Agent Context`
- `prd.md > Boundary Rules`.

## Data Model

### Project Context

```text
ProjectContext
- projectName
- agentName
- doRules[]
- dontRules[]
```

Lives in local JSON persistence.

Updated when the builder changes project identity or boundary rules.

Reloaded when the local application starts so the boundary survives restart.

### Intended Action

```text
IntendedAction
- id
- processId
- actionKind
- description
- target
- beforeText
- proposedText
```

Represents a simulated AI action before execution.

`beforeText` and `proposedText` provide the visible before/proposed-change evidence for the demo.

The intended action is temporary runtime state unless it becomes part of a rejection report.

### Guard Decision

```text
GuardDecision
- actionId
- decision
- matchedRule
- reason
```

Represents the Guard Engine's result.

The decision is produced before execution.

### Pending Block

```text
PendingBlock
- action
- guardDecision
- status
```

Exists while a prohibited action is paused and waiting for builder permission.

No simulated change may be applied while this state remains unresolved.

### Permission

```text
Permission
- actionKind
- processId
- scope
```

`scope` is either:

```text
once
process
```

One-time permission is consumed by the current action.

Process permission only applies to matching action context inside the same process.

### Rejection Report

```text
RejectionReport
- actionId
- processId
- actionDescription
- decision
- performed
- message
- createdAt
```

For a rejected action:

```text
decision = rejected
performed = false
```

The report is visible to the builder as written evidence that the rejected action was not performed.

## File Structure

```text
RX CONTEXT GUARD/
â”œâ”€â”€ app/
â”‚   â”œâ”€â”€ api/
â”‚   â”‚   â”œâ”€â”€ context/
â”‚   â”‚   â”‚   â””â”€â”€ route.ts
â”‚   â”‚   â”œâ”€â”€ guard/
â”‚   â”‚   â”‚   â””â”€â”€ route.ts
â”‚   â”‚   â””â”€â”€ report/
â”‚   â”‚       â””â”€â”€ route.ts
â”‚   â”œâ”€â”€ globals.css
â”‚   â”œâ”€â”€ layout.tsx
â”‚   â””â”€â”€ page.tsx
â”‚
â”œâ”€â”€ components/
â”‚   â”œâ”€â”€ ProjectContextPanel.tsx
â”‚   â”œâ”€â”€ BoundaryRulesPanel.tsx
â”‚   â”œâ”€â”€ ActionSimulator.tsx
â”‚   â”œâ”€â”€ ProposedChangeView.tsx
â”‚   â”œâ”€â”€ GuardStatus.tsx
â”‚   â”œâ”€â”€ PermissionGate.tsx
â”‚   â””â”€â”€ RejectionReportView.tsx
â”‚
â”œâ”€â”€ lib/
â”‚   â”œâ”€â”€ guard/
â”‚   â”‚   â”œâ”€â”€ evaluateAction.ts
â”‚   â”‚   â”œâ”€â”€ permissions.ts
â”‚   â”‚   â””â”€â”€ types.ts
â”‚   â”œâ”€â”€ simulator/
â”‚   â”‚   â””â”€â”€ simulatedActions.ts
â”‚   â”œâ”€â”€ reports/
â”‚   â”‚   â””â”€â”€ createRejectionReport.ts
â”‚   â””â”€â”€ storage/
â”‚       â””â”€â”€ projectStore.ts
â”‚
â”œâ”€â”€ data/
â”‚   â””â”€â”€ project-context.json
â”‚
â”œâ”€â”€ tests/
â”‚   â”œâ”€â”€ guard.test.ts
â”‚   â”œâ”€â”€ permissions.test.ts
â”‚   â””â”€â”€ rejection-report.test.ts
â”‚
â”œâ”€â”€ devpost/
â”‚   â”œâ”€â”€ scope.md
â”‚   â”œâ”€â”€ prd.md
â”‚   â””â”€â”€ spec.md
â”‚
â”œâ”€â”€ .gitignore
â”œâ”€â”€ package.json
â”œâ”€â”€ tsconfig.json
â””â”€â”€ README.md
```

`devpost/learner-profile.md` remains local/private according to the existing project ignore rule and is not intended for the public repository.

The exact bootstrap may create additional routine framework files. Those generated files do not change the architecture described here.

## External Services and Dependencies

### External Services

None are required for the POC.

There is:
- no external AI API;
- no cloud database;
- no authentication provider;
- no required hosting service;
- no external project-management service.

### Major Dependencies

The application uses:
- Next.js â€” https://nextjs.org/docs
- React â€” https://react.dev/
- TypeScript â€” https://www.typescriptlang.org/docs/

Exact installed versions will be captured from `package.json` during the build.

No API keys are required.

No external-service rate limits or usage costs apply to the planned POC.

## Important Failure Modes

- **Local project context cannot be read or written** -> the interface shows a clear local-storage error and does not pretend the boundary was safely persisted.
- **Guard evaluation cannot produce a valid decision** -> the action fails closed: execution remains paused rather than allowing an uncertain action to proceed.
- **Permission does not clearly match the current action/process** -> the previous permission is not reused; the action returns to explicit builder review.

These fallbacks favor protecting the project boundary rather than silently continuing.

## What Was Simplified and Why

- **Simulated AI intended actions instead of a real AI-agent integration** â€” this isolates and proves the Context Guard kernel without API keys, agent hooks, network behavior, or vendor-specific integration. A fuller version would require intercepting real agent tool/action requests before execution.
- **Local JSON persistence instead of a database** â€” the POC is local and single-user, so an external database would add complexity without proving the Guard. A fuller multi-project or multi-user product would need a stronger persistence model.
- **Local-only execution instead of deployment** â€” the required proof can be demonstrated in a recorded local browser session. Public deployment would add hosting work without strengthening the core allow/block proof.

## Decisions and Open Issues

### Learner Decisions

- **Run locally first** â€” the POC does not require public deployment.
- **Simulate AI intended actions** â€” the first proof focuses on the Guard rather than real-agent integration.
- **Persist the project boundary** â€” project identity and **DILAKUKEUN / ULAH DILAKUKEUN** rules must remain after restart.
- **Use Next.js + TypeScript with local JSON persistence** â€” the learner explicitly approved this recommended POC stack.
- **Show proposed syntax/code changes visually before execution** â€” the builder needs to see what is about to change.
- **Pause work while permission is unresolved** â€” a prohibited action must not continue while waiting for approval.
- **Use explicit permission scopes** â€” rejection, one-time permission, and same-process permission remain distinct.
- **Use a serious, slightly dark-blue interface** â€” carried forward from the approved PRD.

### Genuine Technical Unknown Clarified During Planning

The key uncertainty was:

**How can RX Context Guard receive an AI agent's intended action before that action changes the project?**

For this POC, that uncertainty is resolved by using a clearly labeled AI Action Simulator.

The simulator supplies the proposed action before execution, allowing the real Guard Engine and permission gate to be built and verified independently.

Real AI-agent interception remains outside this POC.

### Build-Time Verification

The build must verify that:

1. a prohibited action cannot modify simulated working state before permission;
2. **TOLAK** leaves the proposed change unapplied;
3. a rejection report records `performed = false`;
4. **IZINKAN SEKALI** does not authorize the next unrelated action;
5. **IZINKAN SELAMA PROSES** only applies to the same kind of action in the same process;
6. an uncertain or invalid guard result fails closed;
7. saved project boundary rules survive application restart.

### Open Issues

No consequential architecture decision remains unresolved for the proof of concept.

Exact dependency versions are intentionally deferred until the initial project bootstrap, where they can be recorded from the actual installed packages rather than guessed.

