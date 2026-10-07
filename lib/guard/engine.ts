import type { GuardDecision, IntendedAction } from "./types";

const words = (value: string) =>
  value.toLowerCase().match(/[a-z0-9]+/g)?.filter((word) => word.length >= 4) ?? [];

function ruleMatchesAction(rule: string, action: IntendedAction) {
  const tokens = words(rule);
  if (!tokens.length) return false;
  const haystack = `${action.actionKind} ${action.target} ${action.description}`.toLowerCase();
  const matches = tokens.filter((token) => haystack.includes(token)).length;
  return matches >= Math.min(2, tokens.length);
}

export function evaluateAction(
  action: IntendedAction,
  doRules: string[],
  dontRules: string[]
): GuardDecision {
  if (
    !action.id?.trim() ||
    !action.processId?.trim() ||
    !action.actionKind?.trim() ||
    !action.target?.trim() ||
    !action.description?.trim()
  ) {
    return { status: "BLOCK", reason: "Action context is incomplete or uncertain. Guard fails closed." };
  }

  const denied = dontRules.find((rule) => ruleMatchesAction(rule, action));
  if (denied) {
    return {
      status: "BLOCK",
      reason: "Proposed action crosses a protected project boundary.",
      matchedRule: denied,
    };
  }

  const allowed = doRules.find((rule) => ruleMatchesAction(rule, action));
  if (!allowed) {
    return {
      status: "BLOCK",
      reason: "Proposed action is outside the explicit allowed boundary. Guard fails closed.",
    };
  }

  return {
    status: "ALLOW",
    reason: "Proposed action matches the explicit allowed project boundary.",
    matchedRule: allowed,
  };
}