import { ImageResponse } from "next/og"

import { SITE_CONFIG } from "@/lib/constants"

export const size = {
  width: 1200,
  height: 630,
}

export const contentType = "image/png"

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px",
          background:
            "radial-gradient(circle at 80% 20%, rgba(224,184,90,0.3), transparent 44%), linear-gradient(145deg, #5B0E2D, #1A1216)",
          color: "#F6EFE7",
          fontFamily: "Inter, Arial, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 24,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            opacity: 0.9,
          }}
        >
          Nurse Prism
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div
            style={{
              fontSize: 64,
              lineHeight: 1.08,
              fontWeight: 700,
              maxWidth: "90%",
            }}
          >
            Illuminate Your Global Nursing Career
          </div>
          <div style={{ fontSize: 28, opacity: 0.9 }}>
            Premium Gulf Career Coaching Platform
          </div>
        </div>
        <div style={{ fontSize: 22, opacity: 0.84 }}>{SITE_CONFIG.email}</div>
      </div>
    ),
    size
  )
}
