"use client";
import { Search } from "lucide-react";
import React, { Dispatch, SetStateAction, useCallback, useState } from "react";
import MultipleSelector, { Option } from "./ui/multiple-selector";
import { Input } from "./ui/input";
import { debounce } from "lodash";
import { TagManager } from "@/lib/tags";
import RecipeSearchResults, {
  RecipeSearchResultListVariant,
} from "./RecipeSearchResults";
import { getGroupById } from "@/convex/groups";
import PlannerRecipeResultList from "./PlannerRecipeResultList";

export enum RecipeFilterVariant {
  Page = "page",
  Planner = "planner",
}

interface RecipeFilterProps {
  variant?: RecipeFilterVariant;
  group: Awaited<ReturnType<typeof getGroupById>>;
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
  searchTags: Option[];
  setSearchTags: Dispatch<SetStateAction<Option[]>>;
}

const debounceDelay = 500;

const RecipeSearchInput = ({
  variant = RecipeFilterVariant.Page,
  group,
  searchTerm,
  setSearchTerm,
  searchTags,
  setSearchTags,
}: RecipeFilterProps) => {
  const [internalSearchTerm, setInternalSearchTerm] = useState(searchTerm);

  const debouncedUpdate = useCallback(
    debounce((value) => {
      // setIsFiltering(true);
      setSearchTerm(value);
      // setTimeout(() => setIsFiltering(false), 200);
    }, debounceDelay),
    []
  );

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInternalSearchTerm(value); // Immediate state update for input
    debouncedUpdate(value); // Debounced state for the query
  };

  if (!group.data) return <></>;

  return (
    <div className="w-full @container z-50">
      <div className="w-full flex flex-col gap-4 justify-start items-start @md:flex-row sm:items-start ">
        {variant === RecipeFilterVariant.Page && (
          <div className="flex gap-1 bg-accent p-2 rounded-lg text-white-1">
            <Search color="white" />
            Search:
          </div>
        )}
        <Input
          className="input-class border-2 border-accent focus-visible:ring-secondary transition-all"
          placeholder="Recipe name"
          type="text"
          value={internalSearchTerm}
          onChange={handleInputChange}
        />
        <MultipleSelector
          className="input-class border-2 border-accent focus-visible:ring-secondary transition"
          defaultOptions={TagManager.getTagOptions()}
          placeholder="Tags"
          value={searchTags}
          onChange={setSearchTags}
        />
      </div>
      {/* {!!(searchTerm.length > 0 || searchTags.length) && (
        <RecipeSearchResults
          groupId={group.data._id}
          searchTerm={searchTerm}
          searchTags={TagManager.convertToValues(searchTags)}
          privilage={group.data.privilage}
          variant={RecipeSearchResultListVariant.Planner}
        />
      )} */}
    </div>
  );
};

export default RecipeSearchInput;
