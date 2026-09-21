import { memo } from 'react';
import { Handle, Position, NodeResizer, useReactFlow } from '@xyflow/react';
import { 
  Trash2, Smile, User, PersonStanding, ArrowRight, AlertTriangle, 
  Star, ThumbsUp, MapPin, Flame, Zap, CheckCircle2,
  HardHat, Building, GraduationCap, Lightbulb, Hammer, Box, Trophy, BookOpen,
  // Nuevos iconos agregados:
  Frown, Meh, Heart, ThumbsDown, MessageCircle, Cloud, Laptop, Smartphone, 
  Briefcase, Clock, Calendar, Megaphone, Wrench, Ruler, PenTool, Compass, 
  Settings, Shield, Activity, Coffee, Rocket, Search, Eye, Target, Camera, Video
} from 'lucide-react';
import clsx from 'clsx';

export type IconNodeData = {
  iconType: string;
  color: string;
};

// Mapa de iconos extendido masivamente
const iconLibrary: Record<string, any> = {
  bimup: 'BIM_UP_SPECIAL', // Caso especial para el sticker de texto
  smile: Smile,
  meh: Meh,
  frown: Frown,
  thumbsup: ThumbsUp,
  thumbsdown: ThumbsDown,
  heart: Heart,
  star: Star,
  flame: Flame,
  zap: Zap,
  check: CheckCircle2,
  alert: AlertTriangle,
  arrow: ArrowRight,
  pin: MapPin,
  message: MessageCircle,
  cloud: Cloud,
  standing: PersonStanding,
  user: User,
  hardhat: HardHat,
  building: Building,
  hammer: Hammer,
  wrench: Wrench,
  ruler: Ruler,
  compass: Compass,
  grad: GraduationCap,
  book: BookOpen,
  idea: Lightbulb,
  box: Box,
  trophy: Trophy,
  laptop: Laptop,
  phone: Smartphone,
  briefcase: Briefcase,
  clock: Clock,
  calendar: Calendar,
  megaphone: Megaphone,
  pentool: PenTool,
  settings: Settings,
  shield: Shield,
  activity: Activity,
  coffee: Coffee,
  rocket: Rocket,
  search: Search,
  eye: Eye,
  target: Target,
  camera: Camera,
  video: Video
};

const colors = [
  '#f87171', // Red
  '#fb923c', // Orange
  '#facc15', // Yellow
  '#4ade80', // Green
  '#60a5fa', // Blue
  '#c084fc', // Purple
  '#f472b6', // Pink
  '#9ca3af', // Gray
  '#ffffff', // White
  '#000000', // Black
];

function IconNode({ id, data, selected }: { id: string, data: IconNodeData, selected?: boolean }) {
  const { setNodes } = useReactFlow();

  const changeIcon = (newIcon: string) => {
    setNodes((nodes) => nodes.map((n) => n.id === id ? { ...n, data: { ...n.data, iconType: newIcon } } : n));
  };

  const changeColor = (newColor: string) => {
    setNodes((nodes) => nodes.map((n) => n.id === id ? { ...n, data: { ...n.data, color: newColor } } : n));
  };

  const handleDelete = () => setNodes((nodes) => nodes.filter((n) => n.id !== id));

  const handleStyle = clsx(
    "!w-2 !h-2 !bg-blue-500 hover:!scale-150 transition-all duration-200 z-10", 
    selected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
  );

  return (
    <div className="relative group w-full h-full min-w-[50px] min-h-[50px] flex items-center justify-center">
      
      <NodeResizer 
        color="#3b82f6" 
        isVisible={selected} 
        minWidth={50} 
        minHeight={50} 
        handleClassName="w-2.5 h-2.5 bg-blue-500 rounded-sm border-2 border-white"
      />

      <Handle type="target" position={Position.Top} id="t" className={handleStyle} />
      <Handle type="source" position={Position.Right} id="r" className={handleStyle} />
      <Handle type="source" position={Position.Bottom} id="b" className={handleStyle} />
      <Handle type="target" position={Position.Left} id="l" className={handleStyle} />

      {/* Toolbar del Icono */}
      <div 
        className={clsx(
          "absolute -top-[270px] left-1/2 -translate-x-1/2 flex flex-col gap-1 bg-gray-900 border border-gray-700 p-2 rounded-lg transition-opacity duration-200 z-50 w-72 shadow-xl",
          selected ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
      >
        {/* Selector de Íconos - Con scroll por si hay demasiados */}
        <div className="flex flex-wrap gap-1 border-b border-gray-700 pb-1.5 mb-1 justify-center max-h-[220px] overflow-y-auto custom-scrollbar">
          {Object.keys(iconLibrary).map(key => {
            const isBimUp = key === 'bimup';
            const BtnIcon = isBimUp ? null : iconLibrary[key];
            
            return (
              <button 
                key={key} 
                onClick={() => changeIcon(key)}
                className={clsx(
                  "p-1 rounded text-gray-400 hover:text-white hover:bg-gray-800 flex items-center justify-center", 
                  data.iconType === key && "bg-gray-800 text-blue-400",
                  isBimUp ? "w-full mx-1 my-0.5 border border-gray-700 py-1 font-black text-xs" : "w-8 h-8"
                )}
                title={key}
              >
                {isBimUp ? <span>BIM UP (Texto)</span> : <BtnIcon className="w-5 h-5" />}
              </button>
            )
          })}
        </div>
        
        {/* Selector de Colores y Basurero */}
        <div className="flex items-center justify-between mt-1">
          <div className="flex flex-wrap gap-1">
            {colors.map(c => (
              <button 
                key={c} onClick={() => changeColor(c)}
                className={clsx("w-4 h-4 rounded-full border border-gray-600 hover:scale-125", data.color === c && "ring-1 ring-white")} 
                style={{ backgroundColor: c }} 
              />
            ))}
          </div>
          <div className="w-px h-4 bg-gray-700 mx-1" />
          <button onClick={handleDelete} className="text-gray-400 hover:text-red-500 p-1 rounded hover:bg-gray-800" title="Eliminar ícono">
            <Trash2 className="w-4 h-4"/>
          </button>
        </div>
      </div>

      {/* Renderizado del Ícono escalado */}
      <div className="w-full h-full drop-shadow-md flex items-center justify-center pointer-events-none">
        {data.iconType === 'bimup' ? (
           <div 
             className="w-full h-full flex items-center justify-center rounded-xl border-4 shadow-2xl transform -rotate-6"
             style={{ borderColor: data.color, backgroundColor: 'rgba(17, 24, 39, 0.8)' }}
           >
             <span 
               className="font-black text-center leading-none uppercase" 
               style={{ 
                 color: data.color, 
                 fontSize: 'min(50cqw, 3rem)',
                 lineHeight: 0.9 
               }}
             >
               BIM<br/>UP
             </span>
           </div>
        ) : (
           (() => {
             const IconComponent = iconLibrary[data.iconType] || Smile;
             return <IconComponent style={{ width: '100%', height: '100%', color: data.color }} strokeWidth={1.5} />;
           })()
        )}
      </div>
    </div>
  );
}

export default memo(IconNode);
