import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  try {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    const { searchParams } = new URL(req.url);
    const name = searchParams.get('name');

    if (!name) {
      return NextResponse.json({ error: 'Brak parametru name' }, { status: 400 });
    }

    const response = await fetch(`https://localhost:7060/StorageLocation/GetByName?name=${encodeURIComponent(name)}`, {
      method: 'GET',
      headers: {
        accept: 'text/plain',
      },
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('Błąd backendu:', response.status, text);
      return NextResponse.json({ error: 'Błąd przy pobieraniu lokalizacji' }, { status: 500 });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Błąd w API route getLocationByName:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}