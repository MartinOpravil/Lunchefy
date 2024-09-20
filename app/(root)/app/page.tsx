import { api } from "@/convex/_generated/api";
import { preloadQuery } from "convex/nextjs";
import React from "react";
import { getAuthToken } from "@/lib/authentication";
import RecipeBooksPage from "./RecipeBooksPage";

const RecipeBooksServerPage = async () => {
  const token = await getAuthToken();
  const recipeBooksPreload = await preloadQuery(
    api.recipeBooks.getRecipeBooks,
    {},
    { token }
  );

  return <RecipeBooksPage recipeBooksPreloaded={recipeBooksPreload} />;
};

export default RecipeBooksServerPage;
