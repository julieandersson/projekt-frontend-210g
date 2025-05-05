// interface för bokobjekt hämtat från Google Books API

export interface BookInterface {
    id: string;
    volumeInfo: {
        title: string;
        authors?: string[];
        imageLinks?: {
            thumbnail: string;
        };
        description?: string;
    };
}