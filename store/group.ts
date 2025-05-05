import { Option } from "@/components/ui/multiple-selector";
import { SearchBy } from "@/enums";
import { RecipeRef } from "@/types";
import { create } from "zustand";

type GroupStore = {
  searchBy: SearchBy;
  setSearchBy: (searchBy: SearchBy) => void;
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
  searchTags: Option[];
  setSearchTags: (searchTags: Option[]) => void;
  planAge?: string;
  setPlanAge: (planAge?: string) => void;
  todayRecipeList?: RecipeRef[];
  setTodayRecipeList: (recipe?: RecipeRef[]) => void;
  getTodayRecipe: () => RecipeRef | undefined;
  isRecipeInTodayList: (recipeId: string) => boolean;
};

export const useGroupStore = create<GroupStore>((set, get) => ({
  searchBy: SearchBy.Name,
  searchTerm: "",
  searchTags: [],
  planAge: undefined,
  todayRecipeList: undefined,

  setSearchBy: (searchBy: SearchBy) => set((state) => ({ searchBy })),
  setSearchTerm: (searchTerm: string) => set((state) => ({ searchTerm })),
  setSearchTags: (searchTags: Option[]) => set((state) => ({ searchTags })),
  setPlanAge: (planAge: string | undefined) => set((state) => ({ planAge })),
  setTodayRecipeList: (recipeList?: RecipeRef[]) =>
    set((state) => ({ todayRecipeList: recipeList })),
  getTodayRecipe: () => get().todayRecipeList?.[0],
  isRecipeInTodayList: (recipeId: string) =>
    !!get().todayRecipeList?.some((x) => x.id === recipeId),
}));
