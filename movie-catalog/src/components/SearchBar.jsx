import { useState } from "react";

// Компонент поиска: локальный state + колбэк родителю
function SearchBar({ onSearch, placeholder = "Поиск..." }) {
  const [query, setQuery] = useState("");

  const handleChange = (e) => {
    setQuery(e.target.value);
    onSearch(e.target.value); // сообщаем родителю о вводе
  };

  return (
    <input
      className="search-input"
      type="text"
      value={query}
      onChange={handleChange}
      placeholder={placeholder}
    />
  );
}

export default SearchBar;