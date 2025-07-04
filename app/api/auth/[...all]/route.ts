import { auth } from "$/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";
import { NextRequest, NextResponse } from "next/server";

const handler = toNextJsHandler(auth);

function addCorsHeaders(response: Response) {
  const newResponse = new NextResponse(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  });
  newResponse.headers.set(
    "Access-Control-Allow-Origin",
    process.env.NEXT_PUBLIC_CORS_ORIGIN || "*"
  );
  newResponse.headers.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  newResponse.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization"
  );
  return newResponse;
}

export async function GET(request: NextRequest) {
  const response = await handler.GET(request);
  return addCorsHeaders(response);
}

export async function POST(request: NextRequest) {
  const response = await handler.POST(request);
  return addCorsHeaders(response);
}
