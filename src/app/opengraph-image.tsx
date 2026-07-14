import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { SITE } from "@/lib/site";

export const alt = SITE.name;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const logo = await readFile(
    join(process.cwd(), "public", "logo-mark-256.png")
  );
  const logoSrc = `data:image/png;base64,${logo.toString("base64")}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#131310",
        }}
      >
        <img src={logoSrc} width={140} height={140} />
        <div
          style={{
            marginTop: 32,
            display: "flex",
            fontSize: 72,
            fontWeight: 700,
            letterSpacing: 2,
            color: "#f3f1e7",
          }}
        >
          CONTAINER ONE DEPOT
          <span style={{ color: "#ff5f1a" }}>.</span>
        </div>
        <div
          style={{
            marginTop: 16,
            display: "flex",
            fontSize: 32,
            color: "#a7a495",
          }}
        >
          {SITE.tagline}
        </div>
      </div>
    ),
    { ...size }
  );
}
