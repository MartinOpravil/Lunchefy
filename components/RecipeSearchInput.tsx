"use client";
import { PencilLine, Tags } from "lucide-react";
import React, { Dispatch, SetStateAction, useCallback, useState } from "react";
import MultipleSelector, { Option } from "./ui/multiple-selector";
import { Input } from "./ui/input";
import { debounce } from "lodash";
import { getGroupById } from "@/convex/groups";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useTranslations } from "next-intl";
import { useTagManager } from "./recipes/TagManager";
import { cn } from "@/lib/utils";

enum SearchBy {
  Name = "name",
  Tags = "tags",
}

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
  classList?: string;
}

const debounceDelay = 500;

const RecipeSearchInput = ({
  variant = RecipeFilterVariant.Page,
  group,
  searchTerm,
  setSearchTerm,
  searchTags,
  setSearchTags,
  classList,
}: RecipeFilterProps) => {
  const t = useTranslations();

  const { tagOptions } = useTagManager();

  const [internalSearchTerm, setInternalSearchTerm] = useState(searchTerm);
  const [searchBy, setSearchBy] = useState<SearchBy>(SearchBy.Name);

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

  const handleSearchByChange = (value: SearchBy) => {
    setInternalSearchTerm("");
    setSearchTerm("");
    setSearchTags([]);
    setSearchBy(value);
  };

  if (!group.data) return <></>;

  return (
    <div className="w-full @container z-50 flex justify-end">
      <div
        className={cn(
          "w-full flex flex-col gap-2 justify-start items-start @md:flex-row",
          classList
        )}
      >
        <div className="flex flex-shrink w-full @md:max-w-44">
          <Select value={searchBy} onValueChange={handleSearchByChange}>
            <SelectTrigger className="input-class h-full transition-all">
              <SelectValue className="placeholder:text-secondary" />
            </SelectTrigger>
            <SelectContent className="bg-background">
              <SelectItem value={SearchBy.Name}>
                <div className="flex gap-2">
                  <PencilLine /> {t("Recipes.SearchInput.SortBy.Name")}
                </div>
              </SelectItem>
              <SelectItem value={SearchBy.Tags}>
                <div className="flex gap-2">
                  <Tags /> {t("Recipes.SearchInput.SortBy.Tags")}
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-grow w-full @md:w-auto">
          {searchBy === SearchBy.Name && (
            <Input
              className="input-class border-2 border-accent focus-visible:ring-secondary transition-all"
              placeholder={t("Recipes.SearchInput.Placeholder.Name")}
              type="text"
              value={internalSearchTerm}
              onChange={handleInputChange}
            />
          )}
          {searchBy === SearchBy.Tags && (
            <MultipleSelector
              className="input-class border-2 border-accent focus-visible:ring-secondary transition"
              options={tagOptions}
              placeholder={t("Recipes.SearchInput.Placeholder.Tags")}
              value={searchTags}
              onChange={setSearchTags}
              hidePlaceholderWhenSelected
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default RecipeSearchInput;
