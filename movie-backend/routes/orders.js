// routes/orders.js — избранное (аналог заказов)
const express = require("express");
const db = require("../db/init");
const checkAdmin = require("../middleware/checkAdmin");

const router = express.Router();

// ============ GET /api/orders — список (только админ) ============
router.get("/", checkAdmin, (req, res) => {
  const orders = db
    .prepare(`
      SELECT o.id, o.status, o.createdAt,
             u.name AS userName, u.email AS userEmail,
             m.title AS movieTitle, m.year AS movieYear, m.poster AS moviePoster
      FROM orders o
      JOIN users u ON u.id = o.userId
      JOIN movies m ON m.id = o.movieId
      ORDER BY o.id DESC
    `)
    .all();
  res.json(orders);
});

// ============ GET /api/orders/user/:userId — избранное пользователя ============
router.get("/user/:userId", (req, res) => {
  const orders = db
    .prepare("SELECT * FROM orders WHERE userId = ? ORDER BY id DESC")
    .all(req.params.userId);
  res.json(orders);
});

// ============ POST /api/orders — добавить в избранное ============
router.post("/", (req, res) => {
  try {
    const { userId, movieId } = req.body;

    if (!userId || !movieId) {
      return res.status(400).json({ error: "userId и movieId обязательны" });
    }

    const insert = db.prepare(
      "INSERT INTO orders (userId, movieId) VALUES (?, ?)"
    );
    const result = insert.run(userId, movieId);

    res.status(201).json({ id: result.lastInsertRowid, userId, movieId });
  } catch (error) {
    res.status(400).json({ error: "Не удалось создать запись" });
  }
});

// ============ PATCH /api/orders/:id — изменить статус (только админ) ============
router.patch("/:id", checkAdmin, (req, res) => {
  const { status } = req.body;
  const result = db
    .prepare("UPDATE orders SET status = ? WHERE id = ?")
    .run(status, req.params.id);

  if (result.changes === 0) {
    return res.status(404).json({ error: "Запись не найдена" });
  }

  res.json({ success: true });
});

// ============ DELETE /api/orders/:id — удалить (только админ) ============
router.delete("/:id", checkAdmin, (req, res) => {
  const result = db
    .prepare("DELETE FROM orders WHERE id = ?")
    .run(req.params.id);

  if (result.changes === 0) {
    return res.status(404).json({ error: "Запись не найдена" });
  }

  res.json({ success: true });
});

module.exports = router;