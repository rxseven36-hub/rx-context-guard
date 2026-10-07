import { evaluateAction } from "./engine";
import { consumeOnce, hasPermission, type PermissionState } from "./permissions";
import type { GuardDecision, IntendedAction } from "./types";

export type GuardedExecution = {
  decision: GuardDecision;
  applied: boolean;
  nextWorkingState: string;
  nextPermissions: PermissionState;
};

export function executeWithGuard(
  action: IntendedAction,
  dontRules: string[],
  workingState: string,
  permissions: PermissionState
): GuardedExecution {
  const permission = hasPermission(permissions, action);

  if (permission) {
    return {
      decision: {
        status: "ALLOW",
        reason:
          permission === "ONCE"
            ? "Builder granted one-time permission for this exact action."
            : "Builder granted permission for this action kind and target during the current process.",
      },
      applied: true,
      nextWorkingState: `Simulated execution applied: ${action.proposedAfter}`,
      nextPermissions: permission === "ONCE" ? consumeOnce(permissions, action) : permissions,
    };
  }

  const decision = evaluateAction(action, dontRules);
  return {
    decision,
    applied: decision.status === "ALLOW",
    nextWorkingState:
      decision.status === "ALLOW"
        ? `Simulated execution applied: ${action.proposedAfter}`
        : workingState,
    nextPermissions: permissions,
  };
}