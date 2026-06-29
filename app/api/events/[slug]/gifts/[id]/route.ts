import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getEventRepository, getGiftRepository } from "@/lib/data";

const UpdateGiftSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(500).nullable().optional(),
  purchaseLink: z.string().url().nullable().optional(),
  photoUrl: z.string().url().nullable().optional(),
  approxPrice: z.number().positive().nullable().optional(),
});

type Params = { slug: string; id: string };

async function resolveAndAuthorize(slug: string, req: NextRequest) {
  const event = await getEventRepository().getEventBySlug(slug);
  if (!event) return { error: "Evento no encontrado", status: 404 } as const;

  const token = req.headers.get("x-edit-token");
  const valid = token ? await getEventRepository().validateEditToken(event.id, token) : false;
  if (!valid) return { error: "Token de edición inválido", status: 403 } as const;

  return { event };
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  const { slug, id } = await params;

  const auth = await resolveAndAuthorize(slug, req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Body inválido" }, { status: 400 });
  }

  const parsed = UpdateGiftSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
  }

  await getGiftRepository().updateGift(auth.event.id, id, parsed.data);
  return new NextResponse(null, { status: 204 });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<Params> }
) {
  const { slug, id } = await params;

  const auth = await resolveAndAuthorize(slug, req);
  if ("error" in auth) {
    return NextResponse.json({ error: auth.error }, { status: auth.status });
  }

  await getGiftRepository().deleteGift(auth.event.id, id);
  return new NextResponse(null, { status: 204 });
}
