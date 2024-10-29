import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";

//require("dotenv").config();

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

/**
 * Logs an array containing all messages from the paginated query "listMessages"
 * by combining pages of results into a single array.
 */
export async function getNextRecipePage(
  recipeBookId: Id<"recipeBooks">,
  continueCursor: string,
  searchTerm?: string
) {
  let isDone = false;
  let page;

  const results = [];

  ({ continueCursor, isDone, page } = await client.query(
    api.recipes.getRecipes,
    {
      recipeBookId,
      searchTerm,
      paginationOpts: { numItems: 2, cursor: continueCursor },
    }
  ));
  console.log("got", page.length);
  results.push(...page);

  console.log(results);
  return {
    results,
    continueCursor,
    isDone,
  };
}
