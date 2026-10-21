import { NavLink, Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/"); // программная навигация после выхода
  };

  return (
    <header className="header">
      <Link to="/" className="logo">🎬 КиноКаталог</Link>
      <nav className="nav">
        <NavLink to="/" end className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          Главная
        </NavLink>
        <NavLink to="/catalog" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
          Каталог
        </NavLink>

        {user ? (
          <>
            <NavLink to="/profile" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              👤 {user.name}
            </NavLink>
            <button className="btn btn-outline" onClick={handleLogout}>Выйти</button>
          </>
        ) : (
          <>
            <NavLink to="/login" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              Войти
            </NavLink>
            <NavLink to="/register" className={({ isActive }) => isActive ? "nav-link active" : "nav-link"}>
              Регистрация
            </NavLink>
          </>
        )}
      </nav>
    </header>
  );
}

export default Header;