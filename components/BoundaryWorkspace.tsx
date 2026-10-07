"use client";

import { useMemo, useState } from "react";
import { evaluateAction } from "@/lib/guard/engine";
import { simulatedActions } from "@/lib/simulator/actions";
import type { IntendedAction } from "@/lib/guard/types";

type RuleGroupProps = {
  title: string;
  subtitle: string;
  value: string;
  onChange: (value: string) => void;
  tone: "allow" | "deny";
};

function RuleGroup({ title, subtitle, value, onChange, tone }: RuleGroupProps) {
  return (
    <section className={`rule-card ${tone}`}>
      <div className="rule-heading">
        <div>
          <span className="eyebrow">{tone === "allow" ? "ALLOWED BOUNDARY" : "PROTECTED BOUNDARY"}</span>
          <h2>{title}</h2>
        </div>
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
      <div className="proposal-meta">
        <span>{action.actionKind.toUpperCase()}</span>
        <code>{action.target}</code>
      </div>
      <p>{action.description}</p>
      <pre>
        <span className="removed">- {action.proposedBefore}</span>
        {"\n"}
        <span className="added">+ {action.proposedAfter}</span>
      </pre>
    </div>
  );
}

export default function BoundaryWorkspace() {
  const [projectName, setProjectName] = useState("RX Context Guard");
  const [agentName, setAgentName] = useState("AI Agent / Simulator");
  const [doRules, setDoRules] = useState(
    "Work only inside the agreed task.\nShow the intended change before execution.\nWait for explicit permission when blocked."
  );
  const [dontRules, setDontRules] = useState(
    "Do not change already-good parts without instruction.\nDo not perform unrequested work.\nDo not continue after the Guard blocks an action."
  );
  const [selectedId, setSelectedId] = useState(simulatedActions[1].id);
  const [decisionText, setDecisionText] = useState("No action evaluated yet.");
  const [decisionStatus, setDecisionStatus] = useState<"IDLE" | "ALLOW" | "BLOCK">("IDLE");
  const [workingState, setWorkingState] = useState("Original project state — no simulated change applied.");

  const action = useMemo(
    () => simulatedActions.find((item) => item.id === selectedId) ?? simulatedActions[0],
    [selectedId]
  );

  const runGuard = () => {
    const rules = dontRules.split("\n").map((rule) => rule.trim()).filter(Boolean);
    const decision = evaluateAction(action, rules);
    setDecisionStatus(decision.status);
    setDecisionText(
      decision.matchedRule
        ? `${decision.reason} Matched: "${decision.matchedRule}"`
        : decision.reason
    );

    if (decision.status === "ALLOW") {
      setWorkingState(`Simulated execution applied: ${action.proposedAfter}`);
    } else {
      setWorkingState("PAUSED — proposed change was not applied. Working state remains unchanged.");
    }
  };

  return (
    <main className="shell">
      <header className="topbar">
        <div><span className="brand-mark">RX</span><span className="brand-name">CONTEXT GUARD</span></div>
        <div className="guard-online"><span /> GUARD WORKSPACE</div>
      </header>

      <section className="hero">
        <span className="eyebrow">PROJECT BOUNDARY CONTROL</span>
        <h1>Set the boundary before the agent moves.</h1>
        <p>Define what the AI may do and what it must not do. Proposed actions are shown before execution and evaluated by deterministic Guard logic.</p>
      </section>

      <section className="identity-grid">
        <label><span>PROJECT</span><input value={projectName} onChange={(e) => setProjectName(e.target.value)} /></label>
        <label><span>AI AGENT / MODEL</span><input value={agentName} onChange={(e) => setAgentName(e.target.value)} /></label>
      </section>

      <section className="boundary-grid">
        <RuleGroup title="DILAKUKEUN" subtitle="Work the agent is allowed and expected to perform." value={doRules} onChange={setDoRules} tone="allow" />
        <RuleGroup title="ULAH DILAKUKEUN" subtitle="Work the agent must not perform without explicit permission." value={dontRules} onChange={setDontRules} tone="deny" />
      </section>

      <section className="guard-lab">
        <div className="lab-heading">
          <div>
            <span className="eyebrow">SIMULATED AI INTENT</span>
            <h2>Pre-execution Guard</h2>
          </div>
          <span className="sim-label">SIMULATOR — NOT A LIVE AI AGENT</span>
        </div>

        <div className="action-picker">
          {simulatedActions.map((item) => (
            <button key={item.id} className={selectedId === item.id ? "active" : ""} onClick={() => { setSelectedId(item.id); setDecisionStatus("IDLE"); setDecisionText("No action evaluated yet."); setWorkingState("Original project state — no simulated change applied."); }}>
              {item.id === "safe-copy-edit" ? "Requested README edit" : "Unrequested good-code change"}
            </button>
          ))}
        </div>

        <Proposal action={action} />
        <button className="guard-button" onClick={runGuard}>CHECK WITH CONTEXT GUARD</button>

        <div className={`decision ${decisionStatus.toLowerCase()}`}>
          <strong>{decisionStatus === "IDLE" ? "WAITING" : decisionStatus}</strong>
          <span>{decisionText}</span>
        </div>

        <div className="working-state">
          <span>SIMULATED WORKING STATE</span>
          <p>{workingState}</p>
        </div>
      </section>

      <footer><span>BOUNDARY OWNER: BUILDER</span><span>SLICE 02 · GUARD KERNEL</span></footer>
    </main>
  );
}