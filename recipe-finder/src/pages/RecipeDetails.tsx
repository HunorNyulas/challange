import type { Recipe } from "../types";
import React from "react";
import { useParams, Link } from "react-router-dom";

type RecipeDetailsProps = {
  recipes: Recipe[];
  toggleFavorite: (recipe: Recipe) => void;
  isFavorite: (title: string) => boolean;
  onBack?: () => void | Promise<void>;
};

const RecipeDetails: React.FC<RecipeDetailsProps> = ({
  recipes,
  toggleFavorite,
  isFavorite,
}) => {
  const { title } = useParams<{ title: string }>();
  const decodedTitle = title ? decodeURIComponent(title) : "";
  const recipe = recipes.find((r) => r.title === decodedTitle);

  if (!recipe) {
    return (
      <main className="min-h-screen p-6">
        <p>Recipe not found.</p>
        <Link to="/">Go back</Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen p-6 bg-gray-50 flex justify-center">
      <div className="max-w-4xl w-full bg-white p-6 rounded shadow flex flex-col md:flex-row">
        <div className="flex-shrink-0 md:w-1/3 flex flex-col items-center md:items-start mb-4 md:mb-0">
          <img
            src={recipe.image}
            alt={recipe.title}
            className="w-full h-auto mb-2 rounded"
          />
          <h1 className="text-2xl font-bold mb-1">{recipe.title}</h1>
          <div className="flex items-center justify-center md:justify-start space-x-2">
            <span>Prep Time: {recipe.prepTime || "N/A"}</span>
            <button
              onClick={() => toggleFavorite(recipe)}
              aria-label={
                isFavorite(recipe.title)
                  ? "Remove from favorites"
                  : "Add to favorites"
              }
              className="text-3xl"
            >
              {isFavorite(recipe.title) ? "❤️" : "🤍"}
            </button>
          </div>
        </div>

        <div className="md:w-2/3 md:pl-6 mt-4 md:mt-0 overflow-y-auto max-h-[80vh]">
          <h2 className="text-xl font-semibold mb-2">Ingredients</h2>
          <ul className="list-disc list-inside mb-4">
            {recipe.ingredients.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>

          <h2 className="text-xl font-semibold mb-2">Instructions</h2>
          <ol className="list-decimal list-inside mb-4">
            {recipe.instructions.map((step, i) => (
              <li key={i} className="mb-2">
                {step}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </main>
  );
};

export default RecipeDetails;
