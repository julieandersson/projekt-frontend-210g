import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Header() {

  const { user, logout } = useAuth();
  return (
    <header>
        <ul>
            <li><NavLink to="/">Startsida</NavLink></li>
            <li><NavLink to="/min-profil">Min profil</NavLink></li>

            <li>
              {
                !user ? <NavLink to="/logga-in">Logga in</NavLink> :
                <button onClick={logout}>Logga ut</button>
              }
              </li>

            <li><NavLink to="/registrera">Registrera</NavLink></li>
        </ul>
    </header>
  )
}

export default Header
