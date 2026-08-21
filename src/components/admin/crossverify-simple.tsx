"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Vendor = { id: string; name: string; slug: string; enabled: boolean; _count: { products: number } } | null;
type Product = { id: string; slug: string; displayName: string; category: string | null; method: string; description: string | null; fields: Array<{ variable: string; name: string; example: string | null }>; endpointPath: string };
type Customer = { id: string; email: string; name: string | null; mode: string; apiKeyPrefix: string | null };

export function CrossVerifySimple({ vendor, products, customers, appUrl }: { vendor: Vendor; products: Product[]; customers: Customer[]; appUrl: string }) {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [selected, setSelected] = useState<string | null>(null);
  const [clientEmail, setClientEmail] = useState("");
  const [clientName, setClientName] = useState("");
  const [clientMode, setClientMode] = useState<"sandbox" | "live">("live");
  const [activeKey, setActiveKey] = useState<{ key: string; email: string; mode: string } | null>(null);
  const [existingId, setExistingId] = useState(customers[0]?.id || "");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // tester
  const [vals, setVals] = useState<Record<string, string>>({});
  const [raw, setRaw] = useState("");
  const [useRaw, setUseRaw] = useState(false);
  const [resp, setResp] = useState<{ status: number; headers: string; body: unknown; raw: string; ok: boolean; reqId: string } | null>(null);
  const [tab, setTab] = useState<"normal" | "json">("normal");
  const [testing, setTesting] = useState(false);

  const filtered = products.filter((p) => !q || `${p.displayName} ${p.slug} ${p.category} ${p.description || ""}`.toLowerCase().includes(q.toLowerCase()));
  const cur = selected ? products.find((p) => p.slug === selected) : null;
  const wlUrl = cur ? `${appUrl.replace(/\/$/, "")}/api/v1/${cur.slug}` : "";

  async function createClient() {
    if (!clientEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clientEmail)) { setMsg("Enter a valid client email"); return; }
    setBusy(true); setMsg(null);
    const r = await fetch("/api/admin/digitap-create-client", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: clientEmail.trim(), name: clientName.trim() || null, mode: clientMode }) });
    const j = await r.json().catch(() => ({}));
    setBusy(false);
    if (!r.ok) { setMsg(j.error || "Failed to create"); return; }
    setActiveKey({ key: j.apiKey, email: j.email, mode: j.mode });
    setMsg(`✅ Created ${j.email}`);
    if (cur) setVals(Object.fromEntries(cur.fields.map((f) => [f.variable, f.example || ""])));
    router.refresh();
  }

  async function genForExisting() {
    if (!existingId) { setMsg("Pick a client"); return; }
    setBusy(true); setMsg(null);
    const r = await fetch("/api/admin/reissue-key", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ customerId: existingId }) });
    const j = await r.json().catch(() => ({}));
    setBusy(false);
    if (!r.ok || !j.apiKey) { setMsg(j.error || "Failed"); return; }
    setActiveKey({ key: j.apiKey, email: j.email, mode: j.mode });
    setMsg(`✅ New key for ${j.email}`);
    if (vendor) await fetch("/api/admin/enable-integration", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ customerId: existingId, vendorId: vendor.id }) }).catch(() => {});
    router.refresh();
  }

  function pick(slug: string) {
    const p = products.find((x) => x.slug === slug);
    if (!p) return;
    setSelected(slug);
    setVals(Object.fromEntries(p.fields.map((f) => [f.variable, f.example || ""])));
    setRaw(p.fields.length ? JSON.stringify(Object.fromEntries(p.fields.map((f) => [f.variable, f.example || ""])), null, 2) : '{\n  "key": "value"\n}');
    setUseRaw(p.fields.length === 0);
    setResp(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function runTest() {
    if (!cur) return;
    const key = activeKey?.key?.trim();
    if (!key) { setMsg("First create or pick a client to get a CrossVerify white-label key"); return; }
    let body: unknown = undefined;
    let rawText = "";
    if (useRaw || cur.fields.length === 0) {
      try { body = raw.trim() ? JSON.parse(raw) : {}; rawText = raw.trim() || "{}"; } catch { setMsg("Fix JSON first"); return; }
    } else {
      const obj: Record<string, string> = {};
      for (const f of cur.fields) {
        const v = (vals[f.variable] || "").trim();
        if (!v) { setMsg(`Fill ${f.name}`); return; }
        obj[f.variable] = v;
      }
      body = obj; rawText = JSON.stringify(obj);
    }
    setTesting(true); setResp(null); setMsg(null);
    try {
      const res = await fetch(wlUrl, { method: cur.method, headers: { "Content-Type": "application/json", Authorization: `Bearer ${key}`, "X-Environment": activeKey?.mode || "live" }, body: cur.method === "GET" ? undefined : rawText });
      const text = await res.text();
      let parsed: unknown = text;
      try { parsed = text ? JSON.parse(text) : null; } catch {}
      const hdrs = Array.from(res.headers.entries()).map(([k, v]) => `${k}: ${v}`).join("\n");
      setResp({ status: res.status, headers: hdrs, body: parsed, raw: text, ok: res.status >= 200 && res.status < 300, reqId: res.headers.get("x-request-id") || "" });
      setTab("normal");
    } catch (e: any) {
      setResp({ status: 0, headers: "", body: e.message, raw: String(e), ok: false, reqId: "" });
    } finally { setTesting(false); }
  }

  return (
    <div className="space-y-6">
      {/* STEP 1 */}
      <div className="rounded-2xl border bg-white p-6 dark:bg-gray-900 dark:border-gray-800">
        <h2 className="text-lg font-bold">Step 1 — Create a client (get a CrossVerify white-label key)</h2>
        <p className="text-sm text-gray-500">Each client gets ONE key that works for ALL 142 APIs. Share the key + URL — client uses YOUR branding.</p>
        <div className="mt-4 grid gap-6 lg:grid-cols-2">
          <div className="rounded-xl border p-4 dark:border-gray-700 space-y-3">
            <h3 className="font-medium">New client</h3>
            <input value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} placeholder="client@email.com" className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-950" />
            <input value={clientName} onChange={(e) => setClientName(e.target.value)} placeholder="Company name (optional)" className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-950" />
            <select value={clientMode} onChange={(e) => setClientMode(e.target.value as any)} className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-950"><option value="live">Live — real CrossVerify</option><option value="sandbox">Sandbox — demo (fake data)</option></select>
            <button onClick={createClient} disabled={busy} className="w-full rounded-lg bg-green-600 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50">{busy ? "..." : "Create client + Generate CrossVerify Key"}</button>
          </div>
          <div className="rounded-xl border p-4 dark:border-gray-700 space-y-3">
            <h3 className="font-medium">Existing client</h3>
            <select value={existingId} onChange={(e) => setExistingId(e.target.value)} className="w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-950">
              {customers.length === 0 ? <option>No clients</option> : customers.map((c) => <option key={c.id} value={c.id}>{c.email} — {c.apiKeyPrefix || "no key"} ({c.mode})</option>)}
            </select>
            <button onClick={genForExisting} disabled={busy || !existingId} className="w-full rounded-lg bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">Generate CrossVerify Key for this client</button>
            <p className="text-xs text-gray-400">Shows once. Key is CrossVerify-branded white-label.</p>
          </div>
        </div>
        {msg && <p className="mt-3 rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-sm dark:bg-amber-950">{msg}</p>}
        {activeKey && (
          <div className="mt-4 rounded-xl border-2 border-green-300 bg-green-50 p-4 dark:bg-green-950 space-y-2">
            <p className="font-medium text-green-800 dark:text-green-200">✅ CrossVerify White-Label Key for {activeKey.email} — give this to your client</p>
            <div className="rounded-lg bg-black p-3 font-mono text-sm text-green-400 break-all select-all">{activeKey.key}</div>
            <div className="flex flex-wrap gap-2"><button onClick={() => navigator.clipboard.writeText(activeKey.key)} className="rounded-lg bg-green-600 px-3 py-1.5 text-xs font-medium text-white">Copy Key</button><span className="text-xs text-gray-500 self-center">Mode: {activeKey.mode} · Works for all 142 APIs</span></div>
          </div>
        )}
      </div>

      {/* TESTER */}
      <div className="rounded-2xl border bg-white p-6 dark:bg-gray-900 dark:border-gray-800">
        <h2 className="text-lg font-bold">Step 2 — Click any API to get its white-label URL + test</h2>
        <p className="text-sm text-gray-500">Tap an API below → see its CrossVerify white-label URL + your client key → Test with one click. Output shows both Normal and JSON.</p>
        {cur && (
          <div className="mt-4 rounded-xl border bg-gray-50 p-4 dark:bg-gray-950 dark:border-gray-700 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div><span className="rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">{cur.method}</span> <span className="font-medium">{cur.displayName}</span> <span className="text-xs text-gray-500">— {cur.category}{cur.description ? ` · ${cur.description.slice(0, 90)}` : ""}</span></div>
              <button onClick={() => setSelected(null)} className="text-xs text-gray-500 hover:underline">Close</button>
            </div>
            <div className="rounded-lg bg-white border p-3 dark:bg-gray-900 space-y-1">
              <div className="text-xs font-medium">White-label URL (share this)</div>
              <div className="flex gap-2"><code className="flex-1 rounded bg-gray-100 px-3 py-2 font-mono text-sm break-all dark:bg-gray-800">{wlUrl}</code><button onClick={() => navigator.clipboard.writeText(wlUrl)} className="rounded border px-3 py-2 text-xs">Copy URL</button></div>
              <div className="text-xs font-medium mt-2">CrossVerify White-Label Key (share this)</div>
              <div className="flex gap-2"><code className="flex-1 rounded bg-black px-3 py-2 font-mono text-sm text-green-400 break-all">{activeKey ? activeKey.key : "(generate a key in Step 1 first)"}</code><button disabled={!activeKey} onClick={() => activeKey && navigator.clipboard.writeText(activeKey.key)} className="rounded border px-3 py-2 text-xs disabled:opacity-50">Copy Key</button></div>
              <p className="text-xs text-gray-500">Client sends: <code>Authorization: Bearer sk_...</code> + <code>X-Environment: {activeKey?.mode || "live"}</code> to <code>{wlUrl}</code></p>
            </div>

            <div>
              <div className="flex items-center justify-between"><label className="text-sm font-medium">Test data {cur.fields.length ? `— ${cur.fields.length} field(s)` : "(JSON)"}</label>{cur.fields.length > 0 && <button onClick={() => setUseRaw((v) => !v)} className="text-xs text-blue-600">{useRaw ? "Use simple fields" : "Use raw JSON"}</button>}</div>
              {useRaw || cur.fields.length === 0 ? (
                <textarea value={raw} onChange={(e) => setRaw(e.target.value)} rows={5} className="mt-1 w-full rounded-lg border px-3 py-2 font-mono text-sm dark:bg-gray-900" placeholder={'{\n  "key": "value"\n}'} />
              ) : (
                <div className="mt-2 grid gap-3 sm:grid-cols-2">
                  {cur.fields.map((f) => (
                    <div key={f.variable}><label className="text-xs font-medium">{f.name} <span className="text-red-500">*</span></label><input value={vals[f.variable] || ""} onChange={(e) => setVals((v) => ({ ...v, [f.variable]: e.target.value }))} placeholder={f.example || ""} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-900" /></div>
                  ))}
                </div>
              )}
              <button onClick={runTest} disabled={testing || !activeKey} className="mt-3 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">{testing ? "Testing..." : `Test ${cur.displayName}`}</button>
              {!activeKey && <p className="mt-1 text-xs text-red-500">Generate a CrossVerify key in Step 1 first</p>}
            </div>

            {resp && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${resp.ok ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>HTTP {resp.status} {resp.ok ? "Success" : "Failed"}</span>
                  {resp.reqId && <span className="text-xs text-gray-400">ID: {resp.reqId.slice(0, 12)}</span>}
                  <div className="ml-auto flex rounded-lg border overflow-hidden">
                    <button onClick={() => setTab("normal")} className={`px-3 py-1 text-xs font-medium ${tab === "normal" ? "bg-blue-600 text-white" : "bg-white"}`}>Normal</button>
                    <button onClick={() => setTab("json")} className={`px-3 py-1 text-xs font-medium ${tab === "json" ? "bg-blue-600 text-white" : "bg-white"}`}>JSON</button>
                  </div>
                </div>
                {tab === "normal" ? <NormalView body={resp.body} ok={resp.ok} /> : <pre className="max-h-80 overflow-auto rounded-lg bg-gray-900 p-4 font-mono text-xs text-gray-100 whitespace-pre-wrap">{resp.raw || "(empty)"}</pre>}
                <details className="rounded-lg bg-gray-100 p-3 dark:bg-gray-800"><summary className="text-xs font-medium cursor-pointer">Headers</summary><pre className="mt-1 text-xs whitespace-pre-wrap">{resp.headers || "(none)"}</pre></details>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ALL APIS */}
      <div className="rounded-2xl border bg-white p-6 dark:bg-gray-900 dark:border-gray-800">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold">All APIs ({filtered.length}/{products.length}) — tap to get white-label</h2>
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name, use, category" className="rounded-lg border px-3 py-2 text-sm w-64 dark:bg-gray-950" />
        </div>
        <p className="text-sm text-gray-500">Each API has its real name + what it does. Tap any card → white-label URL + CrossVerify key + test.</p>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <button key={p.id} onClick={() => pick(p.slug)} className={`text-left rounded-xl border p-4 hover:border-blue-300 hover:bg-blue-50 dark:hover:bg-blue-950 transition ${selected === p.slug ? "border-blue-500 bg-blue-50 dark:bg-blue-950" : "bg-white dark:bg-gray-900"}`}>
              <div className="flex items-center gap-2"><span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-medium dark:bg-gray-800">{p.method}</span><span className="text-xs text-gray-500 truncate">{p.category}</span></div>
              <div className="mt-1 font-medium text-sm leading-tight">{p.displayName}</div>
              <div className="text-xs text-gray-500 line-clamp-2">{p.description || `Use for ${p.displayName.toLowerCase()}`}</div>
              <div className="mt-2 font-mono text-xs text-blue-600 truncate">/api/v1/{p.slug}</div>
              <div className="mt-1 text-xs font-medium text-blue-600">Tap to get URL + Key →</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function NormalView({ body, ok }: { body: unknown; ok: boolean }) {
  const rows: Array<{ k: string; v: string }> = [];
  function walk(v: unknown, prefix: string) {
    if (v && typeof v === "object" && !Array.isArray(v)) {
      for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
        if (val && typeof val === "object") walk(val, prefix ? `${prefix}.${k}` : k);
        else rows.push({ k: tit(k), v: val == null ? "—" : String(val) });
      }
    } else if (Array.isArray(v)) v.forEach((it, i) => walk(it, `${prefix}[${i}]`));
    else if (v != null && v !== "") rows.push({ k: tit(prefix || "Value"), v: String(v) });
  }
  walk(body, "");
  if (!rows.length) return <p className="text-sm text-gray-500">No fields</p>;
  return (
    <div className="overflow-hidden rounded-lg border bg-white dark:bg-gray-900">
      {rows.map((r, i) => (
        <div key={i} className="flex justify-between gap-4 border-b px-4 py-2 text-sm last:border-0 dark:border-gray-800"><span className="text-gray-500">{r.k}</span><span className="font-mono text-right break-all">{r.v}</span></div>
      ))}
      <div className="flex justify-between bg-gray-50 px-4 py-2 text-sm dark:bg-gray-800"><span>Status</span><span className={ok ? "text-green-600 font-medium" : "text-red-600 font-medium"}>{ok ? "✓ Success" : "✗ Failed"}</span></div>
    </div>
  );
}
function tit(k: string) { return k.replace(/_/g, " ").replace(/([A-Z])/g, " $1").trim().replace(/\s+/g, " ").replace(/^./, (c) => c.toUpperCase()); }
