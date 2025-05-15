import { useState } from "react";
import { useAuth } from "../context/AuthContext"; // authcontext för autentisering av användare
import * as Yup from "yup"; // importerar yup valideringsbiblitoek
import { ReviewFormData } from "../types/ReviewFormData"; // importerar interface för formdata
import { ReviewErrors } from "../types/ReviewErrors"; // importerar valideringsfel
import "./css/ReviewForm.css";

// props
interface ReviewFormProps {
  bookId: string;
  bookTitle: string;
  onReviewSubmit: () => void; // callback som triggas efter lyckad inskickning
}

const ReviewForm = ({ bookId, bookTitle, onReviewSubmit }: ReviewFormProps) => {
  const { user } = useAuth(); // hämtar inloggad användare

  // state för formulärets innehåll
  const [reviewFormData, setReviewFormData] = useState<ReviewFormData>({
    reviewText: "",
    rating: 5,
  });

  // state för ev felmeddelanden
  const [errors, setErrors] = useState<ReviewErrors>({});
  // state för bekmeddelanden
  const [success, setSuccess] = useState("");

  // valideringsschema med yup för att validera skapande av recension
  const validationSchema = Yup.object({
    reviewText: Yup.string()
      .required("Recensionstext krävs.")
      .min(10, "Recensionen måste vara minst 10 tecken.")
      .max(1000, "Recensionen får inte vara längre än 1000 tecken."),
    rating: Yup.number()
      .required("Du måste ange ett betyg.")
      .min(1, "Betyget får inte vara lägre än 1.")
      .max(5, "Betyget får inte vara högre än 5."),
  });

  // funktion som hanterar inskicning av formulär
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // förhindrar sidomladdning
    setErrors({});
    setSuccess("");

    // för utloggad användare (extra säkerhet)
    if (!user) {
      setErrors({ general: "Du måste vara inloggad för att skriva en recension." });
      return;
    }

    try {
      // validerar formuläret enligt yupschemat
      await validationSchema.validate(reviewFormData, { abortEarly: false });

      // Skapa recension, POST anrop till API
      const res = await fetch("http://localhost:3000/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // skickar med cookie (jwt)
        body: JSON.stringify({
          ...reviewFormData,
          bookId,
          bookTitle,
          userId: user._id,
          username: user.username,
        }),
      });

      // om något blir fel i backend
      if (!res.ok) throw new Error("Kunde inte spara recension.");

      setReviewFormData({ reviewText: "", rating: 5 });
      setSuccess("Recensionen har sparats!");
      onReviewSubmit(); // laddar om recensioner

    } catch (err: any) {
      // visar valideringsfel från yup
      if (err instanceof Yup.ValidationError) {
        const validationErrors: ReviewErrors = {};
        err.inner.forEach((error) => {
          const path = error.path as keyof ReviewErrors;
          if (!validationErrors[path]) {
            validationErrors[path] = error.message;
          }
        });
        setErrors(validationErrors);
      } else {
        // övriga fel
        setErrors({ general: err.message || "Ett fel uppstod. Försök igen." });
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="review-form">
      <h4>Skriv en recension</h4>

      {/* allmänt felmeddelande (t.ex. ej inloggad) */}
      {errors.general && <p className="error">{errors.general}</p>}

      {/* Bekräftelsemeddelande vid lyckad recension */}
      {success && <p className="success">{success}</p>}

      {/* Betygsfält */}
      <div className="form-group">
        <label htmlFor="rating">Betyg (1-5):</label>
        <input
            id="rating"
            type="number"
            value={reviewFormData.rating}
            onChange={(e) =>
            setReviewFormData({ ...reviewFormData, rating: Number(e.target.value) })
            }
        />
        {errors.rating && <p className="error">{errors.rating}</p>}
        </div>

        {/* textfält för recension */}
        <div className="form-group">
        <label htmlFor="reviewText">Recension:</label>
        <textarea
            id="reviewText"
            value={reviewFormData.reviewText}
            onChange={(e) =>
            setReviewFormData({ ...reviewFormData, reviewText: e.target.value })
            }
            rows={4}
        />
        {errors.reviewText && <p className="error">{errors.reviewText}</p>}
        </div>


      <button type="submit" className="reviewButton">Skicka recension</button>
    </form>
  );
};

export default ReviewForm;