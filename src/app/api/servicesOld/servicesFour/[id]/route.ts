import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params; // Ambil ID dari URL
    const response = await fetch(`https://nmw.prahwa.net/api/patient?subtos_id=${id}`);

    if (!response.ok) {
      return NextResponse.json({ message: `Error: ${response.statusText}` }, { status: response.status });
    }

    const data = await response.json();
    if (Array.isArray(data.data)) {
        data.data.forEach((service: { image: string }) => {
          service.image = `https://nmw.prahwa.net/storage/${service.image}`;
        });
      }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching service:", error);
    return NextResponse.json({ message: "Failed to fetch service" }, { status: 500 });
  }
} 