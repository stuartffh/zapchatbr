'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaUserPlus, FaTrash, FaSignOutAlt, FaEdit, FaCalendarAlt } from 'react-icons/fa';


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
  const [clienteEditando, setClienteEditando] = useState<Cliente | null>(null);
  const [novoCliente, setNovoCliente] = useState({ nome: '', telefone: '', endereco: '', data_vencimento: '' });
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    verificarAutenticacao();
  }, []);

  const verificarAutenticacao = async () => {
    try {
      const res = await fetch('/api/auth/verify', { method: 'GET', credentials: 'include' });
      if (!res.ok) throw new Error('Não autenticado');
      setIsAuthenticated(true);
      carregarClientes();
    } catch {
      setIsAuthenticated(false);
      router.push('/login');
    }
  };

  const carregarClientes = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/clientes', { method: 'GET', credentials: 'include' });
      const data = await res.json();
      setClientes(data);
    } catch (error) {
      console.error('Erro ao carregar clientes', error);
    }
    setLoading(false);
  };

  const handleCliente = async (method: string, body?: object, id?: number) => {
    setLoading(true);
    await fetch(`/api/clientes${id ? `/${id}` : ''}`, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
      credentials: 'include',
    });
    carregarClientes();
    setClienteEditando(null);
    setNovoCliente({ nome: '', telefone: '', endereco: '', data_vencimento: '' });
  };

const handleEditar = (cliente: Cliente) => {
  setClienteEditando(cliente);
  
  setNovoCliente({
    nome: cliente.nome,
    telefone: cliente.telefone,
    endereco: cliente.endereco,
    data_vencimento: new Date(cliente.data_vencimento).toISOString().split('T')[0], // ✅ Corrigido para formato YYYY-MM-DD
  });
};


  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'GET', credentials: 'include' });
    router.push('/login');
  };
  

  if (isAuthenticated === null) {
    return <div className="min-h-screen flex items-center justify-center text-white">🔍 Verificando...</div>;
  }

  return (
    <div className="min-h-[calc(100vh-140px)] p-4 md:p-6 bg-gray-900 text-white">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h1 className="text-2xl md:text-4xl font-extrabold flex items-center gap-2">
          📊 Dashboard
        </h1>
        <button 
          onClick={handleLogout} 
          className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-md text-white flex items-center gap-2 w-full md:w-auto justify-center"
        >
          <FaSignOutAlt className="text-sm md:text-base" /> 
          <span className="text-sm md:text-base">Sair</span>
        </button>
      </div>

      {/* Formulário de Adicionar/Editar Cliente */}
      <div className="bg-gray-800 p-4 md:p-6 rounded-lg mb-6 shadow-lg">
        <h2 className="text-lg md:text-xl font-bold mb-4 flex items-center gap-2">
          <FaUserPlus className="text-sm md:text-base" /> 
          {clienteEditando ? "Editar Cliente" : "Adicionar Cliente"}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <input 
            type="text" 
            placeholder="Nome completo"
            value={novoCliente.nome}
            className="p-2 bg-gray-700 rounded text-white placeholder-gray-400"
            onChange={e => setNovoCliente({ ...novoCliente, nome: e.target.value })}
          />
          <input 
            type="text" 
            placeholder="Telefone"
            value={novoCliente.telefone}
            className="p-2 bg-gray-700 rounded text-white placeholder-gray-400"
            onChange={e => setNovoCliente({ ...novoCliente, telefone: e.target.value })}
          />
          <input 
            type="text" 
            placeholder="Endereço completo"
            value={novoCliente.endereco}
            className="p-2 bg-gray-700 rounded text-white placeholder-gray-400"
            onChange={e => setNovoCliente({ ...novoCliente, endereco: e.target.value })}
          />
          <div className="relative">
            <input 
              type="date" 
              value={novoCliente.data_vencimento}
              className="p-2 bg-gray-700 rounded text-white w-full pr-8" 
              onChange={e => setNovoCliente({ ...novoCliente, data_vencimento: e.target.value })}
            />
            <FaCalendarAlt className="absolute top-3 right-3 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <button 
          className="mt-4 bg-green-600 hover:bg-green-700 w-full p-2 md:p-3 rounded font-bold transition-colors"
          onClick={() => handleCliente(clienteEditando ? 'PUT' : 'POST', novoCliente, clienteEditando?.id)}
        >
          {clienteEditando ? "Atualizar Cliente" : "Adicionar Cliente"}
        </button>
      </div>

      {/* Tabela de Clientes */}
      {loading ? (
        <p className="text-center text-white py-8">🔄 Carregando clientes...</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow-lg">
          <table className="w-full bg-gray-800 min-w-[600px]">
            <thead className="bg-gray-700">
              <tr>
                {['Nome', 'Telefone', 'Endereço', 'Status', 'Vencimento', 'Ações'].map((header, index) => (
                  <th key={index} className="p-3 text-left text-sm md:text-base font-medium">{header}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clientes.map(cliente => (
                <tr key={cliente.id} className="border-t border-gray-700 hover:bg-gray-750 transition-colors">
                  <td className="p-3">{cliente.nome}</td>
                  <td className="p-3">{cliente.telefone}</td>
                  <td className="p-3">{cliente.endereco}</td>
                  <td className={`p-3 font-bold ${cliente.status_pagamento === 'pago' ? 'text-green-400' : 'text-red-400'}`}>{cliente.status_pagamento}</td>
                  <td className="p-3">{new Date(cliente.data_vencimento).toLocaleDateString('pt-BR')}</td>
                  <td className="p-3 flex gap-2">
                    <button className="bg-blue-500 px-2 py-1 rounded text-white flex items-center gap-1" onClick={() => handleEditar(cliente)}>
                      <FaEdit /> Editar
                    </button>
                    <button className="bg-red-600 px-2 py-1 rounded text-white flex items-center gap-1" onClick={() => handleCliente('DELETE', {}, cliente.id)}>
                      <FaTrash /> Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
