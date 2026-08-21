import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { customerId, vendorId } = await req.json();
  if (!customerId || !vendorId) return NextResponse.json({ error: "customerId and vendorId required" }, { status: 400 });
  await prisma.customerIntegration.upsert({
    where: { customerId_vendorId: { customerId, vendorId } },
    update: { enabled: true },
    create: { customerId, vendorId, enabled: true, position: 0 },
  });
  return NextResponse.json({ ok: true });
}
