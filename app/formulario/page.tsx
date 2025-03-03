'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Formulario() {
  const [formData, setFormData] = useState({
    nome: '',
    endereco: '',
    telefone: '',
    email: '',
  });

  const [status, setStatus] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('Enviando...');

    const response = await fetch('/api/formulario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    if (response.ok) {
      setStatus('Cadastro realizado com sucesso!');
      setFormData({ nome: '', endereco: '', telefone: '', email: '' });
    } else {
      setStatus(`Erro: ${data.error}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-blue-400 mb-4">Cadastro de Cliente</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="nome"
            placeholder="Nome Completo"
            value={formData.nome}
            onChange={handleChange}
            required
            className="w-full p-3 bg-gray-700 rounded"
          />
          <input
            type="text"
            name="endereco"
            placeholder="Endereço"
            value={formData.endereco}
            onChange={handleChange}
            required
            className="w-full p-3 bg-gray-700 rounded"
          />
          <input
            type="tel"
            name="telefone"
            placeholder="Telefone"
            value={formData.telefone}
            onChange={handleChange}
            required
            className="w-full p-3 bg-gray-700 rounded"
          />
          <input
            type="email"
            name="email"
            placeholder="E-mail"
            value={formData.email}
            onChange={handleChange}
            required
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
