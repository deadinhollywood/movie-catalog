import { createContext, useContext, useState, useEffect } from "react";
import { api } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  // --- Сессия пользователя (по-прежнему локально, чтобы пережить F5) ---
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("currentUser");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem("currentUser", JSON.stringify(user));
    else localStorage.removeItem("currentUser");
  }, [user]);

  const logout = () => setUser(null);

  // --- Регистрация через API ---
  const register = async (name, email, password) => {
    const newUser = await api.register(name, email, password);
    setUser({ id: newUser.id, name: newUser.name, email: newUser.email });
    return newUser;
  };

  // --- Вход через API ---
  const login = async (email, password) => {
    const loggedUser = await api.login(email, password);
    setUser({ id: loggedUser.id, name: loggedUser.name, email: loggedUser.email });
    return loggedUser;
  };

  // --- Избранное (по-прежнему локально, синхронизация отдельно) ---
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = async (movie) => {
    const exists = favorites.find((m) => m.id === movie.id);

    if (exists) {
      // Удаляем локально (API-удаление сделаем через админку)
      setFavorites((prev) => prev.filter((m) => m.id !== movie.id));
    } else {
      // Добавляем локально
      setFavorites((prev) => [...prev, movie]);

      // И синхронизируем с сервером, если пользователь авторизован
      if (user) {
        try {
          await api.addToFavorites(user.id, movie.id);
        } catch (err) {
          console.warn("Не удалось сохранить на сервер:", err.message);
        }
      }
    }
  };

  const isFavorite = (id) => favorites.some((m) => m.id === id);

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        logout,
        register,
        login,
        favorites,
        toggleFavorite,
        isFavorite,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}