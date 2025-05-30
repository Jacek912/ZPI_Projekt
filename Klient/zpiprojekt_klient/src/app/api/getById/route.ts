import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Brak ID produktu' }, { status: 400 });
    }

    const response = await fetch(`https://localhost:7060/Product/GetById?id=${id}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('Błąd GET:', response.status, text);
      return NextResponse.json({ error: 'Błąd backendu przy pobieraniu produktu' }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Błąd w GET route:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
