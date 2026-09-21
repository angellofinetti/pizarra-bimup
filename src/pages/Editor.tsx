import Sidebar from '../components/Sidebar';
import LearningCanvas from '../components/LearningCanvas';
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function Editor() {
  const { boardId } = useParams();
  const navigate = useNavigate();

  if (!boardId) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex h-screen w-full bg-gray-950 text-white overflow-hidden">
      <Sidebar />
      <main className="flex-1 relative h-full flex flex-col">
        {/* Simple top bar to go back to Dashboard */}
        <div className="absolute top-4 left-4 z-50">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 bg-gray-900/80 hover:bg-gray-800 text-white px-3 py-2 rounded-lg backdrop-blur-sm border border-gray-700 shadow-lg text-sm font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al Lobby
          </button>
        </div>
        
        <LearningCanvas boardId={boardId} />
      </main>
    </div>
  );
}
