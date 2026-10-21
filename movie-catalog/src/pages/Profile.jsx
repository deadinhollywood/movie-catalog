import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { user } = useAuth();

  return (
    <div className="page profile-page">
      <h1>Личный кабинет</h1>
      <p className="welcome">Привет, <strong>{user.name}</strong>!</p>

      <nav className="profile-nav">
        <NavLink to="/profile" end className={({ isActive }) => isActive ? "profile-link active" : "profile-link"}>
          Профиль
        </NavLink>
        <NavLink to="/profile/orders" className={({ isActive }) => isActive ? "profile-link active" : "profile-link"}>
          Избранное
        </NavLink>
      </nav>

      {/* Сюда рендерятся вложенные маршруты */}
      <div className="profile-content">
        <Outlet />
      </div>
    </div>
  );
}

export default Profile;