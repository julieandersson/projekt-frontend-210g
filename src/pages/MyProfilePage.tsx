import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Review } from "../types/ReviewInterface";
import UserReviewItem from "../components/UserReviewItem"; // importerar UserReviewItem

const MyProfilePage = () => {
  const { user } = useAuth(); // hämtar aktuell inloggad användare
  // states för användarens recensioner, laddning, ev fel och meddelande
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

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

      {/* visar laddning, fel eller bekräftelsemeddelande */}
      {loading && <p>Laddar dina recensioner...</p>}
      {error && <p className="error">{error}</p>}
      {message && <p className="success">{message}</p>}

      {/* visar meddelande om inga recensioner finns */}
      {!loading && !error && userReviews.length === 0 && (
        <p>Du har inte skrivit några recensioner ännu.</p>
      )}

      {/* importerar användarens recensioner från komponent */}
      <ul>
        {userReviews.map((review) => (
          <UserReviewItem
            key={review._id}
            review={review}
            onUpdate={getUserReviews}
            setMessage={setMessage}
          />
        ))}
      </ul>
    </div>
  );
};

export default MyProfilePage;