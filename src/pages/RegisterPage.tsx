import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RegisterForm from '../components/RegisterForm'; // importerar registreringsformulärkomponenten

const RegisterPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/min-profil'); // om användaren redan är inloggad
    }
  }, [user, navigate]);

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Skapa konto</h2>
        <RegisterForm />
      </div>
    </div>
  );
};

export default RegisterPage;