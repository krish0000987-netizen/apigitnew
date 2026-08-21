import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function fakeDetails(path: string, body: any) {
  const aadhaar = body?.aadhaar || body?.aadhaar_number || body?.document_number || body?.pan_number || body?.pan || body?.mobile || "000000000000";
  const last4 = String(aadhaar).slice(-4);
  const isAadhaar = path.includes("aadhaar") || path.includes("basic_aadhaar");
  const isPan = path.includes("pan");
  const isVoter = path.includes("voter");
  const isDl = path.includes("dl");
  const isRc = path.includes("rc");
  const isGst = path.includes("gst");
  if (isAadhaar) {
    return {
      aadhaar_number: aadhaar,
      aadhaar_age_band: "20-30",
      aadhaar_gender: Number(last4) % 2 === 0 ? "MALE" : "FEMALE",
      aadhaar_state: "Karnataka",
      aadhaar_result: `Aadhaar Number ${aadhaar} Exists! (CrossVerify mock)`,
      name: `Test User ${last4}`,
      care_of: "S/O Test Father",
      address: "123 Test Street, Bangalore, Karnataka 560001",
      dob: "1995-06-15",
      verification_status: "verified",
    };
  }
  if (isPan) {
    return {
      pan_number: aadhaar,
      pan_status: "Valid",
      name: `Test User ${last4}`,
      father_name: "Test Father",
      dob: "1995-06-15",
      verification_status: "verified",
      category: "Individual",
    };
  }
  if (isVoter) {
    return { voter_id: aadhaar, name: `Test User ${last4}`, father_name: "Test Father", age: "28", gender: "MALE", address: "Test Address", verification_status: "verified" };
  }
  if (isDl) {
    return { dl_number: aadhaar, name: `Test User ${last4}`, father_name: "Test Father", dob: "1995-06-15", address: "Test Address", valid_upto: "2030-12-31", verification_status: "verified" };
  }
  if (isRc) {
    return { rc_number: aadhaar, owner_name: `Test User ${last4}`, father_name: "Test Father", vehicle_class: "LMV", fuel: "PETROL", verification_status: "verified" };
  }
  if (isGst) {
    return { gstin: aadhaar, legal_name: `Test Business ${last4}`, trade_name: `Test Trade`, address: "Test GST Address", status: "Active", verification_status: "verified" };
  }
  return {
    status: "success",
    verification_status: "verified",
    name: `Test User ${last4}`,
    message: `Mock success for ${path}`,
    received: body,
  };
}

async function handler(req: Request) {
  const url = new URL(req.url);
  const path = url.pathname.replace("/api/mock/crossverify", "") || "/";
  let body: any = null;
  let raw = "";
  try {
    raw = await req.text();
    body = raw ? JSON.parse(raw) : null;
  } catch {
    body = raw || null;
  }
  const clientRef = body?.client_ref_num || body?.clientRefNum || body?.client_ref_no || "test991";
  const details = fakeDetails(path, body || {});
  return NextResponse.json({
    http_response_code: 200,
    result_code: 101,
    request_id: `mock_${Date.now()}`,
    client_ref_num: clientRef,
    result: details,
    success: true,
    mock: true,
  });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
