import { memo } from 'react';
import { Handle, Position, NodeResizer, useReactFlow } from '@xyflow/react';
import { Trash2, Square, Circle, Diamond, ArrowUpToLine, ArrowDownToLine, Minus, GripHorizontal, MoreHorizontal, PaintBucket } from 'lucide-react';
import clsx from 'clsx';

export type ShapeNodeData = {
  text: string;
  shape: 'rectangle' | 'circle' | 'diamond';
  color: string;
  isTransparent?: boolean;
  borderStyle?: 'solid' | 'dashed' | 'dotted';
  borderWidth?: number;
};

const colors = [
  { name: 'gray', bg: '#f3f4f6', text: '#1f2937', border: '#d1d5db' },
  { name: 'blue', bg: '#dbeafe', text: '#1e3a8a', border: '#bfdbfe' },
  { name: 'green', bg: '#dcfce3', text: '#14532d', border: '#bbf7d0' },
  { name: 'red', bg: '#fee2e2', text: '#7f1d1d', border: '#fecaca' },
  { name: 'yellow', bg: '#fef9c3', text: '#713f12', border: '#fef08a' },
  { name: 'purple', bg: '#f3e8ff', text: '#581c87', border: '#d8b4fe' }, 
  { name: 'orange', bg: '#ffedd5', text: '#9a3412', border: '#fdba74' }  
];

