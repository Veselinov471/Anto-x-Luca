import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(145deg, #2a201c 0%, #120e0c 60%, #1c1512 100%)",
          color: "#faf8f5",
          fontFamily: "Georgia, serif",
        }}
      >
        <div style={{ fontSize: 42, letterSpacing: 2 }}>Anto x Luca</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: 58, lineHeight: 1.1, maxWidth: 960 }}>
            Italian elegance for every day
          </div>
          <div style={{ fontSize: 28, opacity: 0.75 }}>Made in Italy · България / Bulgaria</div>
        </div>
      </div>
    ),
    { ...size },
  );
}
