import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const JWT_SECRET = process.env.JWT_SECRET || 'seuSegredoUltraSecreto';

export async function POST(request: Request) {
  try {
    const { email, senha } = await request.json();
    
    // Busca o usuário no banco
    const result = await pool.query(`SELECT * FROM usuarios WHERE email = $1`, [email]);
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 401 });
    }

    const user = result.rows[0];

    // Verifica a senha com bcrypt
    const senhaValida = await bcrypt.compare(senha, user.senha);
    if (!senhaValida) {
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 });
    }

    // Gera o Token JWT
    const token = jwt.sign(
      { id: user.id, nome: user.nome, email: user.email },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    return NextResponse.json({ token, nome: user.nome });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro no servidor' }, { status: 500 });
  }
}

