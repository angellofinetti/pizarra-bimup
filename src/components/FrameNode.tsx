import { memo } from 'react';
import { NodeResizer, useReactFlow } from '@xyflow/react';
import { Trash2, ArrowDownToLine, ArrowUpToLine, Minus, GripHorizontal, MoreHorizontal } from 'lucide-react';
import clsx from 'clsx';

export type FrameNodeData = {
  title: string;
  bgColor?: string;
  borderColor?: string;
  borderStyle?: 'solid' | 'dashed' | 'dotted';
  borderWidth?: number;
};

const bgColors = [
  { label: 'Transparente', bg: 'transparent' },
  { label: 'Azul', bg: 'rgba(59, 130, 246, 0.1)' },
  { label: 'Verde', bg: 'rgba(34, 197, 94, 0.1)' },
  { label: 'Amarillo', bg: 'rgba(234, 179, 8, 0.1)' },
  { label: 'Gris', bg: 'rgba(107, 114, 128, 0.2)' },
  { label: 'Rojo', bg: 'rgba(239, 68, 68, 0.1)' },
];

const borderColors = [
  { label: 'Gris', color: '#6b7280' },
  { label: 'Blanco', color: '#ffffff' },
  { label: 'Azul', color: '#3b82f6' },
  { label: 'Verde', color: '#22c55e' },
  { label: 'Amarillo', color: '#eab308' },
  { label: 'Rojo', color: '#ef4444' },
  { label: 'Morado', color: '#a855f7' },
];

