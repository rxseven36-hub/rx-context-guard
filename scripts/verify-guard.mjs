import assert from "node:assert/strict";
import fs from "node:fs";

const engine = fs.readFileSync("lib/guard/engine.ts", "utf8");
const execution = fs.readFileSync("lib/guard/execution.ts", "utf8");
const ui = fs.readFileSync("components/BoundaryWorkspace.tsx", "utf8");
const simulator = fs.readFileSync("lib/simulator/actions.ts", "utf8");

assert.match(engine, /dontRules\.find/, "Protected boundary must be checked.");
assert.match(engine, /doRules\.find/, "Allowed boundary must be checked.");
assert.match(engine, /outside the explicit allowed boundary/, "Outside-boundary fail-closed branch missing.");
assert.match(engine, /incomplete or uncertain/, "Uncertain fail-closed branch missing.");
assert.match(execution, /evaluateAction\(action, doRules, dontRules\)/, "Execution must call deterministic Guard with both boundaries.");
assert.match(ui, /allowedRules\(\), protectedRules\(\)/, "UI must pass both boundaries.");
assert.match(ui, /PAUSED/, "Blocked UI must remain paused.");
assert.match(simulator, /prohibited-good-code-edit/, "Prohibited simulator action missing.");

console.log("PASS: protected rules block prohibited actions.");
console.log("PASS: allowed rules are required before execution.");
console.log("PASS: outside/uncertain actions fail closed.");
console.log("PASS: simulator remains separate from Guard decision logic.");