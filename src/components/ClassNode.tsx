import { memo, useState } from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import { Lock, MessageSquare, Trash2, Pencil, Check } from 'lucide-react';
import clsx from 'clsx';

export type ClassNodeData = {
  title: string;
  module: string;
  status: 'locked' | 'in-progress' | 'completed';
  tiktokUrl?: string;
  color?: string;
};

const classColors = [
  { bg: 'default', header: 'bg-blue-900/30 border-blue-900/50 text-blue-400', body: 'border-blue-500/80 shadow-blue-500/20' },
  { bg: '#fef08a', header: 'bg-yellow-900/40 border-yellow-700/50 text-yellow-500', body: 'border-yellow-500/80 shadow-yellow-500/20' },
  { bg: '#fbcfe8', header: 'bg-pink-900/40 border-pink-700/50 text-pink-400', body: 'border-pink-500/80 shadow-pink-500/20' },
  { bg: '#bbf7d0', header: 'bg-emerald-900/40 border-emerald-700/50 text-emerald-400', body: 'border-emerald-500/80 shadow-emerald-500/20' },
  { bg: '#fed7aa', header: 'bg-orange-900/40 border-orange-700/50 text-orange-400', body: 'border-orange-500/80 shadow-orange-500/20' }
];

function ClassNode({ id, data, selected }: { id: string, data: ClassNodeData, selected?: boolean }) {
  const { title, module, status, tiktokUrl, color } = data;
  const { setNodes, setEdges } = useReactFlow();

  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(title);
  const [editModule, setEditModule] = useState(module);
  const [editUrl, setEditUrl] = useState(tiktokUrl || '');

  const isCompleted = status === 'completed';
  const isLocked = status === 'locked';

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNodes((nodes) => nodes.filter((n) => n.id !== id));
    setEdges((edges) => edges.filter((edge) => edge.source !== id && edge.target !== id));
  };

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNodes((nodes) => 
      nodes.map((n) => n.id === id ? { ...n, data: { ...n.data, title: editTitle, module: editModule, tiktokUrl: editUrl } } : n)
    );
    setIsEditing(false);
  };

  const startEditing = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditTitle(title);
    setEditModule(module);
    setEditUrl(tiktokUrl || '');
    setIsEditing(true);
  };

  const changeColor = (newColor: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNodes((nodes) => nodes.map((n) => n.id === id ? { ...n, data: { ...n.data, color: newColor } } : n));
  };

  let currentStyle = classColors.find(c => c.bg === color) || classColors[0];
  
  if (!color || color === 'default') {
    if (isCompleted) {
      currentStyle = { bg: 'default', header: 'bg-emerald-900/30 border-emerald-900/50 text-emerald-400', body: 'border-emerald-500/50' };
    } else if (isLocked) {
      currentStyle = { bg: 'default', header: 'bg-gray-800/50 border-gray-800 text-gray-500', body: 'border-gray-800 opacity-70' };
    }
  }

  const handleStyle = clsx(
    "!w-2 !h-2 !border-2 !border-gray-900 transition-all duration-200 z-10", 
    selected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
  );

  return (
    <div className="relative group" data-editing={isEditing}>
      
      <div 
        className={clsx(
          "absolute -top-10 left-1/2 -translate-x-1/2 flex gap-1 bg-gray-900 border border-gray-700 p-1.5 rounded-lg transition-opacity duration-200 z-50",
          selected ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
      >
        <button onClick={(e) => changeColor('default', e)} className="w-5 h-5 rounded-full border border-gray-600 bg-blue-500 hover:scale-110" title="Color por defecto" />
        {classColors.slice(1).map(c => (
          <button 
            key={c.bg} 
            onClick={(e) => changeColor(c.bg, e)}
            className={clsx("w-5 h-5 rounded-full border border-gray-600 hover:scale-125 transition-transform", color === c.bg && "ring-2 ring-white")} 
            style={{ backgroundColor: c.bg }} 
            title="Cambiar color"
          />
        ))}
      </div>

      <div
        className={clsx(
          "flex flex-col w-72 rounded-xl border bg-gray-900 shadow-xl overflow-visible transition-all duration-200",
          currentStyle.body,
          selected && "ring-2 ring-white ring-offset-2 ring-offset-gray-950 scale-105"
        )}
      >
        <Handle type="target" position={Position.Top} id="top" className={clsx(handleStyle, "!bg-gray-400")} />
        <Handle type="source" position={Position.Right} id="right" className={clsx(handleStyle, "!bg-blue-500 hover:!scale-150")} />
        <Handle type="source" position={Position.Bottom} id="bottom" className={clsx(handleStyle, "!bg-blue-500 hover:!scale-150")} />
        <Handle type="target" position={Position.Left} id="left" className={clsx(handleStyle, "!bg-gray-400")} />
        
        <div className={clsx("px-4 py-2 border-b text-xs font-semibold flex justify-between items-center rounded-t-xl", currentStyle.header)}>
          {isEditing ? (
            <input 
              value={editModule} 
              onChange={(e) => setEditModule(e.target.value)} 
              className="nodrag bg-black/50 text-white px-1 py-0.5 rounded outline-none border border-gray-600 w-32"
              placeholder="Ej: Módulo 1"
            />
          ) : (
            <span className="truncate pr-2">{module}</span>
          )}
          
          <div className="flex items-center gap-1">
            {isLocked && !isEditing && <Lock className="w-4 h-4" />}
            {isEditing ? (
               <button onClick={handleSave} className="text-green-400 hover:text-green-300 transition-colors p-1 rounded hover:bg-black/20" title="Guardar">
                 <Check className="w-4 h-4" />
               </button>
            ) : (
              <button onClick={startEditing} className="text-gray-400 hover:text-blue-400 transition-colors p-1 rounded hover:bg-black/20" title="Editar nodo">
                 <Pencil className="w-3.5 h-3.5" />
              </button>
            )}
            <button onClick={handleDelete} className="text-gray-400 hover:text-red-500 transition-colors p-1 rounded hover:bg-black/20" title="Eliminar nodo">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="p-4 flex flex-col gap-3 rounded-b-xl">
          {isEditing ? (
            <div className="flex flex-col gap-2">
              <div>
                <label className="text-[10px] text-gray-500 uppercase font-bold">Título de la clase</label>
                <input 
                  value={editTitle} onChange={(e) => setEditTitle(e.target.value)} 
                  className="nodrag w-full bg-gray-800 text-sm text-white px-2 py-1.5 rounded outline-none border border-gray-700 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="text-[10px] text-gray-500 uppercase font-bold">Link de TikTok</label>
                <input 
                  value={editUrl} onChange={(e) => setEditUrl(e.target.value)} 
                  placeholder="https://tiktok.com/..."
                  className="nodrag w-full bg-gray-800 text-xs text-blue-400 px-2 py-1.5 rounded outline-none border border-gray-700 focus:border-blue-500"
                />
              </div>
            </div>
          ) : (
            <>
              <h3 className="text-sm font-bold text-gray-100 leading-tight">{title}</h3>
              {!isLocked && (
                <div className="flex justify-end mt-1">
                  <button className="flex items-center gap-1.5 text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-md transition-colors pointer-events-none">
                    <MessageSquare className="w-3.5 h-3.5" />
                    Chat
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(ClassNode);
