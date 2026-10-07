import type { ProjectContext } from "./types";

export const defaultProjectContext = (): ProjectContext => ({
  projectName: "RX Context Guard",
  agentName: "AI Agent / Simulator",
  doRules:
    "Work only inside the agreed task.\nShow the intended change before execution.\nWait for explicit permission when blocked.",
  dontRules:
    "Do not change already-good parts without instruction.\nDo not perform unrequested work.\nDo not continue after the Guard blocks an action.",
  updatedAt: new Date(0).toISOString(),
});