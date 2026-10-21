import { useState } from "react";
import Modal from "../components/Modal";
import MovieCard from "../components/MovieCard";
import Button from "../components/Button";
import { useAuth } from "../context/AuthContext";

function ProfileOrders() {
  const { favorites } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div>
      <div className="favorites-header">
        <h2>Избранные фильмы ({favorites.length})</h2>
      </div>

      {favorites.length === 0 ? (
        <div className="empty-state">
          <p className="empty-emoji">💔</p>
          <p>Список избранного пуст</p>
          <p className="empty-hint">Добавляйте фильмы, нажимая на ♡ в каталоге</p>
        </div>
      ) : (
        <div className="movies-grid">
          {favorites.map((m) => (
            <MovieCard key={m.id} {...m} />
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Подтверждение"
      >
        <p>Вы уверены, что хотите очистить избранное?</p>
        <div className="modal-actions">
          <Button onClick={() => setIsModalOpen(false)}>Да, очистить</Button>
          <Button variant="outline" onClick={() => setIsModalOpen(false)}>Отмена</Button>
        </div>
      </Modal>
    </div>
  );
}

export default ProfileOrders;