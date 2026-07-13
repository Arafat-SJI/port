import { NextResponse } from "next/server";
import { readSectionOrderFromSupabase } from "@/lib/sectionOrderServer";

export async function GET() {
  const order = await readSectionOrderFromSupabase();
  return NextResponse.json({ order });
}
