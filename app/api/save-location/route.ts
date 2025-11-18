import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

export async function POST(req: Request) {
  const prisma = new PrismaClient({
    datasourceUrl: process.env.PRISMA_ACCELERATE_URL
  }).$extends(withAccelerate());

  const data = await req.json();

  const record = await prisma.tracking.create({
    data: {
      device: data.device,
      userAgent: data.userAgent,
      ip: data.ip,
      gpsLat: data.gpsLat ? Number(data.gpsLat) : null,
      gpsLon: data.gpsLon ? Number(data.gpsLon) : null,
    },
  });

  return NextResponse.json({ success: true, id: record.id });
}
