import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { getEventRepository } from "@/lib/data";
import { getTemplate, defaultTemplateId } from "@/lib/templates";
import type { Template, TemplateStyle } from "@/lib/templates";
import {
  BirthdayMotif,
  WeddingMotif,
  GraduationMotif,
  BabyshowerMotif,
  OtherMotif,
} from "@/lib/illustrations";
import type { Event } from "@/lib/types";

export const dynamic = "force-dynamic";

const SIZE = { width: 1080, height: 1080 };

const fontCache = new Map<string, ArrayBuffer>();

type FontWeight = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900;

interface FontEntry {
  name: string;
  data: ArrayBuffer;
  weight: FontWeight;
  style: "normal";
}

async function loadFont(family: string, weight: FontWeight): Promise<ArrayBuffer | null> {
  const key = `${family}:${weight}`;
  if (fontCache.has(key)) return fontCache.get(key)!;
  try {
    const cssUrl = `https://fonts.googleapis.com/css2?family=${family.replace(/ /g, "+")}:wght@${weight}`;
    const css = await fetch(cssUrl).then((r) => r.text());
    const urlMatch = css.match(/url\((https:\/\/fonts\.gstatic\.com\/s\/[^)]+)\)/);
    if (!urlMatch) return null;
    const data = await fetch(urlMatch[1]).then((r) => r.arrayBuffer());
    fontCache.set(key, data);
    return data;
  } catch {
    return null;
  }
}

function formatDate(dateStr: string | null): string | null {
  if (!dateStr) return null;
  try {
    return new Date(dateStr).toLocaleDateString("es-AR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

const EVENT_LABELS: Record<string, string> = {
  birthday: "Cumpleaños",
  wedding: "Boda",
  graduation: "Graduación",
  babyshower: "Baby Shower",
  other: "Celebración",
};

function firstLetter(name: string): string {
  return name.charAt(0).toUpperCase();
}

function CardModerno({ event, template }: { event: Event; template: Template }) {
  const hasPhoto = !!event.customPhotoUrl;
  const blockWidth = 400;
  const date = formatDate(event.date);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        backgroundColor: template.backgroundColor,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        style={{
          width: blockWidth,
          height: "100%",
          backgroundColor: template.accentColor,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "80px 50px",
        }}
      >
        {hasPhoto && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.customPhotoUrl!}
            alt=""
            width={300}
            height={300}
            style={{
              width: 300,
              height: 300,
              objectFit: "cover",
              borderRadius: 12,
              boxShadow: "0 2px 12px rgba(0,0,0,0.25)",
            }}
          />
        )}
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px 80px 80px 60px",
        }}
      >
        <div
          style={{
            fontSize: 26,
            color: template.accentColor,
            letterSpacing: 6,
            textTransform: "uppercase",
            marginBottom: 16,
            fontWeight: 500,
          }}
        >
          {EVENT_LABELS[event.type] ?? event.type}
        </div>
        <div
          style={{
            fontSize: 76,
            fontWeight: 700,
            color: template.textColor,
            lineHeight: 1.08,
            marginBottom: 36,
            fontFamily: "'Space Grotesk', sans-serif",
          }}
        >
          {event.name}
        </div>
        {date && (
          <div style={{ fontSize: 28, color: template.accentColor, marginBottom: 8, fontWeight: 500 }}>
            {date}
          </div>
        )}
        {event.location && (
          <div style={{ fontSize: 26, color: template.textColor, opacity: 0.6, marginBottom: event.message ? 24 : 0 }}>
            {event.location}
          </div>
        )}
        {event.message && (
          <div
            style={{
              fontSize: 24,
              color: template.textColor,
              opacity: 0.7,
              fontStyle: "italic",
              marginTop: event.location || date ? 0 : 0,
              lineHeight: 1.4,
            }}
          >
            {`"${event.message}"`}
          </div>
        )}
      </div>
    </div>
  );
}

