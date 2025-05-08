import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { BookInterface } from "../types/BookInterface";
import ReviewForm from "../components/ReviewForm";
import { Review } from "../types/ReviewInterface";
import { useAuth } from "../context/AuthContext";

const BookDetailsPage = () => {
  const { id } = useParams(); // hämtar bok-ID från URL
  const { user } = useAuth(); // hämtar användarinformation

  //states för att lagra bokinformation och recensioner
  const [book, setBook] = useState<BookInterface | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);

  // states för laddning, fel och gillningar
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);

  // hämtar bokinformation från Google Books API
  const getBook = async () => {
    setLoading(true);
      try {
        const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${id}`);
        if (!res.ok) throw new Error("Något gick fel vid hämtning");
        const data = await res.json();
        setBook(data);
      } catch (err) {
        setError("Kunde inte hämta bokinformationen.");
      } finally {
        setLoading(false);
      }
  };

  // hämtar antal gillningar för aktuell bok
  const getLikesCount = async () => {
    try {
      const res = await fetch(`http://localhost:3000/bookLikes/${id}`);
      if (!res.ok) throw new Error("Kunde inte hämta gillningar");
      const data = await res.json();
      setLikesCount(data.likes);
    } catch (err) {
      console.error("Fel vid hämtning av gillningar:", err);
    }
  };

  // kollar om inloggad användare har gillat den aktuella boken
  const getUserHasLiked = async () => {
    try {
      const res = await fetch("http://localhost:3000/bookLikes/user-likes", {
        credentials: "include",
      });
      const data = await res.json();
      const liked = data.some((like: { bookId: string }) => like.bookId === id); // söker efter matchande bokId
      setHasLiked(liked); // true/false beroende på resultat
    } catch (err) {
      console.error("Kunde inte kontrollera gillning:", err);
    }
  };

  // funktion för att gilla boken
  const postLike = async () => {
    try {
      const res = await fetch(`http://localhost:3000/bookLikes/${id}`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Gillning misslyckades.");
      setHasLiked(true); // uppdaterar knappens tillstånd
      getLikesCount(); // uppdaterar antal likes
    } catch (err) {
      console.error("Fel vid gillning:", err);
    }
  };

  // funktion för att ta bort gillning 
  const deleteLike = async () => {
    try {
      const res = await fetch(`http://localhost:3000/bookLikes/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Kunde inte ta bort gillning");
      setHasLiked(false); // uppdaterar knappens tillstånd
      getLikesCount(); // uppdateras antal likes
    } catch (err) {
      console.error("Fel vid borttagning av gillning:", err);
    }
  };

  // hämtar recensioner för aktuell bok
  const getReviews = async () => {
    setReviewsLoading(true);
      try {
        const res = await fetch("http://localhost:3000/reviews", {
          credentials: "include"
        });
        
        if (!res.ok) throw new Error("Kunde inte hämta recensioner");
        const data: Review[] = await res.json();
        const filtered = data.filter((r) => r.bookId === id);
        setReviews(filtered);

      } catch (err) {
        console.error("Fel vid hämtning av recensioner:", err);
      } finally {
        setReviewsLoading(false);
      }
    };

    // körs när sidan mountas
    useEffect(() => {
      getBook();
      getReviews();
      getLikesCount();
      if (user) getUserHasLiked(); // kollar om boken är gillad av användaren som är inloggad
    }, [id, user]);    

    // visar laddningsmeddelande eller felmeddelande
    if (loading) return <p>Laddar bokinformation...</p>;
    if (error || !book) return <p>{error || "Ingen bokinformation hittades."}</p>;

    // extraherar volumeInfo från bokobjektet
    const info = book.volumeInfo;

  return (
    <section>
      <h2>{info.title}</h2>
      {/* visar bokomslag om bild finns */}
      {info.imageLinks?.thumbnail && (
        <img src={info.imageLinks.thumbnail} alt={info.title} />
      )}
      {/* visar info om boken */}
      <p><strong>{likesCount} användare har gillat denna bok</strong></p>

      {/* knapp som visas för inloggade användare */}
      {user && (
        <button onClick={hasLiked ? deleteLike : postLike}>
          {hasLiked ? "Ta bort gillning" : "Gilla denna bok"}
        </button>
      )}

      <p><strong>Författare:</strong> {info.authors?.join(", ") || "Okänd"}</p>
      <p><strong>Utgivningsår:</strong> {info.publishedDate?.slice(0, 4) || "Saknas"}</p>
      <p><strong>Förlag:</strong> {info.publisher || "Saknas"}</p>
      <p><strong>Antal sidor:</strong> {info.pageCount || "Okänt"}</p>
      <p><strong>Språk:</strong> {info.language?.toUpperCase() || "Saknas"}</p>
      <p><strong>Genrer:</strong> {info.categories?.join(", ") || "Saknas"}</p>

      {/* renderar beskrivningen som HTML med dangerouslySetInnerHTML */}
      <div>
        <strong>Beskrivning:</strong>
        <div
          dangerouslySetInnerHTML={{
            __html: info.description || "Ingen beskrivning tillgänglig."
          }}
        />
      </div>

      {/* tillbaka-"knapp" för att gå tillbaka till startsidan */}
      <Link to="/" className="backButton">Tillbaka till startsidan</Link>

      <hr />

      <h3>Recensioner</h3>
        {reviewsLoading ? (
          <p>Laddar recensioner...</p>
        ) : reviews.length === 0 ? (
          <p>Inga recensioner ännu.</p>
        ) : (
          /* tillfällig utskrift av recensioner just nu */
          <ul>
            {reviews.map((r) => (
              <li key={r._id}>
                <strong>{r.username}</strong>
                <br />
                {r.rating}/5
                <br />
                {r.reviewText}
                <hr />
              </li>
            ))}
          </ul>
        )}

        {user && (
          <ReviewForm
            bookId={id || ""}
            bookTitle={info.title}
            onReviewSubmit={getReviews}
          />
        )}
    </section>
  );
};

export default BookDetailsPage;