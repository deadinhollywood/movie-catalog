// src/pages/Home.jsx
import { Link } from "react-router-dom";
// 👇 Импортируем данные напрямую из локального файла
import { movies } from "../data/movies";
import MovieCard from "../components/MovieCard";
import Button from "../components/Button";

function Home() {
  // 1. Сортируем фильмы по рейтингу (чтобы выбрать лучшие для топа)
  const featured = [...movies].sort((a, b) => b.rating - a.rating).slice(0, 3);
  
  // 2. Берём первый фильм из топа как "Фильм дня" (для баннера)
  const heroMovie = featured[0];

  // 3. Если файл movies.js вдруг пустой (защита от падения)
  if (!heroMovie) {
    return (
      <div className="page empty-state">
        <p className="empty-emoji">🎬</p>
        <p>Каталог пуст. Проверьте файл src/data/movies.js</p>
      </div>
    );
  }

  return (
    <div className="page">
      {/* Баннер (Hero) с фильмом дня */}
      <section className="hero">
        <div className="hero-glow" aria-hidden="true" />
        <div className="hero-content">
          <span className="hero-label">Сейчас в тренде</span>
          <h1>Твой личный <span className="accent">кинотеатр</span></h1>
          <p className="hero-text">
            {movies.length} фильмов — от классики до современных хитов.
          </p>
          <div className="hero-actions">
            <Link to="/catalog">
              <Button>Смотреть каталог</Button>
            </Link>
            {/* Ссылка на страницу фильма. Передаем ID в URL */}
            <Link to={`/catalog/${heroMovie.id}`}>
              <Button variant="outline">🎬 Фильм дня</Button>
            </Link>
          </div>
        </div>
        <div className="hero-visual">
          {/* Картинка фильма дня */}
          <img src={heroMovie.poster} alt={heroMovie.title} />
        </div>
      </section>

      {/* Секция "Топ рейтинга" */}
      <section className="section">
        <div className="section-header">
          <h2>Топ рейтинга</h2>
          <Link to="/catalog" className="link-more">Все фильмы →</Link>
        </div>
        <div className="movies-grid">
          {featured.map((movie) => (
            // 👇 Используем movie.id как key, так как он есть в файле movies.js
            <MovieCard key={movie.id} {...movie} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;