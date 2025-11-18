import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    req.headers.get("x-real-ip") ||
    "unknown";

  let geo = {};

  try {
    const res = await fetch(`https://ipapi.co/${ip}/json/`);
    const json = await res.json();

    geo = {
      ipCity: json.city ?? null,
      ipCountry: json.country_name ?? null,
      ipLat: json.latitude ?? null,
      ipLon: json.longitude ?? null,
    };
  } catch {}

  return NextResponse.json({ ip, ...geo });
}
