````markdown
# Avito FE Tech Internship 2025 (Wave 2)

**Мини‑версия системы управления проектами**  
Stack: React + Go

---

## 🚀 Быстрый старт

### Локальная разработка

#### Бэкенд

```bash
cd server
go run ./cmd/service
```
````

-   Сервер будет запущен на `http://localhost:8080`

#### Фронтенд

```bash
cd avito-frontend
yarn install
yarn dev
```

-   Приложение стартует на `http://localhost:5173`

---

### Docker Compose

В корне проекта есть `docker-compose.yml`, который поднимает два сервиса:

-   **backend**  – Go сервис, порт 8080
-   **frontend** – nginx + собранный Vite‑бандл, порт 80

```bash
docker-compose up --build
```

-   Фронтенд: `http://localhost/`
-   Бэкенд API: `http://localhost:8080/api/v1/`

---

## 📖 Документация API

Generated Swagger UI доступен здесь:

```
http://localhost:8080/swagger/index.html#/
```

---

## 🛠 Стек и инструменты

**Фронтенд**

-   React 18
-   Vite
-   React Router DOM
-   @hello‑pangea/dnd (Drag & Drop)
-   Axios

**Dev & CI**

-   ESLint
-   Prettier
-   Docker
-   Docker Compose

---

## 🔧 Дополнительные возможности

-   Drag‑and‑drop смена статуса на доске
-   Модальное создание/редактирование задач
-   Фильтрация и поиск задач по статусу, доске, исполнителю и названию
-   Сохранение состояния «открытой» задачи через URL (`?task=<ID>`)

---
