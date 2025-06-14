import { createContext, useState, useContext, ReactNode, useEffect } from "react";
import { User, RegisterCredentials, LoginCredentials, AuthResponse, AuthContextType } from "../types/auth.types";

// skapar context
const AuthContext = createContext <AuthContextType | null>(null);

interface AuthProviderProps {
    children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    
    const [user, setUser] = useState <User | null>(null); // användartillstånd

    // registrering av ny användare
    const register = async (credentials: RegisterCredentials): Promise<void> => {
        try {
            console.log("Skickar register-data:", credentials);

            const res = await fetch("https://projekt-api-210g.onrender.com/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(credentials),
                credentials: "include"
            });

            if (!res.ok) {
            const errorData = await res.json().catch(() => null);
            const errorMsg = errorData?.message || "Registrering misslyckades";
            throw new Error(errorMsg);
            }

            const data = await res.json() as AuthResponse;
            console.log("Data från registrering: ", data);

        } catch (error) {
            console.error("Fel vid registrering: ", error);
            throw error;
        }
    };

    // inloggning av användare
    const login = async (credentials: LoginCredentials): Promise<void> => {
        try {
            const res = await fetch("https://projekt-api-210g.onrender.com/users/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(credentials),
                credentials: "include" // skickar med cookies
            })

            if(!res.ok) throw new Error("Inloggningen misslyckades");

            const data = await res.json() as AuthResponse;
            console.log("Data från inloggning: ", data);

            if(data.user) {
                setUser(data.user); // sätter användartillstånd
            } else {
                console.error("Misslyckad inloggning")
                throw new Error("Fel vid inloggning");
            }

     } catch (error) {
        console.error("Fel vid inloggning: ", error);
            throw new Error("Fel vid inloggning");
        }
    };

    // validering av token vid sidanladdning, kontrollerar om användaren är inloggad
    const checkUser = async () => {
        try {
            const res = await fetch("https://projekt-api-210g.onrender.com/checkUser", {
                method: "GET",
                credentials: "include",
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                }
            });

            if (!res.ok) throw new Error("Ingen session hittades"); // eventuella fel

            const data = await res.json();
            setUser(data.user);

        } catch (error) {
            console.error("Något blev fel vid kontroll av session");
            setUser(null);
        }
    }

    // anropar checkToken
    useEffect(() => {
        checkUser();
    }, [])

    // utloggning av användare
    const logout = async () => {
        try {
            const res = await fetch("https://projekt-api-210g.onrender.com/users/logout", {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
            })
            if (!res.ok) throw new Error("Utloggning misslyckades");
            setUser(null);

        } catch (error) {
            console.error("Fel vid utloggning: ", error);
        }
    }
    
    return (
        <AuthContext.Provider value={{ user, register, login, logout }}>
            {children}
        </AuthContext.Provider>
    )
}

// hook för att hämta context
export const useAuth = () : AuthContextType => {
    const context = useContext(AuthContext);

    if(!context) {
        // säkerställer att context används inom AuthProvider
        throw new Error('useAuth måste användas inom AuthProvider');
    }
    return context;
}

