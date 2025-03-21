import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const response = await fetch("https://nmw.prahwa.net/api/services");

    if (!response.ok) {
      return NextResponse.json(
        { message: `Error: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Jika data.data adalah array, ubah URL gambar menjadi absolute URL
    if (Array.isArray(data.data)) {
      data.data.forEach((service: { image: string }) => {
        service.image = `https://nmw.prahwa.net/storage/${service.image}`;
      });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching services:", error);
    return NextResponse.json({ message: "Failed to fetch services" }, { status: 500 });
  }
}

