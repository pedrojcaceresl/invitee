import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getEventRepository } from "@/lib/data";

const CreateEventSchema = z.object({
  name: z.string().min(1).max(100),
  type: z.enum(["birthday", "wedding", "graduation", "babyshower", "other"]),
  date: z.string().nullable().optional(),
  location: z.string().max(200).nullable().optional(),
  message: z.string().max(500).nullable().optional(),
  templateId: z.string().min(1),
  shareMode: z.enum(["list_only", "card_only", "combined"]),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  const parsed = CreateEventSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
  }

  const repo = getEventRepository();
  const { event, editToken } = await repo.createEvent({
    ...parsed.data,
    date: parsed.data.date ?? null,
    location: parsed.data.location ?? null,
    message: parsed.data.message ?? null,
    customPhotoUrl: null,
  });

  return NextResponse.json({ slug: event.slug, editToken }, { status: 201 });
}
