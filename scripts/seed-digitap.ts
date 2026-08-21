import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { PrismaClient } from "../src/generated/prisma/client";
import { getPrismaAdapter } from "../src/lib/db-adapter";
import { encryptSecret, fingerprint } from "../src/lib/crypto";
import { encryptAuthConfig } from "../src/lib/auth-config";
import { rupeesToPaise } from "../src/lib/pricing";

const prisma = new PrismaClient({ adapter: getPrismaAdapter(process.env.DATABASE_URL!) });

// Digitap base URLs - demo endpoints from collection; replace with live hosts when you have them
const BASE_URL_API = "https://apidemo.digitap.work";
const BASE_URL_SVC = "https://svcdemo.digitap.work";
// placeholder token - admin must update vendor keys via Admin > Providers
const PLACEHOLDER_TOKEN = "REPLACE_WITH_DIGITAP_AUTH_TOKEN";

const COLLECTION_PATH = "/Users/himanshu/.local/share/opencode/tool-output/tool_023df4ba90019AdduDuUX1ujmf";

function slugify(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
}

type Leaf = {
  fullName: string;
  method: string;
  rawUrl: string;
  headers: Array<{ key: string; value: string }>;
  bodyRaw?: string;
  bodyMode: string;
  path: string;
  hostVar: string;
};

function collectLeaves(items: any[], prefix: string, out: Leaf[]) {
  for (const it of items) {
    if (it.item) {
      collectLeaves(it.item, prefix ? `${prefix} > ${it.name}` : it.name, out);
    } else if (it.request) {
      const req = it.request;
      const method = (req.method || "GET").toUpperCase();
      let rawUrl: string;
      let hostVar = "";
      if (typeof req.url === "string") rawUrl = req.url;
      else if (req.url?.raw) rawUrl = req.url.raw;
      else if (req.urlObject?.path) rawUrl = "/" + (req.urlObject.path as string[]).join("/");
      else rawUrl = req.url || "";
      // detect host var
      if (rawUrl.includes("BASE_URL_SVC")) hostVar = "BASE_URL_SVC";
      else if (rawUrl.includes("BASE_URL_API")) hostVar = "BASE_URL_API";
      const headers = (req.header as Array<{ key: string; value: string }>) || [];
      const bodyMode = req.body?.mode || "none";
      const bodyRaw = req.body?.raw as string | undefined;
      // resolve path part
      let pathPart = rawUrl;
      // strip var
      pathPart = pathPart.replace("{{BASE_URL_API}}", "").replace("{{BASE_URL_SVC}}", "").replace("{{BASE_URL}}", "");
      // handle query
      pathPart = pathPart.split("?")[0];
      if (!pathPart.startsWith("/")) pathPart = "/" + pathPart;
      out.push({
        fullName: prefix ? `${prefix} > ${it.name}` : it.name,
        method,
        rawUrl,
        headers,
        bodyRaw,
        bodyMode,
        path: pathPart,
        hostVar,
      });
    }
  }
}

function inferFields(bodyRaw?: string): { fields: any[]; template: Record<string, unknown> | null; bodyType: string } {
  if (!bodyRaw) return { fields: [], template: null, bodyType: "none" };
  const trimmed = bodyRaw.trim();
  if (trimmed.startsWith("{")) {
    try {
      const parsed = JSON.parse(trimmed.replace(/\n/g, "").replace(/\t/g, ""));
      // parsed may still contain strings with spaces, but json parse handles
    } catch {}
  }
  // try parse ignoring tab stuff
  try {
    // Replace single quotes? no.
    // The raw often has \n\t and is valid JSON
    const cleaned = bodyRaw.replace(/\n/g, "").replace(/\r/g, "").replace(/\t/g, "");
    // But original has newlines within - JSON.parse should handle whitespaces
    const parsed = JSON.parse(bodyRaw);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      const template: Record<string, unknown> = {};
      const fields: any[] = [];
      for (const [k, v] of Object.entries(parsed as Record<string, unknown>)) {
        template[k] = `{{${k}}}`;
        const isSensitive = /(aadhaar|pan|mobile|phone|otp|captcha|consent|auth)/i.test(k);
        fields.push({
          name: k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
          variable: k,
          type: typeof v === "number" ? "number" : typeof v === "boolean" ? "boolean" : "text",
          description: `Field ${k} from Digitap ${k}`,
          required: true,
          sensitive: isSensitive,
          store: false,
          mask: isSensitive,
          log: false,
          returnToCustomer: !isSensitive,
          validation: null,
          minLength: null,
          maxLength: null,
          example: String(v ?? ""),
        });
      }
      return { fields, template, bodyType: "json" };
    }
  } catch (e) {
    // raw may be form-data variant or invalid
  }
  // fallback: treat as raw
  return { fields: [], template: null, bodyType: "raw" };
}

