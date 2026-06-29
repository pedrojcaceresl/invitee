import type { Event } from "@/lib/types"
import { EVENT_LABELS, formatDate, titleFontSize } from "../_utils"

interface Props {
  event: Event
  accent: string
}

export function CardEleganteLayout({ event, accent }: Props) {
  const date = formatDate(event.date)
  const label = (EVENT_LABELS[event.type] ?? event.type).toUpperCase()
  const initials = event.name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
  const fs = titleFontSize(event.name)

  return (
    <div style={{
      width: "100%", height: "100%", display: "flex",
      backgroundColor: "#FAFAFC",
      fontFamily: "Fraunces, Georgia, serif",
      padding: 48,
    }}>
      {/* Outer frame */}
      <div style={{
        flex: 1,
        display: "flex",
        border: `1.5px solid ${accent}`,
        padding: 40,
      }}>
        {/* Inner frame */}
        <div style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          border: `0.5px solid ${accent}44`,
          padding: "60px 80px",
          gap: 0,
        }}>
          {/* Event label */}
          <div style={{
            display: "flex",
            fontSize: 11,
            letterSpacing: 6,
            color: `${accent}99`,
            fontFamily: "Inter, sans-serif",
            fontWeight: 400,
            marginBottom: 40,
          }}>
            {label}
          </div>

          {/* Monogram circle */}
          <div style={{
            display: "flex",
            width: 80,
            height: 80,
            borderRadius: "50%",
            backgroundColor: accent,
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 36,
          }}>
            <div style={{ display: "flex", fontSize: 28, color: "#FFFFFF", fontWeight: 500, letterSpacing: 2 }}>
              {initials}
            </div>
          </div>

          {/* Thin divider */}
          <div style={{ display: "flex", width: 48, height: 1, backgroundColor: accent, marginBottom: 36 }} />

          {/* Title */}
          <div style={{
            display: "flex",
            fontSize: fs,
            fontWeight: 500,
            color: "#211D2C",
            textAlign: "center",
            lineHeight: 1.1,
            marginBottom: 32,
          }}>
            {event.name}
          </div>

          {/* Divider again */}
          <div style={{ display: "flex", width: 48, height: 1, backgroundColor: `${accent}55`, marginBottom: 32 }} />

          {date && (
            <div style={{
              display: "flex",
              fontSize: 18,
              color: accent,
              letterSpacing: 1,
              fontFamily: "Inter, sans-serif",
              fontWeight: 400,
              marginBottom: 12,
            }}>
              {date}
            </div>
          )}
          {event.location && (
            <div style={{
              display: "flex",
              fontSize: 17,
              color: "#6E6A7C",
              fontFamily: "Inter, sans-serif",
              marginBottom: event.message ? 20 : 0,
            }}>
              {event.location}
            </div>
          )}
          {event.message && (
            <div style={{
              display: "flex",
              fontSize: 16,
              color: "#6E6A7C",
              fontStyle: "italic",
              fontFamily: "Inter, sans-serif",
              textAlign: "center",
              lineHeight: 1.5,
              marginTop: 8,
              maxWidth: 500,
            }}>
              {`"${event.message}"`}
            </div>
          )}

          {/* Brand mark */}
          <div style={{
            display: "flex",
            marginTop: "auto",
            paddingTop: 48,
            fontSize: 11,
            letterSpacing: 4,
            color: "#6E6A7C55",
            fontFamily: "Inter, sans-serif",
            fontWeight: 300,
          }}>
            invitee
          </div>
        </div>
      </div>
    </div>
  )
}
