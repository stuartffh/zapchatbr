'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Cliente {
  id: number;
  nome: string;
  telefone: string;
  endereco: string;
  status_pagamento: string;
  data_vencimento: string;
}

export default function Dashboard() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [novoCliente, setNovoCliente] = useState({ nome: '', telefone: '', endereco: '', status_pagamento: 'pendente', data_vencimento: '' });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    verificarAutenticacao();
  }, []);

  const verificarAutenticacao = async () => {
    const token = document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1];

    if (!token) {
      setIsAuthenticated(false);
      router.push('/login');
      return;
    }

    setIsAuthenticated(true);
    carregarClientes();
  };

  const carregarClientes = async () => {
    try {
      const res = await fetch('/api/clientes', {
        headers: {
          Authorization: `Bearer ${document.cookie.split('; ').find(row => row.startsWith('token='))?.split('=')[1]}`,
        },
      });

      if (!res.ok) {
        setIsAuthenticated(false);
        router.push('/login');
        return;
      }

      const data = await res.json();
      setClientes(data);
    } catch (error) {
      console.error('Erro ao carregar clientes', error);
    }
  };

  const adicionarCliente = async () => {
    await fetch('/api/clientes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(novoCliente),
    });
    carregarClientes();
  };

  const atualizarCliente = async (id: number, endereco: string, data_vencimento: string) => {
    await fetch('/api/clientes', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, endereco, data_vencimento }),
    });
    carregarClientes();
  };

  const deletarCliente = async (id: number) => {
    await fetch('/api/clientes', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    carregarClientes();
  };

  const handleLogout = () => {
    document.cookie = 'token=; Max-Age=0; path=/';
    router.push('/login');
  };

  if (isAuthenticated === null) {
    return <div className="min-h-screen flex items-center justify-center text-white">Verificando...</div>;
  }

  return (
    <div className="min-h-screen p-6 bg-gray-900 text-white">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold">📊 Dashboard - Vigilância</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-2 rounded-md text-white"
        >
          🚪 Sair
        </button>
      </div>

      {/* Formulário para Adicionar Cliente */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6">
        <h2 className="text-xl font-bold mb-2">Adicionar Cliente</h2>
        <input type="text" placeholder="Nome" className="p-2 w-full mb-2" onChange={e => setNovoCliente({ ...novoCliente, nome: e.target.value })} />
        <input type="text" placeholder="Telefone" className="p-2 w-full mb-2" onChange={e => setNovoCliente({ ...novoCliente, telefone: e.target.value })} />
        <input type="text" placeholder="Endereço" className="p-2 w-full mb-2" onChange={e => setNovoCliente({ ...novoCliente, endereco: e.target.value })} />
        <button className="bg-green-500 p-2 w-full rounded" onClick={adicionarCliente}>Adicionar</button>
      </div>

      {/* Tabela de Clientes */}
      <table className="w-full border border-gray-700">
        <thead>
          <tr className="bg-gray-800">
            <th className="p-3">Nome</th>
            <th className="p-3">Telefone</th>
            <th className="p-3">Endereço</th>
            <th className="p-3">Status</th>
            <th className="p-3">Vencimento</th>
            <th className="p-3">Ações</th>
          </tr>
        </thead>
        <tbody>
          {clientes.map(cliente => (
            <tr key={cliente.id} className="border-t border-gray-700">
              <td className="p-3">{cliente.nome}</td>
              <td className="p-3">{cliente.telefone}</td>
              <td className="p-3">
                <input type="text" className="p-1 w-full bg-gray-700" defaultValue={cliente.endereco} 
                  onBlur={e => atualizarCliente(cliente.id, e.target.value, cliente.data_vencimento)} />
              </td>
              <td className="p-3">{cliente.status_pagamento}</td>
              <td className="p-3">{new Date(cliente.data_vencimento).toLocaleDateString()}</td>
              <td className="p-3">
                <button className="bg-red-500 px-2 py-1 rounded" onClick={() => deletarCliente(cliente.id)}>🗑 Excluir</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
