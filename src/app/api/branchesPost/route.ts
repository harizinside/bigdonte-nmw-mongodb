import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const response = await fetch("https://nmw.prahwa.net/api/branches", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: "Gagal menyimpan data" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Terjadi kesalahan pada server", error: error },
      { status: 500 }
    );
  }
}
