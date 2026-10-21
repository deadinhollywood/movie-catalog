// routes/upload.js — загрузка изображений (постеров)
const express = require("express");
const multer = require("multer");
const path = require("path");
const db = require("../db/init");

const router = express.Router();

// Хранилище: сохраняем файл в uploads/ под уникальным именем
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    // Уникальное имя: timestamp + безопасное имя файла
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, "_");
    cb(null, `${Date.now()}-${safeName}`);
  },
});

// Фильтр: только картинки
const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Разрешены только изображения (jpg, png, webp, gif)"));
  }
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

// ============ POST /api/upload — загрузить один файл ============
router.post("/", upload.single("image"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Файл не загружен" });
    }

    const filePath = `/uploads/${req.file.filename}`;

    // Сохраняем информацию о файле в БД
    const insert = db.prepare(
      "INSERT INTO images (originalName, filename, path) VALUES (?, ?, ?)"
    );
    const result = insert.run(
      req.file.originalname,
      req.file.filename,
      filePath
    );

    res.status(201).json({
      id: result.lastInsertRowid,
      path: filePath,
      filename: req.file.filename,
    });
  } catch (error) {
    res.status(500).json({ error: "Ошибка загрузки файла" });
  }
});

// ============ GET /api/upload — список загруженных (только админ) ============
router.get("/", (req, res) => {
  const images = db.prepare("SELECT * FROM images ORDER BY id DESC").all();
  res.json(images);
});

module.exports = router;