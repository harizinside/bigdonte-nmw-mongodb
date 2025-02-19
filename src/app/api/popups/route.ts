import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const response = await fetch("https://nmw.prahwa.net/api/popups-all");

    if (!response.ok) {
      return NextResponse.json(
        { message: `Error: ${response.statusText}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    // Jika data sudah berupa array, gunakan langsung; jika berupa objek dengan properti data, gunakan data.data
    const popups = Array.isArray(data) ? data : data.data;

    const transformedPopups = popups.map((popup: { image: string; [key: string]: any }) => ({
      ...popup,
      image: `https://nmw.prahwa.net/storage/${popup.image}`,
    }));

    return NextResponse.json(transformedPopups, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching popup:", error);
    return NextResponse.json({ message: "Failed to fetch popup" }, { status: 500 });
  }
}
