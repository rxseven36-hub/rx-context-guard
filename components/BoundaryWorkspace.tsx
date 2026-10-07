"use client";

import { useEffect, useMemo, useState } from "react";
import { executeWithGuard } from "@/lib/guard/execution";
import {
  emptyPermissionState,
  grantForProcess,
  grantOnce,
  type PermissionState,
} from "@/lib/guard/permissions";
import { simulatedActions } from "@/lib/simulator/actions";
import type { IntendedAction } from "@/lib/guard/types";

type RuleGroupProps = {
  title: string; subtitle: string; value: string;
  onChange: (value: string) => void; tone: "allow" | "deny";
};

function RuleGroup({ title, subtitle, value, onChange, tone }: RuleGroupProps) {
  return (
    <section className={`rule-card ${tone}`}>
      <div className="rule-heading">
        <div><span className="eyebrow">{tone === "allow" ? "ALLOWED BOUNDARY" : "PROTECTED BOUNDARY"}</span><h2>{title}</h2></div>
        <span className="status-dot" aria-hidden="true" />
      </div>
      <p>{subtitle}</p>
      <textarea value={value} onChange={(e) => onChange(e.target.value)} aria-label={title} spellCheck={false} />
    </section>
  );
}

function Proposal({ action }: { action: IntendedAction }) {
  return (
    <div className="proposal">
      <div className="proposal-meta"><span>{action.actionKind.toUpperCase()}</span><code>{action.target}</code></div>
      <p>{action.description}</p>
      <pre><span className="removed">- {action.proposedBefore}</span>{"\n"}<span className="added">+ {action.proposedAfter}</span></pre>
    </div>
  );
}

