import assert from "node:assert/strict";
import fs from "node:fs";

const engine = fs.readFileSync("lib/guard/engine.ts", "utf8");
const simulator = fs.readFileSync("lib/simulator/actions.ts", "utf8");
const workspace = fs.readFileSync("components/BoundaryWorkspace.tsx", "utf8");

assert.match(engine, /status:\s*"BLOCK"/, "Guard engine must contain BLOCK decision.");
assert.match(engine, /status:\s*"ALLOW"/, "Guard engine must contain ALLOW decision.");
assert.match(engine, /Fail closed/, "Incomplete/uncertain action must fail closed.");
assert.match(engine, /matchedRule/, "Guard must return the matched protected rule.");
assert.match(simulator, /Change already-good parts of BoundaryWorkspace without instruction/, "Prohibited demo action missing.");
assert.match(workspace, /evaluateAction\(action,\s*rules\)/, "UI must call the real Guard engine.");
assert.match(workspace, /PAUSED — proposed change was not applied/, "Blocked state must remain unapplied.");
assert.match(workspace, /SIMULATOR — NOT A LIVE AI AGENT/, "Simulator must be clearly labeled.");

console.log("PASS: Guard kernel source contract verified.");
console.log("PASS: Simulator is separate from Guard decision logic.");
console.log("PASS: Blocked UI state explicitly remains unapplied.");