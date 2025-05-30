import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest) {
  try {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

    const body = await req.json();

    if (!body?.id || !body?.name || !body?.description) {
      return NextResponse.json({ error: 'Niepełne dane lokalizacji' }, { status: 400 });
    }

    const response = await fetch(`https://localhost:7060/StorageLocation`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: body.id,
        name: body.name,
        description: body.description,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error('Błąd DELETE:', response.status, text);
      return NextResponse.json({ error: 'Błąd backendu' }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Błąd w DELETE route:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
