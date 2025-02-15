import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params; // Ambil ID dari URL
    const response = await fetch(`https://nmw.prahwa.net/api/catalogs/${id}`);

    if (!response.ok) {
      return NextResponse.json({ message: `Error: ${response.statusText}` }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching catalog:", error);
    return NextResponse.json({ message: "Failed to fetch catalog" }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const id = params.id;
    const formData = await req.formData();

    // Kirim permintaan ke API backend
    const response = await fetch(`https://nmw.prahwa.net/api/catalogs/update/${id}`, {
      method: "POST", // Sesuai dengan backend utama
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Failed to update catalog: ${response.statusText}`);
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
  } catch (error) {
    console.error(error);
    return new NextResponse(JSON.stringify('eror'), { status: 500 });
  }
}
