import { NextResponse } from "next/server";
import { readProjectContext, writeProjectContext } from "@/lib/storage/server";
import type { ProjectContext } from "@/lib/storage/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await readProjectContext());
}

export async function PUT(request: Request) {
  const body = (await request.json()) as Partial<ProjectContext>;
  if (
    typeof body.projectName !== "string" ||
    typeof body.agentName !== "string" ||
    typeof body.doRules !== "string" ||
    typeof body.dontRules !== "string"
  ) {
    return NextResponse.json({ error: "Invalid project context." }, { status: 400 });
  }

  const context: ProjectContext = {
    projectName: body.projectName,
    agentName: body.agentName,
    doRules: body.doRules,
    dontRules: body.dontRules,
    updatedAt: new Date().toISOString(),
  };
  await writeProjectContext(context);
  return NextResponse.json(context);
}