import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import MoviePage from "./pages/MoviePage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ProfileInfo from "./pages/ProfileInfo";
import ProfileOrders from "./pages/ProfileOrders";
import NotFound from "./pages/NotFound";
import Privacy from "./pages/Privacy";
import PrivacyNotice from "./components/PrivacyNotice";

function App() {
  return (
    <div className="app">
      <Header />
      <main className="content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/catalog" element={<Catalog />} />
          {/* Динамический параметр :id */}
          <Route path="/catalog/:id" element={<MoviePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/privacy" element={<Privacy />} />

          {/* Защищённый маршрут с вложенными подразделами */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          >
            <Route index element={<ProfileInfo />} />
            <Route path="orders" element={<ProfileOrders />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      
      <Footer />
      <PrivacyNotice />
    </div>
  );
}

export default App;