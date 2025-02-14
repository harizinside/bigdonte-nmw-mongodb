import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(
      "https://nmw.prahwa.net/api/kebijakan?keyword=kebijakan"
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
