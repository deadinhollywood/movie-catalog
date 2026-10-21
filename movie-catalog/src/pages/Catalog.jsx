import { useState, useEffect } from "react";
import { api } from "../api/client";
import MovieCard from "../components/MovieCard";
import SearchBar from "../components/SearchBar";
import Loader from "../components/Loader";

function Catalog() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("Все");
  const [sortBy, setSortBy] = useState("default");

  // Загружаем фильмы с backend при монтировании
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await api.getMovies();
        if (!cancelled) {
          setMovies(data);
          setIsLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          setError("Не удалось загрузить фильмы");
          setIsLoading(false);
        }
      }
    }
    load();

    return () => { cancelled = true; };
  }, []);

  const genres = ["Все", ...new Set(movies.map((m) => m.genre))];

  const filtered = movies
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

  if (isLoading) return <Loader />;
  if (error) return <div className="page empty-state"><p>{error}</p></div>;

  return (
    <div className="page">
      <div className="page-header">
        <h1>Каталог фильмов</h1>
        <p className="page-subtitle">
          Найдено: {filtered.length} из {movies.length}
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
          {filtered.map((movie) => (
            <MovieCard key={movie.id} {...movie} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Catalog;