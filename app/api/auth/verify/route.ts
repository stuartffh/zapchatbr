/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'seuSegredoUltraSecreto';

export async function GET(request: Request) {
  try {
    const token = request.headers.get('cookie')?.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

    if (!token) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    jwt.verify(token, JWT_SECRET);
    return NextResponse.json({ message: 'Autenticado' });
  } catch (error) {
    return NextResponse.json({ error: 'Token inválido' }, { status: 401 });
  }
}
