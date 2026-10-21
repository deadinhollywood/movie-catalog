import { Link } from "react-router-dom";
import Button from "../components/Button";

function NotFound() {
  return (
    <div className="page not-found">
      <h1>404</h1>
      <p>Страница не найдена</p>
      <Link to="/">
        <Button>На главную</Button>
      </Link>
    </div>
  );
}

export default NotFound;