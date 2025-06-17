import axios from "axios";

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

export async function fetchRecipesFromAI(
  prompt: string,
  excludeTitles: string[] = []
) {
  try {
    const systemPrompt = `
You are a helpful recipe assistant.
Provide exactly 5 recipes in JSON array format only, with no extra text or markdown.
Each recipe must have:
- 'title' (string),
- 'ingredients' (string array),
- 'instructions' (string array),
- 'prepTime' (string),
- 'image' (URL ttps://loremflickr.com/400/300/food).

Do NOT include recipes with the following titles: ${
      excludeTitles.length > 0 ? excludeTitles.join(", ") : "none"
    }.
`;

    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: systemPrompt.trim(),
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 700,
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const text = response.data.choices[0].message.content;

    try {
      return JSON.parse(text);
    } catch {
      console.warn("Groq returned non-JSON, returning empty array.");
      return [];
    }
  } catch (error) {
    console.error("Error fetching recipes from Groq:", error);
    return [];
  }
}
