import type { Event } from "@/lib/types"
import { getIllustration } from "@/lib/illustrations"
import { EVENT_LABELS, formatDate, titleFontSize } from "../_utils"

interface Props {
  event: Event
  accent: string
  background: string
  text: string
}

export function CardModernoLayout({ event, accent, background, text }: Props) {
  const date = formatDate(event.date)
  const Motif = getIllustration(event.type)
  const hasPhoto = !!event.customPhotoUrl
  const fs = titleFontSize(event.name)
  const label = (EVENT_LABELS[event.type] ?? event.type).toUpperCase()

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", backgroundColor: background, fontFamily: "Inter, sans-serif" }}>
      {/* Left panel — accent block */}
      <div style={{
        width: 400,
        height: "100%",
        backgroundColor: accent,
        display: "flex",
        flexDirection: "column",
        padding: "64px 44px",
        justifyContent: "space-between",
      }}>
        {/* Event type label */}
        <div style={{ display: "flex", fontSize: 13, color: "rgba(255,255,255,0.7)", letterSpacing: 5, fontWeight: 500 }}>
          {label}
        </div>

        {/* Central: illustration or photo */}
        <div style={{ display: "flex", flex: 1, alignItems: "center", justifyContent: "center", paddingTop: 20, paddingBottom: 20 }}>
          {hasPhoto ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={event.customPhotoUrl!}
              alt=""
              width={300}
              height={300}
              style={{ width: 300, height: 300, objectFit: "cover", borderRadius: 12, boxShadow: "0 4px 24px rgba(0,0,0,0.3)" }}
            />
          ) : (
            <div style={{ display: "flex" }}>
              <Motif color="rgba(255,255,255,0.82)" size={268} />
            </div>
          )}
        </div>

        {/* Brand mark */}
        <div style={{ display: "flex", fontSize: 13, color: "rgba(255,255,255,0.3)", letterSpacing: 3, fontWeight: 300 }}>
          invitee
        </div>
      </div>

      {/* Right panel — text */}
      <div style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px 70px 80px 58px",
      }}>
        <div style={{ fontSize: fs, fontWeight: 700, color: text, lineHeight: 1.06, marginBottom: 32, fontFamily: "'Space Grotesk', sans-serif" }}>
          {event.name}
        </div>

        {date && (
          <div style={{ display: "flex", fontSize: 24, color: accent, marginBottom: 10, fontWeight: 500 }}>
            {date}
          </div>
        )}
        {event.location && (
          <div style={{ display: "flex", fontSize: 22, color: `${text}99`, marginBottom: event.message ? 18 : 0 }}>
            {event.location}
          </div>
        )}
        {event.message && (
          <div style={{ display: "flex", fontSize: 22, color: `${text}AA`, fontStyle: "italic", lineHeight: 1.45 }}>
            {`"${event.message}"`}
          </div>
        )}
      </div>
    </div>
  )
}
