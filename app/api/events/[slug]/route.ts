import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getEventRepository } from "@/lib/data";

const UpdateEventSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  date: z.string().nullable().optional(),
  location: z.string().max(200).nullable().optional(),
  message: z.string().max(500).nullable().optional(),
  templateId: z.string().optional(),
  shareMode: z.enum(["list_only", "card_only", "combined"]).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const repo = getEventRepository();

  const event = await repo.getEventBySlug(slug);
  if (!event) return NextResponse.json({ error: "Evento no encontrado" }, { status: 404 });

  const token = req.headers.get("x-edit-token");
  const valid = token ? await repo.validateEditToken(event.id, token) : false;
  if (!valid) return NextResponse.json({ error: "Token de edición inválido" }, { status: 403 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  const parsed = UpdateEventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
  }

  await repo.updateEvent(event.id, parsed.data);
  return new NextResponse(null, { status: 204 });
}
