'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, senha }),
      credentials: 'include', // Envia os cookies
    });

    if (!res.ok) {
      const data = await res.json();
      setErro(data.error);
      return;
    }

    router.push('/dashboard'); // Redireciona para o dashboard após o login
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-blue-400 mb-4">🔐 Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-3 bg-gray-700 rounded"
            required
          />
          <input
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full p-3 bg-gray-700 rounded"
            required
          />
          {erro && <p className="text-red-400">{erro}</p>}
          <button type="submit" className="w-full bg-blue-500 py-2 rounded font-bold hover:bg-blue-400">
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
