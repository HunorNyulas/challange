import type { Recipe } from "../types.ts";
import LoadingSpinner from "@/components/ui/loadingSpinner.tsx";
import SearchBar from "@/components/ui/searchBar.tsx";
import React from "react";
import { Link } from "react-router-dom";

type HomeProps = {
  recipes: Recipe[];
  loading: boolean;
  onSearch: (query: string) => Promise<void>;
  onRetrySearch: () => void;
  toggleFavorite: (recipe: Recipe) => void;
  isFavorite: (title: string) => boolean;
  query: string;
  setQuery: (query: string) => void;
  searchSubmitted: boolean;
};

const Home: React.FC<HomeProps> = ({
  recipes,
  loading,
  onSearch,
  toggleFavorite,
  isFavorite,
  query,
  setQuery,
  onRetrySearch,
  searchSubmitted,
}) => {
  return (
    <main className="min-h-screen p-6 bg-gray-50">
      <h1 className="text-3xl font-bold text-center mb-6">Recipe Finder</h1>

      <SearchBar value={query} onChange={setQuery} onSearch={onSearch} />

      {loading && <LoadingSpinner className="mt-4" />}

      <h2 className="text-xl  font-bold mt-8 mb-4 text-left max-w-xl mx-auto">
        {!searchSubmitted || query.trim() === ""
          ? "Your Favorite Recipes"
          : "Suggested Recipes"}
      </h2>

      <div className="max-w-xl mx-auto">
        <div className="space-y-2">
          {recipes.map((recipe) => (
            <div key={recipe.title}>
              <Link to={`/recipe/${encodeURIComponent(recipe.title)}`}>
                <div className="cursor-pointer p-4 border rounded-xl bg-white shadow-sm hover:shadow-md transition flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-medium">{recipe.title}</h3>
                    <p className="text-sm text-gray-600">
                      {recipe.prepTime || "N/A"}
                    </p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      toggleFavorite(recipe);
                    }}
                    aria-label={
                      isFavorite(recipe.title)
                        ? "Remove from favorites"
                        : "Add to favorites"
                    }
                    className="text-2xl"
                  >
                    {isFavorite(recipe.title) ? "❤️" : "🤍"}
                  </button>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {searchSubmitted && query.trim() && recipes.length > 0 && (
        <div className="text-center my-8">
          <button
            onClick={onRetrySearch}
            className="px-5 py-2 rounded-full bg-purple-600 text-white hover:bg-purple-700 transition"
          >
            I don’t like these, show different ones
          </button>
        </div>
      )}
    </main>
  );
};

export default Home;
