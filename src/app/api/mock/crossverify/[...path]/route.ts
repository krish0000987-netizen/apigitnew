import { NextResponse } from "next/server";

// Mock CrossVerify (Digitap) for sandbox testing - no real token needed
// Returns success for any path/method so white-label tester shows Normal + JSON
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function handler(req: Request) {
  const url = new URL(req.url);
  const path = url.pathname.replace("/api/mock/crossverify", "") || "/";
  let body: unknown = null;
  try {
    const text = await req.text();
    body = text ? JSON.parse(text) : null;
  } catch {
    body = null;
  }
  const clientRef = (body as any)?.client_ref_num || (body as any)?.clientRefNum || "test991";
  return NextResponse.json({
    http_response_code: 200,
    result_code: 101,
    request_id: `mock_${Date.now()}`,
    client_ref_num: clientRef,
    result: {
      status: "success",
      message: `Mock success for ${path} - replace sandbox key with real Digitap token for live verification`,
      mock: true,
      received: body,
      aadhaar_result: "Aadhaar Number Exists! (mock)",
      verification_status: "verified",
    },
  });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
