import { NextResponse } from "next/server";

export async function GET(request: Request) {
  let ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    request.headers.get("remote_addr") ||
    null;

  if (!ip || ip === "::1" || ip === "127.0.0.1") {
    ip = "8.8.8.8";
  }

  try {
    const geo = await fetch(`https://ipapi.co/${ip}/json/`).then((r) =>
      r.json()
    );

    return NextResponse.json({
      ip,
      ipCity: geo.city ?? null,
      ipCountry: geo.country_name ?? null,
      ipLat: geo.latitude ?? null,
      ipLon: geo.longitude ?? null,
    });
  } catch {
    return NextResponse.json({
      ip,
      ipCity: null,
      ipCountry: null,
      ipLat: null,
      ipLon: null,
    });
  }
}
