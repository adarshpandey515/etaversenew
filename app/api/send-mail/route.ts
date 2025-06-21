import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { to, subject, text, html } = await req.json();

  const response = await fetch('https://gxxxxxxx.com', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to, subject, text, html }),
  });

  const result = await response.json();
  return NextResponse.json(result);
}