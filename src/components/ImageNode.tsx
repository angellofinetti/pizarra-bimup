import { memo } from 'react';
import { useReactFlow, NodeResizer } from '@xyflow/react';
import { Trash2, ArrowUpToLine, ArrowDownToLine } from 'lucide-react';
import clsx from 'clsx';

export type ImageNodeData = {
  url: string;
};

function ImageNode({ id, data, selected, zIndex }: { id: string, data: ImageNodeData, selected?: boolean, zIndex?: number }) {
  const { setNodes } = useReactFlow();

  const handleDelete = () => setNodes((nodes) => nodes.filter((n) => n.id !== id));
  
  const bringToFront = () => setNodes((nodes) => nodes.map((n) => n.id === id ? { ...n, zIndex: (zIndex || 0) + 1 } : n));
  const sendToBack = () => setNodes((nodes) => nodes.map((n) => n.id === id ? { ...n, zIndex: (zIndex || 0) - 1 } : n));

  return (
    <div className="relative group w-full h-full">
      <NodeResizer 
        color="#3b82f6" 
        isVisible={selected} 
        minWidth={100} 
        minHeight={100} 
        handleClassName="w-3 h-3 bg-blue-500 rounded-sm border-2 border-white"
      />
      
      <div 
        className={clsx(
          "absolute -top-10 left-1/2 -translate-x-1/2 flex gap-1 bg-gray-900 border border-gray-700 p-1.5 rounded-lg transition-opacity duration-200 z-50",
          selected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}
      >
        <button onClick={bringToFront} className="text-gray-400 hover:text-white p-1 rounded hover:bg-gray-800" title="Traer al frente">
          <ArrowUpToLine className="w-4 h-4" />
        </button>
        <button onClick={sendToBack} className="text-gray-400 hover:text-white p-1 rounded hover:bg-gray-800" title="Enviar al fondo">
          <ArrowDownToLine className="w-4 h-4" />
        </button>
        <div className="w-px bg-gray-700 my-1 mx-1" />
        <button onClick={handleDelete} className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-gray-800" title="Eliminar imagen">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      
      <img 
        src={data.url} 
        alt="Elemento pegado" 
        className={clsx(
          "w-full h-full object-contain rounded-md shadow-md border pointer-events-none transition-colors",
          selected ? "border-blue-500 ring-2 ring-blue-500/50" : "border-gray-700 bg-gray-900/50"
        )} 
      />
    </div>
  );
}

export default memo(ImageNode);
