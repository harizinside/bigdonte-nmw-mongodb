import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    let currentPage = 1;
    let lastPage = 1;
    let allDoctors: any[] = [];

    // Looping selama currentPage belum melebihi lastPage
    do {
      const response = await fetch(`https://nmw.prahwa.net/api/doctors?page=${currentPage}`);
      if (!response.ok) {
        return NextResponse.json(
          { message: `Error: ${response.statusText}` },
          { status: response.status }
        );
      }

      const data = await response.json();

      // Update lastPage dari meta data
      lastPage = data.meta?.last_page || 1;

      // Hilangkan properti `image` dari setiap dokter
      const doctorsWithoutImage = data.data.map((doctor: any) => {
        const { image, ...rest } = doctor;
        return rest;
      });

      // Gabungkan data dokter dari halaman ini dengan data sebelumnya
      allDoctors = [...allDoctors, ...doctorsWithoutImage];

      currentPage++;
    } while (currentPage <= lastPage);

    // Kembalikan seluruh data dokter tanpa properti image dan tanpa pagination
    return NextResponse.json(allDoctors, { status: 200 });
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return NextResponse.json(
      { message: "Failed to fetch doctors" },
      { status: 500 }
    );
  }
}
