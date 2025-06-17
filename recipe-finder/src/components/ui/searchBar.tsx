import { Search } from "lucide-react";
import React, { useState, useEffect } from "react";

interface SearchBarProps {
  onSearch: (query: string) => Promise<void>;
  onChange: (value: string) => void;
  value: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onChange, value }) => {
  const [, setInput] = useState(value);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onSearch(value.trim());
    }
  };

  useEffect(() => {
    setInput(value);
  }, [value]);

  return (
    <div className="relative w-full max-w-xl mx-auto">
      <form
        onSubmit={handleSubmit}
        className="flex items-center justify-center mb-6"
      >
        <input
          type="text"
          placeholder="What do you feel like eating?"
          className="w-full pl-4 pr-10 py-2 border rounded-full shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          type="submit"
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-blue-600"
          aria-label="Search"
        >
          <Search className="w-5 h-5" />
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
