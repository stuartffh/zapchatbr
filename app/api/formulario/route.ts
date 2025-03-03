import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

export async function POST(request: Request) {
  try {
    const { nome, endereco, telefone, email } = await request.json();

    if (nome.length > 100 || endereco.length > 200 || telefone.length > 20 || email.length > 100) {
      return NextResponse.json({ error: 'Dados inválidos' }, { status: 400 });
    }

    const result = await pool.query(
      'INSERT INTO clientes (nome, endereco, telefone, email) VALUES ($1, $2, $3, $4) RETURNING id',
      [nome, endereco, telefone, email]
    );

    return NextResponse.json({ message: 'Cadastro realizado com sucesso', id: result.rows[0].id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro no servidor' }, { status: 500 });
  }
}
