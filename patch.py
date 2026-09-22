import re

with open('src/components/LearningCanvas.tsx', 'r', encoding='utf8') as f:
    content = f.read()

if 'useTheme' not in content:
    content = content.replace("import clsx from 'clsx';", "import clsx from 'clsx';\nimport { useTheme } from '../contexts/ThemeContext';")

content = re.sub(r'const \[isDarkMode, setIsDarkMode\] = useState\(true\);', 'const { isDarkMode, setTheme } = useTheme();', content)
content = content.replace('setIsDarkMode(data.theme);', 'setTheme(data.theme);')
content = content.replace('onClick={() => setIsDarkMode(!isDarkMode)}', 'onClick={() => setTheme(!isDarkMode)}')

with open('src/components/LearningCanvas.tsx', 'w', encoding='utf8') as f:
    f.write(content)
