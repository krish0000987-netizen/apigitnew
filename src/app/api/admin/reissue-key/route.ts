import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";
import { generateApiKey } from "@/lib/api-keys";
import { logAudit } from "@/lib/audit";

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { customerId } = await req.json();
  if (!customerId) return NextResponse.json({ error: "customerId required" }, { status: 400 });
  const customer = await prisma.customer.findUnique({ where: { id: customerId }, select: { id: true, email: true, mode: true } });
  if (!customer) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const mode = customer.mode === "live" ? "live" : "sandbox";
  const { apiKey, hash, lookup, masked } = await generateApiKey(mode);
  await prisma.customer.update({ where: { id: customerId }, data: { apiKeyHash: hash, apiKeyLookup: lookup, apiKeyPrefix: masked, apiKeyRevoked: false } });
  await logAudit({ actorId: session.user.id, action: "customer.key.reissued", entity: "customer", entityId: customerId, details: `email=${customer.email}` });
  return NextResponse.json({ apiKey, masked, email: customer.email, mode });
}
