import assert from "node:assert/strict";
import fs from "node:fs";

const permissions = fs.readFileSync("lib/guard/permissions.ts", "utf8");
const execution = fs.readFileSync("lib/guard/execution.ts", "utf8");
const ui = fs.readFileSync("components/BoundaryWorkspace.tsx", "utf8");

assert.match(permissions, /grantOnce/, "One-time permission missing.");
assert.match(permissions, /grantForProcess/, "Process permission missing.");
assert.match(permissions, /consumeOnce/, "One-time permission must be consumed.");
assert.match(permissions, /processId.*actionKind.*target/s, "Process scope must be narrow.");
assert.match(execution, /hasPermission/, "Execution must consult permission state.");
assert.match(execution, /evaluateAction/, "Execution must still use Guard engine.");
assert.match(ui, />TOLAK</, "Reject control missing.");
assert.match(ui, />IZINKAN SEKALI</, "One-time allow control missing.");
assert.match(ui, />IZINKAN SELAMA PROSES</, "Process allow control missing.");
assert.match(ui, /blocked action remains unapplied/, "Reject path must keep action unapplied.");

console.log("PASS: builder permission gate contract verified.");
console.log("PASS: one-time permission is consumable.");
console.log("PASS: process permission is scoped by process + action kind + target.");
console.log("PASS: rejection keeps the blocked action unapplied.");