function FrameNode({ id, data, selected }: { id: string, data: FrameNodeData, selected?: boolean }) {
  const { setNodes, getNodes } = useReactFlow();

  const handleChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setNodes((nodes) => nodes.map((n) => n.id === id ? { ...n, data: { ...n.data, title: evt.target.value } } : n));
  };

  const changeBg = (newBg: string) => {
    setNodes((nodes) => nodes.map((n) => n.id === id ? { ...n, data: { ...n.data, bgColor: newBg } } : n));
  };

  const changeBorder = (newStyle: 'solid' | 'dashed' | 'dotted') => {
    setNodes((nodes) => nodes.map((n) => n.id === id ? { ...n, data: { ...n.data, borderStyle: newStyle } } : n));
  };

  const changeBorderColor = (newColor: string) => {
    setNodes((nodes) => nodes.map((n) => n.id === id ? { ...n, data: { ...n.data, borderColor: newColor } } : n));
  };

  const changeBorderWidth = (newWidth: number) => {
    setNodes((nodes) => nodes.map((n) => n.id === id ? { ...n, data: { ...n.data, borderWidth: newWidth } } : n));
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

  const currentBg = data.bgColor || 'transparent';
  const currentBorder = data.borderStyle || 'dashed';
  const currentBorderWidth = data.borderWidth || 2;
  const currentBorderColor = data.borderColor || '#6b7280'; // Default gray-500

  return (
    <div 
      className={clsx(
        "relative w-full h-full rounded-lg transition-colors group",
        selected ? "ring-2 ring-blue-500/50" : "hover:border-gray-400"
      )}
      style={{
        backgroundColor: currentBg,
        borderColor: selected ? '#3b82f6' : currentBorderColor,
        borderStyle: currentBorder,
        borderWidth: `${currentBorderWidth}px`
      }}
    >
      <NodeResizer 
        color="#3b82f6" 
        isVisible={selected} 
        minWidth={200} 
        minHeight={200}
        handleClassName="w-3 h-3 bg-blue-500 rounded-sm border-2 border-white"
      />
      
      {/* Toolbar superior externa */}
      <div 
        className={clsx(
          "nodrag nopan absolute -top-[5.5rem] left-0 flex flex-col gap-1 bg-gray-900 border border-gray-700 p-1.5 rounded-lg transition-opacity duration-200 z-50 shadow-xl",
          selected ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        {/* Fila 1: Colores */}
        <div className="flex gap-1 items-center px-1">
          {/* Fondo */}
          <div className="flex gap-1 items-center border-r border-gray-700 pr-2">
            <span className="text-[10px] text-gray-400 font-bold uppercase mr-1">Fondo</span>
            {bgColors.map(c => (
              <button 
                key={c.bg} onClick={() => changeBg(c.bg)}
                className={clsx(
                  "w-4 h-4 rounded-full border hover:scale-125 transition-transform", 
                  currentBg === c.bg ? "border-white ring-1 ring-white" : "border-gray-600"
                )} 
                style={{ backgroundColor: c.bg === 'transparent' ? '#1f2937' : c.bg }} 
                title={`Fondo ${c.label}`}
              >
                {c.bg === 'transparent' && <div className="w-full h-full rounded-full border border-gray-600" style={{ backgroundImage: 'linear-gradient(45deg, #374151 25%, transparent 25%, transparent 75%, #374151 75%, #374151), linear-gradient(45deg, #374151 25%, transparent 25%, transparent 75%, #374151 75%, #374151)', backgroundPosition: '0 0, 4px 4px', backgroundSize: '8px 8px' }} />}
              </button>
            ))}
          </div>
          {/* Borde */}
          <div className="flex gap-1 items-center pl-1">
            <span className="text-[10px] text-gray-400 font-bold uppercase mr-1">Borde</span>
            {borderColors.map(c => (
              <button 
                key={c.color} onClick={() => changeBorderColor(c.color)}
                className={clsx(
                  "w-4 h-4 rounded-full border hover:scale-125 transition-transform", 
                  currentBorderColor === c.color ? "border-white ring-1 ring-white" : "border-gray-600"
                )} 
                style={{ backgroundColor: c.color }} 
                title={`Borde ${c.label}`}
              />
            ))}
          </div>
        </div>
        
        {/* Fila 2: Estilos, Grosor y Acciones */}
        <div className="flex gap-1 items-center px-1 border-t border-gray-700 pt-1.5 justify-between">
          <div className="flex gap-1 items-center border-r border-gray-700 pr-2">
            <button onClick={() => changeBorder('solid')} className={clsx("p-1 rounded hover:text-white transition-colors", currentBorder === 'solid' ? "bg-gray-800 text-blue-400" : "text-gray-400")} title="Borde Corrido">
              <Minus className="w-4 h-4" />
            </button>
            <button onClick={() => changeBorder('dashed')} className={clsx("p-1 rounded hover:text-white transition-colors", currentBorder === 'dashed' ? "bg-gray-800 text-blue-400" : "text-gray-400")} title="Borde Punteado (Largo)">
              <GripHorizontal className="w-4 h-4" />
            </button>
            <button onClick={() => changeBorder('dotted')} className={clsx("p-1 rounded hover:text-white transition-colors", currentBorder === 'dotted' ? "bg-gray-800 text-blue-400" : "text-gray-400")} title="Borde Punteado (Puntos)">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          <div className="flex items-center gap-2 px-1 border-r border-gray-700 pr-2">
             <span className="text-[10px] text-gray-400 font-bold uppercase">Grosor</span>
             <input 
               type="range" 
               min="1" 
               max="12" 
               value={currentBorderWidth}
               onChange={(e) => changeBorderWidth(Number(e.target.value))}
               className="nodrag nopan w-16 accent-blue-500 cursor-pointer"
               title="Grosor del borde"
             />
          </div>

          <div className="flex gap-1 items-center pl-1">
            <button onClick={bringToFront} className="text-gray-400 hover:text-white p-1 rounded hover:bg-gray-800 transition-colors" title="Traer al frente">
              <ArrowUpToLine className="w-4 h-4" />
            </button>
            <button onClick={sendToBack} className="text-gray-400 hover:text-white p-1 rounded hover:bg-gray-800 transition-colors" title="Enviar al fondo">
              <ArrowDownToLine className="w-4 h-4" />
            </button>
            <button onClick={handleDelete} className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-gray-800 transition-colors ml-1" title="Eliminar Marco">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Etiqueta del Marco (Afuera y arriba) */}
      <div className="absolute -top-7 left-0 flex items-center gap-2 pointer-events-auto">
        <input 
          value={data.title} 
          onChange={handleChange}
          className="nodrag bg-transparent outline-none w-48 text-sm font-bold text-gray-500 focus:text-gray-300 placeholder-gray-500 transition-colors"
          placeholder="Nombre del Marco..."
        />
      </div>
    </div>
  );
}

export default memo(FrameNode);
