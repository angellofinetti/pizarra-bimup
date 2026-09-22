import re

with open('src/pages/Editor.tsx', 'r', encoding='utf8') as f:
    content = f.read()

if 'useTheme' not in content:
    content = content.replace("import Sidebar from '../components/Sidebar';", "import Sidebar from '../components/Sidebar';\nimport { useTheme } from '../contexts/ThemeContext';")

content = content.replace('export default function Editor() {', 'export default function Editor() {\n  const { isDarkMode } = useTheme();')
content = content.replace('<div className="flex h-screen w-full bg-gray-950 text-white overflow-hidden">', '<div className={`flex h-screen w-full ${isDarkMode ? "bg-gray-950 text-white" : "bg-gray-50 text-gray-900"} overflow-hidden`}>')
content = content.replace('<header className="h-16 px-4 bg-gray-950 border-b border-gray-800 flex items-center justify-between shrink-0 z-10">', '<header className={`h-16 px-4 ${isDarkMode ? "bg-gray-950 border-gray-800" : "bg-white border-gray-200"} border-b flex items-center justify-between shrink-0 z-10`}>')

with open('src/pages/Editor.tsx', 'w', encoding='utf8') as f:
    f.write(content)
