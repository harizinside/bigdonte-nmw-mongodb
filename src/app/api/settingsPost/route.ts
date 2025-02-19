// import { NextResponse } from "next/server";

// export async function POST(req: Request) {
//     try {
//       const body = await req.json(); // Mengambil data dari request body
  
//       const response = await fetch("https://nmw.prahwa.net/api/settings", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify(body),
//       });
  
//       if (!response.ok) {
//         throw new Error("Failed to post data");
//       }
  
//       const data = await response.json();
//       return NextResponse.json(data, { status: response.status });
//     } catch (error: any) {
//       return NextResponse.json({ message: error.message }, { status: 500 });
//     }
//   }

import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    // 1. Baca body dari request
    const body = await req.json();

    // 2. Kirim ke server eksternal
    const response = await fetch("https://nmw.prahwa.net/api/settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    // 3. Jika status bukan OK, lempar error
    if (!response.ok) {
      throw new Error(`Failed to post data. Status code: ${response.status}`);
    }

    // 4. Baca response sebagai teks
    const text = await response.text();

    // 5. Parsing ke JSON
    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      throw new Error(`Invalid JSON response: ${text.slice(0, 100)}...`);
    }

    // 6. Kembalikan ke client
    return NextResponse.json(data, { status: response.status });
  } catch (error: any) {
    // Tangani error
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
