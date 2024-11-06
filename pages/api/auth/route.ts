import { NextResponse } from "next/server";
import { parse } from "cookie";

export async function GET(request: Request) {
  const cookies = request.headers.get("cookie") || "";
  const parsedCookies = parse(cookies);
  const userData = parsedCookies.userData ? JSON.parse(parsedCookies.userData) : null;

  return NextResponse.json({ email: userData?.email || "" });
}
