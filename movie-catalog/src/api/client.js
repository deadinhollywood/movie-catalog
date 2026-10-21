// src/api/client.js — единая точка для запросов к backend
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

// ============ Универсальная обёртка над fetch ============
async function request(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
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

// ============ Пользователи ============
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