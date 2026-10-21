import { useAuth } from "../context/AuthContext";

function ProfileInfo() {
  const { user } = useAuth();
  return (
    <div>
      <h2>Мои данные</h2>
      <p><strong>Имя:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
    </div>
  );
}

export default ProfileInfo;