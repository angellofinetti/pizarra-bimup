import { useCallback, useState, useEffect, useRef } from 'react';
import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  BackgroundVariant,
  Panel,
  MarkerType,
  MiniMap,
  SelectionMode
} from '@xyflow/react';
import type { Connection, Edge, Node } from '@xyflow/react';
import { Save, Sun, Moon, Square, Camera, Undo2, Redo2, Frame, SmilePlus, Type } from 'lucide-react';
import { toPng } from 'html-to-image';
import clsx from 'clsx';

import ClassNode from './ClassNode';
import type { ClassNodeData } from './ClassNode';
import ClassDetailModal from './ClassDetailModal';
import TextNode from './TextNode';
import EditableEdge from './EditableEdge';
import StickyNode from './StickyNode';
import ImageNode from './ImageNode';
import ShapeNode from './ShapeNode';
import FrameNode from './FrameNode';
import IconNode from './IconNode';

import { supabase } from '../lib/supabase';

import { useAuth } from '../contexts/AuthContext';

const nodeTypes = {
  classNode: ClassNode,
  textNode: TextNode,
  stickyNode: StickyNode,
  imageNode: ImageNode,
  shapeNode: ShapeNode,
  frameNode: FrameNode,
  iconNode: IconNode,
};

const edgeTypes = {
  editableEdge: EditableEdge,
};

const initialNodes: Node[] = [];
const initialEdges: Edge[] = [];

let idCounter = 60;

interface LearningCanvasProps {
  boardId: string;
}

