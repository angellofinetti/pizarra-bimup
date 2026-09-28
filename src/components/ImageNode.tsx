import { memo } from 'react';
import { useReactFlow, NodeResizer, Handle, Position } from '@xyflow/react';
import { Trash2, ArrowUpToLine, ArrowDownToLine } from 'lucide-react';
import clsx from 'clsx';

export type ImageNodeData = {
  url: string;
};

function ImageNode({ id, data, selected }: { id: string, data: ImageNodeData, selected?: boolean }) {
  const { setNodes, getNodes } = useReactFlow();

  const handleDelete = () => setNodes((nodes) => nodes.filter((n) => n.id !== id));
  
  const bringToFront = () => {
    const maxZ = Math.max(0, ...getNodes().map(n => n.zIndex || 0));
    setNodes((nodes) => nodes.map((n) => n.id === id ? { ...n, zIndex: maxZ + 1 } : n));
  };
  const sendToBack = () => {
    const minZ = Math.min(0, ...getNodes().map(n => n.zIndex || 0));
    setNodes((nodes) => nodes.map((n) => n.id === id ? { ...n, zIndex: minZ - 1 } : n));
  };

  const handleStyle = clsx(
    "!w-2.5 !h-2.5 !bg-blue-500 !border-2 !border-white transition-opacity duration-200",
    selected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
  );

  return (
    <div className="relative group w-full h-full">
      <NodeResizer 
        color="#3b82f6" 
        isVisible={selected} 
        minWidth={100} 
        minHeight={100} 
        handleClassName="w-3 h-3 bg-blue-500 rounded-sm border-2 border-white"
      />

      {/* Connection Handles */}
      <Handle type="target" position={Position.Top}    id="t" className={handleStyle} style={{ left: '50%' }}  />
      <Handle type="source" position={Position.Right}  id="r" className={handleStyle} style={{ top: '50%' }}   />
      <Handle type="source" position={Position.Bottom} id="b" className={handleStyle} style={{ left: '50%' }}  />
      <Handle type="target" position={Position.Left}   id="l" className={handleStyle} style={{ top: '50%' }}   />
      
      {/* Toolbar */}
      <div 
        className={clsx(
          "nodrag nopan absolute -top-10 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-gray-900/95 backdrop-blur-sm border border-gray-700/80 p-1.5 rounded-xl transition-opacity duration-200 z-50 shadow-xl w-max",
          selected ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <button onClick={bringToFront} className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-gray-800 transition-colors" title="Traer al frente">
          <ArrowUpToLine className="w-3.5 h-3.5" />
        </button>
        <button onClick={sendToBack} className="text-gray-400 hover:text-white p-1 rounded-md hover:bg-gray-800 transition-colors" title="Enviar al fondo">
          <ArrowDownToLine className="w-3.5 h-3.5" />
        </button>
        <div className="w-px h-4 bg-gray-700 mx-0.5" />
        <button onClick={handleDelete} className="text-gray-400 hover:text-red-500 p-1 rounded-md hover:bg-gray-800 transition-colors" title="Eliminar imagen">
          <Trash2 className="w-3.5 h-3.5" />
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
