import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function PrivacyNotice() {
  const [isOpen, setIsOpen] = useState(false);
  const [agreed, setAgreed] = useState(false);

  // Проверяем при монтировании: принял ли пользователь политику ранее
  useEffect(() => {
    const accepted = localStorage.getItem("privacyAccepted");
    if (!accepted) {
      // Небольшая задержка, чтобы модалка не «прыгала» сразу при загрузке
      const timer = setTimeout(() => setIsOpen(true), 600);
      return () => clearTimeout(timer);
    }
  }, []);

  // Принять политику
  const handleAccept = () => {
    if (!agreed) return;
    localStorage.setItem("privacyAccepted", new Date().toISOString());
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="privacy-overlay">
      <div className="privacy-modal">
        <div className="privacy-modal-header">
          <span className="privacy-modal-icon">🍪</span>
          <h2>Мы заботимся о вашей конфиденциальности</h2>
        </div>

        <div className="privacy-modal-body">
          <p>
            Сайт «КиноКаталог» собирает минимальный набор данных:{" "}
            <strong>имя, email и пароль</strong> — только чтобы вы могли войти
            в личный кабинет и сохранять избранные фильмы.
          </p>
          <p>
            Мы <strong>не передаём</strong> ваши данные третьим лицам, не
            используем cookies и не показываем рекламу. Пароли хранятся в
            виде bcrypt-хэша.
          </p>
          <p>
            Подробнее — в{" "}
            <Link to="/privacy" className="privacy-modal-link">
              полной политике конфиденциальности
            </Link>
            .
          </p>
        </div>

        <label className="privacy-modal-checkbox">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          <span>
            Я прочитал и согласен с{" "}
            <Link to="/privacy" className="privacy-modal-link">
              политикой конфиденциальности
            </Link>
          </span>
        </label>

        <div className="privacy-modal-actions">
          <button
            className="btn btn-primary"
            onClick={handleAccept}
            disabled={!agreed}
          >
            {agreed ? "Принять и продолжить" : "Поставьте галочку"}
          </button>
        </div>

        <p className="privacy-modal-hint">
          Без согласия вы не сможете пользоваться сайтом.
        </p>
      </div>
    </div>
  );
}

export default PrivacyNotice;