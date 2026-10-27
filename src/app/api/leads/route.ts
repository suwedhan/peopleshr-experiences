// Mock lead endpoint. In production this would forward the lead to a CRM
// (e.g. HubSpot or Salesforce). Here it validates and logs it.
export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const email = typeof body.email === "string" ? body.email.trim() : "";
  const name = typeof body.name === "string" ? body.name.trim() : "";

  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ ok: false, error: "Name and a valid email are required" }, { status: 422 });
  }

  console.info("[lead]", JSON.stringify({ ...body, receivedAt: new Date().toISOString() }));

  return Response.json({ ok: true });
}
