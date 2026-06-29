import { ImageResponse } from "next/og"
import type { NextRequest } from "next/server"
import { getEventRepository } from "@/lib/data"
import { getTemplate, defaultTemplateId } from "@/lib/templates"
import { getCardTemplate, loadFontsFor } from "@/lib/card-templates"

export const dynamic = "force-dynamic"

const SIZE = { width: 1080, height: 1080 }

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const url = new URL(req.url)
  const repo = getEventRepository()
  const event = await repo.getEventBySlug(slug)
  if (!event) return new Response("Not found", { status: 404 })

  const templateId = url.searchParams.get("template") ?? defaultTemplateId(event.type)
  const templateMeta = getTemplate(templateId)
  if (!templateMeta) return new Response("Template not found", { status: 404 })

  const entry = getCardTemplate(templateId)
  if (!entry) return new Response("Card entry not found", { status: 404 })

  const fonts = await loadFontsFor(entry.fonts)

  return new ImageResponse(entry.render(event), {
    ...SIZE,
    ...(fonts.length > 0 ? { fonts } : {}),
  })
}
