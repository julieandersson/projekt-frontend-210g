import { useEffect, useState } from "react";
import { BookInterface } from "../types/BookInterface";
import { Link } from "react-router-dom";
import "./css/BookGallery.css";


const ITEMS_PER_PAGE = 20;

// Funktion för att hämta böcker från Google Books API
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

interface Props {
    search: string;
}

const BookGallery = ({ search }: Props) => {
    const [bookList, setBookList] = useState<BookInterface[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [isFetching, setIsFetching] = useState(false);
    const [fetchError, setFetchError] = useState("");

    useEffect(() => {
        const fetchAndSetBooks = async () => {
            setIsFetching(true);
            setFetchError("");
            const actualQuery = search.trim();
            const offset = (currentPage - 1) * ITEMS_PER_PAGE;

            const { items, total } = await loadBooks(actualQuery, ITEMS_PER_PAGE, offset);

            if (items.length === 0) {
                setFetchError("Inga resultat hittades.");
            }

            setBookList(items);
            setTotalCount(total);
            setIsFetching(false);
        };

        fetchAndSetBooks();
    }, [search, currentPage]);

    return (
        <section className="galleryContainer">

            {isFetching && <div className="loading">Laddar böcker...</div>}

            {!isFetching && fetchError && <p className="errorMsg">{fetchError}</p>}

            {!isFetching && !fetchError && bookList.length > 0 && (
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
                                <p>Författare: {book.volumeInfo.authors?.join(", ") || "Okänd"}</p>
                                <Link to={`/book/${book.id}`} className="detailsLink">
                                    Visa mer
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <div className="paginationControls">
                <button disabled={currentPage === 1} onClick={() => setCurrentPage((p) => p - 1)}>
                    &laquo; Föregående
                </button>
                <span>Sida {currentPage} av {Math.ceil(totalCount / ITEMS_PER_PAGE)}</span>
                <button disabled={currentPage * ITEMS_PER_PAGE >= totalCount} onClick={() => setCurrentPage((p) => p + 1)}>
                    Nästa &raquo;
                </button>
            </div>
        </section>
    );
};

export default BookGallery;