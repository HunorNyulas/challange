import type { Recipe } from "../types";
import { useState, useEffect } from "react";

function userSetFavorites() {
  const [favorites, setFavorites] = useState<Recipe[]>(() => {
    const stored = localStorage.getItem("favorites");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (recipe: Recipe) => {
    setFavorites((prev) => {
      const exists = prev.some((r) => r.title === recipe.title);
      if (exists) {
        return prev.filter((r) => r.title !== recipe.title);
      } else {
        return [...prev, recipe];
      }
    });
  };

  const isFavorite = (title: string) =>
    favorites.some((r) => r.title === title);

  return {
    favorites,
    toggleFavorite,
    isFavorite,
  };
}

export default userSetFavorites;
