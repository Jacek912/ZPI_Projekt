import { NextResponse } from "next/server";
import axios from "axios";
import https from "https";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const response = await axios.post("https://localhost:7060/Product", body, {
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    return NextResponse.json(response.data, { status: 200 });
  } catch (error: any) {
    console.error("Product API proxy error:", error.response?.status, error.response?.data);
    return NextResponse.json(
      { error: error.response?.data || "Wystąpił błąd podczas dodawania produktu." },
      { status: 500 }
    );
  }
}