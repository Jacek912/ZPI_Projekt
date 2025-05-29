// app/api/removeProductFromLocation/route.ts
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import https from "https";

export async function PUT(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const locationId = searchParams.get("locationId");
    const productId = searchParams.get("productId");

    if (!locationId || !productId) {
      return NextResponse.json(
        { error: "Brakuje locationId lub productId" },
        { status: 400 }
      );
    }

    const response = await axios.put(
      `https://localhost:7060/StorageLocation/RemoveProduct`,
      null,
      {
        params: { locationId, productId },
        httpsAgent: new https.Agent({ rejectUnauthorized: false }),
        headers: { Accept: "*/*" },
      }
    );

    return NextResponse.json({ success: true, result: response.data });
  } catch (error: any) {
    console.error("Remove error:", error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data || "Wystąpił błąd" },
      { status: 500 }
    );
  }
}
