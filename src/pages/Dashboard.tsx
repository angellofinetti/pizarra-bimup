import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Plus, LayoutTemplate, LogOut } from 'lucide-react';

interface Board {
  id: string;
  title?: string;
  updated_at: string;
}

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [boards, setBoards] = useState<Board[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBoards();
  }, [user]);

  const fetchBoards = async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('tableros_pizarra')
      .select('id, title, updated_at')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });

    if (!error && data) {
      setBoards(data);
    }
    setLoading(false);
  };

  const createNewBoard = async () => {
    if (boards.length >= 3) {
      alert('¡Has alcanzado el límite de 3 pizarras gratuitas! Actualiza al Plan Pro para crear más.');
      return;
    }

    const newId = crypto.randomUUID();
    const { error } = await supabase
      .from('tableros_pizarra')
      .insert({
        id: newId,
        user_id: user?.id,
        title: 'Nueva Pizarra BIM UP'
      });

    if (!error) {
      navigate(`/board/${newId}`);
    } else {
      alert('Error creando la pizarra: ' + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <header className="flex justify-between items-center mb-12 max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <LayoutTemplate className="w-6 h-6 text-blue-500" />
          BIM UP - Mis Pizarras
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">{user?.email}</span>
          <button
            onClick={signOut}
            className="flex items-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors"
          >
            <LogOut className="w-4 h-4" /> Salir
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h2 className="text-xl font-semibold mb-2">Tus Proyectos</h2>
            <p className="text-sm text-gray-400">
              Llevas {boards.length} de 3 pizarras en el Plan Gratuito.
            </p>
          </div>
          <button
            onClick={createNewBoard}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition-colors"
          >
            <Plus className="w-5 h-5" /> Nueva Pizarra
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-400">Cargando pizarras...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {boards.map((board) => (
              <div
                key={board.id}
                onClick={() => navigate(`/board/${board.id}`)}
                className="bg-gray-800 border border-gray-700 rounded-xl p-5 hover:border-blue-500 hover:shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-all cursor-pointer group"
              >
                <div className="aspect-video bg-gray-900 rounded-lg mb-4 flex items-center justify-center border border-gray-700 group-hover:border-gray-600">
                   <LayoutTemplate className="w-8 h-8 text-gray-600 group-hover:text-gray-500" />
                </div>
                <h3 className="font-medium text-gray-200 truncate">{board.title || 'Pizarra sin título'}</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Actualizado: {new Date(board.updated_at).toLocaleDateString()}
                </p>
              </div>
            ))}

            {boards.length === 0 && (
              <div className="col-span-full text-center py-12 bg-gray-800/50 rounded-xl border border-gray-700 border-dashed">
                <p className="text-gray-400 mb-4">No tienes ninguna pizarra todavía.</p>
                <button
                  onClick={createNewBoard}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors"
                >
                  Crear mi primera pizarra
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
