import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    req.headers.get("x-real-ip") ||
    "unknown";

  let geo = {};

  try {
    const geoRes = await fetch(`https://ipapi.co/${ip}/json/`);
    const j = await geoRes.json();

    geo = {
      ipCity: j.city ?? null,
      ipCountry: j.country_name ?? null,
      ipLat: j.latitude ?? null,
      ipLon: j.longitude ?? null,
    };
  } catch {}

  return NextResponse.json({
    ip,
    ...geo,
  });
}
