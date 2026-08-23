import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/require-admin";
import { isSameOrigin } from "@/lib/csrf";
import { prisma } from "@/lib/prisma";
import { logAudit } from "@/lib/audit";
import { encryptSecret, fingerprint } from "@/lib/crypto";
import { generateApiKey } from "@/lib/api-keys";

export const runtime = "nodejs";

// Simple "Add API" flow (the quick white-label dashboard).
// Admin pastes a third-party URL + optional key → we create an encrypted
// Provider + a published passthrough API Product, and mint a white-label key
// the admin can use immediately. The original credentials are never returned.
export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!isSameOrigin(request)) return NextResponse.json({ error: "Cross-origin request rejected" }, { status: 403 });

  let body: {
    name?: string;
    url?: string;
    key?: string;
    method?: string;
    authType?: string;
    authHeaderName?: string;
    authQueryParam?: string;
    vendorId?: string;
    fields?: Array<{ label?: string; variable?: string; example?: string }>;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const name = (body.name ?? "").trim();
  const rawUrl = (body.url ?? "").trim();
  const key = (body.key ?? "").trim();
  const method = ["GET", "POST", "PUT", "PATCH", "DELETE"].includes(body.method ?? "")
    ? (body.method as string)
    : "POST";

  // How the vendor wants the API key sent.
  const authTypeRaw = (body.authType ?? "bearer").toLowerCase();
  const authType = ["bearer", "api_key", "query", "none"].includes(authTypeRaw) ? authTypeRaw : "bearer";
  const authHeaderName = (body.authHeaderName ?? "x-api-key").trim() || "x-api-key";
  const authQueryParam = (body.authQueryParam ?? "api_key").trim() || "api_key";

  if (!name) return NextResponse.json({ error: "Please give your API a name." }, { status: 400 });

  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    return NextResponse.json({ error: "Please enter a valid API URL, e.g. https://vendor.com/api/verify" }, { status: 400 });
  }
  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return NextResponse.json({ error: "API URL must start with http:// or https://" }, { status: 400 });
  }

  const fields = (Array.isArray(body.fields) ? body.fields : [])
    .filter((f) => f.variable && f.variable.trim())
    .map((f) => ({
      label: (f.label ?? f.variable ?? "").trim() || f.variable!.trim(),
      variable: f.variable!.trim().replace(/[^a-zA-Z0-9_]/g, "_"),
      example: (f.example ?? "").trim(),
    }))
    .filter((f) => /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(f.variable));

  const hasFields = fields.length > 0;
  const requestBodyTemplate = hasFields
    ? Object.fromEntries(fields.map((f) => [f.variable, `{{${f.variable}}}`]))
    : Object.fromEntries(fields.map((f) => [f.variable, `{{${f.variable}}}`])); // always send JSON

  const slug = await uniqueSlug(name);

  let vendor: { id: string; slug: string };
  let mockVendorId: string | null = null;

  if (body.vendorId) {
    const existing = await prisma.vendor.findUnique({ where: { id: body.vendorId }, select: { id: true, slug: true } });
    if (!existing) return NextResponse.json({ error: "Vendor not found" }, { status: 404 });
    vendor = existing;
    // optionally update its endpoint/key if provided
    if (key) {
      await prisma.vendor.update({
        where: { id: vendor.id },
        data: {
          sandboxKeyEnc: encryptSecret(key),
          sandboxKeyFingerprint: fingerprint(key),
          liveKeyEnc: encryptSecret(key),
          liveKeyFingerprint: fingerprint(key),
          authType: authType as any,
          authHeaderName: authType === "api_key" ? authHeaderName : undefined,
          authQueryParam: authType === "query" ? authQueryParam : undefined,
        },
      });
    }
  } else {
    // Default to CrossVerify vendor (digitap) for simple testing
    const crossVerify = await prisma.vendor.findUnique({ where: { slug: "digitap" }, select: { id: true, slug: true } });
    if (crossVerify) {
      vendor = { id: crossVerify.id, slug: crossVerify.slug };
      // Get mock vendor for fallback
      const mock = await prisma.vendor.findUnique({ where: { slug: "mock-crossverify" }, select: { id: true } });
      if (mock) mockVendorId = mock.id;
    } else {
      // Fallback: create new vendor
      vendor = await prisma.vendor.create({
        data: {
          name,
          slug: `${slug}-provider`,
          sandboxEndpoint: url.toString(),
          sandboxKeyEnc: encryptSecret(key),
          sandboxKeyFingerprint: key ? fingerprint(key) : "",
          liveEndpoint: url.toString(),
          liveKeyEnc: encryptSecret(key),
          liveKeyFingerprint: key ? fingerprint(key) : "",
          authType: key ? authType : "none",
          authHeaderName: authType === "api_key" ? authHeaderName : null,
          authQueryParam: authType === "query" ? authQueryParam : null,
          enabled: true,
        },
        select: { id: true, slug: true },
      });
    }
  }

  const isCrossVerifyVendor = vendor.slug === "digitap";
  const mockBaseUrl = "https://api-reseller-platform.vercel.app/api/mock/crossverify";
  const product = await prisma.apiProduct.create({
    data: {
      name: isCrossVerifyVendor ? `CrossVerify — ${name}` : name,
      displayName: isCrossVerifyVendor ? `CrossVerify — ${name}` : name,
      slug,
      version: "v1",
      category: isCrossVerifyVendor ? "CrossVerify" : "Quick Add",
      description: isCrossVerifyVendor ? `CrossVerify white-label for "${name}" — ${url.pathname}` : `White-label passthrough for "${name}".`,
      vendorId: vendor.id,
      status: "published",
      supportsSandbox: true,
      supportsLive: true,
      method,
      baseUrl: isCrossVerifyVendor ? mockBaseUrl : `${url.origin}`,
      endpointPath: isCrossVerifyVendor ? `${url.pathname}${url.search}` : `${url.pathname}${url.search}`,
      requestBodyType: "json", // always JSON for proper testing
      requestBodyTemplate: (requestBodyTemplate as never) ?? (null as never),
      responseMode: "raw",
      errorMappings: null as never,
      fallbackEnabled: false,
      fallbackRetryCount: 1,
      fallbackTimeoutMs: 3000,
      fallbackVendorIds: null,
      defaultCost: 0,
      defaultPrice: 0,
      billingModel: "per_request",
      billOnSuccess: false,
      requireConsent: false,
      privacyConfig: null as never,
      fields: hasFields
        ? {
            create: fields.map((f, i) => ({
              name: f.label,
              variable: f.variable,
              type: "text",
              required: true,
              sensitive: false,
              store: false,
              mask: false,
              log: true,
              returnToCustomer: true,
              validation: null,
              example: f.example || null,
              placeholder: f.example || null,
              position: i,
            })),
          }
        : undefined,
    },
    select: { id: true, slug: true, version: true },
  });

  // The admin's own "My White-Label" test account, used to mint white-label keys.
  const TEST_CUSTOMER_EMAIL = "my-white-label@apireseller.dev";
  let customer: { id: string } | null = await prisma.customer.findUnique({
    where: { email: TEST_CUSTOMER_EMAIL },
    select: { id: true },
  });
  if (!customer) {
    const primary = await generateApiKey("sandbox");
    customer = await prisma.customer.create({
      data: {
        email: TEST_CUSTOMER_EMAIL,
        name: "My White-Label",
        apiKeyHash: primary.hash,
        apiKeyLookup: primary.lookup,
        apiKeyPrefix: primary.masked,
        mode: "sandbox",
      },
      select: { id: true },
    });
  }
  if (!customer) throw new Error("Failed to create test customer");

  const isCrossVerify = vendor.slug === "digitap";
  const keyMode = isCrossVerify ? "live" as const : "sandbox" as const;
  const apiKey = await generateApiKey(keyMode);
  await prisma.customerApiKey.create({
    data: {
      customerId: customer.id,
      name: name,
      apiKeyHash: apiKey.hash,
      apiKeyLookup: apiKey.lookup,
      apiKeyPrefix: apiKey.masked,
      mode: keyMode,
      status: "active",
    },
  });

  await prisma.customerIntegration.upsert({
    where: { customerId_vendorId: { customerId: customer.id, vendorId: vendor.id } },
    create: { customerId: customer.id, vendorId: vendor.id, enabled: true },
    update: { enabled: true },
  });

  await logAudit({
    actorId: session.user.id,
    action: "api.product.created",
    entity: "api_product",
    entityId: product.id,
    details: `name=${name}, slug=${slug}, mode=quick-add`,
  });

  const whiteLabelUrl = `${new URL(request.url).origin}/api/v1/${slug}`;

  return NextResponse.json(
    {
      ok: true,
      productId: product.id,
      slug,
      whiteLabelUrl,
      whiteLabelKey: apiKey.apiKey,
      whiteLabelKeyMasked: apiKey.masked,
      fields: fields.map((f) => ({ variable: f.variable, name: f.label, example: f.example })),
    },
    { status: 201 },
  );
}

async function uniqueSlug(name: string): Promise<string> {
  const base =
    name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 50) || "api";
  let slug = base;
  let n = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const existing = await prisma.apiProduct.findUnique({ where: { slug_version: { slug, version: "v1" } } });
    if (!existing) return slug;
    n += 1;
    slug = `${base}-${n}`;
  }
}