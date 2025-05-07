// interface baserat på lagrad data i recensioner i apiet

export interface Review {
    _id: string;
    bookId: string;
    bookTitle: string;
    userId: string;
    username: string;
    reviewText: string;
    rating: number;
    created: string;
}
  