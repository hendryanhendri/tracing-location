import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

export async function POST(req: Request) {
  const prisma = new PrismaClient({
    datasourceUrl: process.env.PRISMA_ACCELERATE_URL,
  }).$extends(withAccelerate());

  const body = await req.json();

  const existing = await prisma.tracking.findUnique({
    where: {
      ip_userAgent: {
        ip: body.ip,
        userAgent: body.userAgent,
      },
    },
  });

  if (!existing) {
    const created = await prisma.tracking.create({
      data: {
        device: body.device,
        deviceType: body.deviceType,
        os: body.os,
        userAgent: body.userAgent,
        ip: body.ip,
        ipCity: body.ipCity,
        ipCountry: body.ipCountry,
        ipLat: body.ipLat,
        ipLon: body.ipLon,
        gpsLat: body.gpsLat,
        gpsLon: body.gpsLon,
      },
    });

    return NextResponse.json({ status: "inserted", id: created.id });
  }

  const updated = await prisma.tracking.update({
    where: {
      ip_userAgent: {
        ip: body.ip,
        userAgent: body.userAgent,
      },
    },
    data: {
      device: existing.device ?? body.device,
      deviceType: existing.deviceType ?? body.deviceType,
      os: existing.os ?? body.os,

      ipCity: existing.ipCity ?? body.ipCity,
      ipCountry: existing.ipCountry ?? body.ipCountry,
      ipLat: existing.ipLat ?? body.ipLat,
      ipLon: existing.ipLon ?? body.ipLon,

      gpsLat: existing.gpsLat ?? body.gpsLat,
      gpsLon: existing.gpsLon ?? body.gpsLon,

      timestamp: new Date(),
    },
  });

  return NextResponse.json({ status: "updated", id: updated.id });
}
