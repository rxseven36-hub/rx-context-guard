import type { GuardDecision, IntendedAction } from "./types";

const normalize = (value: string) =>
  value.toLowerCase().replace(/[^\p{L}\p{N}._/-]+/gu, " ").replace(/\s+/g, " ").trim();

const significantTokens = (value: string) =>
  normalize(value)
    .split(" ")
    .filter((token) => token.length >= 4);

function ruleMatchesAction(rule: string, action: IntendedAction): boolean {
  const tokens = significantTokens(rule);
  if (tokens.length === 0) return false;

  const actionText = normalize(
    `${action.actionKind} ${action.target} ${action.description}`
  );

  // Deterministic POC rule: a boundary matches only when at least two
  // meaningful rule tokens occur in the structured intended action.
  // This avoids pretending that the simulator or an AI model made the decision.
  const hits = tokens.filter((token) => actionText.includes(token));
  return hits.length >= Math.min(2, tokens.length);
}

export function evaluateAction(
  action: IntendedAction | null | undefined,
  dontRules: string[]
): GuardDecision {
  if (
    !action ||
    !action.id ||
    !action.processId ||
    !action.actionKind ||
    !action.target ||
    !action.description
  ) {
    return {
      status: "BLOCK",
      reason: "Guard decision is uncertain because the intended action is incomplete. Fail closed.",
    };
  }

  for (const rule of dontRules) {
    if (rule.trim() && ruleMatchesAction(rule, action)) {
      return {
        status: "BLOCK",
        reason: "Proposed action crosses a protected project boundary.",
        matchedRule: rule.trim(),
      };
    }
  }

  return {
    status: "ALLOW",
    reason: "No protected boundary matched this intended action.",
  };
}