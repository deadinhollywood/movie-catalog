import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";

function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!form.name || !form.email || !form.password || !form.confirm) {
      return "Заполните все поля";
    }
    if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      return "Некорректный email";
    }
    if (form.password.length < 4) {
      return "Пароль должен быть не менее 4 символов";
    }
    if (form.password !== form.confirm) {
      return "Пароли не совпадают";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const err = validate();
    if (err) {
      setError(err);
      return;
    }

    setIsLoading(true);
    try {
      await register(form.name, form.email, form.password);   // ← API
      navigate("/profile");
    } catch (err) {
      setError(err.message || "Ошибка регистрации");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page auth-page">
      <h1>Регистрация</h1>
      <form onSubmit={handleSubmit} className="form">
        <input name="name" placeholder="Имя" value={form.name} onChange={handleChange} disabled={isLoading} />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={handleChange} disabled={isLoading} />
        <input name="password" type="password" placeholder="Пароль" value={form.password} onChange={handleChange} disabled={isLoading} />
        <input name="confirm" type="password" placeholder="Повторите пароль" value={form.confirm} onChange={handleChange} disabled={isLoading} />
        {error && <p className="error">{error}</p>}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Регистрация..." : "Зарегистрироваться"}
        </Button>
      </form>
      <p>Уже есть аккаунт? <Link to="/login">Войти</Link></p>
    </div>
  );
}

export default Register;