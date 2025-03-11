import { Option } from "@/components/ui/multiple-selector";
import { SearchBy } from "@/enums";
import { create } from "zustand";

type GroupStore = {
  searchBy: SearchBy;
  searchTerm: string;
  searchTags: Option[];
  planAge: string | undefined;
  setSearchBy: (searchBy: SearchBy) => void;
  setSearchTerm: (searchTerm: string) => void;
  setSearchTags: (searchTags: Option[]) => void;
  setPlanAge: (planAge: string | undefined) => void;
};

export const useGroupStore = create<GroupStore>((set, get) => ({
  searchBy: SearchBy.Name,
  searchTerm: "",
  searchTags: [],
  planAge: undefined,

  setSearchBy: (searchBy: SearchBy) => set((state) => ({ searchBy })),
  setSearchTerm: (searchTerm: string) => set((state) => ({ searchTerm })),
  setSearchTags: (searchTags: Option[]) => set((state) => ({ searchTags })),
  setPlanAge: (planAge: string | undefined) => set((state) => ({ planAge })),
}));
