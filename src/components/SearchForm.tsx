import { useState } from "react";
import { SearchFormProps } from "../types/SearchFormProps";
import "./css/SearchForm.css";
  
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
        <label htmlFor="search" className="searchLabel">Sök efter böcker:</label>
        <div className="searchInputGroup">
          <input
            type="text"
            className="searchInput"
            id="search"
            name="search"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ex. Harry Potter..."
          />
          <button type="submit" className="searchButton">Sök</button>
        </div>
      </form>
    );
  };
  
  export default SearchForm;  