import BookGallery from "../components/BookGallery";
import SearchForm from "../components/SearchForm";
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

// definierar genrer som ska användas i dropdown-menyn
const genres = [
  { label: "Alla genrer", value: "" },
  { label: "Deckare", value: "mystery" },
  { label: "Fantasy", value: "fantasy" },
  { label: "Science Fiction", value: "science+fiction" },
  { label: "Romantik", value: "romance" },
  { label: "Skräck", value: "horror" },
  { label: "Historia", value: "history" },
  { label: "Biografier", value: "biography" },
  { label: "Självhjälp", value: "self-help" },
  { label: "Affärer & Ekonomi", value: "business" },
  { label: "Religion", value: "religion" },
  { label: "Konst & Design", value: "art" },
  { label: "Resor", value: "travel" },
  { label: "Mat & Dryck", value: "cooking" },
  { label: "Barn & Ungdom", value: "juvenile" },
  { label: "Utbildning", value: "education" },
  { label: "Hälsa", value: "health" },
  { label: "Teknik", value: "technology" },
];

const HomePage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // hämtar sökparametrar från URL
  const queryParam = searchParams.get("query") || "";
  const genreParam = searchParams.get("genre") || "";
  const page = Number(searchParams.get("page")) || 1;

  // states för sökterm och vald genre 
  const [searchTerm, setSearchTerm] = useState(queryParam);
  const [selectedGenre, setSelectedGenre] = useState(genreParam);

  // uppdaterar urlparametrar när sökterm, genre eller sida ändras
  useEffect(() => {
    const params: any = {};
    if (searchTerm) params.query = searchTerm;
    if (selectedGenre) params.genre = selectedGenre;
    params.page = page.toString();
    setSearchParams(params);
  }, [searchTerm, selectedGenre, page]);

  // hanterar sökning från sökfältet
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  // hanterar val av genre från dropdown-menyn
  const handleGenreChange = (value: string) => {
    setSelectedGenre(value);
  };

  // skapar söksträng för apianrop baserat på sökterm och genre
  const genreQuery = selectedGenre ? `subject:${selectedGenre}` : "";
  const query = [searchTerm.trim(), genreQuery].filter(Boolean).join("+");

  return (
    <>
      <h1>Recensera Mera</h1>
      <section>
        <p>
          <strong>Recensera Mera</strong> är en plats för bokälskare som vill upptäcka nya titlar, läsa vad andra tycker och dela sina egna bokrecensioner. 
          Här hittar du ett ständigt växande bibliotek av böcker. Börja med att utforska nedan och hitta din nästa favorit!
        </p>
      </section>

      <h2>Sök eller filtrera böcker</h2>
      <p>
        Använd sökfältet för att hitta specifika böcker eller bläddra genom olika genrer.
      </p>

      {/* Sökfält med förifyllt värde från URL */}
      <SearchForm initialValue={queryParam} onSearch={handleSearch} />

      {/* Genre-dropdown */}
      <label htmlFor="genre" style={{ display: "block", marginTop: "1rem" }}>
        Filtrera på genre:
      </label>
      <select
        id="genre"
        value={selectedGenre}
        onChange={(e) => handleGenreChange(e.target.value)}
        style={{ marginBottom: "1rem" }}
      >
        {genres.map((g) => (
          <option key={g.value} value={g.value}>
            {g.label}
          </option>
        ))}
      </select>

      <h2>Upptäck böcker</h2>
      {/* komponent som visar böcker baserat på sökning och sida */}
      <BookGallery search={query || "fiction"} initialPage={page} />
    </>
  );
};

export default HomePage;