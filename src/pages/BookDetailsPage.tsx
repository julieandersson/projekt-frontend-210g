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
  const [pageError, setPageError] = useState("");
  const [reviewsLoading, setReviewsLoading] = useState(false);
  const [likesLoading, setLikesLoading] = useState(false);
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
      setPageError(""); // rensar fel om lyckat
    } catch (err) {
      setPageError("Kunde inte hämta bokinformationen.");
    } finally {
      setLoading(false);
    }
  };

  // hämtar antal gillningar för aktuell bok
  const getLikesCount = async () => {
    setLikesLoading(true);
    try {
      const res = await fetch(`https://projekt-api-210g.onrender.com/bookLikes/${id}`);
      if (!res.ok) throw new Error("Kunde inte hämta gillningar");
      const data = await res.json();
      setLikesCount(data.likes);
      setPageError("");
    } catch (err) {
      console.error("Fel vid hämtning av gillningar:", err);
      setPageError("Kunde inte hämta antal gillningar.");
    } finally {
      setLikesLoading(false);
    }
  };

  // kollar om inloggad användare har gillat den aktuella boken
  const getUserHasLiked = async () => {
    try {
      const res = await fetch("https://projekt-api-210g.onrender.com/bookLikes/user-likes", {
        credentials: "include",
      });
      const data = await res.json();
      const liked = data.some((like: { bookId: string }) => like.bookId === id); // söker efter matchande bokId
      setHasLiked(liked); // true/false beroende på resultat
      setPageError("");
    } catch (err) {
      console.error("Kunde inte kontrollera gillning:", err);
      setPageError("Kunde inte kontrollera om du har gillat denna bok.");
    }
  };

  // funktion för att gilla boken
  const postLike = async () => {
    try {
      const res = await fetch(`https://projekt-api-210g.onrender.com/bookLikes/${id}`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Gillning misslyckades.");
      setHasLiked(true); // uppdaterar knappens tillstånd
      getLikesCount(); // uppdaterar antal likes
      setPageError("");
    } catch (err) {
      console.error("Fel vid gillning:", err);
      setPageError("Kunde inte gilla boken. Försök igen senare.");
    }
  };

  // funktion för att ta bort gillning 
  const deleteLike = async () => {
    try {
      const res = await fetch(`https://projekt-api-210g.onrender.com/bookLikes/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (!res.ok) throw new Error("Kunde inte ta bort gillning");
      setHasLiked(false); // uppdaterar knappens tillstånd
      getLikesCount(); // uppdateras antal likes
      setPageError("");
    } catch (err) {
      console.error("Fel vid borttagning av gillning:", err);
      setPageError("Kunde inte ta bort gillningen. Försök igen senare.");
    }
  };

  // hämtar recensioner för aktuell bok
  const getReviews = async (bookId: string) => {
    setReviewsLoading(true);
    try {
      const res = await fetch(`https://projekt-api-210g.onrender.com/reviews?bookId=${bookId}`, {
      });

      if (!res.ok) throw new Error("Kunde inte hämta recensioner");

      const data = await res.json();

      if (Array.isArray(data)) {
        setReviews(data);
      } else {
        setReviews([]);
      }
      setPageError("");
    } catch (err) {
      console.error("Fel vid hämtning av recensioner:", err);
      setPageError("Kunde inte hämta recensioner.");
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  };

    // körs när sidan mountas
    useEffect(() => {
    if (id) {
      getBook();
      getReviews(id);
      getLikesCount();
      if (user) getUserHasLiked(); // kollar om boken är gillad av användaren som är inloggad
    }
  }, [id, user]);
    

    // visar laddningsmeddelande eller felmeddelande
    if (loading) return <p style={{ fontStyle: "italic", textAlign: "center" }}>Laddar bokinformation...</p>;
    if (!book) return <p>{pageError || "Ingen bokinformation hittades."}</p>;

    // extraherar volumeInfo från bokobjektet
    const info = book.volumeInfo;

  return (
    <section>
      <h2>{info.title}</h2>
      {pageError && (
        <p className="error-message" style={{ marginBottom: "1rem" }}>{pageError}</p>
      )}
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
            {likesLoading ? (
            <p style={{ fontStyle: "italic", textAlign: "center" }}>Laddar antal gillningar...</p>
          ) : (
            <p><strong>{likesCount} användare har gillat denna bok</strong></p>
          )}

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
                <Link to="/logga-in" style={{ textDecoration: "none", color: "#0070f3" }}>
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
                onUpdate={() => id && getReviews(id)}
                setMessage={setMessage}
              />
            ) : (
              <li key={r._id} className="bookdetails-review-item">
                <strong>{r.username}</strong>
                <div className="bookdetails-review-rating">
                  {r.rating}/5 <i className="fa-solid fa-star"></i>
                </div>
                <div className="bookdetails-review-text">"{r.reviewText}"</div>
                <div className="bookdetails-review-dates">
                  <small>
                    Skapad:{" "}
                    {new Date(r.created).toLocaleString("sv-SE", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </small>
                  {r.updated && r.updated !== r.created && (
                    <br />
                  )}
                  {r.updated && r.updated !== r.created && (
                    <small>
                      Senast uppdaterad:{" "}
                      {new Date(r.updated).toLocaleString("sv-SE", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </small>
                  )}
                </div>
              </li>
            )
          )}
        </div>
      )}

      {user ? (
        <ReviewForm
          bookId={id || ""}
          bookTitle={info.title}
          onReviewSubmit={() => id && getReviews(id)}
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