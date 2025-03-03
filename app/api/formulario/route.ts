import { NextResponse } from 'next/server';
import { Pool } from 'pg';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const LRUCache = require('lru-cache');



// Configuração do banco de dados
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Configuração do rate limit (máximo de 5 tentativas a cada 15 minutos por IP)
const rateLimit = new LRUCache({
  max: 100, // Máximo de IPs armazenados
  ttl: 15 * 60 * 1000, // 15 minutos (tempo de expiração dos registros)
});


// Função para validar CPF
const validarCPF = (cpf: string) => {
  cpf = cpf.replace(/\D/g, '');
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  let soma = 0, resto;
  for (let i = 1; i <= 9; i++) soma += parseInt(cpf[i - 1]) * (11 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf[9])) return false;

  soma = 0;
  for (let i = 1; i <= 10; i++) soma += parseInt(cpf[i - 1]) * (12 - i);
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpf[10])) return false;

  return true;
};

// Função para validar telefone
const validarTelefone = (telefone: string) => {
  const regex = /^\(?\d{2}\)?\s?\d{5}-?\d{4}$/;
  return regex.test(telefone);
};

export async function POST(request: Request) {
  try {
    // Obtém o IP do usuário
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('cf-connecting-ip') || '127.0.0.1';

    // Verifica o limite de requisições
    const tentativas = rateLimit.get(ip) || 0;
    if (tentativas >= 5) {
      return NextResponse.json({ error: 'Muitas tentativas, tente novamente mais tarde.' }, { status: 429 });
    }
    rateLimit.set(ip, tentativas + 1);

    // Obtém os dados do corpo da requisição
    const { nome, cpf, endereco, telefone, email } = await request.json();

    // Validações antes da inserção
    if (!nome.includes(' ')) {
      return NextResponse.json({ error: 'Informe o nome completo.' }, { status: 400 });
    }

    if (!validarCPF(cpf)) {
      return NextResponse.json({ error: 'CPF inválido.' }, { status: 400 });
    }

    if (!validarTelefone(telefone)) {
      return NextResponse.json({ error: 'Formato de telefone inválido. Use (XX) 9XXXX-XXXX' }, { status: 400 });
    }

    // Verifica se CPF ou Endereço já existem no banco
    const checkExist = await pool.query(
      'SELECT * FROM clientes WHERE cpf = $1 OR endereco = $2',
      [cpf, endereco]
    );

    if (checkExist.rows.length > 0) {
      return NextResponse.json({ error: 'CPF ou Endereço já cadastrado.' }, { status: 400 });
    }

    // Insere no banco de dados
    const result = await pool.query(
      'INSERT INTO clientes (nome, cpf, endereco, telefone, email) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [nome, cpf, endereco, telefone, email]
    );

    return NextResponse.json({ message: 'Cadastro realizado com sucesso!', id: result.rows[0].id });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Erro no servidor' }, { status: 500 });
  }
}
