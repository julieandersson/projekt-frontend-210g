import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext'; // importera AuthContext för hantering av autentisering
import { useNavigate } from 'react-router-dom'; // för att navigera efter inloggning
import { Link } from "react-router-dom";
import * as Yup from 'yup'; // importerar Yup för validering av formulär
import "./css/LoginPage.css";
import "../components/css/FormStyle.css";

const LoginPage = () => {
  // State för att hantera inloggningsuppgifter och felmeddelanden
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  const {login, user} = useAuth(); // hämtar inloggningsfunktionen från AuthContext
  const navigate = useNavigate(); // för att navigera till andra sidor

  // kontrollerar användare
  useEffect(() => {
    if (user) {
      navigate('/min-profil'); // om användaren redan är inloggad, navigera till profil direkt
    }
  }, [user, navigate]);

  // Yup valideringsschema
  const validationSchema = Yup.object({
    email: Yup.string()
      .email('Du måste ange en giltig e-postadress')
      .required('Du måste ange en e-postadress'),
    password: Yup.string()
      .required('Du måste ange ett lösenord'),
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // förhindrar att sidan laddas om vid formulärinlämning
    setError(''); // återställer ev felmeddelanden
    setValidationErrors({});
    setLoading(true);

    try {
      await validationSchema.validate({ email, password }, { abortEarly: false });

      await login({ email, password }); // loggar in användaren med angivna uppgifter
      navigate('/min-profil'); // navigerar till användarens profil efter inloggning
    } catch (err) {
      // hanterar fel vid inloggning
      if (err instanceof Yup.ValidationError) {
        const errors: { email?: string; password?: string } = {};
        err.inner.forEach((e) => {
          if (e.path && !errors[e.path as keyof typeof errors]) {
            errors[e.path as keyof typeof errors] = e.message;
          }
        });
        setValidationErrors(errors);
      } else {
        setError('Inloggning misslyckades. Kontrollera dina uppgifter och försök igen.');
      }
    } finally {
      setLoading(false);
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
          <label htmlFor="email">E-postadress</label>
          <input
            id="email"
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading} // inaktiverar under inloggning
            className="form-input"
          />
          {validationErrors.email && <p className="error-message">{validationErrors.email}</p>}

          {/* Lösenordsfält */}
          <label htmlFor="password">Lösenord</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading} // // inaktiverar under inloggning
            className="form-input"
          />
          {validationErrors.password && <p className="error-message">{validationErrors.password}</p>}

          {/* Logga in */}
          <button type="submit" className="loginButton" disabled={loading}>
            {loading ? 'Loggar in...' : 'Logga in'}
          </button>
        </form>
        
        {/* länk till skapa konto */}
        <p style={{ marginTop: '1rem', textAlign: 'center' }}>
          Har du inget konto?{' '}
          <Link to="/registrera" style={{ color: '#007bff', textDecoration: 'none' }}>
            Registrera dig här
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage