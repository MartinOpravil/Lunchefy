import { create } from "zustand";

import { Option } from "@/components/ui/multiple-selector";

import { SearchBy } from "@/enums";
import { RecipeRef } from "@/types";

type GroupStore = {
  isFetched: boolean;
  setIsFetched: (isFetched: boolean) => void;
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
  isRecipeInTodayList: (recipeId: string) => boolean;
};

export const useGroupStore = create<GroupStore>((set, get) => ({
  isFetched: false,
  setIsFetched: (isFetched: boolean) => set((state) => ({ isFetched })),
  searchBy: SearchBy.Name,
  setSearchBy: (searchBy: SearchBy) => set((state) => ({ searchBy })),

  searchTerm: "",
  setSearchTerm: (searchTerm: string) => set((state) => ({ searchTerm })),

  searchTags: [],
  setSearchTags: (searchTags: Option[]) => set((state) => ({ searchTags })),

  planAge: undefined,
  setPlanAge: (planAge: string | undefined) => set((state) => ({ planAge })),

  todayRecipeList: undefined,
  setTodayRecipeList: (recipeList?: RecipeRef[]) =>
    set((state) => ({ todayRecipeList: recipeList })),
  isRecipeInTodayList: (recipeId: string) =>
    !!get().todayRecipeList?.some((x) => x.id === recipeId),
}));