async function ensureVendor() {
  const auth = encryptAuthConfig({
    authType: "api_key",
    authHeaderName: "Authorization",
  });
  const sandboxKey = PLACEHOLDER_TOKEN;
  const liveKey = PLACEHOLDER_TOKEN;
  const vendor = await prisma.vendor.upsert({
    where: { slug: "digitap" },
    update: {
      name: "Digitap",
      sandboxEndpoint: BASE_URL_API,
      liveEndpoint: BASE_URL_API,
      sandboxKeyEnc: encryptSecret(sandboxKey),
      liveKeyEnc: encryptSecret(liveKey),
      sandboxKeyFingerprint: fingerprint(sandboxKey),
      liveKeyFingerprint: fingerprint(liveKey),
      priority: 1,
      enabled: true,
      authType: auth.authType,
      authHeaderName: auth.authHeaderName,
      authQueryParam: null,
      authBasicEnc: auth.authBasicEnc,
      authExtraHeadersEnc: auth.authExtraHeadersEnc,
      authOAuthEnc: auth.authOAuthEnc,
    },
    create: {
      slug: "digitap",
      name: "Digitap",
      sandboxEndpoint: BASE_URL_API,
      liveEndpoint: BASE_URL_API,
      sandboxKeyEnc: encryptSecret(sandboxKey),
      liveKeyEnc: encryptSecret(liveKey),
      sandboxKeyFingerprint: fingerprint(sandboxKey),
      liveKeyFingerprint: fingerprint(liveKey),
      priority: 1,
      enabled: true,
      authType: auth.authType,
      authHeaderName: auth.authHeaderName,
      authQueryParam: null,
      authBasicEnc: auth.authBasicEnc,
      authExtraHeadersEnc: auth.authExtraHeadersEnc,
      authOAuthEnc: auth.authOAuthEnc,
    },
    select: { id: true, slug: true },
  });
  console.log(`✅ Vendor ready: ${vendor.slug} (${vendor.id})`);
  return vendor;
}

