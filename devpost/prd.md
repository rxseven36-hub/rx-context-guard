---
doc: prd
status: approved
---

# RX Context Guard — Product Requirements

RX Context Guard is a proof-of-concept protective boundary for a builder working with an AI agent, preventing the agent from performing actions outside the builder's instructions and agreed rules without explicit permission.

Source: `scope.md > The Unique Kernel`, `scope.md > Who It's For`.

## The Core Journey

Source: `scope.md > The Core Loop`, `scope.md > What "Working" Looks Like`.

1. The builder opens RX Context Guard and sees the AI agent/model name and the project name.
2. The builder defines the project's protective boundary using two groups:
   - **DILAKUKEUN** — things the AI agent should or is allowed to do.
   - **ULAH DILAKUKEUN** — things the AI agent must not do without permission.
3. The builder gives the AI agent a project instruction.
4. Before an intended AI action proceeds, RX Context Guard checks that action against the agreed boundary.
5. If the intended action stays inside the boundary, it is allowed to proceed.
6. If the intended action violates **ULAH DILAKUKEUN** or otherwise goes outside the agreed instruction, RX Context Guard stops the action before it changes the project.
7. The builder is warned that the action has been blocked and decides what happens next:
   - **TOLAK** — keep the action blocked.
   - **IZINKAN SEKALI** — allow that blocked action once.
   - **IZINKAN SELAMA PROSES** — allow the same kind of action while it remains part of the same process.
8. Permission for one action or process does not automatically authorize a different action. A different out-of-bound action must be reviewed separately.
9. If the builder chooses **TOLAK**, the AI provides a written report confirming that the rejected action was not performed.
10. The builder can inspect that report to verify that the boundary decision was respected.

Success is visible when an unrequested or prohibited AI action is stopped before it changes the project, remains under the builder's control, and a rejected action produces a written confirmation that it was not performed.

## Screens and Layout

Source: `scope.md > The Core Loop`, `scope.md > The POC Boundary`.

The proof of concept has a visual interaction surface centered on the active AI agent, active project, boundary rules, and guard decision.

The initial view shows:

- the **AI agent/model name**;
- the **project name**;
- an area where the builder can define **DILAKUKEUN**;
- an area where the builder can define **ULAH DILAKUKEUN**.

When an intended AI action violates the boundary, the interaction surface must present a visible blocked-action warning and controls for the builder's decision.

The warning presents the available decisions:

- **TOLAK**
- **IZINKAN SEKALI**
- **IZINKAN SELAMA PROSES**

A rejected action also results in a visible written report confirming that the action was not performed.

No additional screens have been established for the POC.

## Look and Feel

RX Context Guard should have a serious, firm, professional visual character that reflects the learner's own approach to project work.

The established primary visual direction is **slightly dark blue**.

The interface should feel like a serious protective and monitoring surface rather than a playful or generic AI application. The visual presentation should reinforce the role of RX Context Guard as a protective boundary around AI-agent activity.

No specific typography, status colors, or external design references have been established.

## Features and Behavior

Source: `scope.md > The Unique Kernel`, `scope.md > The Core Loop`, `scope.md > What "Working" Looks Like`.

### Project and Agent Context

The builder can see which project is currently protected and which AI agent/model is operating within that project's boundary.

- [ ] The active project name is visible.
- [ ] The AI agent/model name is visible.

### Boundary Rules

The builder defines the boundary rather than RX Context Guard inventing it.

The boundary has two explicit groups:

- **DILAKUKEUN** — actions or behavior the builder wants the AI agent to perform or permits within the project.
- **ULAH DILAKUKEUN** — actions or behavior the AI agent must not perform without explicit permission.

- [ ] The builder can provide rules under **DILAKUKEUN**.
- [ ] The builder can provide rules under **ULAH DILAKUKEUN**.
- [ ] The currently defined boundary can be seen by the builder.

### Guard Decision

Before an intended AI action that falls outside the agreed boundary proceeds, RX Context Guard intervenes.

