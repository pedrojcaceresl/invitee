import { NextRequest, NextResponse } from "next/server";
import { getEventRepository, getStorageProvider } from "@/lib/data";

const MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function POST(
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

  let formData: FormData;
  try {
    formData = await req.formData();
  } catch {
    return NextResponse.json({ error: "FormData inválido" }, { status: 400 });
  }

  const file = formData.get("photo");
  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "Campo 'photo' requerido" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ error: "Tipo de archivo no permitido (jpg, png, webp)" }, { status: 400 });
  }

  if (file.size > MAX_SIZE_BYTES) {
    return NextResponse.json({ error: "La foto no puede superar 5 MB" }, { status: 400 });
  }

  const url = await getStorageProvider().uploadPhoto(event.id, file, file.name);
  await repo.updateEvent(event.id, { customPhotoUrl: url });

  return NextResponse.json({ url }, { status: 200 });
}
