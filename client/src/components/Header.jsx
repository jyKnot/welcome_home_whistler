// client/src/components/Header.jsx
import { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import "../styles/header.css";

export default function Header() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    try {
      const stored = localStorage.getItem("whwUser");
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    }
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:4000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (err) {
      console.error("Logout error (continuing anyway):", err);
    } finally {
      localStorage.removeItem("whwUser");
      setUser(null);
      navigate("/");
    }
  };

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/register";

  return (
    <header className="whw-header">
      <div className="whw-header-inner">
        <button
          className="whw-brand"
          type="button"
          onClick={() => navigate("/")}  
        >
          <span className="whw-brand-mark">🏔️</span>
          <span className="whw-brand-text">Welcome Home Whistler</span>
        </button>

        <nav className="whw-nav">
          {!user ? (
            !isAuthPage && (
              <>
                <Link to="/login" className="whw-nav-link">
                  Sign in
                </Link>
                <Link to="/register" className="whw-nav-cta">
                  Create account
                </Link>
              </>
            )
          ) : (
            <>
              <span className="whw-user-label">
                Hi,&nbsp;
                <strong>{user.name || user.email || "Guest"}</strong>
              </span>

              <button
                type="button"
                className="whw-nav-link"
                onClick={() => navigate("/my-orders")}
              >
                My orders
              </button>

              <button
                type="button"
                className="whw-nav-link"
                onClick={handleLogout}
              >
                Log out
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
