import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const page = searchParams.get("page") || "1";

    const response = await fetch(`https://nmw.prahwa.net/api/faqs?page=${page}`);

    if (!response.ok) {
      return NextResponse.json({ message: `Error: ${response.statusText}` }, { status: response.status });
    }

    const data = await response.json();

    return NextResponse.json({
      data: data.data,
      pagination: {
        currentPage: data.meta?.current_page || 1,
        totalPages: data.meta?.last_page || 1,
        perPage: data.meta?.per_page || 10,
        total: data.meta?.total || 0,
        links: data.links || [],
      },
    }, { status: 200 });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return NextResponse.json({ message: "Failed to fetch doctors" }, { status: 500 });
  }
}

