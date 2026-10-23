import { useState } from "react";
// 👇 Импортируем наши локальные данные вместо API
import { movies as allMovies } from "../data/movies"; 
import MovieCard from "../components/MovieCard";
import SearchBar from "../components/SearchBar";

function Catalog() {
  // Локальные состояния для фильтров
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("Все");
  const [sortBy, setSortBy] = useState("default");

  // Собираем список уникальных жанров из наших данных
  const genres = ["Все", ...new Set(allMovies.map((m) => m.genre))];

  // Фильтрация и сортировка происходят "на лету" в памяти браузера
  const filtered = allMovies
    .filter((m) => {
      const matchesSearch = m.title.toLowerCase().includes(search.toLowerCase());
      const matchesGenre = genre === "Все" || m.genre === genre;
      return matchesSearch && matchesGenre;
    })
    .sort((a, b) => {
      if (sortBy === "rating") return b.rating - a.rating;
      if (sortBy === "year") return b.year - a.year;
      if (sortBy === "title") return a.title.localeCompare(b.title, "ru");
      return 0;
    });

  return (
    <div className="page">
      <div className="page-header">
        <h1>Каталог фильмов</h1>
        <p className="page-subtitle">
          Найдено: {filtered.length} из {allMovies.length}
        </p>
      </div>

      <div className="catalog-controls">
        <SearchBar onSearch={setSearch} placeholder="🔍 Поиск по названию..." />
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="genre-select">
          <option value="default">Без сортировки</option>
          <option value="rating">По рейтингу</option>
          <option value="year">По году (новые)</option>
          <option value="title">По алфавиту</option>
        </select>
      </div>

      <div className="genre-chips">
        {genres.map((g) => (
          <button
            key={g}
            className={`genre-chip ${genre === g ? "active" : ""}`}
            onClick={() => setGenre(g)}
          >
            {g}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <p className="empty-emoji">🎬</p>
          <p>Ничего не найдено</p>
        </div>
      ) : (
        <div className="movies-grid">
          {filtered.map((movie, index) => (
            // 👇 Используем index как key (если в данных нет уникального id)
            <MovieCard key={index} {...movie} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Catalog;