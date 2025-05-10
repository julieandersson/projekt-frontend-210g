import { useState } from "react";
import { Review } from "../types/ReviewInterface";
import "./css/UserReviewItem.css";

// props
interface UserReviewItemProps {
  review: Review; // recensionen som ska visas
  onUpdate: () => void; // funktion som anropas efter uppdatering/radering
  setMessage: (msg: string) => void; // funktion för att visa bekräftelsemeddelande
}

const UserReviewItem = ({ review, onUpdate, setMessage }: UserReviewItemProps) => {
  const [editMode, setEditMode] = useState(false); // true om redigering är aktivt
  const [deleteConfirm, setDeleteConfirm] = useState(false); // true om användaren valt att radera
  const [editData, setEditData] = useState({
    reviewText: review.reviewText, // initierar den befintliga recensionsdatan
    rating: review.rating,
  });

  // funktion för att uppdatera recension
  const saveEdit = async () => {
    try {
      const res = await fetch(`http://localhost:3000/reviews/${review._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(editData),
      });

      if (!res.ok) throw new Error("Kunde inte uppdatera recensionen.");

      setEditMode(false); // avslutar redigering
      setMessage("Recensionen har uppdaterats!");
      onUpdate(); // uppdaterar listan
    } catch (err) {
      console.error(err);
    }
  };

  // funktion för att radera recension
  const deleteReview = async () => {
    try {
      const res = await fetch(`http://localhost:3000/reviews/${review._id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!res.ok) throw new Error("Kunde inte radera recensionen.");

      setDeleteConfirm(false); // stänger bek
      setMessage("Recensionen har raderats.");
      onUpdate(); // uppdaterar listan
    } catch (err) {
      console.error(err);
    }
  };

  return (

    <section className="user-review-card">
      <div className="user-review-content">
        <strong>Bok: {review.bookTitle}</strong>
        <br />
  
        {/* Visar redigeringsformulär om redigeringsläge är aktivt */}
        {editMode ? (
          <>
            <label>
              Betyg:
              <input
                type="number"
                min={1}
                max={5}
                value={editData.rating}
                onChange={(e) =>
                  setEditData({ ...editData, rating: Number(e.target.value) })
                }
              />
            </label>
            <label>
              Recension:
              <textarea
                value={editData.reviewText}
                onChange={(e) =>
                  setEditData({ ...editData, reviewText: e.target.value })
                }
              />
            </label>
            <button className="btn-save" onClick={saveEdit}><i className="fa-solid fa-check"></i> Spara</button>
            <button className="btn-cancel" onClick={() => setEditMode(false)}><i className="fa-solid fa-xmark"></i> Avbryt</button>
          </>
        ) : (
          // visar recensionen som vanligt om inte i redigeringsläge
          <>
            Betyg: {review.rating}/5
            <br />
            "{review.reviewText}"
            <br />
            <small>
              Skapad:{" "}
              {new Date(review.created).toLocaleString("sv-SE", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </small>
          </>
        )}
  
        {/* visar bekräftelse vid radering */}
        {deleteConfirm && (
          <>
            <p style={{ fontStyle: "italic", color: "red" }}>Är du säker på att du vill ta bort denna recensionen?</p>
            <button className="btn-yes" onClick={deleteReview}><i className="fa-solid fa-check"></i> Ja</button>
            <button className="btn-no" onClick={() => setDeleteConfirm(false)}><i className="fa-solid fa-xmark"></i> Nej</button>
          </>
        )}
      </div>
  
      {/* redigera/radera-knappar placerade till höger */}
      {!editMode && !deleteConfirm && (
        <div className="user-review-buttons">
          <button onClick={() => setEditMode(true)}><i className="fa-solid fa-pencil"></i> Redigera</button> {/* sätter redigeringsläge true om användaren vill redigera */}
          <button onClick={() => setDeleteConfirm(true)}><i className="fa-solid fa-trash-can"></i> Radera</button> {/* sätter raderingsbek till true om användaren vill radera */}
        </div>
      )}
    </section>
  );
};

export default UserReviewItem;