import { NextResponse } from "next/server";
import axios from "axios";
import https from "https";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const url = `https://localhost:7060/StorageLocation?name=${encodeURIComponent(
      body.name
    )}&description=${encodeURIComponent(body.description)}`;

    const response = await axios.post(url, null, {
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    return NextResponse.json(response.data, { status: 200 });
  } catch (error: any) {
    console.error("Location API proxy error:", error.response?.status, error.response?.data);
    return NextResponse.json(
      { error: error.response?.data || "Wystąpił błąd podczas dodawania lokalizacji." },
      { status: 500 }
    );
  }
}
