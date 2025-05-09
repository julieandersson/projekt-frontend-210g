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
      <>
        <RegisterForm />
      </>
  );
};

export default RegisterPage;