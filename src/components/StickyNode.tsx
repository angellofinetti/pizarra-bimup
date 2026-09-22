import { memo } from 'react';
import { Handle, Position, NodeResizer, useReactFlow } from '@xyflow/react';
import { Trash2, Plus, Minus, Type, ArrowDownToLine, ArrowUpToLine } from 'lucide-react';
import clsx from 'clsx';

export type StickyNodeData = {
  text: string;
  color: string;
  fontSize?: number;
};

const colors = [
  { name: 'yellow', bg: '#fef08a', text: '#854d0e' },
  { name: 'pink', bg: '#fbcfe8', text: '#831843' },
  { name: 'blue', bg: '#bfdbfe', text: '#1e3a8a' },
  { name: 'green', bg: '#bbf7d0', text: '#14532d' },
  { name: 'orange', bg: '#fed7aa', text: '#9a3412' }
];

function StickyNode({ id, data, selected }: { id: string, data: StickyNodeData, selected?: boolean }) {
  const { setNodes, getNodes } = useReactFlow();

  const handleChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNodes((nodes) => nodes.map((n) => n.id === id ? { ...n, data: { ...n.data, text: evt.target.value } } : n));
  };

  const changeColor = (newColor: string) => {
    setNodes((nodes) => nodes.map((n) => n.id === id ? { ...n, data: { ...n.data, color: newColor } } : n));
  };

  const changeFontSize = (delta: number) => {
    const newSize = Math.max(8, Math.min(120, (data.fontSize || 16) + delta));
    setNodes((nodes) => nodes.map((n) => n.id === id ? { ...n, data: { ...n.data, fontSize: newSize } } : n));
  };

  const handleDelete = () => setNodes((nodes) => nodes.filter((n) => n.id !== id));
  
  const sendToBack = () => {
    const minZ = Math.min(0, ...getNodes().map(n => n.zIndex || 0));
    setNodes((nodes) => nodes.map((n) => n.id === id ? { ...n, zIndex: minZ - 1 } : n));
  };
  const bringToFront = () => {
    const maxZ = Math.max(0, ...getNodes().map(n => n.zIndex || 0));
    setNodes((nodes) => nodes.map((n) => n.id === id ? { ...n, zIndex: maxZ + 1 } : n));
  };

  const currentColorObj = colors.find(c => c.bg === data.color) || colors[0];
  const currentFontSize = data.fontSize || 16;

  const handleStyle = clsx(
    "!w-2 !h-2 !bg-gray-700 transition-opacity duration-200 z-10",
    selected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
  );

  return (
    <div 
      className={clsx(
        "relative w-full h-full shadow-lg group rounded-sm transition-all duration-200 min-w-[150px] min-h-[150px] @container",
        selected && "ring-2 ring-white ring-offset-2 ring-offset-gray-950 shadow-2xl z-50"
      )}
      style={{ backgroundColor: currentColorObj.bg }}
    >
      <NodeResizer 
        color="#000" 
        isVisible={selected} 
        minWidth={100} 
        minHeight={100} 
        handleClassName="w-3 h-3 bg-white rounded-sm border-2 border-black"
      />

      <Handle type="target" position={Position.Top} id="t" className={handleStyle} />
      <Handle type="source" position={Position.Right} id="r" className={handleStyle} />
      <Handle type="source" position={Position.Bottom} id="b" className={handleStyle} />
      <Handle type="target" position={Position.Left} id="l" className={handleStyle} />

      <div 
        className={clsx(
          "absolute -top-10 left-0 flex gap-2 bg-gray-900 border border-gray-700 p-1.5 rounded-lg transition-opacity duration-200",
          selected ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        <div className="flex gap-1 items-center px-1">
          {colors.map(c => (
            <button 
              key={c.bg} 
              onClick={() => changeColor(c.bg)}
              className={clsx(
                "w-5 h-5 rounded-full border border-gray-600 hover:scale-125 transition-transform",
                data.color === c.bg && "ring-2 ring-white"
              )} 
              style={{ backgroundColor: c.bg }} 
              title="Cambiar color"
            />
          ))}
        </div>
        
        <div className="w-px bg-gray-700 my-1 mx-1" />
        
        <div className="flex items-center gap-1 text-gray-400">
          <Type className="w-3.5 h-3.5 mr-1" />
          <button onClick={() => changeFontSize(-2)} className="p-1 hover:text-white hover:bg-gray-800 rounded transition-colors" title="Reducir Tamaño">
            <Minus className="w-3 h-3" />
          </button>
          <span className="text-xs font-semibold w-5 text-center">{currentFontSize}</span>
          <button onClick={() => changeFontSize(2)} className="p-1 hover:text-white hover:bg-gray-800 rounded transition-colors" title="Aumentar Tamaño">
            <Plus className="w-3 h-3" />
          </button>
        </div>

        <div className="w-px bg-gray-700 my-1 mx-1" />
        
        <div className="flex gap-0.5 px-1">
          <button onClick={bringToFront} className="text-gray-400 hover:text-white p-1 rounded hover:bg-gray-800 transition-colors" title="Traer al frente">
            <ArrowUpToLine className="w-3.5 h-3.5" />
          </button>
          <button onClick={sendToBack} className="text-gray-400 hover:text-white p-1 rounded hover:bg-gray-800 transition-colors" title="Enviar al fondo">
            <ArrowDownToLine className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="w-px bg-gray-700 my-1 mx-1" />

        <button onClick={handleDelete} className="text-gray-400 hover:text-red-500 p-0.5 rounded transition-colors" title="Eliminar">
          <Trash2 className="w-4 h-4"/>
        </button>
      </div>

      <textarea
        className={clsx(
          "w-full h-full bg-transparent border-none outline-none resize-none p-4 font-medium leading-tight",
          selected ? "nodrag pointer-events-auto" : "pointer-events-none"
        )}
        style={{ color: currentColorObj.text, fontSize: `${currentFontSize}px` }}
        value={data.text}
        onChange={handleChange}
        placeholder="Escribe tu nota aquí..."
      />
      
      <div 
        className="absolute bottom-0 right-0 w-6 h-6 bg-black/10 rounded-tl-lg pointer-events-none" 
        style={{ clipPath: 'polygon(100% 0, 0% 100%, 100% 100%)' }}
      />
    </div>
  );
}

export default memo(StickyNode);
