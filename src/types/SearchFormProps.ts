// interface för SearchForm komponent

export interface SearchFormProps {
    onSearch: (term: string) => void;
    initialValue?: string;
}