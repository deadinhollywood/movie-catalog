// fetch-posters.js — массовое скачивание постеров + обновление БД
// Запуск: node fetch-posters.js
//
// Что делает:
//  1. Берёт список фильмов из таблицы movies
//  2. Для каждого скачивает картинку с picsum.photos (параллельно)
//  3. Сохраняет файл в ../movie-catalog/public/posters/<slug>.jpg
//  4. Обновляет поле poster в БД на локальный путь /posters/<slug>.jpg

const fs = require("fs");
const path = require("path");
const db = require("./db/init");

// ============ Настройки ============
const POSTERS_DIR = path.join(
  __dirname,
  "..",
  "movie-catalog",
  "public",
  "posters"
);

const IMAGE_SIZE = "400/600"; // ширина/высота
const CONCURRENCY = 2;        // сколько файлов качать одновременно

// ============ Список соответствий: название фильма → slug для URL ============
// Ключ — как фильм называется в БД (title).
// Значение — короткий идентификатор для файла и picsum seed.
const SLUG_MAP = {
  "Начало": "inception",
  "Матрица": "matrix",
  "Интерстеллар": "inter",
  "Крёстный отец": "godfather",
  "Тёмный рыцарь": "darkknight",
  "Форрест Гамп": "gump",
  "Бойцовский клуб": "fightclub",
  "Побег из Шоушенка": "shawshank",
  "Криминальное чтиво": "pulp",
  "Гладиатор": "gladiator",
  "Властелин колец: Братство Кольца": "lotr",
  "Однажды в Голливуде": "hollywood",
  "Джокер": "joker",
  "Дюна": "dune",
  "Отель Гранд Будапешт": "budapest",
  "Паразиты": "parasite",
  "Люди в чёрном": "mib",
  "Терминатор 2: Судный день": "t2",
  "Назад в будущее": "bttf",
  "Чужой": "alien",
  "Сияние": "shining",
  "Молчание ягнят": "lambs",
  "Семь": "seven",
  "Отступники": "departed",
  "Волк с Уолл-стрит": "wolf",
  "Остров проклятых": "shutter",
  "Игра": "game",
  "Леон": "leon",
  "Карты, деньги, два ствола": "lockstock",
  "Большой куш": "snatch",
  "Старикам тут не место": "ncfom",
  "Вечное сияние чистого разума": "eternal",
  "1+1": "untouchable",
  "Ла-Ла Ленд": "lalaland",
  "Одержимость": "whiplash",
  "Она": "her",
  "Гравитация": "gravity",
  "Вверх": "up",
  "ВАЛЛ·И": "walle",
  "Тайна Коко": "coco",
};

// ============ Утилита: скачать один файл ============
async function downloadOne(slug, outputPath) {
  if (fs.existsSync(outputPath)) {
    return { slug, status: "skip", reason: "уже скачан" };
  }

const url = `https://dummyimage.com/400x600/14090b/e11d2f.jpg&text=${encodeURIComponent(slug)}`;

  try {
    const response = await fetch(url, {
      redirect: "follow",
      headers: {
        // Притворяемся браузером Chrome
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 " +
          "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept":
          "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        "Accept-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7",
        "Referer": "https://picsum.photos/",
        "Sec-Fetch-Dest": "image",
        "Sec-Fetch-Mode": "no-cors",
        "Sec-Fetch-Site": "same-origin",
      },
    });

    if (!response.ok) {
      return { slug, status: "error", reason: `HTTP ${response.status}` };
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    fs.writeFileSync(outputPath, buffer);
    return { slug, status: "ok", size: buffer.length };
  } catch (err) {
    return { slug, status: "error", reason: err.message };
  }
}

// ============ Утилита: пул параллельных задач ============
async function runWithConcurrency(tasks, limit) {
  const results = [];
  let index = 0;

  async function worker() {
    while (index < tasks.length) {
      const i = index++;
      results[i] = await tasks[i]();
    }
  }

  // Запускаем N «воркеров» — каждый берёт задачу из очереди
  const workers = Array.from({ length: Math.min(limit, tasks.length) }, worker);
  await Promise.all(workers);

  return results;
}

// ============ Основная логика ============
async function main() {
  console.log("🚀 Старт загрузки постеров\n");

  // 1. Создаём папку для постеров, если её нет
  if (!fs.existsSync(POSTERS_DIR)) {
    fs.mkdirSync(POSTERS_DIR, { recursive: true });
    console.log(`📁 Создана папка: ${POSTERS_DIR}`);
  }

  // 2. Читаем фильмы из БД
  const movies = db.prepare("SELECT id, title FROM movies ORDER BY id").all();

  if (movies.length === 0) {
    console.log(
      "⚠️  В таблице movies нет записей. Сначала запустите `node seed.js`."
    );
    return;
  }

  console.log(`📋 Найдено фильмов в БД: ${movies.length}\n`);

  // 3. Готовим задачи на скачивание
  const tasks = movies.map((movie) => {
    const slug = SLUG_MAP[movie.title];

    if (!slug) {
      return async () => ({
        slug: null,
        movieId: movie.id,
        title: movie.title,
        status: "error",
        reason: "нет slug в SLUG_MAP",
      });
    }

    const outputPath = path.join(POSTERS_DIR, `${slug}.jpg`);

    return async () => {
      const result = await downloadOne(slug, outputPath);
      return { ...result, movieId: movie.id, title: movie.title };
    };
  });

  // 4. Скачиваем параллельно
  console.log(`⬇️  Скачивание ${tasks.length} файлов (${CONCURRENCY} параллельно)...\n`);

  const results = await runWithConcurrency(tasks, CONCURRENCY);

  // 5. Обновляем БД и считаем статистику
  const updatePoster = db.prepare(
    "UPDATE movies SET poster = ? WHERE id = ?"
  );

  let okCount = 0;
  let skipCount = 0;
  let errorCount = 0;
  const errors = [];

  const updateMany = db.transaction(() => {
    for (const r of results) {
      if (r.status === "ok" || r.status === "skip") {
        updatePoster.run(`/posters/${r.slug}.jpg`, r.movieId);

        if (r.status === "ok") {
          okCount++;
          console.log(`  ✅ ${r.title.padEnd(40)} → /posters/${r.slug}.jpg`);
        } else {
          skipCount++;
          console.log(`  ⏩ ${r.title.padEnd(40)} — уже был`);
        }
      } else {
        errorCount++;
        errors.push({ title: r.title, reason: r.reason });
        console.log(`  ❌ ${r.title.padEnd(40)} — ${r.reason}`);
      }
    }
  });

  updateMany();

  // 6. Итог
  console.log("\n" + "─".repeat(60));
  console.log(`✅ Скачано новых:  ${okCount}`);
  console.log(`⏩ Пропущено:      ${skipCount} (уже были)`);
  console.log(`❌ Ошибок:         ${errorCount}`);

  if (errors.length > 0) {
    console.log("\nПроблемные фильмы:");
    errors.forEach((e) => console.log(`  - ${e.title}: ${e.reason}`));
  }

  console.log(`\n📁 Файлы в: ${POSTERS_DIR}`);
  console.log(`🗄  Пути обновлены в БД (таблица movies, поле poster)`);
  console.log(`\n🔗 Проверить: http://localhost:3000/api/movies`);
}

// ============ Запуск ============
main().catch((err) => {
  console.error("💥 Критическая ошибка:", err.message);
  process.exit(1);
});