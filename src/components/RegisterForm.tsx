import { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // hämtar register-funktion från AuthContext
import { useNavigate } from 'react-router-dom';
import { RegisterFormData } from '../types/RegisterInterface'; // importerar interface för registreringsformulär
import { ErrorsData } from '../types/ErrorsInterface'; // importerar interface för felmeddelanden
import * as Yup from 'yup'; // importerar Yup för validering

const RegisterForm = () => {
    // state för att lagra registreringsformulärdata
  const [registerFormData, setRegisterFormData] = useState<RegisterFormData>({
    username: '',
    email: '',
    password: '',
  });

  // states för att lagra felmeddelanden och bekräftelsemeddelande
  const [errors, setErrors] = useState<ErrorsData>({});
  const [confirmationMessage, setConfirmationMessage] = useState('');

  const { register } = useAuth(); // hämtar register-funktionen från AuthContext
  const navigate = useNavigate(); // navigerar till inloggningssidan efter registrering

  // valideringsschema med Yup
  const validationSchema = Yup.object({
    username: Yup.string()
      .required('Du måste ange ett användarnamn')
      .min(3, 'Användarnamnet måste vara minst 3 tecken långt'),
    email: Yup.string()
      .email('Du måste ange en giltig e-postadress')
      .required('Du måste ange en e-postadress'),
    password: Yup.string()
      .required('Du måste ange ett lösenord')
      .matches(
        /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
        'Lösenordet måste vara minst 8 tecken långt och innehålla minst en bokstav och en siffra.')
  });

  // funktion som körs när formuläret skickas
  const registerForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // hindrar sidomladdning

    try {
      // validera formuläret enligt valideringsschemat
      await validationSchema.validate(registerFormData, { abortEarly: false });
      setErrors({}); // rensa eventuella tidigare felmeddelanden

      // anropa register-funktionen från AuthContext för att registrera användaren
      await register(registerFormData);

      // visar bekräftelsemeddelande
      setConfirmationMessage('Ditt konto har skapats! Du navigeras nu till inloggningssidan...');

      // väntar 5 sekunder och navigerar sedan till inloggningssidan
      setTimeout(() => {
        navigate('/logga-in');
      }, 5000);
    } catch (errors) {
      const validationErrors: ErrorsData = {};

      // om det finns valideringsfel, lägg till första felet för varje fält
      if (errors instanceof Yup.ValidationError) {
        errors.inner.forEach(error => {
          const prop = error.path as keyof ErrorsData;
          if (!validationErrors[prop]) {
            validationErrors[prop] = error.message;
          }
        });
        setErrors(validationErrors);
      } else {
        console.error("Fel vid registrering:", errors);
      }
    }
  };

  return (
    <form onSubmit={registerForm}>
        {/* visar bekräftelsemeddelande efter lyckad registrering */}
        {confirmationMessage && <p className="success">{confirmationMessage}</p>}

        {/* fält för användarnamn */}
      <div className="form-group">
        <label htmlFor="username">Användarnamn</label>
        <input
          id="username"
          type="text"
          value={registerFormData.username}
          onChange={(e) =>
            setRegisterFormData({ ...registerFormData, username: e.target.value })
          }
        />
        {errors.username && <p className="error">{errors.username}</p>}
      </div>

      {/* fält för e-postadress */}
      <div className="form-group">
        <label htmlFor="email">E-postadress</label>
        <input
          id="email"
          type="text"
          value={registerFormData.email}
          onChange={(e) =>
            setRegisterFormData({ ...registerFormData, email: e.target.value })
          }
        />
        {errors.email && <p className="error">{errors.email}</p>}
      </div>

      {/* fält för lösenord */}
      <div className="form-group">
        <label htmlFor="password">Lösenord</label>
        <input
          id="password"
          type="password"
          value={registerFormData.password}
          onChange={(e) =>
            setRegisterFormData({ ...registerFormData, password: e.target.value })
          }
        />
        {errors.password && <p className="error">{errors.password}</p>}
      </div>

      <button type="submit">Skapa konto</button>
    </form>
  );
};

export default RegisterForm;