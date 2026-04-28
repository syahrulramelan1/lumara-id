import { NextRequest, NextResponse } from "next/server";

const ALLOWED_ORIGINS = [
  "https://admni-panel.onrender.com",
  "http://localhost:5173",
  "http://localhost:4173",
];

export function middleware(request: NextRequest) {
  const origin = request.headers.get("origin") ?? "";
  const isAllowed = ALLOWED_ORIGINS.includes(origin);

  const corsHeaders: Record<string, string> = {
    "Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type,x-admin-secret,Authorization",
  };
  if (isAllowed) {
    corsHeaders["Access-Control-Allow-Origin"] = origin;
  }

  // Handle OPTIONS preflight
  if (request.method === "OPTIONS") {
    return new NextResponse(null, { status: 200, headers: corsHeaders });
  }

  const response = NextResponse.next();
  Object.entries(corsHeaders).forEach(([k, v]) => response.headers.set(k, v));
  return response;
}

export const config = {
  matcher: "/api/admin/:path*",
};
