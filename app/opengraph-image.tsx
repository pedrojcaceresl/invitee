import { ImageResponse } from "next/og";

export const alt = "Invitee — Invitaciones y listas de regalos";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FAFAFC",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "56px",
          }}
        >
          <div
            style={{
              width: "180px",
              height: "180px",
              borderRadius: "50%",
              background: "#D9A441",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg
              viewBox="0 0 64 64"
              fill="none"
              width="120"
              height="120"
            >
              <circle cx="32" cy="32" r="24" fill="none" stroke="white" strokeWidth="1.5" strokeOpacity="0.5" strokeDasharray="4 3" />
              <rect x="26" y="19" width="12" height="3" rx="1.5" fill="white" />
              <rect x="30.5" y="22" width="3" height="21" rx="1.5" fill="white" />
              <rect x="26" y="43" width="12" height="3" rx="1.5" fill="white" />
            </svg>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div
              style={{
                fontSize: "76px",
                fontWeight: "700",
                color: "#211D2C",
                letterSpacing: "-0.02em",
              }}
            >
              Invitee
            </div>
            <div
              style={{
                fontSize: "30px",
                color: "#6E6A7C",
                lineHeight: "1.4",
              }}
            >
              Creá tu invitación y lista de regalos
            </div>
            <div
              style={{
                fontSize: "30px",
                color: "#6E6A7C",
                lineHeight: "1.4",
              }}
            >
              en segundos.
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
