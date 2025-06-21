// app/api/send-mail/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const data = await req.json();

    const response = await fetch('https://glapp.onrender.com/send-email-adarsh9876', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    // Try to parse the response
    const result = await response.json();

    // Return the Render server's response back to the client
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error forwarding email:', error);
    return NextResponse.json(
      { message: 'Failed to send email via Render server' },
      { status: 500 }
    );
  }
}
