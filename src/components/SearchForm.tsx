import { useState } from "react";
import { SearchFormProps } from "../types/SearchFormProps";

  
// formulärkomponent för att söka efter böcker  
const SearchForm = ({ onSearch, initialValue = "" }: SearchFormProps) => {
    
    // state för att hantera sökterm
    const [input, setInput] = useState(initialValue);
  
    // hanterar formulärets submit
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const term = input.trim();
      // fiction som standard om ingen sökterm anges
      onSearch(term || "fiction");
    };
  
    return (
      <form onSubmit={handleSubmit} className="searchForm">
        <label htmlFor="search">Sök efter böcker:</label>
        <input
          type="text"
          id="search"
          name="search"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ex. Harry Potter..."
        />
        <button type="submit">Sök</button>
      </form>
    );
  };
  
  export default SearchForm;  