async function main() {
  const raw = fs.readFileSync(COLLECTION_PATH, "utf8");
  const collection = JSON.parse(raw);
  const leaves: Leaf[] = [];
  collectLeaves(collection.item, "", leaves);
  console.log(`Found ${leaves.length} endpoints in collection`);

  // deduplicate by method+path (keep first per slug)
  const seen = new Map<string, Leaf>();
  for (const leaf of leaves) {
    const key = `${leaf.method} ${leaf.path}`;
    if (!seen.has(key)) seen.set(key, leaf);
  }
  console.log(`Deduped to ${seen.size} unique method+path combos`);

  const vendor = await ensureVendor();

  // base URL map
  const baseMap: Record<string, string> = {
    BASE_URL_API,
    BASE_URL_SVC,
    "": BASE_URL_API,
  };

  let created = 0;
  let skipped = 0;
  for (const leaf of seen.values()) {
    const baseUrl = baseMap[leaf.hostVar] || BASE_URL_API;
    // derive slug from path: last segment + prefix category
    const segments = leaf.path.split("/").filter(Boolean);
    const last = segments[segments.length - 1] || "endpoint";
    // use fullName to make slug unique
    const slugBase = slugify(`${segments.slice(-2).join("-")}-${last}`);
    let slug = slugify(`${leaf.fullName.split(" > ").slice(-2).join("-")} ${last}`);
    if (!slug) slug = slugBase;
    // ensure slug uniqueness by appending method if needed later
    slug = slug.replace(/-+/g, "-").slice(0, 50);

    const existing = await prisma.apiProduct.findUnique({
      where: { slug_version: { slug, version: "v1" } },
      select: { id: true },
    });
    if (existing) {
      skipped++;
      continue;
    }

    const { fields, template, bodyType } = inferFields(leaf.bodyRaw);
    // For GET with no body, ensure fields from query? Not needed for seed

    // Determine headers extra (ent_authorization etc.)
    const extraHeaders = leaf.headers
      .filter((h) => h.key && h.key.toLowerCase() !== "authorization")
      .map((h) => ({ name: h.key, value: h.value.includes("{{") ? h.value.replace("{{AUTH_TOKEN}}", "{{auth_token}}") : h.value }));

    // Build display name & category
    const parts = leaf.fullName.split(" > ");
    const category = parts[0] || "Digitap";
    const displayName = parts.slice(-1)[0] || leaf.fullName;

    const productData: any = {
      vendorId: vendor.id,
      name: slug,
      displayName,
      slug,
      version: "v1",
      category,
      description: `${leaf.fullName} — proxied via Digitap. White-labeled as /api/v1/${slug}. Original: ${leaf.method} ${leaf.path}`,
      status: "published",
      supportsSandbox: true,
      supportsLive: true,
      method: leaf.method,
      baseUrl,
      endpointPath: leaf.path,
      requestBodyType: bodyType,
      requestBodyTemplate: template as never,
      queryParams: null as never,
      pathParams: null as never,
      headers: (extraHeaders.length ? extraHeaders : null) as never,
      responseMode: "raw",
      normalizedResponseSchema: null as never,
      errorMappings: null as never,
      fallbackEnabled: false,
      fallbackRetryCount: 1,
      fallbackTimeoutMs: 5000,
      fallbackVendorIds: null,
      defaultCost: rupeesToPaise(1),
      defaultPrice: rupeesToPaise(2),
      billingModel: "per_request",
      billOnSuccess: true,
      requireConsent: false,
      dataRetentionDays: 7,
      privacyConfig: JSON.stringify({ logResponse: false, storeResponse: false }) as never,
      fields: {
        create: fields.map((f: any, i: number) => ({
          name: f.name,
          variable: f.variable,
          type: f.type,
          description: f.description,
          required: f.required,
          sensitive: f.sensitive,
          store: f.store,
          mask: f.mask,
          log: f.log,
          returnToCustomer: f.returnToCustomer,
          validation: f.validation,
          minLength: f.minLength,
          maxLength: f.maxLength,
          example: f.example,
          position: i,
        })),
      },
      mappings: { create: [] },
    };

    try {
      await prisma.apiProduct.create({ data: productData });
      created++;
      if (created % 20 === 0) console.log(`... created ${created}`);
    } catch (e: any) {
      // slug collision: try with suffix
      if (String(e.message).includes("Unique constraint")) {
        const altSlug = `${slug}-${leaf.method.toLowerCase()}-${segments.length}`.slice(0, 60);
        const altExisting = await prisma.apiProduct.findUnique({ where: { slug_version: { slug: altSlug, version: "v1" } }, select: { id: true } });
        if (!altExisting) {
          productData.slug = altSlug;
          productData.name = altSlug;
          await prisma.apiProduct.create({ data: productData });
          created++;
        } else {
          skipped++;
        }
      } else {
        console.error(`Failed ${slug}:`, e.message?.slice(0, 300));
        skipped++;
      }
    }
  }

  console.log(`✅ Done: created ${created}, skipped ${skipped}`);
  console.log(`   White-label base: /api/v1/{slug}  (e.g. /api/v1/aadhaar-validation)`);
  console.log(`   Auth: send  Authorization: Bearer <your_customer_api_key>  +  X-Environment: sandbox|live`);
  console.log(`   Next: update Digitap token in Admin > Providers > digitap (currently placeholder)`);

  // Show few samples
  const samples = await prisma.apiProduct.findMany({ where: { vendorId: vendor.id }, select: { slug: true, displayName: true, method: true, endpointPath: true, category: true }, take: 10, orderBy: { slug: "asc" } });
  for (const s of samples) console.log(`   - ${s.method} /api/v1/${s.slug}  → ${s.method} ${s.endpointPath}  [${s.category}] ${s.displayName}`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
