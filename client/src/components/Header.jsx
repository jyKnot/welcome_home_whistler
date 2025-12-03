// client/src/components/Header.jsx
import { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import "../styles/header.css";

export default function Header() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    try {
      const stored = localStorage.getItem("whwUser");
      if (stored) setUser(JSON.parse(stored));
      else setUser(null);
    } catch (error) {
      console.error("Error retrieving user from localStorage:", error);
      // Handle the error appropriately, e.g., show a message to the user
    }
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:4000/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (error) {
      console.error("Error logging out:", error);
    }
    finally {
      localStorage.removeItem("whwUser");
      setUser(null);
      navigate("/");
    }
  };

  const path = location.pathname;

  return (
    <>
      <header className="whw-header">
        <div className="whw-header-inner">
          {/* Brand */}
          <button className="whw-brand" onClick={() => navigate("/")}>
            <span className="whw-brand-mark">△</span>
            <span className="whw-brand-text">Welcome Home Whistler</span>
          </button>

          {/* Desktop Nav */}
          <nav className="whw-nav whw-nav-desktop">
            {/* Unified button style */}
            <button
              className={
                "whw-nav-btn" +
                (path.startsWith("/groceries") ||
                path === "/arrival" ||
                path === "/order-confirmation"
                  ? " whw-nav-btn-active"
                  : "")
              }
              onClick={() => navigate("/groceries")}
            >
              Start order
            </button>

            {!user ? (
              <>
                <Link
                  to="/login"
                  className={
                    "whw-nav-btn" + (path === "/login" ? " whw-nav-btn-active" : "")
                  }
                >
                  Sign in
                </Link>

                <Link
                  to="/register"
                  className={
                    "whw-nav-btn" + (path === "/register" ? " whw-nav-btn-active" : "")
                  }
                >
                  Create account
                </Link>
              </>
            ) : (
              <>
                <button
                  className={
                    "whw-nav-btn" +
                    (path === "/my-orders" ? " whw-nav-btn-active" : "")
                  }
                  onClick={() => navigate("/my-orders")}
                >
                  My orders
                </button>

                <button className="whw-nav-link-quiet" onClick={handleLogout}>
                  Log out
                </button>
              </>
            )}
          </nav>

          {/* Mobile toggle */}
          <button
            className="whw-nav-toggle"
            onClick={() => setMenuOpen((prev) => !prev)}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="whw-nav-mobile">
            <button
              className={
                "whw-nav-mobile-btn" +
                (path.startsWith("/groceries") ||
                path === "/arrival" ||
                path === "/order-confirmation"
                  ? " whw-nav-mobile-btn-active"
                  : "")
              }
              onClick={() => navigate("/groceries")}
            >
              Start order
            </button>

            {!user ? (
              <>
                <Link
                  className={
                    "whw-nav-mobile-btn" +
                    (path === "/login" ? " whw-nav-mobile-btn-active" : "")
                  }
                  to="/login"
                >
                  Sign in
                </Link>

                <Link
                  className={
                    "whw-nav-mobile-btn" +
                    (path === "/register" ? " whw-nav-mobile-btn-active" : "")
                  }
                  to="/register"
                >
                  Create account
                </Link>
              </>
            ) : (
              <>
                <button
                  className={
                    "whw-nav-mobile-btn" +
                    (path === "/my-orders" ? " whw-nav-mobile-btn-active" : "")
                  }
                  onClick={() => navigate("/my-orders")}
                >
                  My orders
                </button>

                <button className="whw-nav-mobile-btn" onClick={handleLogout}>
                  Log out
                </button>
              </>
            )}
          </div>
        )}
      </header>

      {/* Signed-in banner */}
            {/* Signed-in banner */}
      {user && (
        <div className="whw-account-bar">
          <div className="whw-account-bar-inner">
            <span>
              Signed in as <strong>{user.name || user.email}</strong>
            </span>
            {/* Removed extra 'View my orders' button to avoid duplication,
                since it's already in the top-right nav */}
          </div>
        </div>
      )}

    </>
  );
}
