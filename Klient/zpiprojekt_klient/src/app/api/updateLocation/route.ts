import { NextRequest, NextResponse } from 'next/server';

export async function PUT(req: NextRequest) {
    try {
      process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0"; 
  
      const body = await req.json();
      console.log("Received body:", body);
  
      const response = await fetch(`https://localhost:7060/StorageLocation/UpdateLocation`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
  
      if (!response.ok) {
        const text = await response.text();
        console.error('Błąd PUT:', response.status, text);
        return NextResponse.json({ error: 'Błąd backendu' }, { status: 500 });
      }
  
      return NextResponse.json({ success: true });
    } catch (error: any) {
      console.error('Błąd w PUT route:', error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
  