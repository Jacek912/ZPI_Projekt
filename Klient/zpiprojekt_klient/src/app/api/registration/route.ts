import axios from "axios";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import https from "https";

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const firstName = searchParams.get("firstName");
  const lastName = searchParams.get("lastName");

  if (!firstName || !lastName) {
    return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
  }

  try {
    const response = await axios.post(
      "https://localhost:7060/User",
      {}, 
      {
        params: { firstName, lastName },
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
      }
    );

    return NextResponse.json({ token: response.data }, { status: 200 });

  } catch (error: any) {
    console.error("Login proxy error:", error.message);
    return NextResponse.json({ error: "Login failed (proxy)" }, { status: 500 });
  }
}
