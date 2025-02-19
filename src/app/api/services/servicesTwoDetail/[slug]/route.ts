import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params; // Ambil slug dari URL
    const response = await fetch(`https://nmw.prahwa.net/api/type-of-services/${slug}`);

    if (!response.ok) {
      return NextResponse.json({ message: `Error: ${response.statusText}` }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching service:", error);
    return NextResponse.json({ message: "Failed to fetch service" }, { status: 500 });
  }
} 

  