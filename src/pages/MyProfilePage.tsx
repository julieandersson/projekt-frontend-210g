import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Review } from "../types/ReviewInterface";

const MyProfilePage = () => {
  const { user } = useAuth(); // hämtar aktuell inloggad användare

  // states för användarens recensioner, laddning och ev fel
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // funktion för att hämta recensioner skrivna av den inloggade användaren
  const getUserReviews = async () => {
    setLoading(true); // visar laddningsmeddelande
    try {
      const res = await fetch("http://localhost:3000/reviews/user", {
        credentials: "include", // skickar med cookie (jwt)
      });

      if (!res.ok) throw new Error("Kunde inte hämta dina recensioner");

      const data = await res.json();
      setUserReviews(data); // sparar användarens recension(er) i state

      
    } catch (err: any) {
      console.error("Fel vid hämtning:", err);
      setError("Något gick fel vid hämtning av dina recensioner.");
    } finally {
      setLoading(false); // sätter laddning till false efter hämtning är klar
    }
  };

  useEffect(() => {
    getUserReviews();
  }, []);

  return (
    <div>
      <p>Hej och välkommen {user?.username}!</p>
      <h1>Min profil</h1>

      <h2>Mina recensioner</h2>

      {/* visar laddningsmeddelande */}
      {loading && <p>Laddar dina recensioner...</p>}
      {error && <p className="error">{error}</p>}

      {/* visar meddelande om inga recensioner finns */}
      {!loading && !error && userReviews.length === 0 && (
        <p>Du har inte skrivit några recensioner ännu.</p>
      )}

      {/* lista över användarens recensioner (tillfällig utskrift just nu) */}
      <ul>
        {userReviews.map((review) => (
          <li key={review._id} style={{ marginBottom: "1rem" }}>
            <strong>Bok: {review.bookTitle}</strong>
            <br />
            Betyg: {review.rating}/5
            <br />
            "{review.reviewText}"
            <br />
            <small>
              Skapad:{" "}
              {new Date(review.created).toLocaleDateString("sv-SE", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              })}
            </small>
            <hr />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyProfilePage;