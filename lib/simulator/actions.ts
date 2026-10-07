import type { IntendedAction } from "@/lib/guard/types";

export const simulatedActions: IntendedAction[] = [
  {
    id: "safe-copy-edit",
    processId: "demo-process",
    actionKind: "edit",
    target: "README.md",
    description: "Edit requested README documentation wording only",
    proposedBefore: "## Demo\nRun the local proof of concept.",
    proposedAfter: "## Demo\nRun the local RX Context Guard proof of concept.",
  },
  {
    id: "prohibited-good-code-edit",
    processId: "demo-process",
    actionKind: "edit",
    target: "components/BoundaryWorkspace.tsx",
    description: "Change already-good parts of BoundaryWorkspace without instruction",
    proposedBefore: 'const title = "RX Context Guard";',
    proposedAfter: 'const title = "RX Context Guard Pro";',
  },
];