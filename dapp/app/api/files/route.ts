import { NextResponse, type NextRequest } from "next/server";
import { pinata } from "@/utils/config";

export async function POST(request: NextRequest) {
  try {
    const metadata = await request.json();
    const { cid } = await pinata.upload.public.json(metadata);
    const url = await pinata.gateways.public.convert(cid);
    return NextResponse.json({ cid, url }, { status: 200 });
  } catch (e) {
    console.error("Metadata upload error:", e);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}