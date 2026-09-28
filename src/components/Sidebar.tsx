import { useState } from 'react';
import { Home, Compass, Map, Users, Settings, FolderOpen, Bell, Box, ChevronLeft, ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { useTheme } from '../contexts/ThemeContext';

export default function Sidebar() {
  const { isDarkMode } = useTheme();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={clsx(
      "relative h-screen flex flex-col hidden md:flex shrink-0 border-r transition-all duration-300",
      collapsed ? "w-16" : "w-64",
      isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"
    )}>
      {/* Botón de colapsar */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className={clsx(
          "absolute -right-3 top-20 z-50 w-6 h-6 rounded-full border flex items-center justify-center shadow-md transition-colors",
          isDarkMode
            ? "bg-gray-800 border-gray-600 text-gray-400 hover:text-white hover:bg-gray-700"
            : "bg-white border-gray-200 text-gray-500 hover:text-gray-900 hover:bg-gray-50"
        )}
        title={collapsed ? "Expandir menú" : "Colapsar menú"}
      >
        {collapsed ? <ChevronRight className="w-3.5 h-3.5" /> : <ChevronLeft className="w-3.5 h-3.5" />}
      </button>

      {/* Header logo */}
      <div className={clsx(
        "h-16 flex items-center border-b overflow-hidden",
        collapsed ? "px-4 justify-center" : "px-6",
        isDarkMode ? "border-gray-800" : "border-gray-200"
      )}>
        <div className="flex items-center gap-3 text-blue-500 shrink-0">
          <Box className="w-6 h-6 shrink-0" />
          {!collapsed && (
            <span className={clsx("text-lg font-bold tracking-wide whitespace-nowrap", isDarkMode ? "text-white" : "text-gray-900")}>
              BIM UP - REVIT
            </span>
          )}
        </div>
      </div>

      {/* User profile */}
      {!collapsed && (
        <div className="p-4">
          <div className={clsx(
            "flex items-center gap-3 px-3 py-2 rounded-lg border",
            isDarkMode ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-200"
          )}>
            <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold text-white shadow-inner shrink-0">
              PF
            </div>
            <div className="overflow-hidden">
              <p className={clsx("text-sm font-semibold truncate", isDarkMode ? "text-gray-200" : "text-gray-900")}>Profesor</p>
              <p className="text-xs text-gray-400 truncate">Colegio de Ingenieros</p>
            </div>
          </div>
        </div>
      )}

      {/* Avatar small when collapsed */}
      {collapsed && (
        <div className="p-3 flex justify-center">
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-sm font-bold text-white shadow-inner">
            PF
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-2 py-2 space-y-1 overflow-hidden">
        <NavItem icon={<Home className="w-5 h-5" />} label="Dashboard" collapsed={collapsed} />
        <NavItem icon={<Map className="w-5 h-5" />} label="Ruta de Aprendizaje" active collapsed={collapsed} />
        <NavItem icon={<Compass className="w-5 h-5" />} label="Cursos Disponibles" collapsed={collapsed} />
        <NavItem icon={<FolderOpen className="w-5 h-5" />} label="Archivos Base (.rvt)" collapsed={collapsed} />
        <NavItem icon={<Users className="w-5 h-5" />} label="Comunidad" collapsed={collapsed} />
      </nav>

      {/* Footer */}
      <div className={clsx("p-2 border-t", isDarkMode ? "border-gray-800" : "border-gray-200")}>
        <NavItem icon={<Bell className="w-5 h-5" />} label="Notificaciones" badge="3" collapsed={collapsed} />
        <NavItem icon={<Settings className="w-5 h-5" />} label="Ajustes" collapsed={collapsed} />
      </div>
    </aside>
  );
}

function NavItem({ icon, label, active, badge, collapsed }: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: string;
  collapsed?: boolean;
}) {
  const { isDarkMode } = useTheme();
  return (
    <a
      href="#"
      title={collapsed ? label : undefined}
      className={clsx(
        "flex items-center rounded-lg transition-colors group",
        collapsed ? "justify-center px-2 py-2.5" : "justify-between px-3 py-2.5",
        active
          ? (isDarkMode ? "bg-blue-600/10 text-blue-500" : "bg-blue-50 text-blue-600")
          : (isDarkMode ? "text-gray-400 hover:bg-gray-800 hover:text-gray-200" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900")
      )}
    >
      <div className={clsx("flex items-center", collapsed ? "" : "gap-3")}>
        {icon}
        {!collapsed && <span className="text-sm font-medium whitespace-nowrap">{label}</span>}
      </div>
      {!collapsed && badge && (
        <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
      {collapsed && badge && (
        <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full" />
      )}
    </a>
  );
}
