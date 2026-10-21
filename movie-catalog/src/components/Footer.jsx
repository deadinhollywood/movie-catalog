import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p className="footer-copy">
          © 2026 КиноКаталог — ПЗ 67
        </p>
        <nav className="footer-nav">
          <Link to="/privacy">Политика конфиденциальности</Link>
          <a href="mailto:privacy@kinocatalog.local">Связаться с нами</a>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;