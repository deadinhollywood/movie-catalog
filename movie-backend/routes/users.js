// routes/users.js — регистрация, вход, список пользователей
const express = require("express");
const bcrypt = require("bcrypt");
const db = require("../db/init");
const checkAdmin = require("../middleware/checkAdmin");

const router = express.Router();

// ============ POST /api/users/register ============
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: "Заполните все поля" });
    }

    // Хэшируем пароль перед сохранением
    const hashedPassword = await bcrypt.hash(password, 10);

    // Параметризованный запрос — защита от SQL-инъекции
    const insert = db.prepare(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)"
    );
    const result = insert.run(name, email, hashedPassword);

    res.status(201).json({
      id: result.lastInsertRowid,
      name,
      email,
    });
  } catch (error) {
    // Уникальный email — единственная ожидаемая ошибка
    res.status(400).json({ error: "Email уже используется" });
  }
});

// ============ POST /api/users/login ============
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Заполните все поля" });
    }

    const user = db
      .prepare("SELECT * FROM users WHERE email = ?")
      .get(email);

    if (!user) {
      return res.status(401).json({ error: "Неверный email или пароль" });
    }

    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ error: "Неверный email или пароль" });
    }

    // Наружу отдаём без поля password
    res.json({ id: user.id, name: user.name, email: user.email });
  } catch (error) {
    res.status(500).json({ error: "Ошибка сервера" });
  }
});

// ============ GET /api/users — список для админки ============
router.get("/", checkAdmin, (req, res) => {
  const users = db
    .prepare("SELECT id, name, email, role, createdAt FROM users")
    .all();
  res.json(users);
});

// ============ DELETE /api/users/:id — только админ ============
router.delete("/:id", checkAdmin, (req, res) => {
  db.prepare("DELETE FROM users WHERE id = ?").run(req.params.id);
  res.json({ success: true });
});

module.exports = router;