- [ ] An action that stays within the boundary can proceed.
- [ ] An action that violates the boundary is stopped before it changes the project.
- [ ] The builder receives a visible warning when an action is blocked.
- [ ] A blocked action waits for the builder's decision.

### Permission Decision

A blocked action remains under explicit builder control.

The builder can:

- **TOLAK** the action;
- **IZINKAN SEKALI** for that action;
- **IZINKAN SELAMA PROSES** when repeated instances of the same kind of action belong to the same process.

An authorization does not silently expand to unrelated actions.

- [ ] **TOLAK** keeps the blocked action from proceeding.
- [ ] **IZINKAN SEKALI** permits the blocked action once.
- [ ] **IZINKAN SELAMA PROSES** permits the same kind of action during the same process without repeatedly asking for the same permission.
- [ ] A different out-of-bound action requires a new review and permission decision.

### Rejection Report

When the builder rejects a blocked action, the AI must provide written evidence that the rejected action was not performed.

- [ ] A rejected action produces a written report.
- [ ] The report identifies the action that was rejected.
- [ ] The report states that the rejected action was not performed.
- [ ] The builder can inspect the report after the rejection.

## States and Boundaries

Source: `scope.md > What "Working" Looks Like`, `scope.md > The POC Boundary`.

- **Boundary Ready** — the project, AI agent/model, and builder-defined rules are available for the guard to use.
- **Allowed** — the intended AI action is inside the agreed boundary and may proceed.
- **Blocked / Awaiting Decision** — the intended action violates the boundary and cannot proceed until the builder decides.
- **Allowed Once** — the builder explicitly permits the currently blocked action once.
- **Allowed During Process** — the builder permits the same kind of action while it belongs to the same process; unrelated actions are not covered.
- **Rejected** — the builder refuses permission, the action remains unperformed, and a written report confirms the rejection.
- **Different Action** — an existing permission does not cover a different out-of-bound action; it must be reviewed separately.

## Product Decisions

- The builder defines **DILAKUKEUN** and **ULAH DILAKUKEUN** — the guard must not invent the builder's project boundary.
- Out-of-bound actions are blocked before they change the project — the purpose of the product is prevention rather than correction afterward.
- The builder remains the authority over exceptions — blocked actions require an explicit decision.
- Permission can be one-time or valid for the same action during the same process — this avoids repeatedly approving the same thing without turning one approval into unrestricted permission.
- Different actions require separate review — permission must not silently spread beyond its original context.
- Rejection produces a written report — the builder wants visible evidence that the rejected action was not performed.

## What We're Building

Source: `scope.md > The POC Boundary`.

The proof of concept must demonstrate:

1. an identifiable AI agent/model and project;
2. builder-defined **DILAKUKEUN** and **ULAH DILAKUKEUN** rules;
3. an intended AI action being checked against that boundary;
4. an in-bound action being allowed;
5. an out-of-bound action being visibly warned and blocked before project modification;
6. builder decisions for **TOLAK**, **IZINKAN SEKALI**, and **IZINKAN SELAMA PROSES**;
7. process-scoped permission applying only to the same kind of action in the same process;
8. a different out-of-bound action requiring separate permission;
9. a rejected action producing a written report confirming it was not performed.

## Deferred From the POC

No additional product capabilities have been committed for later implementation during the PRD interview.

Anything beyond what is necessary to demonstrate the protective boundary remains outside the current proof of concept unless explicitly added by the learner.

## Possible Later Enhancements

No later enhancements have been committed yet.

## Non-Goals

Source: `scope.md > Explicitly Cut`.

- **Building a complete AI coding agent** — RX Context Guard proves the protective guard rather than replacing the AI coding agent.
- **Building a full project-management platform** — this is unnecessary to demonstrate the allow/block boundary.
- **Adding unrelated project functionality** — features that do not help demonstrate the core protective boundary are outside the POC.
- **Automatically expanding permission to unrelated actions** — this conflicts with the builder's requirement that different actions receive separate review.
- **Allowing a prohibited action before approval** — the central proof requires prevention before the project is changed.

## Open Questions

- **Look and Feel — must be resolved before PRD approval.** The product behavior is defined, but the learner has not yet established the visual direction for the POC.


