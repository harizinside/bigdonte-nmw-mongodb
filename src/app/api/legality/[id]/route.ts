import { connectToDatabase } from "@/lib/mongodb";
import Legality from "@/models/legality";
import { NextResponse } from "next/server";
import { validateToken } from "@/lib/auth";

export async function GET(req: any, { params }: any) {
  const authError = validateToken(req);
  if (authError) return authError;

  await connectToDatabase();

  const legalityId = "67d811d72cc8e3c40f63456d";

  const legality = await Legality.findById(legalityId);
  if (!legality) return NextResponse.json({ message: "legality not found" }, { status: 404 });
  return NextResponse.json(legality, { status: 200 });
}

export async function PUT(req: { json: () => PromiseLike<{ privacyPolicy: any; termsCondition: any;}> | { privacyPolicy: any; termsCondition: any;}; }, { params }: { params: { id: string } }) {
  try {
    const authError = validateToken(req);
    if (authError) return authError;
    await connectToDatabase();

    let requestBody;
    try {
      requestBody = await req.json();
    } catch (jsonError) {
      console.error("❌ Error parsing JSON:", jsonError);
      return NextResponse.json({ error: "Invalid JSON format" }, { status: 400 });
    }

    const { privacyPolicy, termsCondition } = requestBody;

    if (!privacyPolicy || !termsCondition) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    const legalityId = "67d811d72cc8e3c40f63456d";

    // Update the existing document by ID
    const updatedLegality = await Legality.findByIdAndUpdate(
      legalityId,
      { privacyPolicy, termsCondition },
      { new: true }
    );

    if (!updatedLegality) {
      return NextResponse.json({ error: "Legality document not found" }, { status: 404 });
    }

    return NextResponse.json(updatedLegality, { status: 200 });
  } catch (error) {
    console.error("❌ Error updating legality:", error);
    return NextResponse.json({ error: "Failed to update legality" }, { status: 500 });
  }
}