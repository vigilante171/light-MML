import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext.jsx";
import "./Header.css";

function Header() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className="header">
      <div className="header-inner">
        <Link to="/" className="brand">
          Product MLM
        </Link>

        <nav className="nav">
          <NavLink to="/products" className="nav-link">
            Products
          </NavLink>

          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard" className="nav-link">
                Dashboard
              </NavLink>

              <span className="user-name">
                {user?.firstName || "Account"}
              </span>

              <button
                type="button"
                className="logout-button"
                onClick={logout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="nav-link">
                Login
              </NavLink>

              <NavLink to="/register" className="nav-link nav-link-primary">
                Create account
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;
