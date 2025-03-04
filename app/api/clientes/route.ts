import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// 📌 [GET] Listar todos os clientes
export async function GET() {
  try {
    const result = await pool.query(`
      SELECT id, nome, telefone, endereco, status_pagamento, data_vencimento 
      FROM clientes
      ORDER BY data_vencimento ASC
    `);
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao buscar clientes' }, { status: 500 });
  }
}

// 📌 [POST] Adicionar um novo cliente manualmente
export async function POST(request: Request) {
  try {
    const { nome, telefone, endereco, status_pagamento, data_vencimento } = await request.json();
    
    const result = await pool.query(`
      INSERT INTO clientes (nome, telefone, endereco, status_pagamento, data_vencimento)
      VALUES ($1, $2, $3, $4, $5) RETURNING id
    `, [nome, telefone, endereco, status_pagamento, data_vencimento]);

    return NextResponse.json({ message: 'Cliente adicionado com sucesso', id: result.rows[0].id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao adicionar cliente' }, { status: 500 });
  }
}
