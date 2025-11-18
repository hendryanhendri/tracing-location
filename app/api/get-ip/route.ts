import { NextResponse } from "next/server";


export async function GET(request: Request) {
const ip =
request.headers.get("x-forwarded-for")?.split(",")[0] ||
request.headers.get("x-real-ip") ||
request.headers.get("remote_addr") ||
"Unknown";


return NextResponse.json({ ip });
}