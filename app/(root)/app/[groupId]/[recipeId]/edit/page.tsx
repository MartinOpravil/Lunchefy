import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { preloadQuery } from "convex/nextjs";

import RecipeDetailPage from "@/app/(root)/app/[groupId]/[recipeId]/edit/RecipeDetailPage";
import ContentHandler from "@/components/global/content/ContentHandler";

import { getAuthToken } from "@/lib/authentication";

interface RecipeDetailServerPageProps {
  params: Promise<{ recipeId: Id<"recipes"> }>;
}

const RecipeDetailServerPage = async ({
  params,
}: RecipeDetailServerPageProps) => {
  const recipeId = (await params).recipeId;

  const token = await getAuthToken();
  const userPreloadPromise = preloadQuery(api.users.getLoggedUser);
  const recipePreloadPromise = preloadQuery(
    api.recipes.getRecipeById,
    {
      id: recipeId,
      checkPrivilages: true,
    },
    { token },
  );

  const [userPreload, recipePreload] = await Promise.all([
    userPreloadPromise,
    recipePreloadPromise,
  ]);

  return (
    <ContentHandler preloadedData={recipePreload}>
      <RecipeDetailPage
        recipePreloaded={recipePreload}
        userPreload={userPreload}
      />
    </ContentHandler>
  );
};

export default RecipeDetailServerPage;
