import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(req: NextRequest) {
  try {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; 

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'No product ID provided' }, { status: 400 });
    }

    console.log("ID:", id);

    const response = await fetch(`https://localhost:7060/Product?id=${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
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
