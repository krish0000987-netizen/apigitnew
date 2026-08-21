import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";
import { DigitapDashboard } from "@/components/admin/digitap-white-label";

export const metadata = { title: "CrossVerify White-Label" };

export default async function CrossVerifyPage({ searchParams }: { searchParams: Promise<{ filter?: string; test?: string; key?: string }> }) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  const sp = await searchParams;

  const vendor = await prisma.vendor.findUnique({
    where: { slug: "digitap" },
    select: { id: true, name: true, slug: true, sandboxEndpoint: true, liveEndpoint: true, sandboxKeyFingerprint: true, liveKeyFingerprint: true, enabled: true, _count: { select: { products: true } } },
  });

  const products = vendor
    ? await prisma.apiProduct.findMany({
        where: { vendorId: vendor.id },
        select: { id: true, slug: true, displayName: true, category: true, method: true, endpointPath: true, baseUrl: true, status: true },
        orderBy: { slug: "asc" },
      })
    : [];

  const customers = await prisma.customer.findMany({
    select: { id: true, email: true, name: true, mode: true, apiKeyPrefix: true, plan: true },
    orderBy: { createdAt: "desc" },
    take: 200,
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">CrossVerify White-Label Dashboard</h1>
        <p className="mt-1 text-sm text-gray-500">
          All 142 CrossVerify (Digitap) APIs are whitelabeled at <code>/api/v1/{"{slug}"}</code>. Create a client, generate a unique API key + URL, and share it. One key works for all 142 endpoints. Connected to <b>Add API</b> — new APIs added there appear here.
        </p>
      </div>
      <DigitapDashboard vendor={vendor} products={products} customers={customers} appUrl={process.env.NEXT_PUBLIC_APP_URL || "https://api-reseller-platform.vercel.app"} initialFilter={sp.filter || ""} initialTestSlug={sp.test || ""} initialTestKey={sp.key || ""} />
    </div>
  );
}
