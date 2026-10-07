export type ProjectContext = {
  projectName: string;
  agentName: string;
  doRules: string;
  dontRules: string;
  updatedAt: string;
};

export type RejectionEvidence = {
  id: string;
  createdAt: string;
  projectName: string;
  agentName: string;
  actionId: string;
  processId: string;
  actionKind: string;
  target: string;
  description: string;
  decision: "REJECTED";
  performed: false;
};