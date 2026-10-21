import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { api } from "../api/client";
import { useAuth } from "../context/AuthContext";
import Button from "../components/Button";
import Loader from "../components/Loader";

function MoviePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const { toggleFavorite, isFavorite } = useAuth();

  useEffect(() => {
    let cancelled = false;
    api.getMovie(id)
      .then((data) => {
        if (!cancelled) {
          setMovie(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setMovie(null);
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, [id]);

  if (loading) return <Loader />;

  if (!movie) {
    return (
      <div className="page empty-state">
        <p className="empty-emoji">🎬</p>
        <h2>Фильм не найден</h2>
        <Button onClick={() => navigate("/catalog")}>Вернуться в каталог</Button>
      </div>
    );
  }

  const favorite = isFavorite(movie.id);

  return (
    <div className="page movie-page">
      <Button variant="outline" onClick={() => navigate(-1)}>← Назад</Button>
      <div className="movie-detail">
        <div className="movie-detail-poster-wrap">
          <img src={movie.poster || "/posters/placeholder.jpg"} alt={movie.title} className="movie-detail-poster" />
        </div>
        <div className="movie-detail-info">
          <h1>{movie.title}</h1>
          <div className="movie-detail-tags">
            <span className="tag">{movie.genre}</span>
            <span className="tag">{movie.year}</span>
            {movie.duration > 0 && <span className="tag">{movie.duration} мин</span>}
            {movie.rating > 0 && <span className="tag rating-tag">★ {movie.rating}</span>}
          </div>
          {movie.director && (
            <p className="movie-detail-director"><strong>Режиссёр:</strong> {movie.director}</p>
          )}
          {movie.description && <p className="movie-detail-description">{movie.description}</p>}
          <div className="movie-detail-actions">
            <button
              className={`fav-big-btn ${favorite ? "active" : ""}`}
              onClick={() => toggleFavorite(movie)}
            >
              {favorite ? "♥ В избранном" : "♡ В избранное"}
            </button>
            <Button variant="outline" onClick={() => navigate("/catalog")}>В каталог</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MoviePage;