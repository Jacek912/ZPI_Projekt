import axios from "axios";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get("username");
  const password = searchParams.get("password");

  if (!username || !password) {
    return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
  }

  try {
    const response = await axios.get("https://localhost:7060/Login", {
      params: { username, password },
      httpsAgent: new (require("https").Agent)({ rejectUnauthorized: false }),
    });

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error("Login proxy error:", error.message);
    return NextResponse.json({ error: "Login failed (proxy)" }, { status: 500 });
  }
}
