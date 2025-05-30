import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    const url = new URL(request.url);
    const id = url.pathname.split('/').pop(); // pobiera id z URL

    if (!id) {
      return NextResponse.json({ error: 'Brak ID' }, { status: 400 });
    }

    const backendUrl = `https://localhost:7060/Product/GetById?id=${id}`;
    const backendRes = await fetch(backendUrl);

    if (!backendRes.ok) {
      const text = await backendRes.text();
      console.error('❌ Błąd z backendu:', backendRes.status, text);
      return NextResponse.json({ error: 'Produkt nie znaleziony' }, { status: 404 });
    }

    const data = await backendRes.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error(' Błąd proxy API:', error.message);
    return NextResponse.json({ error: 'Błąd serwera proxy' }, { status: 500 });
  }
}
