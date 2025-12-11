import requests
import re

print("=== ПРОВЕРКА ОШИБОК ФРОНТЕНДА ===")

# 1. Загружаем главную страницу
response = requests.get('http://localhost/')
html = response.text

print(f"1. Статус: {response.status_code}")
print(f"   Размер: {len(html)} символов")

# 2. Ищем скрипты
scripts = re.findall(r'<script[^>]*src="([^"]+)"', html)
print(f"2. Найдено скриптов: {len(scripts)}")
for script in scripts[:3]:
    print(f"   {script}")

# 3. Ищем упоминания API
if '/api/' in html:
    print("3. ✅ HTML содержит ссылки на /api/")
else:
    print("3. ⚠️ HTML не содержит /api/ ссылок")

# 4. Проверяем main.js бандл
if scripts:
    main_js = scripts[0] if 'main.' in scripts[0] else next((s for s in scripts if 'main.' in s), None)
    if main_js:
        js_url = f'http://localhost{main_js}'
        try:
            js_response = requests.get(js_url, timeout=5)
            js_content = js_response.text[:5000]
            
            # Ищем API вызовы
            api_calls = re.findall(r'fetch\([^)]*api[^)]*\)', js_content, re.IGNORECASE)
            if api_calls:
                print(f"4. ✅ Найдены API вызовы в JS: {len(api_calls)}")
                for call in api_calls[:2]:
                    print(f"   {call[:100]}...")
            else:
                print("4. ⚠️ Не найдены API вызовы в JS")
                
        except Exception as e:
            print(f"4. ❌ Ошибка загрузки JS: {e}")

# 5. Тестируем CORS
print("\n5. Тест CORS:")
headers = {'Origin': 'http://localhost'}
try:
    cors_test = requests.get('http://localhost/api/products', headers=headers)
    cors_headers = dict(cors_test.headers)
    
    if 'Access-Control-Allow-Origin' in cors_headers:
        print(f"   ✅ CORS настроен: {cors_headers['Access-Control-Allow-Origin']}")
    else:
        print("   ⚠️ Нет CORS заголовков")
        
except Exception as e:
    print(f"   ❌ CORS ошибка: {e}")
