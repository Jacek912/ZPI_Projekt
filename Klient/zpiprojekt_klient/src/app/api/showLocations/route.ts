import { NextResponse } from "next/server";
import axios from "axios";
import https from "https";

export async function GET() {
    try {
      const response = await axios.get("https://localhost:7060/StorageLocation/GetAll", {
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
      });
  
      return NextResponse.json(response.data, { status: 200 });
    } catch (error: any) {
      console.error("Location API fetch error:", error.message);
      return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
  }