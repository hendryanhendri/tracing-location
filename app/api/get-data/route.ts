import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";

export async function GET() {
  const prisma = new PrismaClient({
    datasourceUrl: process.env.PRISMA_ACCELERATE_URL
  }).$extends(withAccelerate());

  const rows = await prisma.tracking.findMany({
    orderBy: { id: "desc" }
  });

  return Response.json(rows);
}
