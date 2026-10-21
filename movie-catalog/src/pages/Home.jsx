import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import MovieCard from "../components/MovieCard";
import Button from "../components/Button";
import Loader from "../components/Loader";

function Home() {
  const [movies, setMovies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.getMovies()
      .then((data) => {
        setMovies(data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  if (isLoading) return <Loader />;

  const featured = [...movies].sort((a, b) => b.rating - a.rating).slice(0, 3);
  const heroMovie = featured[0];

  if (!heroMovie) {
    return (
      <div className="page empty-state">
        <p className="empty-emoji">🎬</p>
        <p>Каталог пуст</p>
        <p className="empty-hint">
          Добавьте фильмы через <a href="http://localhost:3000/admin/">админ-панель</a>
        </p>
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
            <Link to={`/catalog/${heroMovie.id}`}><Button variant="outline">🎬 Фильм дня</Button></Link>
          </div>
        </div>
        <div className="hero-visual">
          <img src={heroMovie.poster} alt="" />
        </div>
      </section>

      <section className="section">
        <div className="section-header">
          <h2>Топ рейтинга</h2>
          <Link to="/catalog" className="link-more">Все фильмы →</Link>
        </div>
        <div className="movies-grid">
          {featured.map((movie) => (
            <MovieCard key={movie.id} {...movie} />
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;