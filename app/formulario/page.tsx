'use client';

import { useState } from 'react';
import Link from 'next/link';

// Função para validar CPF
const validarCPF = (cpf: string) => {
  cpf = cpf.replace(/\D/g, ''); // Remove não numéricos
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

// Função para validar telefone (WhatsApp)
const validarTelefone = (telefone: string) => {
  const regex = /^\(?\d{2}\)?\s?\d{5}-?\d{4}$/;
  return regex.test(telefone);
};

export default function Formulario() {
  const [formData, setFormData] = useState({
    nome: '',
    cpf: '',
    endereco: '',
    telefone: '',
    email: '',
  });

  const [status, setStatus] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus(null);

    // Validações antes do envio
    const newErrors: { [key: string]: string } = {};
    
    // Nome deve ter pelo menos duas palavras
    if (!formData.nome.includes(' ')) {
      newErrors.nome = 'Informe o nome completo.';
    }

    // CPF deve ser válido
    if (!validarCPF(formData.cpf)) {
      newErrors.cpf = 'CPF inválido.';
    }

    // Telefone deve ter formato válido
    if (!validarTelefone(formData.telefone)) {
      newErrors.telefone = 'Formato inválido. Use (XX) 9XXXX-XXXX.';
    }

    setErrors(newErrors);

    // Se houver erros, não envia
    if (Object.keys(newErrors).length > 0) return;

    setStatus('Enviando...');

    const response = await fetch('/api/formulario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    if (response.ok) {
      setStatus('Cadastro realizado com sucesso!');
      setFormData({ nome: '', cpf: '', endereco: '', telefone: '', email: '' });
    } else {
      setStatus(`Erro: ${data.error}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-blue-400 mb-4">Cadastro de Cliente</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="text"
              name="nome"
              placeholder="Nome Completo"
              value={formData.nome}
              onChange={handleChange}
              required
              className="w-full p-3 bg-gray-700 rounded"
            />
            {errors.nome && <p className="text-red-400 text-sm">{errors.nome}</p>}
          </div>

          <div>
            <input
              type="text"
              name="cpf"
              placeholder="CPF (000.000.000-00)"
              value={formData.cpf}
              onChange={handleChange}
              required
              className="w-full p-3 bg-gray-700 rounded"
            />
            {errors.cpf && <p className="text-red-400 text-sm">{errors.cpf}</p>}
          </div>

          <input
            type="text"
            name="endereco"
            placeholder="Endereço"
            value={formData.endereco}
            onChange={handleChange}
            required
            className="w-full p-3 bg-gray-700 rounded"
          />

          <div>
            <input
              type="tel"
              name="telefone"
              placeholder="Telefone (WhatsApp) (XX) 9XXXX-XXXX"
              value={formData.telefone}
              onChange={handleChange}
              required
              className="w-full p-3 bg-gray-700 rounded"
            />
            {errors.telefone && <p className="text-red-400 text-sm">{errors.telefone}</p>}
          </div>

          <input
            type="email"
            name="email"
            placeholder="E-mail (Opcional)"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-3 bg-gray-700 rounded"
          />

          <button type="submit" className="w-full bg-blue-500 py-2 rounded font-bold hover:bg-blue-400">
            Enviar
          </button>
        </form>

        {status && <p className="mt-4 text-center">{status}</p>}

        <div className="mt-4 text-center">
          <Link href="/" className="text-blue-300 hover:text-blue-500">Voltar para a Página Inicial</Link>
        </div>
      </div>
    </div>
  );
}
