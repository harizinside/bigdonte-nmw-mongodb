import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params; // Ambil ID dari URL
    const response = await fetch(`https://nmw.prahwa.net/api/popups/${id}`);

    if (!response.ok) {
      return NextResponse.json({ message: `Error: ${response.statusText}` }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching popup:", error);
    return NextResponse.json({ message: "Failed to fetch popup" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const body = await req.json();

    // Kirim permintaan ke API backend dengan payload JSON
    const response = await fetch(`https://nmw.prahwa.net/api/popups/update/${id}`, {
      method: "POST", // Metode POST sesuai backend utama
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error(`Failed to update popup: ${response.statusText}`);
    }

    const data = await response.json();

    return new NextResponse(JSON.stringify(data), {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  } catch (error: any) {
    console.error(error);
    return new NextResponse(JSON.stringify("error"), { status: 500 });
  }
}
