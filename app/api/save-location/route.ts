import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

export async function POST(req: Request) {
  const prisma = new PrismaClient({
    datasourceUrl: process.env.PRISMA_ACCELERATE_URL,
  }).$extends(withAccelerate());

  const body = await req.json();

  const record = await prisma.tracking.upsert({
    where: {
      ip_userAgent: {
        ip: body.ip ?? "unknown",
        userAgent: body.userAgent ?? "unknown"
      }
    },
    create: {
      device: body.device,
      userAgent: body.userAgent,
      ip: body.ip,
      ipCity: body.ipCity,
      ipCountry: body.ipCountry,
      ipLat: body.ipLat,
      ipLon: body.ipLon,
      gpsLat: body.gpsLat,
      gpsLon: body.gpsLon,
    },
    update: {
      device: body.device,
      userAgent: body.userAgent,
      ipCity: body.ipCity,
      ipCountry: body.ipCountry,
      ipLat: body.ipLat,
      ipLon: body.ipLon,
      gpsLat: body.gpsLat,
      gpsLon: body.gpsLon,
      timestamp: new Date(),
    },
  });

  return NextResponse.json({ success: true, id: record.id });
}
