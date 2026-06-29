import type { Event } from "@/lib/types"
import { getIllustration } from "@/lib/illustrations"
import { EVENT_LABELS, formatDate, titleFontSize } from "../_utils"

const TYPE_BACKGROUNDS: Record<string, string> = {
  birthday: "#FFF0E6",
  wedding: "#EEF2F9",
  graduation: "#EBF5EF",
  babyshower: "#FFF8E6",
  other: "#F5EEF5",
}

interface Props {
  event: Event
  accent: string
}

export function CardIlustradoLayout({ event, accent }: Props) {
  const date = formatDate(event.date)
  const Motif = getIllustration(event.type)
  const background = TYPE_BACKGROUNDS[event.type] ?? "#F5EEF5"
  const label = (EVENT_LABELS[event.type] ?? event.type).toUpperCase()
  const fs = titleFontSize(event.name)
  const hasPhoto = !!event.customPhotoUrl

  return (
    <div style={{
      width: "100%", height: "100%", display: "flex",
      flexDirection: "column",
      backgroundColor: background,
      fontFamily: "Fredoka, sans-serif",
      alignItems: "center",
      padding: "60px 80px 56px",
    }}>
      {/* Top illustration or photo */}
      <div style={{ display: "flex", marginBottom: 28 }}>
        {hasPhoto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.customPhotoUrl!}
            alt=""
            width={220}
            height={220}
            style={{ width: 220, height: 220, objectFit: "cover", borderRadius: "50%", boxShadow: `0 4px 20px ${accent}44` }}
          />
        ) : (
          <Motif color={accent} size={240} />
        )}
      </div>

      {/* Event type label */}
      <div style={{
        display: "flex",
        fontSize: 13,
        color: `${accent}99`,
        letterSpacing: 5,
        fontFamily: "Inter, sans-serif",
        fontWeight: 400,
        marginBottom: 20,
      }}>
        {label}
      </div>

      {/* Thin rule */}
      <div style={{ display: "flex", width: 56, height: 1.5, backgroundColor: `${accent}66`, marginBottom: 28 }} />

      {/* Title */}
      <div style={{
        display: "flex",
        fontSize: fs,
        fontWeight: 600,
        color: "#211D2C",
        textAlign: "center",
        lineHeight: 1.08,
        marginBottom: 28,
      }}>
        {event.name}
      </div>

      {date && (
        <div style={{
          display: "flex",
          fontSize: 22,
          color: accent,
          fontWeight: 500,
          marginBottom: 10,
        }}>
          {date}
        </div>
      )}
      {event.location && (
        <div style={{
          display: "flex",
          fontSize: 20,
          color: "#6E6A7C",
          fontFamily: "Inter, sans-serif",
          fontWeight: 400,
          marginBottom: event.message ? 14 : 0,
        }}>
          {event.location}
        </div>
      )}
      {event.message && (
        <div style={{
          display: "flex",
          fontSize: 18,
          color: "#6E6A7C",
          fontFamily: "Inter, sans-serif",
          fontStyle: "italic",
          textAlign: "center",
          lineHeight: 1.5,
          maxWidth: 680,
          marginTop: 8,
        }}>
          {`"${event.message}"`}
        </div>
      )}

      {/* Bottom: 3 dots + brand */}
      <div style={{ display: "flex", flex: 1, alignItems: "flex-end", flexDirection: "column", justifyContent: "flex-end", alignSelf: "stretch" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, width: "100%" }}>
          <div style={{ display: "flex", width: 6, height: 6, borderRadius: "50%", backgroundColor: accent }} />
          <div style={{ display: "flex", width: 8, height: 8, borderRadius: "50%", backgroundColor: accent }} />
          <div style={{ display: "flex", width: 6, height: 6, borderRadius: "50%", backgroundColor: accent }} />
        </div>
        <div style={{
          display: "flex",
          marginTop: 16,
          fontSize: 11,
          letterSpacing: 4,
          color: `${accent}66`,
          fontFamily: "Inter, sans-serif",
          fontWeight: 300,
          alignSelf: "center",
        }}>
          invitee
        </div>
      </div>
    </div>
  )
}
