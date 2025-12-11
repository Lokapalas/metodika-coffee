FROM python:3.11-slim

WORKDIR /app

# Копируем зависимости
COPY ./app/requirements.txt .

# Устанавливаем с таймаутами и ретраями
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir --default-timeout=100 -r requirements.txt

# Копируем код
COPY ./app .

# Открываем порт
EXPOSE 8000

# Запускаем сервер
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
