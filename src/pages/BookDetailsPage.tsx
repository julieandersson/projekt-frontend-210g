import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { BookInterface } from "../types/BookInterface";

const BookDetailsPage = () => {
  const { id } = useParams(); // hämtar bok-ID från URL
  //state för att lagra bokinformation
  const [book, setBook] = useState<BookInterface | null>(null);
  // states för laddning och fel
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // useEffect som körs när komponenten mounta
  useEffect(() => {
    // hämtar bokinformation från Google Books API
    const getBook = async () => {
      try {
        const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${id}`);
        if (!res.ok) throw new Error("Något gick fel vid hämtning");
        const data = await res.json();
        setBook(data); // sparar bokinformation i state
      } catch (err) {
        setError("Kunde inte hämta bokinformationen."); // sätter felmeddelande
      } finally {
        setLoading(false); // sätter loading till false när hämtning är klar
      }
    };

    getBook();
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
      <p><strong>Kategorier:</strong> {info.categories?.join(", ") || "Saknas"}</p>

      {/* tillbaka-"knapp" för att gå tillbaka till startsidan */}
      <Link to="/" className="backButton">Tillbaka till startsidan</Link>
    </section>
  );
};

export default BookDetailsPage;