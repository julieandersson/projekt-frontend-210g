import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // importera AuthContext för hantering av autentisering
import { useNavigate } from 'react-router-dom'; // för att navigera efter inloggning

const LoginPage = () => {
  // State för att hantera inloggningsuppgifter och felmeddelanden
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const {login, user} = useAuth(); // hämtar inloggningsfunktionen från AuthContext
  const navigate = useNavigate(); // för att navigera till andra sidor

  // kontrollerar användare
  useEffect(() => {
    if (user) {
      navigate('/min-profil'); // om användaren redan är inloggad, navigera till profil direkt
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // förhindrar att sidan laddas om vid formulärinlämning
    setError(''); // återställer ev felmeddelanden

    try {

      await login({ email, password }); // loggar in användaren med angivna uppgifter
      navigate('/min-profil'); // navigerar till användarens profil efter inloggning

    } catch(error) {
      // hanterar fel vid inloggning
      setError('Inloggning misslyckades. Kontrollera dina uppgifter och försök igen.');
    }
    
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Logga in på ditt konto</h2>

        <form onSubmit={handleSubmit}>
           {/* Visar felmeddelande om något gått fel */}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* E-postfält */}
          <div className="form-group">
            <label htmlFor="email">E-postadress</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Lösenordsfält */}
          <div className="form-group">
            <label htmlFor="password">Lösenord</label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Logga in */}
          <button type="submit">Logga in</button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage
