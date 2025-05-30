import { NextResponse } from "next/server";
import axios from "axios";
import https from "https";

export async function PUT(req: Request) {
  try {
    const { locationId, productId } = await req.json();

    if (!locationId || !productId) {
      return NextResponse.json(
        { error: "Wymagane są pola locationId i productId." },
        { status: 400 }
      );
    }

    const response = await axios.put(
      `https://localhost:7060/StorageLocation/AddProduct`,
      null,
      {
        params: {
          locationId,
          productId,
        },
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
        headers: {
          "Accept": "*/*",
        },
      }
    );

    return NextResponse.json(response.data, { status: 200 });
  } catch (error: any) {
    console.error("Błąd proxy addProductToLocation:", error.response?.data || error.message);
    return NextResponse.json(
      { error: error.response?.data || "Wystąpił błąd podczas dodawania produktu do lokalizacji." },
      { status: 500 }
    );
  }
}
