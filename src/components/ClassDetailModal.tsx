import { X, ExternalLink, Send, Users } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ClassDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  tiktokUrl: string;
}

export default function ClassDetailModal({ isOpen, onClose, title, tiktokUrl }: ClassDetailModalProps) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-gray-900 rounded-xl overflow-hidden shadow-2xl flex flex-col border border-gray-700"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-gray-800 bg-gray-800/50">
            <div>
              <h2 className="text-xl font-bold text-white">{title}</h2>
              <div className="flex items-center gap-2 mt-1 text-sm text-gray-400">
                <Users className="w-4 h-4" />
                <span>12 alumnos en esta clase</span>
              </div>
            </div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-full text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Link Section */}
          <div className="p-6 border-b border-gray-800 flex flex-col items-center text-center bg-gray-800/20">
            <p className="text-gray-300 mb-4">Haz clic en el botón de abajo para ver la lección en TikTok.</p>
            <a 
              href={tiktokUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold transition-all hover:scale-105 shadow-lg shadow-blue-500/20"
            >
              <ExternalLink className="w-5 h-5" />
              Ver Video en TikTok
            </a>
            <p className="text-xs text-gray-500 mt-3">El video se abrirá en una nueva pestaña.</p>
          </div>

          {/* Chat Section */}
          <div className="flex flex-col h-[350px] bg-gray-900">
            <div className="p-4 border-b border-gray-800">
              <h3 className="font-semibold text-gray-200 text-sm">Comentarios y Preguntas</h3>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-green-600 shrink-0 flex items-center justify-center text-xs font-bold text-white">CM</div>
                <div>
                  <p className="text-xs text-gray-400"><span className="font-bold text-gray-200">Carlos M.</span> • Hace 2 min</p>
                  <p className="text-sm text-gray-300 mt-1">¿Cómo hacías para aislar el elemento en la vista 3D?</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-600 shrink-0 flex items-center justify-center text-xs font-bold text-white">TÚ</div>
                <div>
                  <p className="text-xs text-gray-400"><span className="font-bold text-blue-400">Profesor (Tú)</span> • Hace 1 min</p>
                  <p className="text-sm text-gray-300 mt-1">Carlos, selecciona el elemento y presiona "BX" en tu teclado.</p>
                </div>
              </div>
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-800 bg-gray-800/30">
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Responde o haz una pregunta..." 
                  className="w-full bg-gray-800 border border-gray-700 rounded-full py-2.5 pl-4 pr-12 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                />
                <button className="absolute right-1 top-1 p-2 bg-blue-600 hover:bg-blue-500 rounded-full text-white transition-colors">
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
