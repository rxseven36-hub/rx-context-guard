import { promises as fs } from "node:fs";
import path from "node:path";
import { defaultProjectContext } from "./defaults";
import type { ProjectContext, RejectionEvidence } from "./types";

const dataDir = path.join(process.cwd(), "data");
const contextPath = path.join(dataDir, "project-context.json");
const rejectionDir = path.join(dataDir, "rejections");

async function ensureDataDir() {
  await fs.mkdir(dataDir, { recursive: true });
}

export async function readProjectContext(): Promise<ProjectContext> {
  await ensureDataDir();
  try {
    const raw = await fs.readFile(contextPath, "utf8");
    return JSON.parse(raw) as ProjectContext;
  } catch {
    const initial = defaultProjectContext();
    await writeProjectContext(initial);
    return initial;
  }
}

export async function writeProjectContext(context: ProjectContext): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(contextPath, `${JSON.stringify(context, null, 2)}\n`, "utf8");
}

export async function writeRejectionEvidence(
  evidence: RejectionEvidence
): Promise<string> {
  await fs.mkdir(rejectionDir, { recursive: true });
  const safeId = evidence.id.replace(/[^a-zA-Z0-9_-]/g, "_");
  const filename = `${safeId}.json`;
  await fs.writeFile(
    path.join(rejectionDir, filename),
    `${JSON.stringify(evidence, null, 2)}\n`,
    "utf8"
  );
  return filename;
}