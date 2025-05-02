// interface för användare baserad på lagrad data i databasen
export interface User {
  _id: number,
  email: string,
  password: string,
  username: string
}

// uppgifter som krävs vid registrering av ny användare
export interface RegisterCredentials {
    email: string,
    password: string,
    username: string
}

// inloggningsuppgifter skickas till backend vid inloggning
export interface LoginCredentials {
   email: string,
   password: string
}

// uppgifter som skickas tillbaka från backend
export interface AuthResponse {
   user: User,
   token: string
}

// definierar vad contextet innehåller
export interface AuthContextType {
   user: User | null, // antingen användare eller null
   // funktioner för registrering och inloggning
   register: (credentials: RegisterCredentials) => Promise<void>,
   login: (credentials: LoginCredentials) => Promise<void>,
   logout: () => void
}
