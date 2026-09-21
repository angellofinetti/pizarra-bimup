import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import LearningCanvas from '../components/LearningCanvas';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Editor() {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('Cargando...');

  useEffect(() => {
    if (!boardId) return;
    const fetchTitle = async () => {
      const { data } = await supabase
        .from('tableros_pizarra')
        .select('title')
        .eq('id', boardId)
        .single();
      
      if (data && data.title) setTitle(data.title);
      else setTitle('Pizarra sin título');
    };
    fetchTitle();
  }, [boardId]);

  const handleTitleChange = async (newTitle: string) => {
    if (!boardId) return;
    await supabase
      .from('tableros_pizarra')
      .update({ title: newTitle })
      .eq('id', boardId);
  };

  if (!boardId) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert('¡Enlace copiado al portapapeles! Cualquiera con cuenta podrá ver tu pizarra.');
  };

  return (
    <div className="flex h-screen w-full bg-gray-950 text-white overflow-hidden">
      <Sidebar />
      <main className="flex-1 h-full flex flex-col">
        {/* Barra superior real (no flotante) para que no choque con la pizarra */}
        <header className="h-16 px-4 bg-gray-950 border-b border-gray-800 flex items-center justify-between shrink-0 z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/dashboard')}
              className="flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-700 shadow-sm text-sm font-medium transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Volver al Lobby
            </button>
            
            <div className="flex items-center gap-2 bg-gray-900 px-3 py-2 rounded-lg border border-gray-700 shadow-sm group">
              <input 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={() => handleTitleChange(title)}
                onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
                className="bg-transparent border-none focus:outline-none text-sm font-semibold text-white w-64 focus:ring-1 focus:ring-blue-500 rounded px-1 transition-all"
                placeholder="Nombre de tu pizarra"
              />
              <Edit2 className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-400 transition-colors" />
            </div>
          </div>

          <button 
            onClick={handleShare}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg shadow-sm text-sm font-medium transition-colors"
          >
            Compartir Link
          </button>
        </header>
        
        <div className="flex-1 relative w-full h-full">
          <LearningCanvas boardId={boardId} />
        </div>
      </main>
    </div>
  );
}
