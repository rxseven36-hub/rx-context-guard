---
doc: scope
status: approved
---

# RX Context Guard

A small proof of concept that puts a protective boundary around an AI agent's project work so it cannot go beyond the user's instruction without permission.

## The Unique Kernel

RX Context Guard acts as a **"pager" (protective boundary)** between the user's instruction and the AI agent's intended action.

If the AI tries to perform an action that falls outside the agreed boundary, the action is automatically blocked until the user explicitly allows it.

## Who It's For

A builder who develops projects iteratively with an AI coding agent: deciding what should be built, asking the AI to implement it, reviewing the result, and then giving the next instruction.

Today, the builder has to repeatedly remind the AI not to change things that are already good, repeat known mistakes, perform unrequested work, drift outside the requested scope, or invent unsupported assumptions.

## The Core Loop

The builder gives the AI a project instruction.

Before the AI's intended action proceeds, RX Context Guard checks whether that action stays inside the agreed project boundary.

- If the action stays inside the boundary, it can proceed.
- If the action goes outside the boundary, RX Context Guard blocks it and warns the builder.
- The blocked action stays blocked until the builder explicitly allows it.

The boundary carries forward so the builder does not have to repeat the same restrictions in every new instruction.

## Inspiration & Identity

Not established yet.

The learner describes the central metaphor as a **"pager"**: a fence or protective boundary that the AI agent should not cross without permission.

## Why This Matters to the Learner

The learner wants an AI agent to become a trustworthy working partner that remembers and follows agreed SOP and project boundaries.

The goal is to avoid wasting project-building time repeatedly correcting unnecessary work, repeated mistakes, unwanted changes, scope drift, or actions that were never requested.

## What "Working" Looks Like

A demonstrable proof of concept shows:

1. The builder gives the AI an instruction.
2. The AI proposes or attempts an action.
3. RX Context Guard checks that action against the agreed boundary.
4. An allowed action passes the guard.
5. An action outside the boundary triggers a visible warning and is automatically blocked.
6. The blocked action cannot continue unless the builder explicitly approves it.

The key demo moment is seeing an AI action that was not requested get stopped **before it changes the project**.

## The POC Boundary

The proof of concept only needs to demonstrate the protective boundary:

**instruction -> intended AI action -> boundary check -> allow or block -> explicit user permission for a blocked action**

It must prove that RX Context Guard can identify an attempted action outside the agreed instruction and prevent that action from proceeding without user approval.

It does not need to become a complete AI coding platform.

## Later

Capabilities beyond the smallest working guard can be considered after the core proof of concept works.

No additional later features have been committed yet.

## Explicitly Cut

- **A complete AI coding agent** — RX Context Guard is proving the guard, not replacing the coding agent.
- **A full project-management platform** — not required to demonstrate the protective boundary.
- **Unrelated project features** — anything that does not help prove the guard's core allow/block behavior is outside this POC.