export default function LearningCanvas({ boardId }: LearningCanvasProps) {
  const { user } = useAuth();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedVideo, setSelectedVideo] = useState<{ isOpen: boolean; title: string; url: string }>({ isOpen: false, title: '', url: '' });
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isOwner, setIsOwner] = useState(false);

  const [past, setPast] = useState<{ nodes: Node[]; edges: Edge[] }[]>([]);
  const [future, setFuture] = useState<{ nodes: Node[]; edges: Edge[] }[]>([]);

  // Usamos una referencia para tener siempre el estado actual de los nodos sin necesidad de re-renderizar los listeners
  const nodesRef = useRef(nodes);
  useEffect(() => {
    nodesRef.current = nodes;
  }, [nodes]);

  const takeSnapshot = useCallback(() => {
    setPast((p) => [...p, { nodes, edges }]);
    setFuture([]);
  }, [nodes, edges]);

  const undo = () => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    setPast((p) => p.slice(0, p.length - 1));
    setFuture((f) => [{ nodes, edges }, ...f]);
    setNodes(previous.nodes);
    setEdges(previous.edges);
  };

  const redo = () => {
    if (future.length === 0) return;
    const next = future[0];
    setFuture((f) => f.slice(1));
    setPast((p) => [...p, { nodes, edges }]);
    setNodes(next.nodes);
    setEdges(next.edges);
  };

  // Cargar estado desde Supabase al iniciar
  useEffect(() => {
    const loadState = async () => {
      if (!boardId) return;
      const { data } = await supabase
        .from('tableros_pizarra')
        .select('*')
        .eq('id', boardId)
        .single();

      if (data) {
        if (data.nodes?.length) setNodes(data.nodes);
        if (data.edges?.length) setEdges(data.edges);
        if (data.theme !== null) setIsDarkMode(data.theme);
        setIsOwner(user?.id === data.user_id);
      }
    };
    loadState();
  }, [setNodes, setEdges, boardId, user?.id]);

  // Manejar atajos de teclado globales (Copiar/Pegar)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignorar si el usuario está escribiendo en un input o textarea
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea') return;

      // Ctrl+C (Copiar Nodos)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'c') {
        const selectedNodes = nodesRef.current.filter(n => n.selected);
        if (selectedNodes.length > 0) {
          localStorage.setItem('revit-clipboard-nodes', JSON.stringify(selectedNodes));
        }
      }

      // Ctrl+V (Pegar Nodos)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v') {
        const clip = localStorage.getItem('revit-clipboard-nodes');
        if (clip) {
          try {
            const parsed = JSON.parse(clip) as Node[];
            if (parsed && parsed.length > 0) {
              takeSnapshot();
              const newNodes = parsed.map(n => ({
                ...n,
                id: `${n.type}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
                position: { x: n.position.x + 40, y: n.position.y + 40 }, // Desplazamiento sutil
                selected: true
              }));
              setNodes(nds => nds.map(n => ({ ...n, selected: false })).concat(newNodes));
            }
          } catch(err) {}
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [setNodes, takeSnapshot]);

  // Pegar Imágenes desde el portapapeles
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const activeTag = document.activeElement?.tagName.toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea') return;

      if (e.clipboardData?.items) {
        for (const item of e.clipboardData.items) {
          if (item.type.indexOf('image') !== -1) {
            const file = item.getAsFile();
            if (!file) continue;
            const reader = new FileReader();
            reader.onload = (event) => {
              if (event.target?.result) {
                takeSnapshot();
                const newNode: Node = {
                  id: `img-${Date.now()}`,
                  type: 'imageNode',
                  position: { x: window.innerWidth / 2 - 150, y: window.innerHeight / 2 - 100 },
                  data: { url: event.target.result as string },
                  style: { width: 300, height: 200 },
                  zIndex: 10
                };
                setNodes((nds) => nds.concat(newNode));
              }
            };
            reader.readAsDataURL(file);
          }
        }
      }
    };
    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [setNodes, takeSnapshot]);

  const saveCanvasState = async () => {
    if (!user) {
      alert('Debes iniciar sesión para guardar.');
      return;
    }
    
    const { error } = await supabase
      .from('tableros_pizarra')
      .upsert({ 
         id: boardId, 
         user_id: user.id,
         nodes: nodes, 
         edges: edges, 
         theme: isDarkMode,
         updated_at: new Date()
      });
    
    if (error) {
      alert('Error guardando en la nube: ' + error.message);
    } else {
      alert('¡Diagrama guardado en Supabase exitosamente!');
    }
  };

  const exportToImage = () => {
    const viewport = document.querySelector('.react-flow__viewport') as HTMLElement;
    if (!viewport) return;
    toPng(viewport, { backgroundColor: isDarkMode ? '#111827' : '#f8fafc' })
      .then((dataUrl) => {
        const a = document.createElement('a');
        a.href = dataUrl;
        a.download = 'Ruta_Revit_2026.png';
        a.click();
      });
  };

  const onConnect = useCallback(
    (params: Connection | Edge) => {
      takeSnapshot();
      setEdges((eds) => addEdge({
        ...params, type: 'editableEdge',
        style: { stroke: isDarkMode ? '#6b7280' : '#475569', strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: isDarkMode ? '#6b7280' : '#475569' },
        data: { label: '' }
      } as any, eds));
    }, [setEdges, isDarkMode, takeSnapshot]
  );

  const addNewNode = (type: string, data: any, zIndex: number = 1, style?: any) => {
    takeSnapshot();
    const newNode: Node = {
      id: `${type}-${idCounter++}`, type,
      position: { x: Math.random() * 200 + 200, y: Math.random() * 200 + 200 },
      data, zIndex, style
    };
    setNodes((nds) => nds.concat(newNode));
  };

  return (
    <div className={clsx("w-full h-full relative transition-colors duration-500", isDarkMode ? "bg-gray-950 text-gray-100" : "bg-gray-50 text-gray-900")}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeDragStart={takeSnapshot}
        onNodeClick={(e, node) => {
          const target = e.target as HTMLElement;
          // Ignorar clics en botones (lapicito, basurero), inputs, textareas, o si el nodo está en modo edición
          if (
            target.closest('button') || 
            target.closest('[data-editing="true"]') ||
            target.tagName.toLowerCase() === 'input' ||
            target.tagName.toLowerCase() === 'textarea'
          ) {
            return;
          }

          if (node.type === 'classNode' && node.data.status !== 'locked') {
            setSelectedVideo({ isOpen: true, title: (node.data as ClassNodeData).title, url: (node.data as ClassNodeData).tiktokUrl || '#' });
          }
        }}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        className="touchdevice-flow"
        minZoom={0.1}
        maxZoom={4}
        deleteKeyCode={["Backspace", "Delete"]}
        snapToGrid={true}
        snapGrid={[20, 20]}
        panOnDrag={[1, 2]}
        selectionOnDrag={true}
        selectionMode={SelectionMode.Partial}
        panActivationKeyCode="Space"
        nodesDraggable={isOwner}
        nodesConnectable={isOwner}
        elementsSelectable={isOwner}
      >
        <Background color={isDarkMode ? "#374151" : "#cbd5e1"} variant={BackgroundVariant.Dots} gap={20} size={2} />
        
        <Controls className={clsx(isDarkMode ? "!bg-gray-800 !border-gray-700 !fill-gray-300" : "!bg-white !border-gray-200 !fill-gray-600")} />
        
        <MiniMap 
          nodeColor={(n) => {
            if (n.type === 'frameNode') return isDarkMode ? '#374151' : '#cbd5e1';
            return isDarkMode ? '#3b82f6' : '#2563eb';
          }}
          maskColor={isDarkMode ? 'rgba(0, 0, 0, 0.7)' : 'rgba(255, 255, 255, 0.7)'}
          style={{ backgroundColor: isDarkMode ? '#1f2937' : '#f8fafc' }}
        />
        
        <Panel position="top-right" className={clsx("p-2 rounded-lg shadow-xl flex gap-2 border items-center flex-wrap max-w-[900px] justify-end", isDarkMode ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200")}>
           
           {isOwner && (
             <div className="flex gap-1 border-r border-gray-600 pr-2">
               <button onClick={undo} disabled={past.length === 0} className="p-1.5 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400" title="Deshacer (Ctrl+Z)"><Undo2 className="w-4 h-4" /></button>
               <button onClick={redo} disabled={future.length === 0} className="p-1.5 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400" title="Rehacer (Ctrl+Y)"><Redo2 className="w-4 h-4" /></button>
             </div>
           )}

           <button onClick={() => setIsDarkMode(!isDarkMode)} className={clsx("p-1.5 rounded-md", isDarkMode ? "text-yellow-400 hover:bg-gray-800" : "text-indigo-600 hover:bg-gray-100")} title="Modo Claro/Oscuro">
             {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
           </button>
           
           {isOwner && (
             <>
               <div className={clsx("w-px h-6 mx-1", isDarkMode ? "bg-gray-700" : "bg-gray-300")} />

               <button onClick={() => addNewNode('frameNode', { title: 'Nuevo Marco' }, -10, { width: 400, height: 300 })} className="bg-gray-800 hover:bg-gray-700 text-white px-3 py-2 rounded-md text-sm font-semibold border border-gray-600 flex items-center gap-1"><Frame className="w-4 h-4"/> Marco</button>
               
               <button onClick={() => addNewNode('textNode', { text: 'Texto libre' }, 5, { width: 250, height: 60 })} className="bg-gray-700 hover:bg-gray-600 text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1"><Type className="w-4 h-4"/> Texto</button>
               <button onClick={() => addNewNode('iconNode', { iconType: 'smile', color: '#facc15' }, 5, { width: 80, height: 80 })} className="bg-pink-600 hover:bg-pink-500 text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1"><SmilePlus className="w-4 h-4"/> Sticker</button>
               <button onClick={() => addNewNode('shapeNode', { text: 'Texto', shape: 'rectangle', color: '#dbeafe' }, 1, { width: 160, height: 160 })} className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1"><Square className="w-4 h-4" /> Figura</button>
               <button onClick={() => addNewNode('stickyNode', { text: '', color: '#fef08a' }, 1, { width: 200, height: 200 })} className="bg-yellow-600 hover:bg-yellow-500 text-white px-3 py-2 rounded-md text-sm font-semibold">Post-it</button>
               <button onClick={() => addNewNode('classNode', { title: 'Clase', module: 'MÓDULO', status: 'in-progress', tiktokUrl: '' }, 2)} className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded-md text-sm font-semibold">+ Clase</button>
             </>
           )}
           
           <div className={clsx("w-px h-6 mx-1", isDarkMode ? "bg-gray-700" : "bg-gray-300")} />

           <button onClick={exportToImage} className="bg-purple-600 hover:bg-purple-500 text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1"><Camera className="w-4 h-4" /> Exportar</button>
           
           {isOwner && (
             <button onClick={saveCanvasState} className="bg-green-600 hover:bg-green-500 text-white px-3 py-2 rounded-md text-sm font-semibold flex items-center gap-1"><Save className="w-4 h-4" /> Guardar</button>
           )}
        </Panel>
      </ReactFlow>

      <ClassDetailModal isOpen={selectedVideo.isOpen} onClose={() => setSelectedVideo({ isOpen: false, title: '', url: '' })} title={selectedVideo.title} tiktokUrl={selectedVideo.url} />
    </div>
  );
}
