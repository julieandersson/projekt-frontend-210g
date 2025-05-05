import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Header() {
  const { user, logout } = useAuth();

  return (
    <header>
      <nav>
        <ul>
          <li>
            <NavLink to="/">Startsida</NavLink>
          </li>

          {!user ? (
            // meny för utloggad användare
            <>
              <li>
                <NavLink to="/logga-in">Logga in</NavLink>
              </li>
              <li>
                <NavLink to="/registrera">Skapa konto</NavLink>
              </li>
            </>
          ) : (
            // meny för inloggad användare
            <>
              <li>
                <NavLink to="/min-profil">Mina sidor</NavLink>
              </li>
              <li>
                <button onClick={logout}>Logga ut</button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;