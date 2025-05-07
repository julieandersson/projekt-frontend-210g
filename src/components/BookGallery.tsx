import { useEffect, useState } from "react";
import { BookInterface } from "../types/BookInterface";
import { Link, useNavigate } from "react-router-dom";
import { BookGalleryProps } from "../types/BookGalleryProps";
import "./css/BookGallery.css";

const ITEMS_PER_PAGE = 20; // sätter antalet böcker som visas per sida

// Funktion för att hämta böcker från Google Books API (baserat på sökterm, antal och offset)
const loadBooks = async (searchTerm: string, limit = ITEMS_PER_PAGE, offset = 0) => {
    try {
        const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${searchTerm}&maxResults=${limit}&startIndex=${offset}`);
        const result = await response.json();
        return {
            items: result.items || [],
            total: result.totalItems || 0
        };
    } catch (err) {
        console.error("Fel vid hämtning av data:", err);
        return { items: [], total: 0 };
    }
};

const BookGallery = ({ search, initialPage }: BookGalleryProps) => {
    const navigate = useNavigate();

    // states för lista med böcker, aktuell sida, total antal träffar, laddning och fel
    const [bookList, setBookList] = useState<BookInterface[]>([]);
    const [currentPage, setCurrentPage] = useState(initialPage || 1);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE); // total antal sidor baserat på total antal träffar

    // useEffect som körs när komponenten mountas eller när sökterm eller aktuell sida ändras
    useEffect(() => {
        const fetchAndSetBooks = async () => {
            setLoading(true);
            setError("");
            
            // skapar korrekt söksträng 
            const actualQuery = search.trim().includes("subject:")
                ? search.trim()
                : `intitle:${search.trim()}`;

            const offset = (currentPage - 1) * ITEMS_PER_PAGE;

            const { items, total } = await loadBooks(actualQuery, ITEMS_PER_PAGE, offset);

            if (items.length === 0) {
                setError("Inga resultat hittades.");
            }

            setBookList(items);
            setTotalCount(total);
            setLoading(false);
        };

        fetchAndSetBooks();
    }, [search, currentPage]);

    // uppdaterar sidnumret i url utan att ta bort andra parametrar
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        params.set("page", currentPage.toString());
        navigate(`?${params.toString()}`, { replace: true });
    }, [currentPage, navigate]);    

    return (
        <section className="galleryContainer">
            {loading && <div className="loading">Laddar böcker...</div>}

            {!loading && error && <p className="errorMsg">{error}</p>}

            {!loading && !error && bookList.length > 0 && (
                <div className="galleryGrid">
                    {bookList.map((book) => (
                        <div className="galleryItem" key={book.id}>
                            {book.volumeInfo.imageLinks?.thumbnail && (
                                <img
                                    src={book.volumeInfo.imageLinks.thumbnail}
                                    alt={book.volumeInfo.title}
                                    className="galleryImage"
                                />
                            )}
                            <div className="galleryDetails">
                                <h4>{book.volumeInfo.title}</h4>
                                <p>
                                    Författare:{" "}
                                    {book.volumeInfo.authors?.join(", ") || "Okänd"}
                                </p>
                                <Link
                                    to={`/bok/${book.id}?page=${currentPage}`}
                                    className="detailsLink"
                                >
                                    Visa mer
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagninering */}
            <div className="paginationControls">
                <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                >
                    &laquo; Föregående
                </button>

                {/* dynamisk sidintervall, max 5 visas åt gången */}
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const startPage = Math.max(1, Math.min(currentPage - 2, totalPages - 4));
                    const pageNum = startPage + i;

                    if (pageNum > totalPages) return null;

                    return (
                        <button
                            key={pageNum}
                            className={pageNum === currentPage ? "active" : ""}
                            onClick={() => setCurrentPage(pageNum)}
                        >
                            {pageNum}
                        </button>
                    );
                })}

                <button
                    disabled={currentPage >= totalPages}
                    onClick={() => setCurrentPage((p) => p + 1)}
                >
                    Nästa &raquo;
                </button>
            </div>
        </section>
    );
};

export default BookGallery;