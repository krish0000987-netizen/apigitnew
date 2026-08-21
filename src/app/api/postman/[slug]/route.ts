import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { paiseToRupees } from "@/lib/pricing";

type RouteContext = { params: Promise<{ slug: string }> };

function openApiToPostman(openApiSpec: Record<string, unknown>, baseUrl: string): Record<string, unknown> {
  const info = openApiSpec.info as Record<string, unknown>;
  const paths = openApiSpec.paths as Record<string, unknown>;
  const components = openApiSpec.components as Record<string, unknown> | undefined;
  const securitySchemes = components?.securitySchemes as Record<string, unknown> | undefined;

  const items: Record<string, unknown>[] = [];

  for (const [path, pathItem] of Object.entries(paths)) {
    const pathItemObj = pathItem as Record<string, unknown>;
    for (const [method, operation] of Object.entries(pathItemObj)) {
      if (["get", "post", "put", "patch", "delete", "options", "head"].includes(method)) {
        const op = operation as Record<string, unknown>;
        const operationId = String(op.operationId ?? `${method.toUpperCase()} ${path}`);
        const summary = String(op.summary ?? operationId);
        const description = String(op.description ?? "");
        const parameters = (op.parameters as Record<string, unknown>[]) ?? [];
        const requestBody = op.requestBody as Record<string, unknown> | undefined;
        const responses = op.responses as Record<string, unknown> | undefined;

        const url = new URL(baseUrl);
        url.pathname = path;

        const queryParams: Record<string, unknown>[] = [];
        const headerParams: Record<string, unknown>[] = [];
        const pathParams: Record<string, unknown>[] = [];

        for (const param of parameters) {
          const p = param as Record<string, unknown>;
          const inLoc = String(p.in ?? "query");
          const schema = p.schema as Record<string, unknown> | undefined;
          const required = Boolean(p.required);
          const example = p.example;

          const paramObj = {
            key: p.name,
            value: example ?? "",
            description: String(p.description ?? ""),
            disabled: !required,
          };

          if (inLoc === "query") queryParams.push(paramObj);
          else if (inLoc === "header") headerParams.push(paramObj);
          else if (inLoc === "path") pathParams.push(paramObj);
        }

        let body: Record<string, unknown> | undefined;
        if (requestBody) {
          const content = requestBody.content as Record<string, unknown> | undefined;
          if (content?.["application/json"]) {
            const schema = content["application/json"] as Record<string, unknown>;
            body = {
              mode: "raw",
              raw: JSON.stringify(schema.example ?? {}, null, 2),
              options: { raw: { language: "json" } },
            };
          }
        }

        const request: Record<string, unknown> = {
          method: method.toUpperCase(),
          header: headerParams.map((h) => ({ key: h.key, value: h.value, description: h.description })),
          url: {
            raw: url.toString(),
            host: [url.host],
            path: url.pathname.split("/").filter(Boolean),
            query: queryParams.map((q) => ({
              key: q.key,
              value: q.value,
              description: q.description,
              disabled: q.disabled,
            })),
          },
        };

        if (body) request.body = body;

        items.push({
          name: summary,
          request,
          response: [],
        });
      }
    }
  }

  const auth = securitySchemes?.bearerAuth as Record<string, unknown> | undefined;
  const authHeader = auth ? { key: "Authorization", value: "Bearer {{apiKey}}", type: "text" } : undefined;

  return {
    info: {
      name: String(info?.title ?? "API Collection"),
      description: String(info?.description ?? ""),
      schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
    },
    item: items,
    auth: authHeader ? { type: "bearer", bearer: [{ key: "token", value: "{{apiKey}}", type: "string" }] } : undefined,
    variable: [
      { key: "baseUrl", value: baseUrl.replace(/\/$/, ""), type: "string" },
      { key: "apiKey", value: "YOUR_API_KEY", type: "string" },
    ],
  };
}

export async function GET(_request: Request, { params }: RouteContext) {
  const { slug } = await params;
  const product = await prisma.apiProduct.findFirst({
    where: { slug, status: "published" },
    orderBy: { version: "desc" },
    include: {
      fields: { orderBy: { position: "asc" } },
      mappings: { orderBy: { position: "asc" } },
    },
  });
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const properties: Record<string, unknown> = {};
  const required: string[] = [];
  for (const f of product.fields) {
    properties[f.variable] = {
      type: f.type === "number" ? "number" : f.type === "boolean" ? "boolean" : "string",
      title: f.name,
      description: f.validation ?? undefined,
      example: f.example ?? undefined,
      format: f.validation ?? undefined,
    };
    if (f.required) required.push(f.variable);
  }

  const responseProps: Record<string, unknown> = {
    success: { type: "boolean", example: true },
    api: { type: "string", example: product.slug },
    request_id: { type: "string" },
  };
  if (product.mappings.length > 0) {
    const data: Record<string, unknown> = {};
    for (const m of product.mappings) {
      data[m.customerField] = { type: "string", example: "value" };
    }
    responseProps.data = { type: "object", properties: data };
  } else {
    responseProps.data = { type: "object", description: "Raw provider payload (privacy-redacted)" };
  }

  const price = paiseToRupees(product.defaultPrice);
  const pathItem: Record<string, unknown> = {
    summary: product.displayName,
    description: product.description ?? undefined,
    operationId: product.slug,
    parameters: [
      { name: "X-Environment", in: "header", schema: { type: "string", enum: ["sandbox", "live"] } },
    ],
    requestBody: {
      required: required.length > 0,
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties,
            required: required.length > 0 ? required : undefined,
          },
        },
      },
    },
    responses: {
      "200": {
        description: "Success",
        content: { "application/json": { schema: { type: "object", properties: responseProps } } },
      },
      "400": { description: "Missing or invalid fields" },
      "401": { description: "Missing or invalid API key" },
      "402": { description: "Insufficient balance" },
      "422": { description: "Verification failed" },
      "429": { description: "Rate limited" },
      "500": { description: "Provider error" },
    },
  };

  const openApiSpec = {
    openapi: "3.0.3",
    info: {
      title: product.displayName,
      description: `${product.description ?? ""}\n\nPrice: ₹${price.toFixed(2)} per request.`.trim(),
      version: `v${product.version}`,
    },
    servers: [{ url: `/api/v1`, description: "White-label gateway" }],
    security: [{ bearerAuth: [] }],
    components: {
      securitySchemes: { bearerAuth: { type: "http", scheme: "bearer" } },
    },
    paths: { [`/${product.slug}`]: { [product.method.toLowerCase()]: pathItem } },
  };

  const baseUrl = `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/v1`;
  const postmanCollection = openApiToPostman(openApiSpec, baseUrl);

  return NextResponse.json(postmanCollection);
}