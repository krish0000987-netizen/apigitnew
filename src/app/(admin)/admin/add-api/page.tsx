import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/require-admin";
import { prisma } from "@/lib/prisma";
import { AddApiPageClient } from "@/components/admin/add-api-page-client";

export const metadata = { title: "Add API — CrossVerify" };

export default async function AddApiPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  // Get CrossVerify vendor for defaults
  const crossVerify = await prisma.vendor.findUnique({
    where: { slug: "digitap" },
    select: { id: true, name: true, slug: true, sandboxEndpoint: true, liveEndpoint: true, sandboxKeyFingerprint: true, liveKeyFingerprint: true },
  });

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <AddApiPageClient initialVendor={crossVerify} />
    </div>
  );
}