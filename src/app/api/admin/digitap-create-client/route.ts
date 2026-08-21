import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getAdminSession } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";
import { generateApiKey } from "@/lib/api-keys";

export async function POST(req: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { email, name, mode } = await req.json();
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return NextResponse.json({ error: "Valid email required" }, { status: 400 });
  const m = mode === "live" ? "live" : "sandbox";
  const existing = await prisma.customer.findUnique({ where: { email: email.toLowerCase() } });
  if (existing) return NextResponse.json({ error: "Client already exists" }, { status: 409 });
  const password = Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 6);
  const { apiKey, hash, lookup, masked } = await generateApiKey(m);
  const customer = await prisma.customer.create({
    data: {
      email: email.toLowerCase(),
      name: name || null,
      passwordHash: await bcrypt.hash(password, 10),
      apiKeyHash: hash,
      apiKeyLookup: lookup,
      apiKeyPrefix: masked,
      mode: m,
      plan: "free",
    },
    select: { id: true, email: true },
  });
  // enable digitap vendor
  const vendor = await prisma.vendor.findUnique({ where: { slug: "digitap" }, select: { id: true } });
  if (vendor) {
    await prisma.customerIntegration.upsert({
      where: { customerId_vendorId: { customerId: customer.id, vendorId: vendor.id } },
      update: { enabled: true },
      create: { customerId: customer.id, vendorId: vendor.id, enabled: true, position: 0 },
    });
  }
  return NextResponse.json({ id: customer.id, email: customer.email, apiKey, masked, mode: m, tempPassword: password });
}
