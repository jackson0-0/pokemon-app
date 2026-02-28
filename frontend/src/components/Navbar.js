import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  return (
    <nav className="navbar">
      <h1 className="nav-title">Pokémon Team Builder</h1>

      <div className="nav-links">
        <Link
          to="/"
          className={location.pathname === "/" ? "nav-link active" : "nav-link"}
        >
          Team Builder
        </Link>
        <Link
          to="/savedteams"
          className={
            location.pathname === "/savedteams" ? "nav-link active" : "nav-link"
          }
        >
          Saved Teams
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
