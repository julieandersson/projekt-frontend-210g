import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import banner from "../assets/banner.jpg";
import logo from "../assets/logo.png";
import "./css/Header.css";

const Header = () => {
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);


  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error("Fel vid utloggning:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <>
      <header>
        <nav>
          <ul>
            <li className="logo-wrapper">
              <NavLink to="/">
                <img src={logo} alt="Logotyp" className="logo" />
              </NavLink>
            </li>

            <li>
              <NavLink to="/">
              <i className="fa-solid fa-book" style={{ marginRight: "0.5rem" }}></i>
              Startsida
              </NavLink>
            </li>

            {!user ? (
              <>
                <li>
                <NavLink to="/logga-in">
                  <i className="fa-solid fa-arrow-right-to-bracket" style={{ marginRight: "0.5rem" }}></i>
                  Logga in
                </NavLink>
                </li>
                <li>
                  <NavLink to="/registrera">
                  <i className="fa-solid fa-user-plus" style={{ marginRight: "0.5rem" }}></i>
                  Skapa konto
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink to="/min-profil">
                  <i className="fa-solid fa-user" style={{ marginRight: "0.5rem" }}></i>
                  Mina sidor
                  </NavLink>
                </li>
                <li>
                  <button onClick={handleLogout} disabled={isLoggingOut}>
                    {isLoggingOut ? "Loggar ut..." : "Logga ut"}
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>
      </header>

      <img 
        src={banner} 
        alt="banner" 
        className="header-banner" 
      />
    </>
  );
};

export default Header;