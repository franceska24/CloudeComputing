'use client';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login');
    if (status === 'authenticated') fetchTasks();
  }, [status]);

  const fetchTasks = async () => {
    const res = await fetch('/api/tasks');
    const data = await res.json();
    setTasks(Array.isArray(data) ? data : []);
  };
const addTask = async () => {
  if (!title.trim()) return;

  setLoading(true);

  await fetch("/api/tasks", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      title,
      description,
      userEmail: session.user.email,
    }),
  });

  setTitle("");
  setDescription("");
  setLoading(false);
  fetchTasks(); // <-- AICI era problema
};




  const deleteTask = async (id) => {
    await fetch('/api/tasks', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    fetchTasks();
  };

  const toggleTask = async (id, completed) => {
    await fetch('/api/tasks', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, completed: !completed }),
    });
    fetchTasks();
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">⏳ Se încarcă...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-blue-600 text-white p-4 shadow-md">
        <div className="max-w-2xl mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">📋 Task Manager</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm">👋 {session?.user?.name}</span>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="bg-white text-blue-600 px-3 py-1 rounded-lg text-sm hover:bg-gray-100 font-medium"
            >
              Deconectare
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto mt-8 p-4">
        <div className="bg-white rounded-2xl shadow p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">➕ Adaugă task nou</h2>
          <input
            type="text"
            placeholder="Titlu task..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-200 rounded-lg p-3 mb-3 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <textarea
            placeholder="Descriere (opțional)..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-200 rounded-lg p-3 mb-3 h-20 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <button
            onClick={addTask}
            disabled={loading || !title.trim()}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 font-medium transition-colors disabled:opacity-50"
          >
            {loading ? '⏳ Se adaugă...' : '+ Adaugă Task'}
          </button>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-3 text-gray-700">
            📝 Task-urile tale ({tasks.length})
          </h2>
          {tasks.length === 0 && (
            <div className="bg-white rounded-2xl shadow p-8 text-center text-gray-400">
              <p className="text-4xl mb-2">🎯</p>
              <p>Nu ai niciun task. Adaugă primul task!</p>
            </div>
          )}
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task._id}
                className={`bg-white rounded-2xl shadow p-4 flex items-start gap-3 ${task.completed ? 'opacity-60' : ''}`}
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task._id, task.completed)}
                  className="mt-1 w-4 h-4 cursor-pointer accent-blue-600"
                />
                <div className="flex-1">
                  <h3 className={`font-medium text-gray-800 ${task.completed ? 'line-through text-gray-400' : ''}`}>
                    {task.title}
                  </h3>
                  {task.description && (
                    <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(task.createdAt).toLocaleDateString('ro-RO')}
                  </p>
                </div>
                <button
                  onClick={() => deleteTask(task._id)}
                  className="text-red-400 hover:text-red-600 transition-colors text-xl"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}