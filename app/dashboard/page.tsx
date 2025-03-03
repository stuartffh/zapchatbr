'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Cliente {
  id: number;
  nome: string;
  telefone: string;
  status_pagamento: string;
  data_vencimento: string;
}

export default function Dashboard() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [filtro, setFiltro] = useState('todos');
  const router = useRouter();

  useEffect(() => {
    fetch('/api/clientes')
      .then((res) => res.json())
      .then((data) => setClientes(data))
      .catch((error) => console.error('Erro ao carregar clientes', error));
  }, []);

  const clientesFiltrados = clientes.filter(cliente => {
    if (filtro === 'pago') return cliente.status_pagamento === 'pago';
    if (filtro === 'pendente') return cliente.status_pagamento === 'pendente';
    if (filtro === 'vencido') return new Date(cliente.data_vencimento) < new Date();
    return true;
  });

  return (
    <div className="min-h-screen p-6 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-4">📊 Dashboard - Vigilância</h1>

      <button 
        className="bg-red-500 text-white px-4 py-2 rounded-md mb-4"
        onClick={() => router.push('/')}
      >
        🔙 Voltar para o site
      </button>

      <div className="mb-4">
        <select
          className="p-2 bg-gray-800 border rounded"
          onChange={(e) => setFiltro(e.target.value)}
        >
          <option value="todos">Todos</option>
          <option value="pago">Pagos</option>
          <option value="pendente">Pendentes</option>
          <option value="vencido">Vencidos</option>
        </select>
      </div>

      <table className="w-full border border-gray-700">
        <thead>
          <tr className="bg-gray-800">
            <th className="p-3">Nome</th>
            <th className="p-3">Telefone</th>
            <th className="p-3">Status</th>
            <th className="p-3">Vencimento</th>
          </tr>
        </thead>
        <tbody>
          {clientesFiltrados.map(cliente => (
            <tr key={cliente.id} className="border-t border-gray-700">
              <td className="p-3">{cliente.nome}</td>
              <td className="p-3">{cliente.telefone}</td>
              <td className={`p-3 font-bold ${
                cliente.status_pagamento === 'pago' ? 'text-green-400' : 
                cliente.status_pagamento === 'pendente' ? 'text-yellow-400' : 
                'text-red-400'
              }`}>
                {cliente.status_pagamento}
              </td>
              <td className="p-3">{new Date(cliente.data_vencimento).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

