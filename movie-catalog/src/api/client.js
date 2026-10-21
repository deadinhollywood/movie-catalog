// src/api/client.js — единая точка для запросов к backend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// Секретный ключ для доступа (берем из переменных окружения Layero)
const ADMIN_KEY = import.meta.env.VITE_ADMIN_KEY || 'sweet-shop-secret-2026'

// ============ Универсальная обёртка над fetch ============
async function request(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      "x-admin-key": ADMIN_KEY, // 👈 ДОБАВИЛИ СЮДА: теперь каждый запрос несет ключ
      ...(options.headers || {}),
    },
    ...options,
  });

  // Пробуем распарсить JSON (даже у ошибок обычно есть тело)
  let data = null;
  try {
    data = await response.json();
  } catch {
    // Пустой ответ — не ошибка
  }

  if (!response.ok) {
    // Пробрасываем ошибку наверх с текстом от сервера
    throw new Error(data?.error || `Ошибка ${response.status}`);
  }

  return data;
}

// ============ API ============
export const api = {
  // Регистрация
  register: (name, email, password) =>
    request("/users/register", {
      method: "POST",
      body: JSON.stringify({ name, email, password }),
    }),

  // Вход
  login: (email, password) =>
    request("/users/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    }),

  // ============ Фильмы ============
  getMovies: () => request("/movies"),
  getMovie: (id) => request(`/movies/${id}`),

  // ============ Избранное ============
  addToFavorites: (userId, movieId) =>
    request("/orders", {
      method: "POST",
      body: JSON.stringify({ userId, movieId }),
    }),

  getFavorites: (userId) => request(`/orders/user/${userId}`),
};