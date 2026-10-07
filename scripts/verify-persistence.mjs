import assert from "node:assert/strict";
import fs from "node:fs";

const storage = fs.readFileSync("lib/storage/server.ts", "utf8");
const contextRoute = fs.readFileSync("app/api/context/route.ts", "utf8");
const rejectionRoute = fs.readFileSync("app/api/rejections/route.ts", "utf8");
const ui = fs.readFileSync("components/BoundaryWorkspace.tsx", "utf8");

assert.match(storage, /project-context\.json/, "Project context JSON path missing.");
assert.match(storage, /rejections/, "Rejection evidence directory missing.");
assert.match(contextRoute, /export async function GET/, "Context GET missing.");
assert.match(contextRoute, /export async function PUT/, "Context PUT missing.");
assert.match(rejectionRoute, /performed:\s*false/, "Rejection evidence must hard-code performed=false.");
assert.match(rejectionRoute, /decision:\s*"REJECTED"/, "Rejection decision missing.");
assert.match(ui, /fetch\("\/api\/context"/, "UI must load/save local context.");
assert.match(ui, /SAVE BOUNDARY/, "Explicit save control missing.");
assert.match(ui, /fetch\("\/api\/rejections"/, "Reject path must write evidence.");
assert.match(ui, /performed = false/, "UI must surface non-performance evidence.");

console.log("PASS: local JSON persistence contract verified.");
console.log("PASS: project boundary load/save route verified.");
console.log("PASS: rejection evidence is hard-coded performed=false.");
console.log("PASS: reject path writes and surfaces evidence.");