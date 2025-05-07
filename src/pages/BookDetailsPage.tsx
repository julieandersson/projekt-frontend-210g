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

  // states för laddning och fel
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reviewsLoading, setReviewsLoading] = useState(false);

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
    }, [id]); // beroende av bok-ID

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
                <strong>{r.username}</strong> ({r.rating}/5)
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