import type { IntendedAction } from "./types";

export type PermissionScope = {
  processId: string;
  actionKind: IntendedAction["actionKind"];
  target: string;
};

export type PermissionState = {
  oneTimeActionIds: string[];
  processScopes: PermissionScope[];
};

export const emptyPermissionState = (): PermissionState => ({
  oneTimeActionIds: [],
  processScopes: [],
});

export function grantOnce(state: PermissionState, action: IntendedAction): PermissionState {
  return state.oneTimeActionIds.includes(action.id)
    ? state
    : { ...state, oneTimeActionIds: [...state.oneTimeActionIds, action.id] };
}

export function grantForProcess(state: PermissionState, action: IntendedAction): PermissionState {
  const scope = { processId: action.processId, actionKind: action.actionKind, target: action.target };
  const exists = state.processScopes.some(
    (item) => item.processId === scope.processId && item.actionKind === scope.actionKind && item.target === scope.target
  );
  return exists ? state : { ...state, processScopes: [...state.processScopes, scope] };
}

export function hasPermission(state: PermissionState, action: IntendedAction): "ONCE" | "PROCESS" | null {
  if (state.oneTimeActionIds.includes(action.id)) return "ONCE";
  if (
    state.processScopes.some(
      (scope) =>
        scope.processId === action.processId &&
        scope.actionKind === action.actionKind &&
        scope.target === action.target
    )
  ) return "PROCESS";
  return null;
}

export function consumeOnce(state: PermissionState, action: IntendedAction): PermissionState {
  return { ...state, oneTimeActionIds: state.oneTimeActionIds.filter((id) => id !== action.id) };
}