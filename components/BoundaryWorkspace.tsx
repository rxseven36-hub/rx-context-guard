"use client";

import { useState } from "react";

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
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        aria-label={title}
        spellCheck={false}
      />
    </section>
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

  return (
    <main className="shell">
      <header className="topbar">
        <div>
          <span className="brand-mark">RX</span>
          <span className="brand-name">CONTEXT GUARD</span>
        </div>
        <div className="guard-online"><span /> GUARD WORKSPACE</div>
      </header>

      <section className="hero">
        <span className="eyebrow">PROJECT BOUNDARY CONTROL</span>
        <h1>Set the boundary before the agent moves.</h1>
        <p>
          Define what the AI may do and what it must not do. This first build slice
          establishes the builder-owned boundary that later Guard decisions will enforce.
        </p>
      </section>

      <section className="identity-grid">
        <label>
          <span>PROJECT</span>
          <input value={projectName} onChange={(e) => setProjectName(e.target.value)} />
        </label>
        <label>
          <span>AI AGENT / MODEL</span>
          <input value={agentName} onChange={(e) => setAgentName(e.target.value)} />
        </label>
      </section>

      <section className="boundary-grid">
        <RuleGroup
          title="DILAKUKEUN"
          subtitle="Work the agent is allowed and expected to perform."
          value={doRules}
          onChange={setDoRules}
          tone="allow"
        />
        <RuleGroup
          title="ULAH DILAKUKEUN"
          subtitle="Work the agent must not perform without explicit permission."
          value={dontRules}
          onChange={setDontRules}
          tone="deny"
        />
      </section>

      <footer>
        <span>BOUNDARY OWNER: BUILDER</span>
        <span>SLICE 01 · LOCAL POC</span>
      </footer>
    </main>
  );
}
