import { NextResponse } from "next/server";

export async function GET() {
    try {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
const response = await fetch("https://localhost:7060/Product"); if (!response.ok) {
            const text = await response.text();
            console.error("❌ Błąd z backendu:", response.status, text);
            return NextResponse.json(
                { error: `Błąd backendu: ${response.status}` },
                { status: 500 }
            );
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: any) { console.error("❌ Błąd w proxy route:", error.message); return NextResponse.json({ error: error.message || "Błąd proxy API" }, { status: 500 }); }
}