function CardElegante({ event, template }: { event: Event; template: Template }) {
  const date = formatDate(event.date);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: template.backgroundColor,
        fontFamily: "'Inter', sans-serif",
        fontWeight: 300,
      }}
    >
      <div
        style={{
          width: 880,
          height: 880,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderWidth: 2,
          borderColor: template.accentColor,
          borderStyle: "solid",
          padding: 80,
        }}
      >
        <div
          style={{
            width: 800,
            height: 800,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 1,
            borderColor: template.accentColor,
            borderStyle: "solid",
            padding: 80,
          }}
        >
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              borderWidth: 2.5,
              borderColor: template.accentColor,
              borderStyle: "solid",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 40,
              fontFamily: "'Fraunces', sans-serif",
              fontSize: 34,
              color: template.accentColor,
              fontWeight: 500,
            }}
          >
            {firstLetter(event.name)}
          </div>
          <div
            style={{
              fontSize: 15,
              color: template.accentColor,
              letterSpacing: 8,
              textTransform: "uppercase",
              marginBottom: 24,
            }}
          >
            {EVENT_LABELS[event.type] ?? event.type}
          </div>
          <div
            style={{
              fontSize: 52,
              fontWeight: 500,
              color: template.textColor,
              textAlign: "center",
              lineHeight: 1.2,
              marginBottom: 32,
              fontFamily: "'Fraunces', sans-serif",
            }}
          >
            {event.name}
          </div>
          {date && (
            <div style={{ fontSize: 24, color: template.accentColor, marginBottom: 8 }}>
              {date}
            </div>
          )}
          {event.location && (
            <div style={{ fontSize: 22, color: template.textColor, opacity: 0.55, marginBottom: event.message ? 20 : 0 }}>
              {event.location}
            </div>
          )}
          {event.message && (
            <div
              style={{
                fontSize: 22,
                color: template.textColor,
                opacity: 0.6,
                fontStyle: "italic",
                textAlign: "center",
                lineHeight: 1.5,
                marginTop: 20,
                maxWidth: 500,
              }}
            >
              {`"${event.message}"`}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function CardIlustrado({ event, template }: { event: Event; template: Template }) {
  const date = formatDate(event.date);

  const motifProps = { color: template.accentColor, size: 180 };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: template.backgroundColor,
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div style={{ display: "flex", paddingTop: 60, paddingLeft: 60 }}>
        {event.type === "birthday" && <BirthdayMotif {...motifProps} />}
        {event.type === "wedding" && <WeddingMotif {...motifProps} />}
        {event.type === "graduation" && <GraduationMotif {...motifProps} />}
        {event.type === "babyshower" && <BabyshowerMotif {...motifProps} />}
        {event.type === "other" && <OtherMotif {...motifProps} />}
      </div>
      <div
        style={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "0 120px",
        }}
      >
        <div
          style={{
            fontSize: 22,
            color: template.accentColor,
            letterSpacing: 6,
            textTransform: "uppercase",
            marginBottom: 20,
            fontWeight: 500,
          }}
        >
          {EVENT_LABELS[event.type] ?? event.type}
        </div>
        <div
          style={{
            fontSize: 72,
            fontWeight: 600,
            color: template.textColor,
            lineHeight: 1.12,
            marginBottom: 32,
            fontFamily: "'Fredoka', sans-serif",
          }}
        >
          {event.name}
        </div>
        {date && (
          <div style={{ fontSize: 28, color: template.accentColor, marginBottom: 8, fontWeight: 500 }}>
            {date}
          </div>
        )}
        {event.location && (
          <div style={{ fontSize: 26, color: template.textColor, opacity: 0.55, marginBottom: event.message ? 16 : 0 }}>
            {event.location}
          </div>
        )}
        {event.message && (
          <div
            style={{
              fontSize: 24,
              color: template.textColor,
              opacity: 0.65,
              fontStyle: "italic",
              lineHeight: 1.4,
              maxWidth: 520,
            }}
          >
            {`"${event.message}"`}
          </div>
        )}
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", paddingBottom: 60, paddingRight: 60 }}>
        <div style={{ display: "flex", transform: "rotate(180deg)" }}>
          {event.type === "birthday" && <BirthdayMotif {...motifProps} />}
          {event.type === "wedding" && <WeddingMotif {...motifProps} />}
          {event.type === "graduation" && <GraduationMotif {...motifProps} />}
          {event.type === "babyshower" && <BabyshowerMotif {...motifProps} />}
          {event.type === "other" && <OtherMotif {...motifProps} />}
        </div>
      </div>
    </div>
  );
}

async function loadFontsForStyle(style: TemplateStyle) {
  const fonts: FontEntry[] = [];

  const inter400 = await loadFont("Inter", 400);
  const inter300 = await loadFont("Inter", 300);

  if (inter400) fonts.push({ name: "Inter", data: inter400, weight: 400, style: "normal" });
  if (inter300) fonts.push({ name: "Inter", data: inter300, weight: 300, style: "normal" });

  switch (style) {
    case "moderno": {
      const sg700 = await loadFont("Space+Grotesk", 700);
      if (sg700) fonts.push({ name: "Space Grotesk", data: sg700, weight: 700, style: "normal" });
      break;
    }
    case "elegante": {
      const fr500 = await loadFont("Fraunces", 500);
      if (fr500) fonts.push({ name: "Fraunces", data: fr500, weight: 500, style: "normal" });
      break;
    }
    case "ilustrado": {
      const fd600 = await loadFont("Fredoka", 600);
      if (fd600) fonts.push({ name: "Fredoka", data: fd600, weight: 600, style: "normal" });
      break;
    }
  }

  return fonts;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const event = await getEventRepository().getEventBySlug(slug);
  if (!event) {
    return new Response("Evento no encontrado", { status: 404 });
  }

  const templateId = event.templateId || defaultTemplateId(event.type);
  const template = getTemplate(templateId) ?? getTemplate(defaultTemplateId(event.type))!;

  let cardElement: React.ReactElement;
  switch (template.style) {
    case "moderno":
      cardElement = <CardModerno event={event} template={template} />;
      break;
    case "elegante":
      cardElement = <CardElegante event={event} template={template} />;
      break;
    case "ilustrado":
    default:
      cardElement = <CardIlustrado event={event} template={template} />;
      break;
  }

  const fonts = await loadFontsForStyle(template.style);

  return new ImageResponse(cardElement, {
    ...SIZE,
    ...(fonts.length > 0 ? { fonts } : {}),
  });
}
