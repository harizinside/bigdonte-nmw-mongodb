import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request, { params }: { params: { id: string } }) {
    try {
      const id = params.id;
      const formData = await req.formData();
  
      // Kirim permintaan ke API backend
      const response = await fetch(`https://nmw.prahwa.net/api/sub-type-of-services/update/${id}`, {
        method: "POST", // Sesuai dengan backend utama
        body: formData,
      });
  
      if (!response.ok) {
        throw new Error(`Failed to update service list: ${response.statusText}`);
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