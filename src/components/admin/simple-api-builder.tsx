"use client";

import { useState } from "react";

const inputCls =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm dark:border-gray-700 dark:bg-gray-900";

type FieldDef = { variable: string; name: string; example?: string };
type FieldInput = { label: string; variable: string; example: string };

type Generated = {
  productId: string;
  slug: string;
  whiteLabelUrl: string;
  whiteLabelKey: string;
  whiteLabelKeyMasked: string;
  fields: FieldDef[];
};

type TestResult = {
  ok: boolean;
  status: number;
  requestId: string;
  body: unknown;
  errorMessage?: string;
};

type SentRequest = {
  url: string;
  method: string;
  headers: Record<string, string>;
  body: unknown;
};

const PRESETS: Record<string, FieldInput[]> = {
  Aadhaar: [{ label: "Aadhaar Number", variable: "document_number", example: "1111-2222-3333" }],
  PAN: [{ label: "PAN Number", variable: "pan_number", example: "ABCDE0000A" }],
  GST: [{ label: "GSTIN", variable: "gstin", example: "22ABCDE1234F1Z5" }],
};

export function SimpleApiBuilder({ vendors, crossProducts, appUrl }: { vendors?: Array<{ id: string; name: string; slug: string }>; crossProducts?: Array<{ id: string; slug: string; displayName: string; category: string | null; method: string; endpointPath: string }>; appUrl?: string }) {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [key, setKey] = useState("");
  const [method, setMethod] = useState("POST");
  const [authType, setAuthType] = useState("bearer");
  const [authHeaderName, setAuthHeaderName] = useState("x-api-key");
  const [authQueryParam, setAuthQueryParam] = useState("api_key");
  const [vendorId, setVendorId] = useState<string>(() => vendors?.find((v) => v.slug === "digitap")?.id || "");
  const [fields, setFields] = useState<FieldInput[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const [generated, setGenerated] = useState<Generated | null>(null);
  const [copied, setCopied] = useState("");

  const [testUrl, setTestUrl] = useState("");
  const [testKey, setTestKey] = useState("");
  const [showKey, setShowKey] = useState(false);
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});
  const [rawBody, setRawBody] = useState("");
  const [testBusy, setTestBusy] = useState(false);
  const [testError, setTestError] = useState("");
  const [result, setResult] = useState<TestResult | null>(null);
  const [sent, setSent] = useState<SentRequest | null>(null);
  const [showSent, setShowSent] = useState(false);
  const [tab, setTab] = useState<"normal" | "json">("normal");
  const [crossFilter, setCrossFilter] = useState("");
  const crossFiltered = (crossProducts || []).filter((p) => !crossFilter || p.slug.toLowerCase().includes(crossFilter.toLowerCase()) || p.displayName.toLowerCase().includes(crossFilter.toLowerCase()));

  async function generate() {
    setBusy(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/admin/simple-apis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, url, key, method, authType, authHeaderName, authQueryParam, vendorId: vendorId || undefined, fields }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.error ?? "Could not create the API. Check your URL and try again.");
        return;
      }
      setGenerated(data);
      setTestUrl(data.whiteLabelUrl);
      setTestKey(data.whiteLabelKey);
      const values: Record<string, string> = {};
      for (const f of data.fields ?? []) values[f.variable] = f.example ?? "";
      setFieldValues(values);
    } finally {
      setBusy(false);
    }
  }

  function addPreset(kind: keyof typeof PRESETS) {
    const incoming = PRESETS[kind];
    setFields((prev) => {
      const existing = new Set(prev.map((f) => f.variable));
      return [...prev, ...incoming.filter((f) => !existing.has(f.variable))];
    });
  }

  function updateField(i: number, patch: Partial<FieldInput>) {
    setFields((prev) => prev.map((f, idx) => (idx === i ? { ...f, ...patch } : f)));
  }

  function removeField(i: number) {
    setFields((prev) => prev.filter((_, idx) => idx !== i));
  }

  async function test() {
    setTestBusy(true);
    setTestError("");
    setResult(null);
    setSent(null);
    try {
      if (!testUrl.trim() || !testKey.trim()) {
        setTestError("Please enter the white-label URL and key.");
        return;
      }

      let body: unknown;
      let rawText: string;
      const hasFields = (generated?.fields.length ?? 0) > 0;
      if (hasFields) {
        const obj: Record<string, unknown> = {};
        for (const f of generated!.fields) {
          const v = fieldValues[f.variable] ?? "";
          if (v === "") {
            setTestError(`Please fill in "${f.name}".`);
            return;
          }
          obj[f.variable] = v;
        }
        body = obj;
        rawText = JSON.stringify(obj);
      } else {
        try {
          body = JSON.parse(rawBody);
          rawText = rawBody;
        } catch {
          setTestError('Please enter valid JSON. Example: {"document_number": "1111-2222-3333"}');
          return;
        }
      }

      const res = await fetch(testUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${testKey}`,
        },
        body: rawText,
      });
      const text = await res.text();
      let json: unknown = null;
      try {
        json = text ? JSON.parse(text) : null;
      } catch {
        json = text;
      }

      const failed = res.status >= 400;
      const errorMessage = failed
        ? extractErrorMessage(json) ?? `The API returned HTTP ${res.status}.`
        : undefined;

      setResult({
        ok: !failed,
        status: res.status,
        requestId: (res.headers.get("x-request-id") as string) ?? "",
        body: json,
        errorMessage,
      });

      // Capture the exact request that was sent (server-side, keys masked)
      // so the admin can verify it against the vendor's documentation.
      try {
        const debugRes = await fetch(`/api/admin/api-products/${generated!.productId}/test`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ mode: "sandbox", body, rawBody: rawText }),
        });
        const debugData = await debugRes.json().catch(() => null);
        const req = debugData?.result?.request;
        if (req) {
          setSent({ url: req.url, method: req.method, headers: req.headers ?? {}, body: req.body ?? null });
          setShowSent(true);
        }
      } catch {
        // debug capture is best-effort
      }

      setTab("normal");
    } catch {
      setTestError("Could not reach the server. Check the white-label URL and try again.");
    } finally {
      setTestBusy(false);
    }
  }

  function copy(text: string, label: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(label);
      setTimeout(() => setCopied(""), 1500);
    });
  }

  return (
    <div className="space-y-8">
      {/* Step 1 — Add API */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-lg font-semibold">1 · Add API</h2>
        <p className="mt-1 text-sm text-gray-500">
          Paste the third-party API URL and its key (key is optional if the API is public). Your
          original key is encrypted and never shown again.
        </p>

        <div className="mt-4 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">API name</label>
              <input
                className={inputCls}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Aadhaar Verification"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">HTTP method</label>
              <select className={inputCls} value={method} onChange={(e) => setMethod(e.target.value)}>
                <option>POST</option>
                <option>GET</option>
                <option>PUT</option>
                <option>PATCH</option>
                <option>DELETE</option>
              </select>
            </div>
          </div>
          {vendors && vendors.length > 0 && (
            <div>
              <label className="mb-1 block text-sm font-medium">White-label group (vendor)</label>
              <select className={inputCls} value={vendorId} onChange={(e) => setVendorId(e.target.value)}>
                <option value="">New provider (auto-create)</option>
                {vendors.map((v) => (
                  <option key={v.id} value={v.id}>{v.slug === "digitap" ? "CrossVerify" : `${v.name} (${v.slug})`}</option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">Select <b>CrossVerify</b> to add to your 142 white-label APIs. It will appear in CrossVerify dashboard and share the same vendor key.</p>
            </div>
          )}
          <div>
            <label className="mb-1 block text-sm font-medium">Third-party API URL</label>
            <input
              className={inputCls}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://vendor.com/api/verify"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">
              API key <span className="font-normal text-gray-400">— kept secret</span>
            </label>
            <input
              className={inputCls}
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="sk_xxxxxxxxxxxx"
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">How the vendor wants the key</label>
              <select className={inputCls} value={authType} onChange={(e) => setAuthType(e.target.value)}>
                <option value="bearer">Bearer token (Authorization: Bearer …)</option>
                <option value="api_key">API key header (x-api-key)</option>
                <option value="query">API key in URL (?api_key=…)</option>
                <option value="none">No key</option>
              </select>
            </div>
            {authType === "api_key" && (
              <div>
                <label className="mb-1 block text-sm font-medium">Header name</label>
                <input
                  className={`${inputCls} font-mono`}
                  value={authHeaderName}
                  onChange={(e) => setAuthHeaderName(e.target.value)}
                  placeholder="x-api-key"
                />
              </div>
            )}
            {authType === "query" && (
              <div>
                <label className="mb-1 block text-sm font-medium">Query parameter name</label>
                <input
                  className={`${inputCls} font-mono`}
                  value={authQueryParam}
                  onChange={(e) => setAuthQueryParam(e.target.value)}
                  placeholder="api_key"
                />
              </div>
            )}
          </div>

          {/* Optional request fields */}
          <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <div className="text-sm font-medium">Request fields (optional)</div>
                <div className="text-xs text-gray-400">
                  What data will be sent — e.g. Aadhaar number, PAN number, GSTIN.
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {(Object.keys(PRESETS) as Array<keyof typeof PRESETS>).map((k) => (
                  <button
                    key={k}
                    type="button"
                    onClick={() => addPreset(k)}
                    className="rounded-full border border-blue-300 px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-300 dark:hover:bg-blue-950"
                  >
                    + {k}
                  </button>
                ))}
              </div>
            </div>

            {fields.length === 0 && (
              <p className="mt-3 rounded-lg border border-dashed border-gray-300 p-3 text-center text-xs text-gray-400">
                No fields yet — the test will use a raw JSON box. Add fields to get simple inputs
                like &quot;Aadhaar Number&quot;.
              </p>
            )}

            {fields.length > 0 && (
              <div className="mt-3 space-y-2">
                {fields.map((f, i) => (
                  <div key={i} className="grid gap-2 sm:grid-cols-[1fr_1fr_1fr_auto]">
                    <input
                      className={inputCls}
                      value={f.label}
                      onChange={(e) => updateField(i, { label: e.target.value })}
                      placeholder="Field name (e.g. Aadhaar Number)"
                    />
                    <input
                      className={`${inputCls} font-mono`}
                      value={f.variable}
                      onChange={(e) => updateField(i, { variable: e.target.value })}
                      placeholder="JSON key (e.g. document_number)"
                    />
                    <input
                      className={inputCls}
                      value={f.example}
                      onChange={(e) => updateField(i, { example: e.target.value })}
                      placeholder="Example (e.g. 1111-2222-3333)"
                    />
                    <button
                      type="button"
                      onClick={() => removeField(i)}
                      className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => setFields((prev) => [...prev, { label: "", variable: "", example: "" }])}
                  className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  + Add field
                </button>
              </div>
            )}
          </div>

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={generate}
            disabled={busy || !name.trim() || !url.trim()}
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {busy ? "Creating…" : "Generate White-Label API"}
          </button>
        </div>
      </section>

      {/* Step 2 — White-label URL & key */}
      {generated && (
        <section className="rounded-xl border border-green-200 bg-green-50 p-6 dark:border-green-900 dark:bg-green-950">
          <h2 className="text-lg font-semibold text-green-900 dark:text-green-100">2 · Your White-Label API</h2>
          <p className="mt-1 text-sm text-green-800 dark:text-green-200">
            Use these instead of the original URL and key. Your customers will never see the
            provider&apos;s details.
          </p>
          <div className="mt-4 space-y-3">
            <Row label="White-label URL" value={generated.whiteLabelUrl} onCopy={() => copy(generated.whiteLabelUrl, "url")} copied={copied === "url"} />
            <Row label="White-label Key" value={generated.whiteLabelKey} onCopy={() => copy(generated.whiteLabelKey, "key")} copied={copied === "key"} />
          </div>
          <p className="mt-3 text-xs text-green-700 dark:text-green-300">
            Copy the key now — for security it is shown only once.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <a href={`/admin/crossverify?filter=${generated.slug}`} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">View in CrossVerify Dashboard</a>
            <a href={`/admin/crossverify?test=${generated.slug}&key=${encodeURIComponent(generated.whiteLabelKey)}`} className="rounded-lg border bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:bg-gray-900 dark:border-gray-700">Test in CrossVerify Tester →</a>
            <a href={`/admin/apis`} className="rounded-lg border bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50 dark:bg-gray-900 dark:border-gray-700">All APIs</a>
          </div>
          <p className="mt-2 text-xs text-green-600">If you selected CrossVerify, this API now appears in CrossVerify (142 → 143) and uses the CrossVerify vendor key. Clients with a CrossVerify key can call it at <code>/api/v1/{generated.slug}</code>.</p>
        </section>
      )}

      {/* Step 3 — Test API */}
      <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="text-lg font-semibold">3 · Test API</h2>
        <p className="mt-1 text-sm text-gray-500">
          The test calls your <strong>white-label URL</strong> with your <strong>white-label key</strong>{" "}
          — exactly how your customers will use it.
        </p>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">White-label URL</label>
            <input className={inputCls} value={testUrl} onChange={(e) => setTestUrl(e.target.value)} placeholder="https://…/api/v1/…" />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">White-label API key</label>
            <div className="flex gap-2">
              <input
                className={inputCls}
                type={showKey ? "text" : "password"}
                value={testKey}
                onChange={(e) => setTestKey(e.target.value)}
                placeholder="sk_test_…"
              />
              <button
                type="button"
                onClick={() => setShowKey((s) => !s)}
                className="shrink-0 rounded-lg border border-gray-300 px-3 text-sm text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                {showKey ? "Hide" : "Show"}
              </button>
            </div>
          </div>
        </div>

        {(generated?.fields.length ?? 0) > 0 ? (
          <div className="mt-4 space-y-4">
            {generated!.fields.map((f) => (
              <div key={f.variable}>
                <label className="mb-1 block text-sm font-medium">
                  {f.name} <span className="text-red-500">*</span>
                </label>
                <input
                  className={inputCls}
                  value={fieldValues[f.variable] ?? ""}
                  onChange={(e) => setFieldValues((v) => ({ ...v, [f.variable]: e.target.value }))}
                  placeholder={f.example ?? "Enter value"}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-4">
            <label className="mb-1 block text-sm font-medium">Data to send (JSON)</label>
            <textarea
              className={`${inputCls} font-mono`}
              rows={5}
              value={rawBody}
              onChange={(e) => setRawBody(e.target.value)}
              placeholder={'{\n  "document_number": "1111-2222-3333"\n}'}
            />
          </div>
        )}

        {testError && (
          <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
            {testError}
          </div>
        )}

        <button
          type="button"
          onClick={test}
          disabled={testBusy || !generated}
          className="mt-4 rounded-lg bg-blue-600 px-5 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {testBusy ? "Testing…" : "Test API"}
        </button>
      </section>

      {/* Integrated CrossVerify White-Label APIs */}
      {crossProducts && crossProducts.length > 0 && (
        <section className="rounded-xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">All CrossVerify White-Label APIs ({crossFiltered.length}/{crossProducts.length})</h2>
              <p className="text-xs text-gray-500">Already white-labeled and testable. Use any white-label key from CrossVerify dashboard.</p>
            </div>
            <input value={crossFilter} onChange={(e) => setCrossFilter(e.target.value)} placeholder="filter" className={`${inputCls} max-w-[200px]`} />
          </div>
          <div className="mt-3 overflow-auto max-h-[360px] rounded-lg border dark:border-gray-700">
            <table className="min-w-full text-xs">
              <thead className="bg-gray-50 dark:bg-gray-950 sticky top-0"><tr><th className="px-3 py-2 text-left">White-label URL</th><th className="px-3 py-2 text-left">Category</th><th className="px-3 py-2">Test</th></tr></thead>
              <tbody>
                {crossFiltered.slice(0, 100).map((p) => {
                  const wl = `${(appUrl || "").replace(/\/$/, "")}/api/v1/${p.slug}`;
                  return (
                    <tr key={p.id} className="border-t dark:border-gray-800">
                      <td className="px-3 py-2 font-mono"><span className="font-semibold">{p.method}</span> {wl}<div className="text-gray-400">{p.displayName}</div></td>
                      <td className="px-3 py-2">{p.category}</td>
                      <td className="px-3 py-2 text-center"><a href={`/admin/crossverify?test=${p.slug}${generated ? `&key=${encodeURIComponent(generated.whiteLabelKey)}` : ""}`} className="rounded border px-2 py-1 text-xs hover:bg-gray-50">Test →</a></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {crossFiltered.length > 100 && <p className="p-2 text-xs text-gray-400 text-center">Showing 100 of {crossFiltered.length} — use filter to narrow</p>}
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <a href="/admin/crossverify" className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-medium text-white hover:bg-blue-700">Open CrossVerify Dashboard (generate keys & test)</a>
            <a href="/api/customer/postman-collection" target="_blank" className="rounded-lg border px-4 py-2 text-xs font-medium hover:bg-gray-50">Download Postman collection</a>
          </div>
        </section>
      )}

      {/* Step 4 — Result */}
      {result && (
        <section className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-lg font-semibold">4 · Result</h2>
            <span
              className={`rounded-full px-3 py-0.5 text-xs font-semibold ${
                result.status === 0
                  ? "bg-gray-200 text-gray-600"
                  : result.status < 300
                    ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400"
                    : "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400"
              }`}
            >
              {result.status === 0 ? "no response" : `HTTP ${result.status}`}
            </span>
            {result.requestId && <span className="text-xs text-gray-400">ID: {result.requestId.slice(0, 12)}</span>}

            <div className="ml-auto flex rounded-lg border border-gray-300 dark:border-gray-700">
              <button
                type="button"
                onClick={() => setTab("normal")}
                className={`rounded-l-lg px-4 py-1.5 text-sm font-medium ${tab === "normal" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"}`}
              >
                Normal format
              </button>
              <button
                type="button"
                onClick={() => setTab("json")}
                className={`rounded-r-lg px-4 py-1.5 text-sm font-medium ${tab === "json" ? "bg-blue-600 text-white" : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"}`}
              >
                JSON format
              </button>
            </div>
          </div>

          {result.errorMessage && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950 dark:text-red-300">
              {result.errorMessage}
            </div>
          )}

          {tab === "normal" ? (
            <ResultNormal body={result.body} ok={result.ok} />
          ) : (
            <pre className="max-h-96 overflow-auto rounded-xl bg-gray-900 p-4 font-mono text-xs text-gray-100">
              {result.body === null || result.body === undefined
                ? "(no JSON response)"
                : typeof result.body === "string"
                  ? result.body
                  : JSON.stringify(result.body, null, 2)}
            </pre>
          )}

          {sent && (
            <div className="rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
              <button
                type="button"
                onClick={() => setShowSent((s) => !s)}
                className="flex w-full items-center justify-between px-5 py-3 text-sm font-medium"
              >
                <span>🔍 What the original API received</span>
                <span className="text-gray-400">{showSent ? "▲ hide" : "▼ show"}</span>
              </button>
              {showSent && (
                <div className="space-y-2 border-t border-gray-100 px-5 py-4 text-xs dark:border-gray-800">
                  <div className="flex gap-2">
                    <span className="shrink-0 text-gray-400">URL:</span>
                    <code className="break-all font-mono">{sent.url}</code>
                  </div>
                  <div className="flex gap-2">
                    <span className="shrink-0 text-gray-400">Method:</span>
                    <code className="font-mono">{sent.method}</code>
                  </div>
                  <div>
                    <div className="mb-1 text-gray-400">Headers (secrets masked):</div>
                    <pre className="max-h-48 overflow-auto rounded-lg bg-gray-50 p-3 font-mono dark:bg-gray-950">
                      {Object.entries(sent.headers).length === 0
                        ? "(no headers)"
                        : Object.entries(sent.headers)
                            .map(([k, v]) => `${k}: ${v}`)
                            .join("\n")}
                    </pre>
                  </div>
                  {sent.body !== null && sent.body !== undefined && (
                    <div>
                      <div className="mb-1 text-gray-400">Body:</div>
                      <pre className="max-h-48 overflow-auto rounded-lg bg-gray-50 p-3 font-mono dark:bg-gray-950">
                        {typeof sent.body === "string" ? sent.body : JSON.stringify(sent.body, null, 2)}
                      </pre>
                    </div>
                  )}
                  <p className="pt-1 text-gray-400">
                    If the original API returns an error, compare this with the vendor&apos;s
                    documentation — the URL, headers, and body must match what they expect.
                  </p>
                </div>
              )}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function ResultNormal({ body, ok }: { body: unknown; ok: boolean }) {
  const rows: Array<{ label: string; value: string }> = flatten(body, "");
  if (rows.length === 0) {
    return <p className="text-sm text-gray-500">No readable fields returned.</p>;
  }
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
      {rows.map((row, i) => (
        <div
          key={i}
          className="flex items-center justify-between gap-4 border-b border-gray-100 px-5 py-2.5 text-sm last:border-0 dark:border-gray-800"
        >
          <span className="text-gray-500">{row.label}</span>
          <span className="font-mono break-all text-right">{row.value}</span>
        </div>
      ))}
      <div className="flex items-center justify-between gap-4 border-t border-gray-100 bg-gray-50 px-5 py-2.5 text-sm dark:border-gray-800 dark:bg-gray-900">
        <span className="text-gray-500">Status</span>
        <span className={`font-semibold ${ok ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
          {ok ? "✓ Success" : "✗ Failed"}
        </span>
      </div>
    </div>
  );
}

function flatten(value: unknown, prefix: string): Array<{ label: string; value: string }> {
  const rows: Array<{ label: string; value: string }> = [];
  if (value && typeof value === "object" && !Array.isArray(value)) {
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      if (v !== null && typeof v === "object") {
        rows.push(...flatten(v, prefix ? `${prefix}.${k}` : k));
      } else {
        rows.push({ label: titleCase(k), value: v === null || v === undefined ? "—" : String(v) });
      }
    }
  } else if (Array.isArray(value)) {
    value.forEach((item, i) => rows.push(...flatten(item, `${prefix}[${i}]`)));
  } else if (value !== undefined && value !== null && value !== "") {
    rows.push({ label: titleCase(prefix || "Value"), value: String(value) });
  }
  return rows;
}

function titleCase(key: string): string {
  return key.replace(/_/g, " ").replace(/([A-Z])/g, " $1").trim().replace(/\s+/g, " ").replace(/^./, (c) => c.toUpperCase());
}

function extractErrorMessage(json: unknown): string | undefined {
  if (!json || typeof json !== "object") return undefined;
  const obj = json as Record<string, unknown>;
  if (typeof obj.message === "string") return obj.message;
  if (obj.error && typeof obj.error === "object") {
    const e = obj.error as Record<string, unknown>;
    if (typeof e.message === "string") return e.message;
  }
  return undefined;
}

function Row({
  label,
  value,
  onCopy,
  copied,
}: {
  label: string;
  value: string;
  onCopy: () => void;
  copied: boolean;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="min-w-0 flex-1">
        <div className="text-xs font-medium text-green-800 dark:text-green-200">{label}</div>
        <code className="block truncate rounded-lg bg-white px-3 py-2 font-mono text-sm dark:bg-gray-900">
          {value}
        </code>
      </div>
      <button
        type="button"
        onClick={onCopy}
        className="shrink-0 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}