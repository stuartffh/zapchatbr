import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// 📌 [PUT] Atualizar cliente por ID
export async function PUT(request: Request, context: { params: { id: string } }) {
  try {
    const { id } = context.params; // ✅ Extraindo corretamente o ID
    const { endereco, data_vencimento } = await request.json();

    const result = await pool.query(`
      UPDATE clientes 
      SET endereco = $1, data_vencimento = $2
      WHERE id = $3 RETURNING id
    `, [endereco, data_vencimento, id]);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Cliente atualizado com sucesso' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao atualizar cliente' }, { status: 500 });
  }
}

// 📌 [DELETE] Remover cliente por ID
export async function DELETE(request: Request, context: { params: { id: string } }) {
  try {
    const { id } = context.params; // ✅ Extraindo corretamente o ID

    const result = await pool.query(`
      DELETE FROM clientes WHERE id = $1 RETURNING id
    `, [id]);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Cliente removido com sucesso' });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro ao remover cliente' }, { status: 500 });
  }
}