function ShapeNode({ id, data, selected, zIndex }: { id: string, data: ShapeNodeData, selected?: boolean, zIndex?: number }) {
  const { setNodes } = useReactFlow();

  const handleChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNodes((nodes) => nodes.map((n) => n.id === id ? { ...n, data: { ...n.data, text: evt.target.value } } : n));
  };

  const changeColor = (newColor: string) => {
    setNodes((nodes) => nodes.map((n) => n.id === id ? { ...n, data: { ...n.data, color: newColor } } : n));
  };

  const changeShape = (newShape: 'rectangle' | 'circle' | 'diamond') => {
    setNodes((nodes) => nodes.map((n) => n.id === id ? { ...n, data: { ...n.data, shape: newShape } } : n));
  };

  const toggleTransparent = () => {
    setNodes((nodes) => nodes.map((n) => n.id === id ? { ...n, data: { ...n.data, isTransparent: !n.data.isTransparent } } : n));
  };

  const changeBorder = (newStyle: 'solid' | 'dashed' | 'dotted') => {
    setNodes((nodes) => nodes.map((n) => n.id === id ? { ...n, data: { ...n.data, borderStyle: newStyle } } : n));
  };

  const changeBorderWidth = (newWidth: number) => {
    setNodes((nodes) => nodes.map((n) => n.id === id ? { ...n, data: { ...n.data, borderWidth: newWidth } } : n));
  };

  const handleDelete = () => setNodes((nodes) => nodes.filter((n) => n.id !== id));
  
  const bringToFront = () => setNodes((nodes) => nodes.map((n) => n.id === id ? { ...n, zIndex: (zIndex || 0) + 1 } : n));
  const sendToBack = () => setNodes((nodes) => nodes.map((n) => n.id === id ? { ...n, zIndex: (zIndex || 0) - 1 } : n));

  const currentColorObj = colors.find(c => c.bg === data.color) || colors[0];
  const isTransparent = data.isTransparent || false;
  const currentBorder = data.borderStyle || 'solid';
  const currentBorderWidth = data.borderWidth || 3; // Default 3px for shapes

  const shapeStyles = {
    rectangle: "rounded-lg",
    circle: "rounded-full",
    diamond: "" 
  };

  const handleStyle = clsx(
    "!w-2 !h-2 !bg-gray-400 hover:!bg-blue-500 hover:!scale-150 transition-all duration-200 z-10", 
    selected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
  );

  return (
    <div className="relative group w-full h-full min-w-[80px] min-h-[80px] @container flex items-center justify-center">
      
      <NodeResizer 
        color="#3b82f6" 
        isVisible={selected} 
        minWidth={80} 
        minHeight={80} 
        handleClassName="w-2.5 h-2.5 bg-blue-500 rounded-sm border-2 border-white"
      />

      <Handle type="target" position={Position.Top} id="t" className={handleStyle} />
      <Handle type="source" position={Position.Right} id="r" className={handleStyle} />
      <Handle type="source" position={Position.Bottom} id="b" className={handleStyle} />
      <Handle type="target" position={Position.Left} id="l" className={handleStyle} />

      {/* Toolbar Expandida para Figuras */}
      <div 
        className={clsx(
          "nodrag nopan absolute -top-[5.5rem] left-1/2 -translate-x-1/2 flex flex-col gap-1 bg-gray-900 border border-gray-700 p-1.5 rounded-lg transition-opacity duration-200 z-50 w-max shadow-xl",
          selected ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        {/* Fila superior: Formas, Bordes y Capas */}
        <div className="flex gap-1 items-center px-1 border-b border-gray-700 pb-1.5 mb-0.5 justify-between">
          <div className="flex gap-1 border-r border-gray-700 pr-2">
            <button onClick={() => changeShape('rectangle')} className={clsx("text-gray-400 hover:text-white p-0.5 rounded", data.shape === 'rectangle' && "bg-gray-800 text-blue-400")} title="Rectángulo"><Square className="w-4 h-4" /></button>
            <button onClick={() => changeShape('circle')} className={clsx("text-gray-400 hover:text-white p-0.5 rounded", data.shape === 'circle' && "bg-gray-800 text-blue-400")} title="Círculo"><Circle className="w-4 h-4" /></button>
            <button onClick={() => changeShape('diamond')} className={clsx("text-gray-400 hover:text-white p-0.5 rounded", data.shape === 'diamond' && "bg-gray-800 text-blue-400")} title="Rombo"><Diamond className="w-4 h-4" /></button>
          </div>
          
          <div className="flex gap-1 px-1">
            <button onClick={() => changeBorder('solid')} className={clsx("p-1 rounded hover:text-white transition-colors", currentBorder === 'solid' ? "bg-gray-800 text-blue-400" : "text-gray-400")} title="Borde Corrido"><Minus className="w-4 h-4" /></button>
            <button onClick={() => changeBorder('dashed')} className={clsx("p-1 rounded hover:text-white transition-colors", currentBorder === 'dashed' ? "bg-gray-800 text-blue-400" : "text-gray-400")} title="Borde Punteado (Largo)"><GripHorizontal className="w-4 h-4" /></button>
            <button onClick={() => changeBorder('dotted')} className={clsx("p-1 rounded hover:text-white transition-colors", currentBorder === 'dotted' ? "bg-gray-800 text-blue-400" : "text-gray-400")} title="Borde Punteado (Puntos)"><MoreHorizontal className="w-4 h-4" /></button>
          </div>
          
          <div className="flex gap-1 border-l border-gray-700 pl-2">
            <button onClick={bringToFront} className="text-gray-400 hover:text-white p-0.5" title="Traer al frente"><ArrowUpToLine className="w-4 h-4" /></button>
            <button onClick={sendToBack} className="text-gray-400 hover:text-white p-0.5" title="Enviar al fondo"><ArrowDownToLine className="w-4 h-4" /></button>
            <button onClick={handleDelete} className="text-gray-400 hover:text-red-500 p-0.5 ml-1"><Trash2 className="w-4 h-4"/></button>
          </div>
        </div>

        {/* Fila inferior: Colores, Transparencia y Slider de Grosor */}
        <div className="flex gap-1 items-center px-1 justify-center">
          {/* Botón de Transparente */}
          <button 
            onClick={toggleTransparent}
            className={clsx(
              "w-5 h-5 rounded-full border flex items-center justify-center hover:scale-110 transition-transform relative overflow-hidden",
              isTransparent ? "border-white ring-1 ring-white" : "border-gray-500"
            )}
            title="Alternar Fondo Transparente"
          >
             <div className="absolute inset-0 bg-[url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAQAAAAECAYAAACp8Z5+AAAAIklEQVQIW2NkQAKrVq36zwjjgzhhYWGMYAEYB8RmROaABADeOQ8CXl/xfgAAAABJRU5ErkJggg==')] opacity-50" />
             <PaintBucket className={clsx("w-3 h-3 z-10", isTransparent ? "text-white" : "text-gray-400")} />
          </button>
          
          <div className="w-px h-4 bg-gray-700 mx-1" />

          {/* Colores */}
          {colors.map(c => (
            <button 
              key={c.bg} onClick={() => changeColor(c.bg)}
              className={clsx("w-4 h-4 rounded-full border border-gray-600 hover:scale-125", data.color === c.bg && "ring-2 ring-white")} 
              style={{ backgroundColor: c.bg }} 
              title={c.name}
            />
          ))}

          {/* Slider de Grosor */}
          <div className="flex items-center gap-2 px-2 border-l border-gray-700 ml-1">
             <span className="text-[10px] text-gray-400 font-bold uppercase">Grosor</span>
             <input 
               type="range" 
               min="1" 
               max="16" 
               value={currentBorderWidth}
               onChange={(e) => changeBorderWidth(Number(e.target.value))}
               className="w-16 accent-blue-500 cursor-pointer"
               title="Grosor del borde"
             />
          </div>
        </div>
      </div>

      {/* Fondo y Borde de la Figura */}
      <div 
        className={clsx(
          "absolute inset-0 transition-all duration-300",
          shapeStyles[data.shape],
          selected && "ring-4 ring-blue-500/50"
        )}
        style={{ 
          backgroundColor: isTransparent ? 'transparent' : currentColorObj.bg,
          borderColor: selected ? '#3b82f6' : (isTransparent ? currentColorObj.text : currentColorObj.border),
          borderWidth: `${currentBorderWidth}px`,
          borderStyle: currentBorder,
          clipPath: data.shape === 'diamond' ? 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' : 'none'
        }}
      />

      {/* Texto */}
      <div className={clsx(
        "relative z-10 w-full h-full flex items-center justify-center",
        data.shape === 'circle' ? "p-[15%]" : data.shape === 'diamond' ? "p-[25%]" : "p-4"
      )}>
        <textarea
          className={clsx(
            "w-full h-full bg-transparent border-none outline-none resize-none font-semibold text-center leading-tight flex items-center justify-center overflow-hidden",
            selected ? "nodrag pointer-events-auto" : "pointer-events-none"
          )}
          style={{ 
             color: isTransparent ? 'inherit' : currentColorObj.text, 
             fontSize: 'max(12px, 15cqw)' 
          }}
          value={data.text}
          onChange={handleChange}
          placeholder="Texto..."
        />
      </div>
    </div>
  );
}

export default memo(ShapeNode);
