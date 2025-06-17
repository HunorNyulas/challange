import useFavorites from "./hooks/userSetFavorites";
import { fetchRecipesFromAI } from "./lib/fetchRecipes";
import Home from "./pages/Home";
import RecipeDetails from "./pages/RecipeDetails";
import type { Recipe } from "./types";
import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useParams,
  useNavigate,
} from "react-router-dom";

const AppRoutes: React.FC = () => {
  const {
    favorites,
    toggleFavorite: toggleFavoriteRaw,
    isFavorite,
  } = useFavorites();
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [allRecipes, setAllRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [searchSubmitted, setSearchSubmitted] = useState(false);
  const [seenRecipeTitles, setSeenRecipeTitles] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    if (!query.trim() && !searchSubmitted) {
      setRecipes(favorites);
    }
  }, [favorites, searchSubmitted, query]);

  useEffect(() => {
    if (!query.trim()) {
      setSearchSubmitted(false);
    }
  }, [query]);

  const handleSearch = async (newQuery: string) => {
    if (!newQuery.trim()) {
      setRecipes(favorites);
      setSearchSubmitted(false);
      setSeenRecipeTitles(new Set());
      return;
    }

    setLoading(true);
    try {
      const data: Recipe[] = await fetchRecipesFromAI(newQuery);
      const titles: Set<string> = new Set(data.map((r: Recipe) => r.title));

      setSeenRecipeTitles(titles);
      setAllRecipes(data);
      setRecipes(data);
      setSearchSubmitted(true);
    } catch (err) {
      console.error(err);
      setRecipes([]);
      setSearchSubmitted(false);
    }
    setLoading(false);
  };

  const handleRetrySearch = async () => {
    if (!query.trim()) return;

    setLoading(true);
    try {
      const excludeTitles = Array.from(seenRecipeTitles);
      const newData: Recipe[] = await fetchRecipesFromAI(query, excludeTitles);

      const filteredByExclude = newData.filter(
        (r) => !seenRecipeTitles.has(r.title)
      );

      const filtered = filteredByExclude.filter((r) =>
        r.title.toLowerCase().includes(query.toLowerCase())
      );

      setSeenRecipeTitles((prev) => {
        const updated = new Set(prev);
        filtered.forEach((r) => updated.add(r.title));
        return updated;
      });

      setAllRecipes(filtered);
      setRecipes(filtered);
    } catch (err) {
      console.error(err);
      setAllRecipes([]);
      setRecipes([]);
    }
    setLoading(false);
  };

  const toggleFavorite = (recipe: Recipe) => {
    toggleFavoriteRaw(recipe);
    setRecipes((prev) =>
      prev.map((r) => (r.title === recipe.title ? { ...r } : r))
    );
  };

  const RecipeDetailsWrapper: React.FC = () => {
    const { title } = useParams<{ title: string }>();
    const navigate = useNavigate();
    const decodedTitle = title ? decodeURIComponent(title) : "";

    const recipe =
      allRecipes.find((r) => r.title === decodedTitle) ||
      favorites.find((r) => r.title === decodedTitle);

    return (
      <RecipeDetails
        recipes={recipe ? [recipe] : []}
        toggleFavorite={toggleFavorite}
        isFavorite={isFavorite}
        onBack={() => navigate(-1)}
      />
    );
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Home
            recipes={recipes}
            loading={loading}
            onSearch={handleSearch}
            onRetrySearch={handleRetrySearch}
            toggleFavorite={toggleFavorite}
            isFavorite={isFavorite}
            query={query}
            setQuery={setQuery}
            searchSubmitted={searchSubmitted}
          />
        }
      />
      <Route path="/recipe/:title" element={<RecipeDetailsWrapper />} />
    </Routes>
  );
};

const App: React.FC = () => (
  <Router>
    <AppRoutes />
  </Router>
);

export default App;
