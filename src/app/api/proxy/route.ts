import { NextRequest, NextResponse } from "next/server";
import validator from "validator";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const path = searchParams.get("path");
  const type = searchParams.get("type");

  if (!path || !type) {
    return NextResponse.json({ error: "Path and type are required" }, { status: 400 });
  }

  if (!validator.isURL(path)) {
    return NextResponse.json({ error: "Path must be a valid URL" }, { status: 400 });
  }

  if (!validator.isAlpha(type)) {
    return NextResponse.json({ error: "Type must be a valid string" }, { status: 400 });
  }

  const cloudinaryUrl = `https://res.cloudinary.com/duwyojrax/${type}/upload/${path}`;
  return NextResponse.redirect(cloudinaryUrl, 301);
}