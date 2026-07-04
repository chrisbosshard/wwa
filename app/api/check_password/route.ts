import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  const password = body?.password ?? "";
  return NextResponse.json({ success: password === process.env.NEXT_PASSWORD_ADMIN });
}
