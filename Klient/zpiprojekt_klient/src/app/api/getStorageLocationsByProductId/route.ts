import { NextRequest, NextResponse } from 'next/server';
import https from 'https';
import axios from 'axios';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get('productId');

  if (!productId) {
    return NextResponse.json({ error: "Brak parametru productId" }, { status: 400 });
  }

  const agent = new https.Agent({
    rejectUnauthorized: false,
  });

  try {
    const backendUrl = `https://localhost:7060/Product/GetStorageLocationsByProductId?productId=${productId}`;

    const response = await axios.get(backendUrl, {
      httpsAgent: agent,
      headers: {
        Accept: 'application/json',
      },
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Błąd podczas pobierania lokalizacji produktu:", error);
    return NextResponse.json({ error: "Nie udało się pobrać danych" }, { status: 500 });
  }
}
