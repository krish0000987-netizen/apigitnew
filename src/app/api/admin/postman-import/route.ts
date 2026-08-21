import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getAdminSession } from "@/lib/require-admin";

type RouteContext = { params: Promise<{ id?: string }> };

function postmanToOpenApi(collection: Record<string, unknown>): Record<string, unknown> {
  const items = (collection.item as Record<string, unknown>[]) ?? [];
  const paths: Record<string, unknown> = {};

  for (const item of items) {
    const request = item.request as Record<string, unknown> | undefined;
    if (!request) continue;

    const method = String(request.method ?? "GET").toLowerCase();
    const url = request.url as Record<string, unknown> | string | undefined;
    let path = "/";

    if (typeof url === "string") {
      try {
        const u = new URL(url);
        path = u.pathname;
      } catch {
        path = url;
      }
    } else if (url && typeof url === "object") {
      const pathParts = (url.path as string[]) ?? [];
      path = "/" + pathParts.join("/");
    }

    if (!paths[path]) paths[path] = {};

    const parameters: Record<string, unknown>[] = [];
    const header = request.header as Array<Record<string, unknown>> | undefined;
    if (header) {
      for (const h of header) {
        const key = String(h.key ?? "");
        if (key.toLowerCase() !== "authorization") {
          parameters.push({
            name: key,
            in: "header",
            required: !h.disabled,
            schema: { type: "string" },
            description: String(h.description ?? ""),
          });
        }
      }
    }

    const query = (url as Record<string, unknown>)?.query as Array<Record<string, unknown>> | undefined;
    if (query) {
      for (const q of query) {
        parameters.push({
          name: String(q.key ?? ""),
          in: "query",
          required: !q.disabled,
          schema: { type: "string" },
          description: String(q.description ?? ""),
          example: q.value,
        });
      }
    }

    let requestBody: Record<string, unknown> | undefined;
    const body = request.body as Record<string, unknown> | undefined;
    if (body && body.mode === "raw" && body.raw) {
      try {
        const parsed = JSON.parse(body.raw as string);
        requestBody = {
          required: true,
          content: {
            "application/json": {
              schema: parsed,
              example: parsed,
            },
          },
        };
      } catch {
        requestBody = {
          required: true,
          content: {
            "application/json": {
              schema: { type: "string" },
              example: body.raw,
            },
          },
        };
      }
    }

    paths[path][method] = {
      summary: String(item.name ?? "Imported Operation"),
      description: String(item.name ?? "Imported Operation"),
      operationId: String(item.name ?? "imported_operation").replace(/\s+/g, "_").toLowerCase(),
      parameters,
      requestBody,
      responses: {
        "200": { description: "Success" },
        "400": { description: "Bad Request" },
        "401": { description: "Unauthorized" },
        "500": { description: "Server Error" },
      },
    };
  }

  return {
    openapi: "3.0.3",
    info: {
      title: String(collection.info?.name ?? "Imported API"),
      description: String(collection.info?.description ?? ""),
      version: "1.0.0",
    },
    servers: [{ url: "/api/v1" }],
    paths,
    components: {
      securitySchemes: { bearerAuth: { type: "http", scheme: "bearer" } },
    },
    security: [{ bearerAuth: [] }],
  };
}

async function createProductFromOpenApi(
  openApiSpec: Record<string, unknown>,
  vendorId: string,
  userId: string
) {
  const info = openApiSpec.info as Record<string, unknown>;
  const paths = openApiSpec.paths as Record<string, unknown>;
  const firstPath = Object.keys(paths)[0];
  const firstMethod = Object.keys(paths[firstPath] as Record<string, unknown>)[0];
  const operation = (paths[firstPath] as Record<string, unknown>)[firstMethod] as Record<string, unknown>;

  const slug = String(info.title ?? "imported-api")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const existing = await prisma.apiProduct.findFirst({ where: { slug } });
  const finalSlug = existing ? `${slug}-${Date.now()}` : slug;

  const parameters = (operation.parameters as Record<string, unknown>[]) ?? [];
  const fields: Array<{
    variable: string;
    name: string;
    type: string;
    required: boolean;
    position: number;
    validation: string | undefined;
    example: string | undefined;
    defaultValue: string | undefined;
  }> = [];
  let position = 0;

  for (const param of parameters) {
    if (param.in === "body") continue;

    const schema = param.schema as Record<string, unknown> | undefined;
    fields.push({
      variable: String(param.name ?? ""),
      name: String(param.name ?? "").replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      type: schema?.type === "number" ? "number" : schema?.type === "boolean" ? "boolean" : "text",
      required: Boolean(param.required),
      position: position++,
      validation: schema?.pattern as string | undefined,
      example: schema?.example as string | undefined,
      defaultValue: schema?.default as string | undefined,
    });
  }

  const requestBody = operation.requestBody as Record<string, unknown> | undefined;
  let requestBodySchema: Record<string, unknown> | undefined;
  if (requestBody) {
    const content = requestBody.content as Record<string, unknown> | undefined;
    const jsonSchema = content?.["application/json"] as Record<string, unknown> | undefined;
    requestBodySchema = jsonSchema?.schema as Record<string, unknown> | undefined;

    if (requestBodySchema?.type === "object" && requestBodySchema.properties) {
      for (const [propName, propSchema] of Object.entries(requestBodySchema.properties as Record<string, unknown>)) {
        const ps = propSchema as Record<string, unknown>;
        const isRequired = (requestBodySchema.required as string[] | undefined)?.includes(propName) ?? false;
        fields.push({
          variable: propName,
          name: propName.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
          type: ps.type === "number" ? "number" : ps.type === "boolean" ? "boolean" : "text",
          required: isRequired,
          position: position++,
          validation: ps.pattern as string | undefined,
          example: ps.example as string | undefined,
          defaultValue: ps.default as string | undefined,
        });
      }
    }
  }

  const product = await prisma.apiProduct.create({
    data: {
      slug: finalSlug,
      displayName: String(info.title ?? "Imported API"),
      description: String(info.description ?? ""),
      version: 1,
      status: "draft",
      vendorId,
      method: firstMethod.toUpperCase(),
      baseUrl: "https://api.example.com",
      endpointPath: firstPath,
      requestBodyType: "json",
      requestBodyTemplate: requestBodySchema ?? {},
      fields: { create: fields },
      defaultPrice: 100,
      defaultCost: 50,
      billingModel: "per_request",
      createdBy: userId,
    },
  });

  return product;
}

export async function POST(request: Request, { params }: RouteContext) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  let vendorId = id;

  if (!vendorId) {
    const body = await request.json();
    vendorId = body.vendorId;
  }

  if (!vendorId) {
    return NextResponse.json({ error: "vendorId required" }, { status: 400 });
  }

  const vendor = await prisma.vendor.findUnique({ where: { id: vendorId } });
  if (!vendor) return NextResponse.json({ error: "Vendor not found" }, { status: 404 });

  const body = await request.json();
  const collection = body.collection;

  if (!collection || !collection.info) {
    return NextResponse.json({ error: "Invalid Postman collection" }, { status: 400 });
  }

  try {
    const openApiSpec = postmanToOpenApi(collection);
    const product = await createProductFromOpenApi(openApiSpec, vendorId, session.user.id);

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("Postman import error:", error);
    return NextResponse.json({ error: "Failed to import collection" }, { status: 500 });
  }
}