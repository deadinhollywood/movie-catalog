// db/init.js — подключение к SQLite и создание таблиц
const Database = require("better-sqlite3");
const path = require("path");

// База данных лежит в корне backend-проекта
const dbPath = path.join(__dirname, "..", "database.sqlite");
const db = new Database(dbPath);

// Включаем поддержку внешних ключей (для связей между таблицами)
db.pragma("foreign_keys = ON");

// ============ Таблица пользователей ============
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

// ============ Таблица фильмов ============
db.exec(`
  CREATE TABLE IF NOT EXISTS movies (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    year INTEGER NOT NULL,
    genre TEXT NOT NULL,
    rating REAL NOT NULL DEFAULT 0,
    duration INTEGER NOT NULL DEFAULT 0,
    director TEXT NOT NULL DEFAULT '',
    description TEXT NOT NULL DEFAULT '',
    poster TEXT NOT NULL DEFAULT '',
    createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

// ============ Таблица избранного (аналог заказов) ============
db.exec(`
  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    movieId INTEGER NOT NULL,
    status TEXT NOT NULL DEFAULT 'новый',
    createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (movieId) REFERENCES movies(id) ON DELETE CASCADE
  )
`);

// ============ Таблица загруженных изображений ============
db.exec(`
  CREATE TABLE IF NOT EXISTS images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    originalName TEXT NOT NULL,
    filename TEXT NOT NULL,
    path TEXT NOT NULL,
    uploadedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

console.log("База данных инициализирована:", dbPath);

module.exports = db;