import { NextResponse } from 'next/server';

export async function GET() {
  const response = NextResponse.redirect(new URL('/login', process.env.NEXT_PUBLIC_BASE_URL || 'https://www.zapchatbr.com/'));
  response.cookies.set('token', '', { path: '/', maxAge: 0 });
  return response;
}
