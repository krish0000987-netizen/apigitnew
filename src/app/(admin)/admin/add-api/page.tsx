import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";
import { SimpleApiBuilder } from "@/components/admin/simple-api-builder";

export const metadata = { title: "Add API" };

export default async function AddApiPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const vendors = await prisma.vendor.findMany({
    where: { enabled: true },
    select: { id: true, name: true, slug: true },
    orderBy: { name: "asc" },
  });

  const crossVendor = await prisma.vendor.findUnique({ where: { slug: "digitap" }, select: { id: true } });
  const crossProducts = crossVendor
    ? await prisma.apiProduct.findMany({
        where: { vendorId: crossVendor.id },
        select: { id: true, slug: true, displayName: true, category: true, method: true, endpointPath: true },
        orderBy: { slug: "asc" },
      })
    : [];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Add API</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Paste any third-party API — get your own white-label URL and key in seconds. Choose <b>CrossVerify</b> to add to your 142 white-label APIs. All CrossVerify APIs below are already white-labeled and testable.
        </p>
      </div>
      <SimpleApiBuilder vendors={vendors} crossProducts={crossProducts} appUrl={process.env.NEXT_PUBLIC_APP_URL || "https://api-reseller-platform.vercel.app"} />
    </div>
  );
}