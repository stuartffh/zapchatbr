import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'seuSegredoUltraSecreto';

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  if (!token) {
    return NextResponse.redirect(new URL('/login', req.url)); // Redireciona para login se não estiver autenticado
  }

  try {
    jwt.verify(token, JWT_SECRET);
    return NextResponse.next();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  } catch (error) {
    return NextResponse.redirect(new URL('/login', req.url)); // Redireciona se o token for inválido
  }
}

// Aplica o middleware apenas no dashboard
export const config = {
  matcher: '/dashboard/:path*',
};
