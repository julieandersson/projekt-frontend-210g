import { NavLink } from "react-router-dom";

function Header() {
  return (
    <header>
        <ul>
            <li><NavLink to="/">Startsida</NavLink></li>
            <li><NavLink to="/min-profil">Min profil</NavLink></li>
            <li><NavLink to="/logga-in">Logga in</NavLink></li>
            <li><NavLink to="/registrera">Registrera</NavLink></li>
        </ul>
    </header>
  )
}

export default Header
