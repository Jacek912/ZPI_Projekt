import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    const url = new URL(request.url);
    const locationId = url.pathname.split('/').pop(); // lub użyj `url.searchParams` jeśli to query

    if (!locationId || isNaN(Number(locationId))) {
      return NextResponse.json({ error: 'Nieprawidłowe locationId' }, { status: 400 });
    }

    const backendUrl = `https://localhost:7060/StorageLocation/GetAllProductsByLocationId?locationId=${locationId}`;
    const backendRes = await fetch(backendUrl, {
      headers: {
        Accept: 'text/plain',
      },
    });

    if (!backendRes.ok) {
      const text = await backendRes.text();
      console.error('❌ Błąd z backendu:', backendRes.status, text);
      return NextResponse.json({ error: 'Nie znaleziono produktów dla lokalizacji' }, { status: 404 });
    }

    const data = await backendRes.text();
    return new NextResponse(data, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch (error: any) {
    console.error('❌ Błąd proxy API:', error.message);
    return NextResponse.json({ error: 'Błąd serwera proxy' }, { status: 500 });
  }
}
