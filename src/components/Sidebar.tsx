import { Home, Compass, Map, Users, Settings, FolderOpen, Bell, Box } from 'lucide-react';
import clsx from 'clsx';

export default function Sidebar() {
  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800 h-screen flex flex-col hidden md:flex shrink-0">
      <div className="h-16 flex items-center px-6 border-b border-gray-800">
        <div className="flex items-center gap-3 text-blue-500">
          <Box className="w-6 h-6" />
          <span className="text-lg font-bold text-white tracking-wide">BIM UP - REVIT</span>
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-center gap-3 px-3 py-2 bg-gray-800 rounded-lg border border-gray-700">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold text-white shadow-inner">
            PF
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-200">Profesor</p>
            <p className="text-xs text-gray-400">Colegio de Ingenieros</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-2 space-y-1">
        <NavItem icon={<Home className="w-5 h-5" />} label="Dashboard" />
        <NavItem icon={<Map className="w-5 h-5" />} label="Ruta de Aprendizaje" active />
        <NavItem icon={<Compass className="w-5 h-5" />} label="Cursos Disponibles" />
        <NavItem icon={<FolderOpen className="w-5 h-5" />} label="Archivos Base (.rvt)" />
        <NavItem icon={<Users className="w-5 h-5" />} label="Comunidad" />
      </nav>

      <div className="p-4 border-t border-gray-800">
        <NavItem icon={<Bell className="w-5 h-5" />} label="Notificaciones" badge="3" />
        <NavItem icon={<Settings className="w-5 h-5" />} label="Ajustes" />
      </div>
    </aside>
  );
}

function NavItem({ icon, label, active, badge }: { icon: React.ReactNode; label: string; active?: boolean; badge?: string }) {
  return (
    <a 
      href="#" 
      className={clsx(
        "flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors group",
        active 
          ? "bg-blue-600/10 text-blue-500" 
          : "text-gray-400 hover:bg-gray-800 hover:text-gray-200"
      )}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      {badge && (
        <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </a>
  );
}
