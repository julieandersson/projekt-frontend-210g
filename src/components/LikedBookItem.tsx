import { Link } from "react-router-dom"; // för att länka till bokens detaljsida

// props för varje gillad bok
interface LikedBookItemProps {
  id: string;
  title: string;
  thumbnail?: string;
  onUnlike: (bookId: string) => void; // funktion som anropas vid borttagning av gillning
}


// komponent som visar en gillad bok med bild, titel och ta bort gillning-knapp
const LikedBookItem = ({ id, title, thumbnail, onUnlike }: LikedBookItemProps) => {
  return (
    <div style={{ border: "1px solid #ccc", padding: "1rem" }}>
      {/* länk till bokens detaljsida */}
      <Link to={`/bok/${id}`}>
        {thumbnail && <img src={thumbnail} alt={title} style={{ width: "100px" }} />}
        <p><strong>{title}</strong></p>
      </Link>
      {/* knapp för att avgilla, anropar förälderns delete-funktion */}
      <button onClick={() => onUnlike(id)}>Ta bort gillning</button>
    </div>
  );
};

export default LikedBookItem;