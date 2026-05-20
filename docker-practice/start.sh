#!/bin/bash
docker compose up --build -d
echo "✅ Сервера запущены"
echo "Тест: curl http://localhost/api/users"
echo "Остановка: docker compose down"
