'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn('credentials', {
      email,
      password,
      name,
      isRegister: isRegister.toString(),
      redirect: false,
    });

    setLoading(false);
    if (result?.error) {
      setError(result.error);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-2xl shadow-lg w-96">
        <div className="text-center mb-6">
          <h1 className="text-3xl">📋</h1>
          <h1 className="text-2xl font-bold text-blue-600 mt-2">Task Manager</h1>
          <p className="text-gray-500 text-sm mt-1">
            {isRegister ? 'Creează un cont nou' : 'Bine ai revenit!'}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm border border-red-200">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3">
          {isRegister && (
            <input
              type="text"
              placeholder="Nume complet"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
              required
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
            required
          />
          <input
            type="password"
            placeholder="Parolă"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50"
          >
            {loading ? '⏳ Se procesează...' : isRegister ? 'Înregistrează-te' : 'Autentifică-te'}
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-500">
          {isRegister ? 'Ai deja cont?' : 'Nu ai cont?'}{' '}
          <button
            onClick={() => { setIsRegister(!isRegister); setError(''); }}
            className="text-blue-600 hover:underline font-medium"
          >
            {isRegister ? 'Autentifică-te' : 'Înregistrează-te'}
          </button>
        </p>
      </div>
    </div>
  );
}