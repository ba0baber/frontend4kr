# Контрольная работа №4 — Фронтенд и бэкенд разработка

## Выполненные практические работы: №19 PostgreSQL ✅ | №20 MongoDB ✅ | №21 Redis кэширование ✅ | №22 Балансировка нагрузки ✅ | №23 Docker ✅

## Что выполнено в каждой практической

№19 PostgreSQL: создано API с подключением к PostgreSQL, реализованы CRUD операции (POST, GET, GET/:id, PATCH, DELETE) для пользователей с полями first_name, last_name, age, created_at, updated_at (unix timestamp). Использован модуль pg для работы с базой данных.

№20 MongoDB: создано API с подключением к MongoDB, реализованы CRUD операции (POST, GET, GET/:id, PATCH, DELETE) для пользователей с полями first_name, last_name, age, created_at, updated_at (unix timestamp). Использован Mongoose ODM.

№21 Redis кэширование: добавлено кэширование GET /api/users (TTL 1 мин), GET /api/users/:id (TTL 1 мин), GET /api/products (TTL 10 мин), GET /api/products/:id (TTL 10 мин). Инвалидация кэша при изменении данных. Ответ помечается source: cache или source: server.

№22 Балансировка нагрузки: запущены 3 экземпляра сервера на портах 3000,3001,3002. Настроен Nginx с upstream и round-robin, параметрами max_fails=2 и fail_timeout=30s, резервным сервером backup. Настроен HAProxy с балансировкой roundrobin. Проверено распределение запросов и отказоустойчивость.

№23 Docker контейнеризация: создан Dockerfile для backend-сервиса, docker-compose.yml с 3 бэкендами, Redis, Nginx-балансировщиком. Все сервисы объединены в сеть. Запуск через docker compose up --build. Проверена балансировка и отказоустойчивость.

## Как проверить

### №19 PostgreSQL
Запуск: npm install && node server.js
Проверка: curl -X POST http://localhost:3000/api/users -H "Content-Type: application/json" -d '{"first_name":"Иван","last_name":"Петров","age":25}' && curl http://localhost:3000/api/users
Ожидаемый результат: JSON с данными пользователя, поля created_at и updated_at в unix timestamp.

### №20 MongoDB
Запуск: npm install && node server.js
Проверка: curl -X POST http://localhost:3000/api/users -H "Content-Type: application/json" -d '{"first_name":"Иван","last_name":"Петров","age":25}' && curl http://localhost:3000/api/users
Ожидаемый результат: JSON с данными пользователя, поля created_at и updated_at в unix timestamp.

### №21 Redis кэширование
Запуск: brew services start redis (или docker run -d -p 6379:6379 redis) && node server.js
Проверка: TOKEN=$(curl -s -X POST http://localhost:3000/api/auth/login -H "Content-Type: application/json" -d '{"username":"admin","password":"admin"}' | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4) && curl -s http://localhost:3000/api/users -H "Authorization: Bearer $TOKEN" | grep source
Ожидаемый результат: первый запрос "source":"server", повторно в течение минуты "source":"cache"

### №22 Балансировка
Запуск: cd load-balancing && ./start-servers.sh && sudo nginx -c $(pwd)/nginx.conf && haproxy -f haproxy.cfg
Проверка: for i in 1 2 3 4 5; do curl -s http://localhost/api/users -H "Authorization: Bearer $TOKEN" | grep -o '"source":"[^"]*"'; done
Проверка отказоустойчивости: kill $(cat .pids | head -1) && curl -s http://localhost/api/users -H "Authorization: Bearer $TOKEN"
Остановка: ./stop-servers.sh && sudo pkill nginx && pkill haproxy

### №23 Docker
Запуск: cd docker-practice && docker compose up --build -d
Проверка: docker ps
Тест: curl -X POST http://localhost/api/auth/register -H "Content-Type: application/json" -d '{"username":"dockeruser","password":"123456","role":"admin"}' && TOKEN=$(curl -s -X POST http://localhost/api/auth/login -H "Content-Type: application/json" -d '{"username":"dockeruser","password":"123456"}' | grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4) && for i in 1 2 3 4 5; do curl -s http://localhost/api/users -H "Authorization: Bearer $TOKEN" | grep -o '"source":"[^"]*"'; done
Проверка отказоустойчивости: docker stop backend2 && curl -s http://localhost/api/users -H "Authorization: Bearer $TOKEN" && docker start backend2
Остановка: docker compose down

## Технологии
Node.js, Express, PostgreSQL, MongoDB, Mongoose, Redis, Nginx, HAProxy, Docker, Docker Compose, JWT

## Ссылка на репозиторий
https://github.com/ba0baber/frontend4kr
