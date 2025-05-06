// interface för bokobjekt hämtat från Google Books API

export interface BookInterface {
    id: string;
    volumeInfo: {
      title: string;
      authors?: string[];
      publishedDate?: string;
      publisher?: string;
      pageCount?: number;
      language?: string;
      categories?: string[];
      imageLinks?: {
        thumbnail: string;
      };
      description?: string;
    };
  }