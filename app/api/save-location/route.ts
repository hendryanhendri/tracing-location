import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

export async function POST(req: Request) {
  const prisma = new PrismaClient({
    datasourceUrl: process.env.PRISMA_ACCELERATE_URL,
  }).$extends(withAccelerate());

  const body = await req.json();

  const device = body.device ?? "Unknown Device";
  const deviceType = body.deviceType ?? "Unknown Type";
  const os = body.os ?? "Unknown OS";

  const existing = await prisma.tracking.findUnique({
    where: {
      device_deviceType_os: {
        device,
        deviceType,
        os,
      },
    },
  });

  if (!existing) {
    const created = await prisma.tracking.create({
      data: {
        device,
        deviceType,
        os,
        userAgent: body.userAgent ?? null,
        ip: body.ip ?? null,
        ipCity: body.ipCity ?? null,
        ipCountry: body.ipCountry ?? null,
        ipLat: body.ipLat ?? null,
        ipLon: body.ipLon ?? null,
        gpsLat: body.gpsLat ?? null,
        gpsLon: body.gpsLon ?? null,
      },
    });

    return NextResponse.json({ status: "inserted", id: created.id });
  }

  const updated = await prisma.tracking.update({
    where: {
      device_deviceType_os: {
        device,
        deviceType,
        os,
      },
    },
    data: {
      userAgent: existing.userAgent ?? body.userAgent,
      ip: existing.ip ?? body.ip,
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
