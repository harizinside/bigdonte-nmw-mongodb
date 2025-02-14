import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params; // Ambil ID dari URL
    const response = await fetch(`https://nmw.prahwa.net/api/faqs/${id}`);

    if (!response.ok) {
      return NextResponse.json({ message: `Error: ${response.statusText}` }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Error fetching faq:", error);
    return NextResponse.json({ message: "Failed to fetch faq" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
      const id = params.id;
      const requestData = await req.json(); // Ubah dari formData ke JSON
  
      console.log("Request Data:", requestData); // Debugging data yang dikirim
  
      // Kirim ke API backend dengan format JSON
      const response = await fetch(`https://nmw.prahwa.net/api/faqs/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json", // Pastikan header ini ada
          "Accept": "application/json",
        },
        body: JSON.stringify(requestData),
      });
  
      // Cek jika request gagal
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error Response:", errorText);
        throw new Error(`Failed to update faq: ${errorText}`);
      }
  
      const data = await response.json();
      return new NextResponse(JSON.stringify(data), { status: 200 });
    } catch (error) {
      console.error(error);
      return new NextResponse(JSON.stringify({ error: "Error updating FAQ" }), { status: 500 });
    }
  }
  