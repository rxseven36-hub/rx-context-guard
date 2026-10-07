export type ActionKind = "edit" | "delete" | "create" | "config";

export type IntendedAction = {
  id: string;
  processId: string;
  actionKind: ActionKind;
  target: string;
  description: string;
  proposedBefore: string;
  proposedAfter: string;
};

export type GuardDecision = {
  status: "ALLOW" | "BLOCK";
  reason: string;
  matchedRule?: string;
};