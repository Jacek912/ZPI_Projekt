import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

export async function PUT(req: NextRequest, { params }: { params: { storageProductId: string } }) {
  const { storageProductId } = params;
  const { searchParams } = new URL(req.url);
  const locationId = searchParams.get('locationId');

  if (!locationId || !storageProductId) {
    return NextResponse.json({ error: 'Brak wymaganych parametrów.' }, { status: 400 });
  }

  try {
    const apiUrl = `https://localhost:7060/StorageLocation/AddProduct?locationId=${locationId}&productId=${storageProductId}`;
    const response = await axios.put(apiUrl);

    return new NextResponse(response.data, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.response?.data || 'Błąd podczas dodawania produktu do lokalizacji.' },
      { status: error.response?.status || 500 }
    );
  }
}
