"use client";

import { useState, useMemo } from "react";
import { DIGITAP_APIS } from "@/lib/digitap-apis";

type VendorInfo = { id: string; name: string; slug: string; sandboxEndpoint: string; liveEndpoint: string; sandboxKeyFingerprint: string; liveKeyFingerprint: string } | null;

export function AddApiPageClient({ initialVendor }: { initialVendor: VendorInfo }) {
  const [baseApi, setBaseApi] = useState("https://svcdemo.digitap.work");
  const [baseSvc, setBaseSvc] = useState("https://svcdemo.digitap.work");
  const [apiKey, setApiKey] = useState("");
  const [liveKey, setLiveKey] = useState("");
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("All");
  const [selected, setSelected] = useState<number | null>(null);
  const [wlUrl, setWlUrl] = useState<string | null>(null);
  const [wlKey, setWlKey] = useState<string | null>(null);
  const [wlSlug, setWlSlug] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  // tester
  const [testBody, setTestBody] = useState("");
  const [testEnv, setTestEnv] = useState<"sandbox" | "live">("sandbox");
  const [resp, setResp] = useState<{ status: number; body: unknown; raw: string; ok: boolean } | null>(null);
  const [tab, setTab] = useState<"normal" | "json">("normal");
  const [testing, setTesting] = useState(false);

  const categories = useMemo(() => {
    const s = new Set<string>();
    for (const a of DIGITAP_APIS) s.add(a.name.split(" > ")[0]);
    return ["All", ...Array.from(s)];
  }, []);

  const filtered = useMemo(() => {
    return DIGITAP_APIS.filter((a, idx) => {
      if (cat !== "All" && !a.name.startsWith(cat + " >")) return false;
      if (!q) return true;
      const qq = q.toLowerCase();
      return a.name.toLowerCase().includes(qq) || a.url.toLowerCase().includes(qq) || a.method.toLowerCase().includes(qq);
    });
  }, [q, cat]);

  const cur = selected !== null ? DIGITAP_APIS[selected] : null;

  async function updateVendorKeys() {
    if (!initialVendor) { setMsg("CrossVerify vendor not found"); return; }
    if (!apiKey.trim() && !liveKey.trim()) { setMsg("Paste at least one API key"); return; }
    setBusy(true); setMsg(null);
    const r = await fetch(`/api/admin/vendors/${initialVendor.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sandboxKey: apiKey.trim() || undefined, liveKey: (liveKey.trim() || apiKey.trim()) || undefined }),
    });
    const j = await r.json().catch(() => ({}));
    setBusy(false);
    if (!r.ok) setMsg(j.error || "Failed");
    else setMsg("✅ CrossVerify keys updated — all 142 white-label APIs now use your Digitap portal keys");
  }

  async function whiteLabel(auto = false) {
    if (selected === null || !cur) { if (!auto) setMsg("Select an API first"); return; }
    if (!cur) return;
    setBusy(true); if (!auto) setMsg(null);
    const vendorId = initialVendor?.id;
    const url = cur.url.replace("{{BASE_URL_API}}", baseApi.replace(/\/$/, "")).replace("{{BASE_URL_SVC}}", baseSvc.replace(/\/$/, "")).replace("{{BASE_URL}}", baseApi.replace(/\/$/, ""));
    const keyToUse = liveKey.trim() || apiKey.trim() || "demo-key";
    const fields: Array<{ label: string; variable: string; example: string }> = [];
    try {
      const parsed = cur.body ? JSON.parse(cur.body) : null;
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
          if (typeof k === "string" && k) fields.push({ label: k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()), variable: k, example: String(v ?? "") });
        }
      }
    } catch {}
    const displayName = `CrossVerify — ${cur.name.split(" > ").slice(-1)[0]}`;
    const r = await fetch("/api/admin/simple-apis", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: displayName, url, key: keyToUse, method: cur.method, authType: cur.headers.includes("ent_authorization") ? "api_key" : "bearer", authHeaderName: cur.headers.includes("ent_authorization") ? "ent_authorization" : "Authorization", vendorId, fields }),
    });
    const j = await r.json().catch(() => ({}));
    setBusy(false);
    if (!r.ok) { if (!auto) setMsg(j.error || "White-label failed"); return; }
    setWlUrl(j.whiteLabelUrl); setWlKey(j.whiteLabelKey); setWlSlug(j.slug);
    setTestBody(cur.body || JSON.stringify(Object.fromEntries(fields.map((f) => [f.variable, f.example])), null, 2) || '{\n  "client_ref_num": "test991"\n}');
    if (!auto) setMsg(`✅ CrossVerify white-label ready: ${displayName} → /api/v1/${j.slug}`);
    // auto-generate Postman env is handled in UI
  }

  // Auto-generate CrossVerify white-label key right after selection (for Postman + live)
  async function handleSelect(idx: number) {
    setSelected(idx);
    const a = DIGITAP_APIS[idx];
    setTestBody(a.body || '{\n  "client_ref_num": "test991"\n}');
    setWlUrl(null); setWlKey(null); setWlSlug(null);
    // auto white-label after short delay so UI updates first
    setTimeout(() => whiteLabel(true), 300);
  }

  async function runTest() {
    if (!wlUrl || !wlKey) { setMsg("White-label first to get URL + key"); return; }
    let body: unknown = undefined;
    let raw = testBody.trim();
    if (raw) {
      try { body = JSON.parse(raw); } catch { setMsg("Test body must be valid JSON"); return; }
    }
    setTesting(true); setResp(null);
    try {
      const r = await fetch(wlUrl, { method: cur?.method || "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${wlKey}`, "X-Environment": testEnv }, body: raw || undefined });
      const text = await r.text();
      let parsed: unknown = text;
      try { parsed = text ? JSON.parse(text) : null; } catch {}
      setResp({ status: r.status, body: parsed, raw: text, ok: r.status >= 200 && r.status < 300 });
      setTab("normal");
    } catch (e: any) {
      setResp({ status: 0, body: e.message, raw: String(e), ok: false });
    } finally { setTesting(false); }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Add API — CrossVerify White-Label</h1>
        <p className="mt-1 text-sm text-gray-500">Fill your Digitap portal details once, select any API, white-label it, test it here (built-in Postman). Same key + URL you give to clients.</p>
      </div>

      {/* Vendor config */}
      <div className="rounded-xl border bg-white p-5 dark:bg-gray-900 dark:border-gray-800 space-y-3">
        <h2 className="font-semibold">1. Your Digitap Portal Details (Third-party API URL + API Key)</h2>
        <p className="text-xs text-gray-500">From https://documenter.getpostman.com/view/20237991/2s9Yywff4a — set once. All white-labels use these. {initialVendor ? `Current: ${initialVendor.name} (${initialVendor.sandboxKeyFingerprint.slice(0,8)}…)` : ""}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div><label className="text-xs font-medium">Third-party API URL — BASE_URL_API</label><input value={baseApi} onChange={(e) => setBaseApi(e.target.value)} placeholder="https://svcdemo.digitap.work" className="mt-1 w-full rounded-lg border px-3 py-2 text-sm font-mono dark:bg-gray-950" /></div>
          <div><label className="text-xs font-medium">Third-party API URL — BASE_URL_SVC</label><input value={baseSvc} onChange={(e) => setBaseSvc(e.target.value)} placeholder="https://svcdemo.digitap.work" className="mt-1 w-full rounded-lg border px-3 py-2 text-sm font-mono dark:bg-gray-950" /></div>
          <div><label className="text-xs font-medium">API Key — Sandbox AUTH_TOKEN</label><input value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="Basic ..." className="mt-1 w-full rounded-lg border px-3 py-2 text-sm font-mono dark:bg-gray-950" type="password" /></div>
          <div><label className="text-xs font-medium">API Key — Live AUTH_TOKEN</label><input value={liveKey} onChange={(e) => setLiveKey(e.target.value)} placeholder="Basic ... (for live real data)" className="mt-1 w-full rounded-lg border px-3 py-2 text-sm font-mono dark:bg-gray-950" type="password" /></div>
        </div>
        <button onClick={updateVendorKeys} disabled={busy} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">Save to CrossVerify Vendor (encrypted)</button>
        <p className="text-xs text-gray-400">Keys are AES-256 encrypted, never shown. White-label APIs proxy with these; clients only see your <code>sk_...</code>.</p>
      </div>

      {/* API selector */}
      <div className="rounded-xl border bg-white p-5 dark:bg-gray-900 dark:border-gray-800">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-semibold">2. Select any API to white-label ({filtered.length}/{DIGITAP_APIS.length})</h2>
          <div className="flex gap-2">
            <select value={cat} onChange={(e) => setCat(e.target.value)} className="rounded-lg border px-3 py-2 text-sm dark:bg-gray-950">
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search API, method, URL" className="rounded-lg border px-3 py-2 text-sm w-64 dark:bg-gray-950" />
          </div>
        </div>
        <div className="mt-3 max-h-[420px] overflow-auto rounded-lg border dark:border-gray-700">
          <table className="min-w-full text-sm">
            <thead className="sticky top-0 bg-gray-50 dark:bg-gray-950 text-xs text-gray-500"><tr><th className="px-3 py-2 text-left">API</th><th className="px-3 py-2 text-left">Method</th><th className="px-3 py-2 text-left">Third-party URL</th><th className="px-3 py-2">Select</th></tr></thead>
            <tbody>
              {filtered.slice(0, 120).map((a, idx) => {
                const realIdx = DIGITAP_APIS.indexOf(a);
                const isSel = selected === realIdx;
                return (
                  <tr key={realIdx} className={`border-t dark:border-gray-800 ${isSel ? "bg-blue-50 dark:bg-blue-950" : ""}`}>
                    <td className="px-3 py-2"><div className="font-medium text-sm leading-tight">CrossVerify — {a.name.split(" > ").slice(-1)[0]}</div><div className="text-xs text-gray-500 truncate max-w-[320px]">{a.name}</div></td>
                    <td className="px-3 py-2"><span className="rounded bg-gray-100 px-1.5 py-0.5 text-xs font-medium dark:bg-gray-800">{a.method}</span></td>
                    <td className="px-3 py-2 font-mono text-xs truncate max-w-[260px]">{a.url}</td>
                    <td className="px-3 py-2 text-center"><button onClick={() => handleSelect(realIdx)} className={`rounded px-3 py-1 text-xs font-medium ${isSel ? "bg-blue-600 text-white" : "border hover:bg-gray-50"}`}>{isSel ? "Selected" : "Select"}</button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {cur && (
          <div className="mt-3 rounded-lg bg-blue-50 border border-blue-200 p-3 dark:bg-blue-950 dark:border-blue-800">
            <div className="font-medium text-sm">Selected: <span className="font-mono">{cur.method}</span> CrossVerify — {cur.name.split(" > ").slice(-1)[0]}</div>
            <div className="font-mono text-xs break-all">{cur.url.replace("{{BASE_URL_API}}", baseApi).replace("{{BASE_URL_SVC}}", baseSvc)}</div>
            <div className="text-xs text-gray-600 dark:text-gray-400">Headers: {cur.headers.join(", ") || "none"} {cur.body ? `· Body: ${cur.body.slice(0, 120)}...` : ""}</div>
            <div className="mt-2 flex flex-wrap gap-2">
              <button onClick={() => whiteLabel()} disabled={busy} className="rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50">{busy ? "Generating CrossVerify Key..." : wlUrl ? "Regenerate CrossVerify White-Label Key" : "White-label this API → Auto CrossVerify Key"}</button>
              {busy && <span className="text-xs text-gray-500 self-center">Auto-generating CrossVerify white-label key for Postman + live...</span>}
            </div>
          </div>
        )}
      </div>

      {wlUrl && wlKey && (
        <div className="rounded-xl border-2 border-green-300 bg-green-50 p-5 dark:bg-green-950 dark:border-green-800 space-y-3">
          <h2 className="font-semibold text-green-800 dark:text-green-200">✅ CrossVerify White-Label Ready — Postman + Live</h2>
          <p className="text-xs text-green-700 dark:text-green-300">Auto-generated for this Digitap API. Same key works for Postman testing (sandbox) and live client systems. White-label name is always <b>CrossVerify</b>.</p>
          <div className="space-y-2">
            <div><div className="text-xs font-medium">White-label URL (CrossVerify)</div><div className="flex gap-2"><code className="flex-1 rounded bg-white px-3 py-2 font-mono text-sm break-all border">{wlUrl}</code><button onClick={() => navigator.clipboard.writeText(wlUrl)} className="rounded border bg-white px-3 py-2 text-xs">Copy URL</button></div></div>
            <div><div className="text-xs font-medium">CrossVerify White-Label Key (auto-generated)</div><div className="flex gap-2"><code className="flex-1 rounded bg-black px-3 py-2 font-mono text-sm text-green-400 break-all">{wlKey}</code><button onClick={() => navigator.clipboard.writeText(wlKey)} className="rounded border bg-white px-3 py-2 text-xs">Copy Key</button></div><p className="text-xs text-gray-500">Postman: <code>Authorization: Bearer {wlKey.slice(0,12)}...</code> + <code>X-Environment: sandbox</code> · Live client: same key + <code>X-Environment: live</code> to <code>{wlUrl}</code> — works in their system</p></div>
          </div>
          <div className="rounded-lg bg-white border p-3 dark:bg-gray-900">
            <div className="text-xs font-medium">Postman Environment (auto)</div>
            <pre className="mt-1 rounded bg-gray-900 p-2 font-mono text-xs text-gray-100 overflow-auto">{JSON.stringify({ name: "CrossVerify", values: [{ key: "baseUrl", value: wlUrl?.replace(/\/api\/v1\/.*/, "/api/v1"), enabled: true }, { key: "apiKey", value: wlKey, enabled: true }, { key: "crossverifySlug", value: wlSlug, enabled: true }], _postman_variable_scope: "environment" }, null, 2)}</pre>
            <button onClick={() => navigator.clipboard.writeText(JSON.stringify({ name: "CrossVerify", values: [{ key: "baseUrl", value: wlUrl?.replace(/\/api\/v1\/.*/, "/api/v1") }, { key: "apiKey", value: wlKey }, { key: "crossverifySlug", value: wlSlug }] }, null, 2))} className="mt-1 rounded border px-2 py-1 text-xs">Copy Postman Env</button>
          </div>
          <div className="flex flex-wrap gap-2">
            <a href={`/admin/crossverify?filter=${wlSlug}`} className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-medium text-white">View in CrossVerify Dashboard</a>
            <span className="text-xs text-gray-500 self-center">Slug: {wlSlug} · Name: CrossVerify — {cur?.name.split(" > ").slice(-1)[0]}</span>
          </div>
        </div>
      )}

      {/* Built-in Postman tester */}
      <div className="rounded-xl border bg-white p-5 dark:bg-gray-900 dark:border-gray-800 space-y-3">
        <h2 className="font-semibold">3. Test here — built-in Postman</h2>
        <p className="text-xs text-gray-500">Uses your white-label URL + key above. No external Postman needed. Output in Normal + JSON.</p>
        {!wlUrl || !wlKey ? (
          <p className="rounded-lg bg-amber-50 border border-amber-200 p-3 text-sm dark:bg-amber-950">White-label an API first (Step 2) to get URL + key, then test here.</p>
        ) : (
          <>
            <div className="grid gap-3 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <label className="text-xs font-medium">White-label URL</label>
                <input value={wlUrl} readOnly className="mt-1 w-full rounded-lg border bg-gray-50 px-3 py-2 text-sm font-mono dark:bg-gray-950" />
              </div>
              <div>
                <label className="text-xs font-medium">X-Environment</label>
                <select value={testEnv} onChange={(e) => setTestEnv(e.target.value as any)} className="mt-1 w-full rounded-lg border px-3 py-2 text-sm dark:bg-gray-950"><option value="sandbox">sandbox</option><option value="live">live</option></select>
              </div>
            </div>
            <div>
              <label className="text-xs font-medium">Request body (JSON)</label>
              <textarea value={testBody} onChange={(e) => setTestBody(e.target.value)} rows={6} className="mt-1 w-full rounded-lg border px-3 py-2 font-mono text-sm dark:bg-gray-950" placeholder={'{\n  "client_ref_num": "test991",\n  "aadhaar": "988128196772"\n}'} />
            </div>
            <button onClick={runTest} disabled={testing} className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">{testing ? "Testing..." : `Test ${cur?.method || "POST"} ${wlSlug}`}</button>
            {resp && (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${resp.ok ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>HTTP {resp.status} {resp.ok ? "Success" : "Failed"}</span>
                  <div className="ml-auto flex rounded-lg border overflow-hidden">
                    <button onClick={() => setTab("normal")} className={`px-3 py-1 text-xs font-medium ${tab === "normal" ? "bg-blue-600 text-white" : "bg-white"}`}>Normal</button>
                    <button onClick={() => setTab("json")} className={`px-3 py-1 text-xs font-medium ${tab === "json" ? "bg-blue-600 text-white" : "bg-white"}`}>JSON</button>
                  </div>
                </div>
                {tab === "normal" ? <NormalView body={resp.body} ok={resp.ok} /> : <pre className="max-h-80 overflow-auto rounded-lg bg-gray-900 p-4 font-mono text-xs text-gray-100 whitespace-pre-wrap">{resp.raw || "(empty)"}</pre>}
              </div>
            )}
          </>
        )}
      </div>

      {msg && <p className="rounded-lg bg-amber-50 border border-amber-200 px-3 py-2 text-sm dark:bg-amber-950">{msg}</p>}
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
