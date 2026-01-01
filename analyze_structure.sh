#!/bin/bash
echo "=== ПОЛНАЯ СТРУКТУРА ПРОЕКТА 'МЕТОДИКА КОФЕ' ==="
echo "Дата: $(date)"
echo "Путь: $(pwd)"
echo ""

# Общая информация
echo "📊 ОБЩАЯ ИНФОРМАЦИЯ:"
echo "Размер проекта: $(du -sh . | cut -f1)"
echo "Количество файлов: $(find . -type f | wc -l)"
echo ""

# Дерево структуры (ограниченное)
echo "🌳 СТРУКТУРА КАТАЛОГОВ:"
find . -type d | sort | grep -v ".git" | head -30
echo ""

# Backend
echo "🔧 BACKEND (/backend):"
if [ -d "backend" ]; then
    echo "Размер: $(du -sh backend | cut -f1)"
    echo "Файлы:"
    ls -la backend/
    echo ""
    echo "package.json:"
    if [ -f "backend/package.json" ]; then
        cat backend/package.json | head -20
    fi
    echo ""
    echo "server.js (первые 10 строк):"
    if [ -f "backend/server.js" ]; then
        head -10 backend/server.js
    fi
else
    echo "❌ Папка backend не найдена"
fi
echo ""

# Frontend
echo "🎨 FRONTEND (/frontend):"
if [ -d "frontend" ]; then
    echo "Размер: $(du -sh frontend | cut -f1)"
    echo "Структура:"
    ls -la frontend/
    echo ""
    if [ -d "frontend/build" ]; then
        echo "Build папка:"
        ls -la frontend/build/
        echo ""
        echo "index.html (первые 15 строк):"
        head -15 frontend/build/index.html
    fi
    echo ""
    echo "package.json:"
    if [ -f "frontend/package.json" ]; then
        cat frontend/package.json | head -20
    fi
else
    echo "❌ Папка frontend не найдена"
fi
echo ""

# Конфигурационные файлы
echo "⚙️ КОНФИГУРАЦИОННЫЕ ФАЙЛЫ:"
find . -name "*.json" -o -name "*.js" -o -name "*.md" -o -name "*.sh" -o -name ".*" 2>/dev/null | grep -v node_modules | head -20
echo ""

# Nginx конфигурация
echo "🌐 NGINX КОНФИГУРАЦИЯ:"
if [ -f "/etc/nginx/sites-available/metodika-coffee" ]; then
    echo "Конфиг найден:"
    head -30 /etc/nginx/sites-available/metodika-coffee
else
    echo "❌ Nginx конфиг не найден в стандартном месте"
fi
echo ""

# PM2 процессы
echo "⚡ PM2 ПРОЦЕССЫ:"
pm2 list 2>/dev/null || echo "PM2 не установлен или не запущен"
echo ""

# Веб-доступность
echo "🔗 ВЕБ-ДОСТУПНОСТЬ:"
curl -s -I http://localhost/ 2>/dev/null | head -1 || echo "❌ Веб-сервер не отвечает"
curl -s -I http://localhost:3000/api/test 2>/dev/null | head -1 || echo "❌ API не отвечает"
