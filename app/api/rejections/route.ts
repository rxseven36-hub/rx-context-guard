import { NextResponse } from "next/server";
import { writeRejectionEvidence } from "@/lib/storage/server";
import type { RejectionEvidence } from "@/lib/storage/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = (await request.json()) as Partial<RejectionEvidence>;
  if (
    typeof body.projectName !== "string" ||
    typeof body.agentName !== "string" ||
    typeof body.actionId !== "string" ||
    typeof body.processId !== "string" ||
    typeof body.actionKind !== "string" ||
    typeof body.target !== "string" ||
    typeof body.description !== "string"
  ) {
    return NextResponse.json({ error: "Invalid rejection evidence." }, { status: 400 });
  }

  const evidence: RejectionEvidence = {
    id: `rejection-${Date.now()}`,
    createdAt: new Date().toISOString(),
    projectName: body.projectName,
    agentName: body.agentName,
    actionId: body.actionId,
    processId: body.processId,
    actionKind: body.actionKind,
    target: body.target,
    description: body.description,
    decision: "REJECTED",
    performed: false,
  };

  const filename = await writeRejectionEvidence(evidence);
  return NextResponse.json({ evidence, filename }, { status: 201 });
}