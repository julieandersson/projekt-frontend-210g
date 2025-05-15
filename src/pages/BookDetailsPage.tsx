import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { BookInterface } from "../types/BookInterface";
import ReviewForm from "../components/ReviewForm";
import { Review } from "../types/ReviewInterface";
import { useAuth } from "../context/AuthContext";
import UserReviewItem from "../components/UserReviewItem";
import placeholder from "../assets/placeholder.png";
import "./css/BookDetailsPage.css";

const BookDetailsPage = () => {
  const { id } = useParams(); // hämtar bok-ID från URL
  const { user } = useAuth(); // hämtar användarinformation

  //states för att lagra bokinformation och recensioner
  const [book, setBook] = useState<BookInterface | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);

  // states för laddning, fel, gillningar och meddelande
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [message, setMessage] = useState(""); // bekräftelsemeddelande

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
    if (loading) return <p style={{ fontStyle: "italic", textAlign: "center" }}>Laddar bokinformation...</p>;
    if (error || !book) return <p>{error || "Ingen bokinformation hittades."}</p>;

    // extraherar volumeInfo från bokobjektet
    const info = book.volumeInfo;

  return (
    <section>
      <h2>{info.title}</h2>
      {/* visar bokomslag om bild finns, annars visas placeholder */}
      <br />
      <div className="bookdetails-top">
        <div className="bookdetails-left">
          <img
            src={info.imageLinks?.thumbnail || placeholder}
            alt={info.title}
            className="bookDetailsImage"
          />

          {/* visar info om boken */}
          <div className="likeSection">
            <p><strong>{likesCount} användare har gillat denna bok</strong></p>

            {/* knapp som visas för inloggade användare */}
            {user ? (
              <button onClick={hasLiked ? deleteLike : postLike} className="bookdetails-like-button">
                {hasLiked ? (
                  <>
                    <i className="fa-solid fa-heart-crack" style={{ marginRight: "0.5rem" }}></i>
                    Ta bort gillning
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-heart-circle-plus" style={{ marginRight: "0.5rem" }}></i>
                    Gilla denna bok
                  </>
                )}
              </button>
            ) : (
              <p style={{ fontStyle: "italic", fontSize: "0.9rem" }}>
                Vill du också ge denna boken en like?{" "}
                <Link to="/login" style={{ textDecoration: "none", color: "#0070f3" }}>
                  Logga in på ditt konto
                </Link>.
              </p>
            )}
          </div>
        </div>

        <div className="bookdetails-right">
          <p className="bookdetails-info"><strong>Författare:</strong> {info.authors?.join(", ") || "Okänd"}</p>
          <p className="bookdetails-info"><strong>Utgivningsår:</strong> {info.publishedDate?.slice(0, 4) || "Saknas"}</p>
          <p className="bookdetails-info"><strong>Förlag:</strong> {info.publisher || "Saknas"}</p>
          <p className="bookdetails-info"><strong>Antal sidor:</strong> {info.pageCount || "Okänt"}</p>
          <p className="bookdetails-info"><strong>Språk:</strong> {info.language?.toUpperCase() || "Saknas"}</p>
          <p className="bookdetails-info"><strong>Genrer:</strong> {info.categories?.join(", ") || "Saknas"}</p>
        </div>
      </div>

      {/* renderar beskrivningen som HTML med dangerouslySetInnerHTML */}
      <div className="bookdetails-description-container">
        <strong className="bookdetails-description-label">Beskrivning:</strong>
        <div
          className="bookdetails-description"
          dangerouslySetInnerHTML={{
            __html: info.description || "Ingen beskrivning tillgänglig.",
          }}
        />
      </div>

      {/* tillbaka-"knapp" för att gå tillbaka till startsidan */}
      <Link to="/" className="backButton">Tillbaka till startsidan</Link>

      <hr />

      <h3>Recensioner</h3>

      {message && <p className="confirmation-message">{message}</p>}

      {reviewsLoading ? (
        <p style={{ fontStyle: "italic", textAlign: "center" }}>Laddar recensioner...</p>
      ) : reviews.length === 0 ? (
        <p style={{ fontStyle: "italic" }}>Inga recensioner ännu.</p>
      ) : (
        <div className="bookdetails-review-list">
          {reviews.map((r) =>
            user?.username === r.username ? (
              <UserReviewItem
                key={r._id}
                review={r}
                onUpdate={getReviews}
                setMessage={setMessage}
              />
            ) : (
              <li key={r._id} className="bookdetails-review-item">
                <strong>{r.username}</strong>
                <div className="bookdetails-review-rating">
                  {r.rating}/5 <i className="fa-solid fa-star"></i>
                </div>
                <div className="bookdetails-review-text">"{r.reviewText}"</div>
              </li>
            )
          )}
        </div>
      )}

      {user ? (
        <ReviewForm
          bookId={id || ""}
          bookTitle={info.title}
          onReviewSubmit={getReviews}
        />
      ) : (
        <p style={{ fontStyle: "italic", fontSize: "0.9rem" }}>
          <Link to="/logga-in" style={{ color: "#007bff", textDecoration: "none" }}>
            Logga in
          </Link>{" "}
          på ditt konto för att skriva en recension.
        </p>
      )}
    </section>
  );
};

export default BookDetailsPage;