// server.js — точка входа backend
require("dotenv").config(); // читаем .env первым делом

const express = require("express");
const cors = require("cors");
const path = require("path");

// Подключаем БД (при первом запуске создаст таблицы)
require("./db/init");

const usersRouter = require("./routes/users");
const moviesRouter = require("./routes/movies");
const ordersRouter = require("./routes/orders");
const uploadRouter = require("./routes/upload");

console.log("usersRouter:",  typeof usersRouter);
console.log("moviesRouter:", typeof moviesRouter);
console.log("ordersRouter:", typeof ordersRouter);
console.log("uploadRouter:", typeof uploadRouter);

const app = express();

// ============ Middleware ============
app.use(cors());                    // разрешаем CORS для React-фронтенда
app.use(express.json());            // разбираем JSON в теле запроса
app.use(express.urlencoded({ extended: true }));

// Отдаём статические файлы
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/admin", express.static(path.join(__dirname, "admin")));

// ============ Маршруты ============
app.get("/api/ping", (req, res) => {
  res.json({ message: "Сервер работает", time: new Date().toISOString() });
});

app.use("/api/users", usersRouter);
app.use("/api/movies", moviesRouter);
app.use("/api/orders", ordersRouter);
app.use("/api/upload", uploadRouter);

// ============ Глобальный обработчик ошибок ============
app.use((err, req, res, next) => {
  console.error("Ошибка:", err.message);
  res.status(err.status || 500).json({ error: err.message || "Ошибка сервера" });
});

// ============ Запуск ============
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
  console.log(`Админ-панель:   http://localhost:${PORT}/admin/`);
});