export default function BoundaryWorkspace() {
  const [projectName, setProjectName] = useState("RX Context Guard");
  const [agentName, setAgentName] = useState("AI Agent / Simulator");
  const [doRules, setDoRules] = useState("Edit requested README documentation wording only.\nWork only inside the agreed task.\nShow the intended change before execution.\nWait for explicit permission when blocked.");
  const [dontRules, setDontRules] = useState("Do not change already-good parts without instruction.\nDo not perform unrequested work.\nDo not continue after the Guard blocks an action.");
  const [selectedId, setSelectedId] = useState(simulatedActions[1].id);
  const [decisionText, setDecisionText] = useState("No action evaluated yet.");
  const [decisionStatus, setDecisionStatus] = useState<"IDLE" | "ALLOW" | "BLOCK" | "REJECTED">("IDLE");
  const [workingState, setWorkingState] = useState("Original project state — no simulated change applied.");
  const [permissions, setPermissions] = useState<PermissionState>(emptyPermissionState());
  const [blockedAction, setBlockedAction] = useState<IntendedAction | null>(null);
  const [storageStatus, setStorageStatus] = useState("Loading saved boundary...");
  const [lastEvidence, setLastEvidence] = useState<string | null>(null);

  useEffect(() => {
    void fetch("/api/context", { cache: "no-store" })
      .then((response) => {
        if (!response.ok) throw new Error("Could not load saved boundary.");
        return response.json();
      })
      .then((saved) => {
        setProjectName(saved.projectName);
        setAgentName(saved.agentName);
        setDoRules(saved.doRules);
        setDontRules(saved.dontRules);
        setStorageStatus("Saved boundary loaded from local JSON.");
      })
      .catch(() => setStorageStatus("Local boundary could not be loaded."));
  }, []);

  const saveBoundary = async () => {
    setStorageStatus("Saving...");
    const response = await fetch("/api/context", {
      method: "PUT",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ projectName, agentName, doRules, dontRules }),
    });
    setStorageStatus(response.ok ? "Boundary saved to local JSON." : "Boundary save failed.");
  };

  const action = useMemo(() => simulatedActions.find((item) => item.id === selectedId) ?? simulatedActions[0], [selectedId]);
  const allowedRules = () => doRules.split("\n").map((rule) => rule.trim()).filter(Boolean);
  const protectedRules = () => dontRules.split("\n").map((rule) => rule.trim()).filter(Boolean);

  const runGuard = (candidate = action, permissionState = permissions) => {
    const result = executeWithGuard(candidate, allowedRules(), protectedRules(), workingState, permissionState);
    setPermissions(result.nextPermissions);
    setDecisionStatus(result.decision.status);
    setDecisionText(result.decision.matchedRule ? `${result.decision.reason} Matched: "${result.decision.matchedRule}"` : result.decision.reason);
    if (result.applied) {
      setWorkingState(result.nextWorkingState);
      setBlockedAction(null);
    } else {
      setWorkingState("PAUSED — proposed change was not applied. Working state remains unchanged.");
      setBlockedAction(candidate);
    }
  };

  const reject = async () => {
    if (!blockedAction) return;
    const rejected = blockedAction;
    setDecisionStatus("REJECTED");
    setDecisionText("Builder rejected the blocked action. It was not performed.");
    setWorkingState("REJECTED — blocked action remains unapplied.");
    setBlockedAction(null);

    const response = await fetch("/api/rejections", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        projectName,
        agentName,
        actionId: rejected.id,
        processId: rejected.processId,
        actionKind: rejected.actionKind,
        target: rejected.target,
        description: rejected.description,
      }),
    });
    if (response.ok) {
      const result = await response.json();
      setLastEvidence(result.filename);
    } else {
      setLastEvidence("ERROR: rejection evidence could not be written.");
    }
  };

  const allowOnce = () => {
    if (!blockedAction) return;
    const next = grantOnce(permissions, blockedAction);
    setPermissions(next);
    runGuard(blockedAction, next);
  };

  const allowProcess = () => {
    if (!blockedAction) return;
    const next = grantForProcess(permissions, blockedAction);
    setPermissions(next);
    runGuard(blockedAction, next);
  };

  const selectAction = (id: string) => {
    setSelectedId(id); setDecisionStatus("IDLE"); setDecisionText("No action evaluated yet.");
    setWorkingState("Original project state — no simulated change applied."); setBlockedAction(null);
  };

  return (
    <main className="shell">
      <header className="topbar"><div><span className="brand-mark">RX</span><span className="brand-name">CONTEXT GUARD</span></div><div className="guard-online"><span /> GUARD WORKSPACE</div></header>
      <section className="hero"><span className="eyebrow">PROJECT BOUNDARY CONTROL</span><h1>Set the boundary before the agent moves.</h1><p>Define what the AI may do and what it must not do. Proposed actions are shown before execution and evaluated by deterministic Guard logic.</p></section>
      <section className="identity-grid">
        <label><span>PROJECT</span><input value={projectName} onChange={(e) => setProjectName(e.target.value)} /></label>
        <label><span>AI AGENT / MODEL</span><input value={agentName} onChange={(e) => setAgentName(e.target.value)} /></label>
      </section>
      <section className="boundary-grid">
        <RuleGroup title="ALLOWED ACTIONS" subtitle="Work the agent is allowed and expected to perform." value={doRules} onChange={setDoRules} tone="allow" />
        <RuleGroup title="PROTECTED ACTIONS" subtitle="Work the agent must not perform without explicit permission." value={dontRules} onChange={setDontRules} tone="deny" />
      </section>
      <section className="storage-bar">
        <div>
          <span className="eyebrow">LOCAL PERSISTENCE</span>
          <p>{storageStatus}</p>
        </div>
        <button onClick={() => void saveBoundary()}>
          SAVE BOUNDARY
        </button>
      </section>

      <section className="guard-lab">
        <div className="lab-heading"><div><span className="eyebrow">SIMULATED AI INTENT</span><h2>Pre-execution Guard</h2></div><span className="sim-label">SIMULATOR — NOT A LIVE AI AGENT</span></div>
        <div className="action-picker">
          {simulatedActions.map((item) => <button key={item.id} className={selectedId === item.id ? "active" : ""} onClick={() => selectAction(item.id)}>{item.id === "safe-copy-edit" ? "Requested README edit" : "Unrequested good-code change"}</button>)}
        </div>
        <Proposal action={action} />
        <button className="guard-button" onClick={() => runGuard()}>CHECK WITH CONTEXT GUARD</button>
        <div className={`decision ${decisionStatus.toLowerCase()}`}><strong>{decisionStatus === "IDLE" ? "WAITING" : decisionStatus}</strong><span>{decisionText}</span></div>

        {blockedAction && (
          <div className="permission-gate">
            <div><span className="eyebrow">BUILDER DECISION REQUIRED</span><h3>Guard paused execution.</h3><p>The blocked action cannot continue until you decide.</p></div>
            <div className="permission-actions">
              <button className="reject" onClick={reject}>TOLAK</button>
              <button onClick={allowOnce}>IZINKAN SEKALI</button>
              <button onClick={allowProcess}>IZINKAN SELAMA PROSES</button>
            </div>
          </div>
        )}

        <div className="working-state"><span>SIMULATED WORKING STATE</span><p>{workingState}</p></div>
        <div className="permission-state"><span>ACTIVE PROCESS PERMISSIONS</span><strong>{permissions.processScopes.length}</strong><span> · ONE-TIME TOKENS </span><strong>{permissions.oneTimeActionIds.length}</strong></div>
        {lastEvidence && <div className="evidence-state"><span>REJECTION EVIDENCE</span><code>{lastEvidence}</code><strong>performed = false</strong></div>}
      </section>
      <footer><span>BOUNDARY OWNER: BUILDER</span><span>SLICE 05 · DEMO READY</span></footer>
    </main>
  );
}