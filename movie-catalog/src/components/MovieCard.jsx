import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// Вспомогательная функция: превращает рейтинг (напр. 8.8) в звёзды (★★★★☆)
function RatingStars({ value }) {
  const stars = Math.round(value / 2); // шкала 0–10 → 0–5 звёзд
  return (
    <span className="rating-stars" title={`Рейтинг: ${value}/10`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span key={n} className={n <= stars ? "star filled" : "star"}>
          ★
        </span>
      ))}
      <span className="rating-value">{value}</span>
    </span>
  );
}

function MovieCard({ id, title, year, genre, rating, poster, description }) {
  const { toggleFavorite, isFavorite } = useAuth();
  const favorite = isFavorite(id);

  return (
    <div className="movie-card">
      <div className="movie-poster-wrap">
        <img src={poster} alt={title} className="movie-poster" loading="lazy" />
        <button
          className={`fav-btn ${favorite ? "active" : ""}`}
          onClick={(e) => {
            e.preventDefault();
            toggleFavorite({ id, title, year, genre, rating, poster, description });
          }}
          title={favorite ? "Убрать из избранного" : "Добавить в избранное"}
          aria-label={favorite ? "Убрать из избранного" : "Добавить в избранное"}
        >
          {favorite ? "♥" : "♡"}
        </button>
        <div className="movie-overlay">
          <p className="movie-description">{description}</p>
        </div>
      </div>

      <div className="movie-info">
        <h3 className="movie-title">{title}</h3>
        <p className="movie-meta">
          {year} • {genre}
        </p>
        <RatingStars value={rating} />
        <Link to={`/catalog/${id}`} className="btn btn-primary btn-block">
          Подробнее
        </Link>
      </div>
    </div>
  );
}

export default MovieCard;