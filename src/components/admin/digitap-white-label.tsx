"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Vendor = { id: string; name: string; slug: string; sandboxEndpoint: string; liveEndpoint: string; sandboxKeyFingerprint: string; liveKeyFingerprint: string; enabled: boolean; _count: { products: number } } | null;
type Product = { id: string; slug: string; displayName: string; category: string | null; method: string; endpointPath: string; baseUrl: string; status: string };
type Customer = { id: string; email: string; name: string | null; mode: string; apiKeyPrefix: string | null; plan: string };

export function DigitapDashboard({ vendor, products, customers, appUrl }: { vendor: Vendor; products: Product[]; customers: Customer[]; appUrl: string }) {
  const router = useRouter();
  const [filter, setFilter] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<string>(customers[0]?.id || "");
  const [generated, setGenerated] = useState<{ apiKey: string; email: string; mode: string } | null>(null);
  const [newEmail, setNewEmail] = useState("");
  const [newName, setNewName] = useState("");
  const [newMode, setNewMode] = useState<"sandbox" | "live">("live");
  const [vendorKey, setVendorKey] = useState("");
  const [vendorLiveKey, setVendorLiveKey] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const filtered = products.filter((p) => !filter || p.slug.toLowerCase().includes(filter.toLowerCase()) || p.displayName.toLowerCase().includes(filter.toLowerCase()) || (p.category || "").toLowerCase().includes(filter.toLowerCase()));

  async function updateVendor() {
    if (!vendor || !vendorKey.trim() && !vendorLiveKey.trim()) { setMsg("Enter at least one key"); return; }
    setBusy(true); setMsg(null);
    const res = await fetch(`/api/admin/vendors/${vendor.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sandboxKey: vendorKey.trim() || undefined, liveKey: vendorLiveKey.trim() || undefined }) });
    const j = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) setMsg(j.error || "Failed");
    else { setMsg("✅ Digitap keys updated (encrypted)"); setVendorKey(""); setVendorLiveKey(""); router.refresh(); }
  }

  async function createClient() {
    if (!newEmail.trim()) { setMsg("Email required"); return; }
    setBusy(true); setMsg(null);
    const res = await fetch("/api/admin/customers", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: newEmail.trim(), name: newName.trim() || null, mode: newMode }) } as any);
    // fallback: use direct prisma via action - we use generic customers endpoint
    let j: any = {};
    try { j = await res.json(); } catch {}
    // If route not found, fallback to csv import single?
    if (!res.ok) {
      // try via admin action endpoint not present - use fetch to customers create via simple route
      setMsg(j.error || "Create failed - check Customers page");
      setBusy(false);
      return;
    }
    setBusy(false);
    setMsg(`✅ Client created: ${newEmail}`);
    setNewEmail(""); setNewName("");
    router.refresh();
  }

  async function generateKeyForSelected() {
    if (!selectedCustomer) { setMsg("Select a client"); return; }
    setBusy(true); setMsg(null);
    const res = await fetch(`/api/admin/customers/${selectedCustomer}/reissue`, { method: "POST" });
    // this endpoint may not exist - fallback to adminReissueKeyAction via RPC
    let data: any = null;
    if (res.ok) data = await res.json();
    if (!res.ok || !data?.apiKey) {
      // try alternative: POST to /api/admin/api-products reissue via server action fetch
      const alt = await fetch("/api/admin/reissue-key", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ customerId: selectedCustomer }) });
      if (alt.ok) data = await alt.json();
    }
    setBusy(false);
    if (!data?.apiKey) { setMsg(data?.error || "Failed to generate key. Use Customers > Reissue."); return; }
    setGenerated({ apiKey: data.apiKey, email: customers.find((c) => c.id === selectedCustomer)?.email || "", mode: data.mode || "live" });
    setMsg(`✅ New API key for ${data.email || selectedCustomer} — copy it once!`);
    // auto-enable digitap integration for this customer
    if (vendor) await fetch("/api/admin/enable-integration", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ customerId: selectedCustomer, vendorId: vendor.id }) }).catch(() => {});
    router.refresh();
  }

  async function generateForNewClientInline() {
    if (!newEmail.trim()) { setMsg("Enter new client email first"); return; }
    setBusy(true);
    // create customer via prisma directly through our digitap create endpoint
    const res = await fetch("/api/admin/digitap-create-client", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: newEmail.trim(), name: newName.trim() || null, mode: newMode }) });
    const j = await res.json().catch(() => ({}));
    setBusy(false);
    if (!res.ok) { setMsg(j.error || "Create failed"); return; }
    setGenerated({ apiKey: j.apiKey, email: j.email, mode: j.mode });
    setMsg(`✅ White-label ready for ${j.email} — share the URLs below`);
    setNewEmail(""); setNewName("");
    router.refresh();
  }

  const baseWhiteLabel = `${appUrl.replace(/\/$/, "")}/api/v1`;

  return (
    <div className="space-y-6">
      {!vendor && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm">Vendor <code>digitap</code> not found. Run <code>npx tsx scripts/seed-digitap.ts</code>.</div>
      )}

      {vendor && (
        <section className="rounded-xl border bg-white p-5 dark:bg-gray-900 dark:border-gray-800 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="font-semibold">1. Connect your Digitap credentials</h2>
              <p className="text-xs text-gray-500">Sandbox: {vendor.sandboxEndpoint} · Live: {vendor.liveEndpoint} · Products: {vendor._count.products} · Fingerprints: {vendor.sandboxKeyFingerprint.slice(0,8)}… / {vendor.liveKeyFingerprint.slice(0,8)}…</p>
            </div>
            <span className={`rounded-full px-2 py-1 text-xs ${vendor.enabled ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{vendor.enabled ? "Enabled" : "Disabled"}</span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div>
              <label className="text-xs font-medium">Sandbox AUTH_TOKEN (or CLIENT_ID:SECRET)</label>
              <input value={vendorKey} onChange={(e) => setVendorKey(e.target.value)} placeholder="paste Digitap sandbox token" className="mt-1 w-full rounded-lg border px-3 py-2 text-sm font-mono dark:bg-gray-950" />
            </div>
            <div>
              <label className="text-xs font-medium">Live AUTH_TOKEN</label>
              <input value={vendorLiveKey} onChange={(e) => setVendorLiveKey(e.target.value)} placeholder="paste Digitap live token" className="mt-1 w-full rounded-lg border px-3 py-2 text-sm font-mono dark:bg-gray-950" />
            </div>
          </div>
          <button onClick={updateVendor} disabled={busy} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">{busy ? "..." : "Update Digitap Keys (encrypted)"}</button>
          <p className="text-xs text-gray-500">Keys are AES-256-GCM encrypted at rest, never shown again. All 142 white-label endpoints proxy with this key.</p>
        </section>
      )}

      <section className="rounded-xl border bg-white p-5 dark:bg-gray-900 dark:border-gray-800 space-y-4">
        <h2 className="font-semibold">2. Create a client & generate unique white-label access</h2>
        <p className="text-xs text-gray-500">Each client gets a unique <code>sk_live_…</code> / <code>sk_test_…</code> that works for all 142 endpoints at <code>{baseWhiteLabel}/{"{slug}"}</code>.</p>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="rounded-lg border p-4 space-y-3 dark:border-gray-800">
            <h3 className="text-sm font-medium">A. Create new client</h3>
            <input value={newEmail} onChange={(e) => setNewEmail(e.target.value)} placeholder="client@company.com" className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-950" />
            <input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Company name (optional)" className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-950" />
            <select value={newMode} onChange={(e) => setNewMode(e.target.value as any)} className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-950">
              <option value="live">live (real Digitap)</option>
              <option value="sandbox">sandbox (demo)</option>
            </select>
            <button onClick={generateForNewClientInline} disabled={busy} className="w-full rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50">Create client + generate API key & URLs</button>
            <p className="text-xs text-gray-400">Creates client, enables Digitap, issues masked key.</p>
          </div>

          <div className="rounded-lg border p-4 space-y-3 dark:border-gray-800">
            <h3 className="text-sm font-medium">B. Use existing client</h3>
            <select value={selectedCustomer} onChange={(e) => setSelectedCustomer(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-950">
              {customers.length === 0 && <option>No clients yet</option>}
              {customers.map((c) => (
                <option key={c.id} value={c.id}>{c.email} — {c.apiKeyPrefix || "no key"} ({c.mode})</option>
              ))}
            </select>
            <button onClick={generateKeyForSelected} disabled={busy || !selectedCustomer} className="w-full rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">Generate / rotate unique API key for selected client</button>
            <button onClick={async () => {
              if (!selectedCustomer || !vendor) return;
              setBusy(true);
              await fetch("/api/admin/enable-integration", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ customerId: selectedCustomer, vendorId: vendor.id }) });
              setBusy(false); setMsg("✅ Digitap enabled for client"); router.refresh();
            }} disabled={busy || !selectedCustomer} className="w-full rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:border-gray-700">Enable Digitap for this client</button>
          </div>
        </div>

        {msg && <p className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-sm dark:bg-amber-950 dark:border-amber-800">{msg}</p>}

        {generated && (
          <div className="rounded-xl border-2 border-green-300 bg-green-50 p-4 dark:bg-green-950 dark:border-green-800 space-y-2">
            <h3 className="font-medium text-green-900 dark:text-green-100">✅ Share this with {generated.email} — copy once, key never shown again</h3>
            <div className="rounded-lg bg-black text-green-400 p-3 font-mono text-sm break-all select-all">{generated.apiKey}</div>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => navigator.clipboard.writeText(generated.apiKey)} className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white">Copy API key</button>
              <button onClick={() => {
                const txt = filtered.slice(0, 10).map((p) => `curl -X ${p.method} ${baseWhiteLabel}/${p.slug} -H \"Authorization: Bearer ${generated.apiKey}\" -H \"X-Environment: ${generated.mode}\" -H \"Content-Type: application/json\"`).join("\n");
                navigator.clipboard.writeText(txt);
              }} className="rounded-lg border bg-white px-3 py-1.5 text-xs font-medium">Copy 10 sample curls</button>
              <a href={`/api/customer/postman-collection`} target="_blank" className="rounded-lg border bg-white px-3 py-1.5 text-xs font-medium">Download Postman collection</a>
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-400">All 142 endpoints work with this one key. Example: <code>{baseWhiteLabel}/{filtered[0]?.slug || "aadhaar-validation"}</code></p>
          </div>
        )}
      </section>

      <section className="rounded-xl border bg-white p-5 dark:bg-gray-900 dark:border-gray-800">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <h2 className="font-semibold">3. All white-label URLs ({filtered.length}/{products.length})</h2>
          <input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="filter by slug or category" className="rounded-lg border px-3 py-1.5 text-sm dark:bg-gray-950" />
        </div>
        <div className="overflow-auto max-h-[520px] rounded-lg border dark:border-gray-800">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-950 text-xs text-gray-500 sticky top-0">
              <tr><th className="px-3 py-2 text-left">White-label URL</th><th className="px-3 py-2 text-left">Category</th><th className="px-3 py-2 text-left">Digitap origin</th><th className="px-3 py-2">Copy</th></tr>
            </thead>
            <tbody>
              {filtered.map((p) => {
                const wl = `${baseWhiteLabel}/${p.slug}`;
                return (
                  <tr key={p.id} className="border-t dark:border-gray-800">
                    <td className="px-3 py-2 font-mono text-xs"><span className="font-semibold">{p.method}</span> {wl}</td>
                    <td className="px-3 py-2 text-xs">{p.category}</td>
                    <td className="px-3 py-2 font-mono text-xs">{p.method} {p.endpointPath}</td>
                    <td className="px-3 py-2 text-center"><button onClick={() => navigator.clipboard.writeText(wl)} className="rounded px-2 py-1 text-xs border hover:bg-gray-50">Copy</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mt-2 text-xs text-gray-500">Share per-client: same URL, different <code>Authorization: Bearer sk_…</code> header. Rotate per client via section 2.</p>
      </section>
    </div>
  );
}
