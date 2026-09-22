import re

with open('src/components/Sidebar.tsx', 'r', encoding='utf8') as f:
    content = f.read()

content = content.replace("import clsx from 'clsx';", "import clsx from 'clsx';\nimport { useTheme } from '../contexts/ThemeContext';")
content = content.replace('export default function Sidebar() {', 'export default function Sidebar() {\n  const { isDarkMode } = useTheme();')
content = content.replace('<aside className="w-64 bg-gray-900 border-r border-gray-800 h-screen flex flex-col hidden md:flex shrink-0">', '<aside className={`w-64 ${isDarkMode ? "bg-gray-900 border-gray-800" : "bg-white border-gray-200"} border-r h-screen flex flex-col hidden md:flex shrink-0`}>')
content = content.replace('<div className="flex items-center gap-3 px-3 py-2 bg-gray-800 rounded-lg border border-gray-700">', '<div className={`flex items-center gap-3 px-3 py-2 ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-gray-100 border-gray-200"} rounded-lg border`}>')
content = content.replace('<p className="text-sm font-semibold text-white">', '<p className={`text-sm font-semibold ${isDarkMode ? "text-white" : "text-gray-900"}`}>')
content = content.replace('? "bg-blue-600/10 text-blue-500"', '? (isDarkMode ? "bg-blue-600/10 text-blue-500" : "bg-blue-50 text-blue-600")')
content = content.replace(': "text-gray-400 hover:bg-gray-800 hover:text-gray-200"', ': (isDarkMode ? "text-gray-400 hover:bg-gray-800 hover:text-gray-200" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900")')
content = content.replace('<h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 px-2">', '<h3 className={`text-xs font-bold ${isDarkMode ? "text-gray-500" : "text-gray-400"} uppercase tracking-wider mb-3 px-2`}>')

with open('src/components/Sidebar.tsx', 'w', encoding='utf8') as f:
    f.write(content)
