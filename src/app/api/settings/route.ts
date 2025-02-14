import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(
      "https://nmw.prahwa.net/api/settings"
    );
    if (!response.ok) {
      throw new Error("Failed to fetch data");
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching data" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json(); // Mengambil data dari request body

    const response = await fetch("https://nmw.prahwa.net/api/settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error("Failed to post data");
    }

    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
