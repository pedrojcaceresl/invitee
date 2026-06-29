import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getEventRepository, getGiftRepository } from "@/lib/data";

const AddGiftSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(500).nullable().optional(),
  purchaseLink: z.string().url().nullable().optional(),
  photoUrl: z.string().url().nullable().optional(),
  approxPrice: z.number().positive().nullable().optional(),
});

async function resolveEvent(slug: string) {
  return getEventRepository().getEventBySlug(slug);
}

async function validateToken(eventId: string, req: NextRequest): Promise<boolean> {
  const token = req.headers.get("x-edit-token");
  if (!token) return false;
  return getEventRepository().validateEditToken(eventId, token);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const event = await resolveEvent(slug);
  if (!event) return NextResponse.json({ error: "Evento no encontrado" }, { status: 404 });

  if (!(await validateToken(event.id, req))) {
    return NextResponse.json({ error: "Token de edición inválido" }, { status: 403 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  const parsed = AddGiftSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
  }

  const gift = await getGiftRepository().addGift(event.id, {
    name: parsed.data.name,
    description: parsed.data.description ?? null,
    purchaseLink: parsed.data.purchaseLink ?? null,
    photoUrl: parsed.data.photoUrl ?? null,
    approxPrice: parsed.data.approxPrice ?? null,
  });

  return NextResponse.json(gift, { status: 201 });
}
