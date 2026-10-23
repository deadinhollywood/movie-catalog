// src/pages/Home.jsx
import { Link } from "react-router-dom";
// 👇 Импортируем фильмы напрямую
import { movies } from "../data/movies"; 
import MovieCard from "../components/MovieCard";
import Button from "../components/Button";

function Home() {
  // Сортируем по рейтингу и берем топ-3
  const featured = [...movies].sort((a, b) => b.rating - a.rating).slice(0, 3);
  const heroMovie = featured[0];

  // Если вдруг файл с фильмами пуст
  if (!heroMovie) {
    return (
      <div className="page empty-state">
        <p className="empty-emoji">🎬</p>
        <p>Каталог пуст</p>
      </div>
    );
  }

  return (
    <div className="page">
      <section className="hero">
        <div className="hero-glow" aria-hidden="true" />
        <div className="hero-content">
          <span className="hero-label">Сейчас в тренде</span>
          <h1>Твой личный <span className="accent">кинотеатр</span></h1>
          <p className="hero-text">
            {movies.length} фильмов — от классики до современных хитов.
          </p>
          <div className="hero-actions">
            <Link to="/catalog"><Button>Смотреть каталог</Button></Link>
            {/* Ссылка на фильм дня (героя) */}
            <Link to={`/catalog/${heroMovie.title}`}><Button variant="outline">🎬 Фильм дня</Button></Link>
          </div>
        </div>
        <div className="hero-visual">
          {/* Постер главного фильма */}
          <img src={heroMovie.poster} alt={heroMovie.title} />
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Топ рейтинга</h2>
          <Link to="/catalog" className="link-more">Все фильмы →</Link>
        </div>
        <div className="movies-grid">
          {featured.map((movie, index) => (
            <MovieCard key={index} {...movie} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;