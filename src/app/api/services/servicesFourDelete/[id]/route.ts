import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params; // Ambil id dari params

    const response = await fetch(`https://nmw.prahwa.net/api/patient/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      return NextResponse.json({ message: `Error: ${response.statusText}` }, { status: response.status });
    }

    return NextResponse.json({ message: "patient berhasil dihapus" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting patient:", error);
    return NextResponse.json({ message: "Failed to delete patient" }, { status: 500 });
  }
}
