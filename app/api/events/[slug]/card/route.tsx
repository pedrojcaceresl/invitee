import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { getEventRepository } from "@/lib/data";
import { getTemplate, defaultTemplateId } from "@/lib/templates";
import type { Template } from "@/lib/templates";
import type { Event } from "@/lib/types";

export const dynamic = "force-dynamic";

const SIZE = { width: 1080, height: 1080 };

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

function CardCentered({ event, template }: { event: Event; template: Template }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: template.backgroundColor,
        padding: "80px",
        fontFamily: "serif",
      }}
    >
      <div style={{ fontSize: 96, marginBottom: 24 }}>{template.emoji}</div>
      <div
        style={{
          fontSize: 32,
          color: template.accentColor,
          letterSpacing: 8,
          textTransform: "uppercase",
          marginBottom: 32,
          fontFamily: "sans-serif",
        }}
      >
        {event.type}
      </div>
      <div
        style={{
          fontSize: 72,
          fontWeight: 700,
          color: template.textColor,
          textAlign: "center",
          lineHeight: 1.1,
          marginBottom: 40,
        }}
      >
        {event.name}
      </div>
      {formatDate(event.date) && (
        <div style={{ fontSize: 32, color: template.accentColor, marginBottom: 12 }}>
          {formatDate(event.date)}
        </div>
      )}
      {event.location && (
        <div style={{ fontSize: 28, color: template.textColor, opacity: 0.7 }}>
          {`📍 ${event.location}`}
        </div>
      )}
      {event.message && (
        <div
          style={{
            fontSize: 26,
            color: template.textColor,
            opacity: 0.8,
            marginTop: 40,
            textAlign: "center",
            fontStyle: "italic",
            maxWidth: 700,
          }}
        >
          {`"${event.message}"`}
        </div>
      )}
    </div>
  );
}

function CardBold({ event, template }: { event: Event; template: Template }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: template.backgroundColor,
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          backgroundColor: template.accentColor,
          padding: "60px 80px",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div style={{ fontSize: 64, marginBottom: 8 }}>{template.emoji}</div>
        <div style={{ fontSize: 28, color: "white", opacity: 0.9, letterSpacing: 4 }}>
          {event.type.toUpperCase()}
        </div>
      </div>
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 80px",
        }}
      >
        <div
          style={{
            fontSize: 80,
            fontWeight: 800,
            color: template.textColor,
            lineHeight: 1.05,
            marginBottom: 40,
          }}
        >
          {event.name}
        </div>
        {formatDate(event.date) && (
          <div style={{ fontSize: 30, color: template.accentColor, marginBottom: 10 }}>
            {formatDate(event.date)}
          </div>
        )}
        {event.location && (
          <div style={{ fontSize: 26, color: template.textColor, opacity: 0.65 }}>
            {event.location}
          </div>
        )}
        {event.message && (
          <div
            style={{
              fontSize: 24,
              color: template.textColor,
              opacity: 0.75,
              marginTop: 36,
              fontStyle: "italic",
            }}
          >
            {`"${event.message}"`}
          </div>
        )}
      </div>
    </div>
  );
}

function CardMinimal({ event, template }: { event: Event; template: Template }) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: template.backgroundColor,
        padding: "80px",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ fontSize: 48 }}>{template.emoji}</div>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            fontSize: 80,
            fontWeight: 700,
            color: template.textColor,
            lineHeight: 1.1,
            marginBottom: 32,
          }}
        >
          {event.name}
        </div>
        {(formatDate(event.date) || event.location) && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "8px",
              marginBottom: event.message ? 32 : 0,
            }}
          >
            {formatDate(event.date) && (
              <div style={{ fontSize: 28, color: template.accentColor }}>
                {formatDate(event.date)}
              </div>
            )}
            {event.location && (
              <div style={{ fontSize: 24, color: template.textColor, opacity: 0.6 }}>
                {event.location}
              </div>
            )}
          </div>
        )}
        {event.message && (
          <div style={{ fontSize: 22, color: template.textColor, opacity: 0.65, fontStyle: "italic" }}>
            {`"${event.message}"`}
          </div>
        )}
      </div>
      <div
        style={{
          width: 60,
          height: 4,
          backgroundColor: template.accentColor,
          borderRadius: 2,
        }}
      />
    </div>
  );
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
  if (template.layout === "bold") {
    cardElement = <CardBold event={event} template={template} />;
  } else if (template.layout === "minimal") {
    cardElement = <CardMinimal event={event} template={template} />;
  } else {
    cardElement = <CardCentered event={event} template={template} />;
  }

  return new ImageResponse(cardElement, { ...SIZE });
}
