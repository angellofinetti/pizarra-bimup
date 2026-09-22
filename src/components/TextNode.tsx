import { memo } from 'react';
import { useReactFlow, Handle, Position, NodeResizer } from '@xyflow/react';
import { Trash2, Bold, Italic, Underline, Minus, Plus, ArrowDownToLine, ArrowUpToLine } from 'lucide-react';
import clsx from 'clsx';

export type TextNodeData = {
  text: string;
  fontSize?: number;
  isBold?: boolean;
  isItalic?: boolean;
  isUnderline?: boolean;
};

function TextNode({ id, data, selected }: { id: string, data: TextNodeData, selected?: boolean }) {
  const { setNodes, getNodes } = useReactFlow();

  const fontSize = data.fontSize || 16;
  const isBold = data.isBold || false;
  const isItalic = data.isItalic || false;
  const isUnderline = data.isUnderline || false;

  const handleChange = (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNodes((nodes) => nodes.map((n) => n.id === id ? { ...n, data: { ...n.data, text: evt.target.value } } : n));
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

  const changeFontSize = (delta: number) => {
    const newSize = Math.max(8, Math.min(120, fontSize + delta));
    setNodes((nodes) => nodes.map((n) => n.id === id ? { ...n, data: { ...n.data, fontSize: newSize } } : n));
  };

  const toggleFormat = (key: 'isBold' | 'isItalic' | 'isUnderline') => {
    setNodes((nodes) => nodes.map((n) => n.id === id ? { ...n, data: { ...n.data, [key]: !n.data[key] } } : n));
  };

  return (
    <div className={clsx("relative group w-full h-full min-w-[100px] min-h-[40px]", selected && "ring-1 ring-blue-500/50 rounded-sm")}>
      
      <NodeResizer 
        color="#3b82f6" 
        isVisible={selected} 
        minWidth={100} 
        minHeight={40} 
        handleClassName="w-2.5 h-2.5 bg-blue-500 rounded-sm border-2 border-white"
      />

      <Handle type="target" position={Position.Top} className="!w-2 !h-2 !bg-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />
      <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !bg-gray-500 opacity-0 group-hover:opacity-100 transition-opacity" />

      {/* Toolbar Expandida */}
      <div 
        className={clsx(
          "absolute -top-12 left-0 flex items-center gap-1 bg-gray-900 border border-gray-700 p-1.5 rounded-lg transition-opacity duration-200 z-50 shadow-xl w-max",
          selected ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        {/* Formato de texto */}
        <div className="flex gap-0.5 px-1">
          <button 
            onClick={() => toggleFormat('isBold')} 
            className={clsx("p-1.5 rounded hover:text-white transition-colors", isBold ? "bg-gray-700 text-blue-400" : "text-gray-400")} 
            title="Negrita"
          >
            <Bold className="w-3.5 h-3.5"/>
          </button>
          <button 
            onClick={() => toggleFormat('isItalic')} 
            className={clsx("p-1.5 rounded hover:text-white transition-colors", isItalic ? "bg-gray-700 text-blue-400" : "text-gray-400")} 
            title="Cursiva"
          >
            <Italic className="w-3.5 h-3.5"/>
          </button>
          <button 
            onClick={() => toggleFormat('isUnderline')} 
            className={clsx("p-1.5 rounded hover:text-white transition-colors", isUnderline ? "bg-gray-700 text-blue-400" : "text-gray-400")} 
            title="Subrayado"
          >
            <Underline className="w-3.5 h-3.5"/>
          </button>
        </div>

        <div className="w-px h-5 bg-gray-700 mx-1" />

        {/* Control de Tamaño */}
        <div className="flex items-center gap-1 text-gray-400">
          <button onClick={() => changeFontSize(-2)} className="p-1 hover:text-white hover:bg-gray-800 rounded transition-colors" title="Reducir Tamaño">
            <Minus className="w-3 h-3" />
          </button>
          <span className="text-xs font-semibold w-5 text-center">{fontSize}</span>
          <button onClick={() => changeFontSize(2)} className="p-1 hover:text-white hover:bg-gray-800 rounded transition-colors" title="Aumentar Tamaño">
            <Plus className="w-3 h-3" />
          </button>
        </div>

        <div className="w-px h-5 bg-gray-700 mx-1" />

        <div className="flex gap-0.5 px-1">
          <button onClick={bringToFront} className="text-gray-400 hover:text-white p-1.5 rounded hover:bg-gray-800 transition-colors" title="Traer al frente">
            <ArrowUpToLine className="w-3.5 h-3.5" />
          </button>
          <button onClick={sendToBack} className="text-gray-400 hover:text-white p-1.5 rounded hover:bg-gray-800 transition-colors" title="Enviar al fondo">
            <ArrowDownToLine className="w-3.5 h-3.5" />
          </button>
        </div>
        
        <div className="w-px h-5 bg-gray-700 mx-1" />

        {/* Eliminar */}
        <button onClick={handleDelete} className="text-gray-400 hover:text-red-500 p-1.5 rounded transition-colors" title="Eliminar Texto">
          <Trash2 className="w-3.5 h-3.5"/>
        </button>
      </div>

      <textarea
        className={clsx(
          "w-full h-full bg-transparent text-gray-200 outline-none resize-none p-3 leading-tight",
          selected ? "nodrag pointer-events-auto" : "pointer-events-none"
        )}
        style={{ 
          fontSize: `${fontSize}px`,
          fontWeight: isBold ? 'bold' : 'normal',
          fontStyle: isItalic ? 'italic' : 'normal',
          textDecoration: isUnderline ? 'underline' : 'none'
        }}
        value={data.text}
        onChange={handleChange}
        placeholder="Texto libre..."
      />
    </div>
  );
}

export default memo(TextNode);
