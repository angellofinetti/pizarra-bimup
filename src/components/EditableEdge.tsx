import { 
  getSmoothStepPath, 
  getBezierPath, 
  getStraightPath, 
  EdgeLabelRenderer, 
  BaseEdge, 
  useReactFlow 
} from '@xyflow/react';
import type { EdgeProps } from '@xyflow/react';
import { Minus, CornerUpRight, Trash2, Spline } from 'lucide-react';
import clsx from 'clsx';

export default function EditableEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style,
  markerEnd,
  data,
  selected
}: EdgeProps) {
  const { setEdges } = useReactFlow();
  
  const pathType = data?.pathType || 'smoothstep';

  let edgePath, labelX, labelY;
  const pathParams = { sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition };

  // Calcular el trazo dependiendo de la opción elegida
  if (pathType === 'straight') {
    [edgePath, labelX, labelY] = getStraightPath(pathParams);
  } else if (pathType === 'bezier') {
    [edgePath, labelX, labelY] = getBezierPath(pathParams);
  } else {
    // por defecto
    [edgePath, labelX, labelY] = getSmoothStepPath(pathParams);
  }

  const onLabelChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    setEdges((eds) =>
      eds.map((e) => {
        if (e.id === id) {
          return { ...e, data: { ...e.data, label: evt.target.value } };
        }
        return e;
      })
    );
  };

  const changeType = (newType: string) => {
    setEdges((eds) =>
      eds.map((e) => {
        if (e.id === id) {
          return { ...e, data: { ...e.data, pathType: newType } };
        }
        return e;
      })
    );
  };

  const handleDelete = () => setEdges((eds) => eds.filter(e => e.id !== id));

  const label = (data?.label as string) || '';

  return (
    <>
      <BaseEdge 
        path={edgePath} 
        markerEnd={markerEnd} 
        style={{
          ...style,
          strokeWidth: selected ? 3 : 2, // Resaltar al seleccionar
        }} 
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: 'absolute',
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            pointerEvents: 'all',
          }}
          className="nodrag nopan flex flex-col items-center gap-1 z-50"
        >
          {/* Barra de herramientas flotante para la flecha (visible al seleccionarla) */}
          <div 
            className={clsx(
              "flex items-center gap-1 bg-gray-900 border border-gray-700 p-1 rounded-lg shadow-xl transition-opacity",
              selected ? "opacity-100" : "opacity-0 pointer-events-none"
            )}
          >
            <button 
              onClick={() => changeType('straight')} 
              className={clsx("p-1 rounded hover:text-white transition-colors", pathType === 'straight' ? "bg-gray-800 text-blue-400" : "text-gray-400")} 
              title="Flecha Recta"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => changeType('bezier')} 
              className={clsx("p-1 rounded hover:text-white transition-colors", pathType === 'bezier' ? "bg-gray-800 text-blue-400" : "text-gray-400")} 
              title="Flecha Curva"
            >
              <Spline className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={() => changeType('smoothstep')} 
              className={clsx("p-1 rounded hover:text-white transition-colors", pathType === 'smoothstep' ? "bg-gray-800 text-blue-400" : "text-gray-400")} 
              title="Flecha Escalonada"
            >
              <CornerUpRight className="w-3.5 h-3.5" />
            </button>
            
            <div className="w-px h-4 bg-gray-700 mx-1" />
            
            <button 
              onClick={handleDelete} 
              className="p-1 rounded text-gray-400 hover:text-red-500 transition-colors" 
              title="Eliminar Flecha"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <input
            className="bg-gray-800 text-gray-200 text-xs px-2 py-1 rounded shadow-lg outline-none border border-gray-600 focus:border-blue-500 text-center transition-all focus:min-w-[120px]"
            value={label}
            onChange={onLabelChange}
            placeholder="Texto..."
            style={{ width: Math.max(70, label.length * 8 + 20) + 'px' }}
          />
        </div>
      </EdgeLabelRenderer>
    </>
  );
}
