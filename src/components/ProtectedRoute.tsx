import { Navigate } from 'react-router-dom';
import { ReactNode } from 'react';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: ReactNode;
}

// komponent som skyddar routes från obehöriga användare
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { user } = useAuth(); // hämtar aktuell användare

    // om ingen användare är inloggad, navigera till inloggningssidan
    if (!user) {
        return <Navigate to="/logga-in" replace />;
    }

    // om användaren är inloggad, visa det skyddade innehållet
    return (
        <>
            {children}
        </>
    )
}

export default ProtectedRoute;