import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'seuSegredoUltraSecreto';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.headers.set('x-user-data', JSON.stringify(decoded)); // Passa dados do usuário no header
    return NextResponse.next();
  } catch (error) {
    console.error('Erro ao verificar token:', error);
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

// Protege apenas a rota do dashboard
export const config = {
  matcher: '/dashboard/:path*',
};
