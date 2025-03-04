'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const router = useRouter();

  useEffect(() => {
    verificarAutenticacao();
  }, []);

  const verificarAutenticacao = async () => {
    try {
      const res = await fetch('/api/auth/verify', { method: 'GET', credentials: 'include' });
      if (res.ok) {
        router.push('/dashboard'); // Redireciona automaticamente se já estiver logado
      }
    } catch (error) {
      console.error('Erro ao verificar autenticação:', error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha }),
      credentials: 'include',
    });

    if (!res.ok) {
      const data = await res.json();
      setErro(data.error);
      return;
    }

    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="bg-gray-800 p-6 md:p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-xl md:text-2xl font-bold text-blue-400 mb-4 flex items-center gap-2">
          <span className="hidden md:inline">🔐</span> Acesso ao Sistema
        </h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm mb-1">E-mail</label>
            <input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 md:p-3 bg-gray-700 rounded focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              required
            />
          </div>
          
          <div>
            <label htmlFor="senha" className="block text-sm mb-1">Senha</label>
            <input
              id="senha"
              type="password"
              placeholder="••••••••"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              className="w-full p-2 md:p-3 bg-gray-700 rounded focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              required
            />
          </div>

          {erro && <p className="text-red-400 text-sm">{erro}</p>}
          
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 py-2 md:py-3 rounded font-bold transition-colors flex items-center justify-center gap-2"
          >
            <span className="md:hidden">🔑</span> Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
