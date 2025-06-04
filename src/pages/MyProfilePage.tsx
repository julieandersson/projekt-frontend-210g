import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Review } from "../types/ReviewInterface";
import { Like } from "../types/BookLike";
import UserReviewItem from "../components/UserReviewItem"; // importerar UserReviewItem
import LikedBookItem from "../components/LikedBookItem";
import "./css/MyProfilePage.css";

const MyProfilePage = () => {
  const { user } = useAuth(); // hämtar aktuell inloggad användare
  // states för användarens recensioner, laddning, ev fel och meddelande
  const [userReviews, setUserReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reviewMessage, setReviewMessage] = useState("");
  const [likeMessage, setLikeMessage] = useState("");

  // laddning och bokdata för varje bok som användaren har gillat
  const [loadingLikes, setLoadingLikes] = useState(false);
  const [likedBooksDetails, setLikedBooksDetails] = useState<
    { id: string; title: string; thumbnail?: string }[]
  >([]);

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

  // hämtar alla böcker som inloggad användare har gillat
  const getUserLikes = async () => {
    setLoadingLikes(true);
    try {
      const res = await fetch("http://localhost:3000/bookLikes/user-likes", {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Kunde inte hämta gillningar");
      const data: Like[] = await res.json();
      await getBookDetailsForLikedBooks(data); // hämtar titel + bild för varje gillad bok
    } catch (err) {
      console.error("Fel vid hämtning av gillningar", err);
    } finally {
      setLoadingLikes(false);
    }
  };  

  // tar bort en gillning för specifik bok
  const deleteBookLike = async (bookId: string) => {
    try {
      const res = await fetch(`http://localhost:3000/bookLikes/${bookId}`, {
        method: "DELETE",
        credentials: "include"
      });
      if (!res.ok) throw new Error("Kunde inte ta bort gillning");
  
      // tar bort boken visuellt
      setLikedBooksDetails((prev) =>
        prev.filter((book) => book.id !== bookId)
      );
      setLikeMessage("Gillning borttagen.");
    } catch (err) {
      console.error(err);
      setError("Fel vid borttagning.");
    }
  };  

  // hämtar titel och bild för varje gillad bok för att visa bokkort
  const getBookDetailsForLikedBooks = async (likes: Like[]) => {
    try {
      const books = await Promise.all(
        likes.map(async (like) => {
          const res = await fetch(`https://www.googleapis.com/books/v1/volumes/${like.bookId}`);
          const data = await res.json();
          return {
            id: like.bookId,
            title: data.volumeInfo.title,
            thumbnail: data.volumeInfo.imageLinks?.thumbnail,
          };
        })
      );
      setLikedBooksDetails(books);
    } catch (err) {
      console.error("Fel vid hämtning av bokdetaljer:", err);
    }
  };

  useEffect(() => {
    getUserReviews();
    getUserLikes();
  }, []);

  return (
    <div>
      <section>
      <p><i className="fa-solid fa-user"></i> Hej och välkommen {user?.username}!</p>
      </section>

      <h1>Min profil</h1>
      <br />
      
      <section>
      <h2><i className="fa-solid fa-star"></i> Mina recensioner</h2>
        <p>
          Här samlas alla recensioner du har skrivit, lättöverskådligt på ett och samma ställe. Du kan när som helst redigera innehållet i en recension eller ta bort den helt om du ångrat dig. Håll koll på dina åsikter och uppdatera dem när det passar dig!
        </p>
  
        {/* visar laddning, fel eller bekräftelsemeddelande */}
        {loading && <p style={{ fontStyle: "italic" }}>Laddar dina recensioner...</p>}
        {error && <p className="error">{error}</p>}
        {reviewMessage && <p className="success">{reviewMessage}</p>}
  
        {/* visar meddelande om inga recensioner finns */}
        {!loading && !error && userReviews.length === 0 && (
          <p style={{ fontStyle: "italic" }}>Du har inte skrivit några recensioner ännu.</p>
        )}
  
        {/* importerar användarens recensioner från komponent */}
        {userReviews.map((review) => (
          <UserReviewItem
            key={review._id}
            review={review}
            onUpdate={getUserReviews}
            setMessage={setReviewMessage}
          />
        ))}
      </section>
  
      <section>
        <h2><i className="fa-solid fa-heart"></i> Mina gillade böcker</h2>
        <p>
          Har du hittat en bok du gillar eller vill spara för att läsa senare? På varje boksida kan du klicka på hjärtikonen för att gilla boken. Alla dina gillade böcker samlas här nedan så att du enkelt kan hitta tillbaka till dem.
        </p>
        {likeMessage && <p className="success">{likeMessage}</p>}
  
        <div className="liked-books-grid">
          {loadingLikes ? (
            <p style={{ fontStyle: "italic", textAlign: "center" }}>Laddar gillade böcker...</p>
          ) : likedBooksDetails.length === 0 ? (
            <p style={{ fontStyle: "italic" }}>Du har inte gillat några böcker ännu.</p>
          ) : (
            // renderar gillade böcker med bild, titel och "ta bort gillning"-knapp
            likedBooksDetails.map((book) => (
              <LikedBookItem
                key={book.id}
                id={book.id}
                title={book.title}
                thumbnail={book.thumbnail}
                onUnlike={deleteBookLike}
              />
            ))
          )}
        </div>
      </section>
    </div>
  );  
};

export default MyProfilePage;