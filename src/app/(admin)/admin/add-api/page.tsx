import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/require-admin";
import { SimpleApiBuilder } from "@/components/admin/simple-api-builder";

export const metadata = { title: "Add API" };

export default async function AddApiPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Add API</h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Paste any third-party API — get your own white-label URL and key in seconds.
        </p>
      </div>
      <SimpleApiBuilder />
    </div>
  );
}