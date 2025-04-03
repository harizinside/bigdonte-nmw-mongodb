import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Services from "@/models/services";
import ServicesList from "@/models/servicesList";
import Article from "@/models/articles";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    try {
        // Ambil parameter pencarian dari URL
        const { searchParams } = new URL(req.url);
        const query = searchParams.get("q")?.trim();

        if (!query) {
            return NextResponse.json({ error: "Query kosong" }, { status: 400 });
        }

        // Koneksi ke database
        await connectToDatabase();
        console.log("✅ Database connected");

        // Buat regex agar pencarian lebih fleksibel
        const regexQuery = new RegExp(query.split(" ").join("|"), "i");

        // Jalankan pencarian di semua koleksi secara paralel
        const [resultsServices, resultsServicesList, resultsArticles] = await Promise.all([
            Services.find({ name: regexQuery }),
            ServicesList.find({ name: regexQuery }),
            Article.find({ title: regexQuery }),
        ]);

        // Logging jumlah hasil untuk debugging
        console.log(`🔍 Ditemukan: Services (${resultsServices.length}), ServicesList (${resultsServicesList.length}), Articles (${resultsArticles.length})`);

        return NextResponse.json({ resultsServices, resultsServicesList, resultsArticles });
    } catch (error) {
        console.error("❌ Error saat pencarian:", error);
        return NextResponse.json({ error: "Terjadi kesalahan" }, { status: 500 });
    }
}