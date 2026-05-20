# frontend4kr

Практические работы по дисциплине "Фронтенд и бэкенд разработка".

## Стек

- Node.js + Express
- JWT (access + refresh токены)
- RBAC (роли: user, seller, admin)
- Redis (кэширование)

## Запуск

```bash
# Запустить Redis
docker run -d --name redis-cache -p 6379:6379 redis

# Установить зависимости
npm install

# Запустить сервер
npm start
```

## Переменные окружения (.env)

```
PORT=3021
ACCESS_SECRET=access_secret_key
REFRESH_SECRET=refresh_secret_key
REDIS_URL=redis://127.0.0.1:6379
```

## Практика 21 — Redis-кэширование

Добавлено кэширование к маршрутам:

| Маршрут | TTL |
|---|---|
| GET /api/users | 1 минута |
| GET /api/users/:id | 1 минута |
| GET /api/products | 10 минут |
| GET /api/products/:id | 10 минут |

При изменении/удалении кэш инвалидируется автоматически.
