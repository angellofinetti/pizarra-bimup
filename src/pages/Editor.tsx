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

  return (
    <div className="flex h-screen w-full bg-gray-950 text-white overflow-hidden">
      <Sidebar />
      <main className="flex-1 relative h-full flex flex-col">
        {/* Barra superior con botón volver y nombre de la pizarra */}
        <div className="absolute top-4 left-4 z-50 flex items-center gap-3">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 bg-gray-900/80 hover:bg-gray-800 text-white px-3 py-2 rounded-lg backdrop-blur-sm border border-gray-700 shadow-lg text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al Lobby
          </button>
          
          <div className="flex items-center gap-2 bg-gray-900/80 px-3 py-2 rounded-lg backdrop-blur-sm border border-gray-700 shadow-lg group">
            <input 
              type="text" 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => handleTitleChange(title)}
              onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
              className="bg-transparent border-none focus:outline-none text-sm font-semibold text-white w-48 focus:ring-1 focus:ring-blue-500 rounded px-1 transition-all"
              placeholder="Nombre de tu pizarra"
            />
            <Edit2 className="w-3.5 h-3.5 text-gray-400 group-hover:text-blue-400 transition-colors" />
          </div>
        </div>
        
        <LearningCanvas boardId={boardId} />
      </main>
    </div>
  );
}
