// routes/movies.js — CRUD фильмов (вторая сущность, помимо users)
const express = require("express");
const db = require("../db/init");
const checkAdmin = require("../middleware/checkAdmin");

const router = express.Router();

// ============ GET /api/movies — публичный список ============
router.get("/", (req, res) => {
  const movies = db.prepare("SELECT * FROM movies ORDER BY id DESC").all();
  res.json(movies);
});

// ============ GET /api/movies/:id — одна запись ============
router.get("/:id", (req, res) => {
  const movie = db
    .prepare("SELECT * FROM movies WHERE id = ?")
    .get(req.params.id);

  if (!movie) {
    return res.status(404).json({ error: "Фильм не найден" });
  }

  res.json(movie);
});

// ============ POST /api/movies — создать (только админ) ============
router.post("/", checkAdmin, (req, res) => {
  try {
    const { title, year, genre, rating, duration, director, description, poster } = req.body;

    if (!title || !year || !genre) {
      return res.status(400).json({ error: "title, year и genre обязательны" });
    }

    const insert = db.prepare(`
      INSERT INTO movies (title, year, genre, rating, duration, director, description, poster)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insert.run(
      title,
      year,
      genre,
      rating || 0,
      duration || 0,
      director || "",
      description || "",
      poster || ""
    );

    res.status(201).json({ id: result.lastInsertRowid, ...req.body });
  } catch (error) {
    res.status(400).json({ error: "Не удалось создать фильм" });
  }
});

// ============ PATCH /api/movies/:id — изменить (только админ) ============
router.patch("/:id", checkAdmin, (req, res) => {
  const { title, year, genre, rating, duration, director, description, poster } = req.body;

  const update = db.prepare(`
    UPDATE movies
    SET title = COALESCE(?, title),
        year = COALESCE(?, year),
        genre = COALESCE(?, genre),
        rating = COALESCE(?, rating),
        duration = COALESCE(?, duration),
        director = COALESCE(?, director),
        description = COALESCE(?, description),
        poster = COALESCE(?, poster)
    WHERE id = ?
  `);

  const result = update.run(
    title, year, genre, rating, duration, director, description, poster,
    req.params.id
  );

  if (result.changes === 0) {
    return res.status(404).json({ error: "Фильм не найден" });
  }

  res.json({ success: true });
});

// ============ DELETE /api/movies/:id — удалить (только админ) ============
router.delete("/:id", checkAdmin, (req, res) => {
  const result = db.prepare("DELETE FROM movies WHERE id = ?").run(req.params.id);

  if (result.changes === 0) {
    return res.status(404).json({ error: "Фильм не найден" });
  }

  res.json({ success: true });
});

module.exports = router;