"use client";

import { useEffect, useMemo, useState } from "react";

import { useTranslations } from "next-intl";

import { getGroupById } from "@/convex/groups";
import { debounce } from "lodash";
import {
  CalendarDays,
  PencilLine,
  SlidersHorizontal,
  Tags,
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import MultipleSelector, { Option } from "@/components/ui/multiple-selector";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { PlannerAge, SearchBy } from "@/enums";
import { useTagManager } from "@/hooks/useTagManager";
import { cn } from "@/lib/utils";
import { useGlobalStore } from "@/store/global";

export enum RecipeFilterVariant {
  Page = "page",
  Planner = "planner",
}

interface RecipeFilterProps {
  variant?: RecipeFilterVariant;
  group: Awaited<ReturnType<typeof getGroupById>>;
  searchBy: SearchBy;
  setSearchBy: (searchBy: SearchBy) => void;
  searchTerm: string;
  setSearchTerm: (searchTerm: string) => void;
  searchTags: Option[];
  setSearchTags: (searchTags: Option[]) => void;
  plannerAge?: string;
  setPlannerAge: (searchTerm: string | undefined) => void;
  classList?: string;
  showSettings?: boolean;
  settingViewItems?: React.ReactNode;
  settingOrderItems?: React.ReactNode;
  showOrderSettings?: boolean;
}

const debounceDelay = 500;

const RecipeSearchInput = ({
  variant = RecipeFilterVariant.Page,
  group,
  searchBy,
  setSearchBy,
  searchTerm,
  setSearchTerm,
  searchTags,
  setSearchTags,
  plannerAge,
  setPlannerAge,
  classList,
  showSettings = false,
  settingViewItems,
  settingOrderItems,
  showOrderSettings = false,
}: RecipeFilterProps) => {
  const t = useTranslations();
  const { darkMode } = useGlobalStore();
  const { tagOptions } = useTagManager();

  const [internalSearchTerm, setInternalSearchTerm] = useState(searchTerm);

  const debouncedUpdate = useMemo(() => {
    return debounce((value: string) => {
      setSearchTerm(value);
    }, debounceDelay);
  }, [setSearchTerm]);

  useEffect(() => {
    return () => {
      // Cleanup
      debouncedUpdate.cancel();
    };
  }, [debouncedUpdate]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setInternalSearchTerm(value); // Immediate state update for input
    debouncedUpdate(value); // Debounced state for the query
  };

  const handleSearchByChange = (value: SearchBy) => {
    setInternalSearchTerm("");
    setSearchTerm("");
    setSearchTags([]);
    value === SearchBy.Planner
      ? setPlannerAge(PlannerAge.TwoWeeks)
      : setPlannerAge(undefined);
    setSearchBy(value);
  };

  if (!group.data) return <></>;

  return (
    <div className="z-50 flex w-full justify-end @container">
      <div
        className={cn(
          "flex w-full flex-col items-start justify-start gap-2 @md:flex-row",
          classList,
        )}
      >
        <div className="flex w-full flex-shrink @md:max-w-44">
          <Select value={searchBy} onValueChange={handleSearchByChange}>
            <SelectTrigger className="input-class h-full transition-all">
              <SelectValue className="placeholder:text-secondary" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={SearchBy.Name}>
                <div className="flex items-center gap-2">
                  <PencilLine /> {t("Recipes.SearchInput.SortBy.Name")}
                </div>
              </SelectItem>
              <SelectItem value={SearchBy.Tags}>
                <div className="flex items-center gap-2">
                  <Tags /> {t("Recipes.SearchInput.SortBy.Tags")}
                </div>
              </SelectItem>
              <SelectItem value={SearchBy.Planner}>
                <div className="flex items-center gap-2">
                  <CalendarDays /> {t("Recipes.SearchInput.SortBy.Planner")}
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-full flex-grow @md:w-auto">
          {searchBy === SearchBy.Name && (
            <Input
              className="input-class border-2 border-accent transition-all focus-visible:ring-secondary"
              placeholder={t("Recipes.SearchInput.Placeholder.Name")}
              type="text"
              value={internalSearchTerm}
              onChange={handleInputChange}
              clearable
            />
          )}
          {searchBy === SearchBy.Tags && (
            <MultipleSelector
              className="input-class border-2 border-accent transition focus-visible:ring-secondary"
              options={tagOptions}
              placeholder={t("Recipes.SearchInput.Placeholder.Tags")}
              value={searchTags}
              onChange={setSearchTags}
              hidePlaceholderWhenSelected
              groupBy="group"
              darkMode={darkMode}
            />
          )}
          {searchBy === SearchBy.Planner && (
            <Select value={plannerAge} onValueChange={setPlannerAge}>
              <SelectTrigger className="input-class h-full transition-all">
                <SelectValue
                  className="placeholder:text-secondary"
                  placeholder={t("Recipes.SearchInput.Placeholder.Planner")}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={PlannerAge.Future}>
                  <div className="flex gap-2">
                    {t("Recipes.SearchInput.Values.Planner.Future")}
                  </div>
                </SelectItem>
                <SelectItem value={PlannerAge.Latest}>
                  <div className="flex gap-2">
                    {t("Recipes.SearchInput.Values.Planner.Latest")}
                  </div>
                </SelectItem>
                <SelectItem value={PlannerAge.OneWeek}>
                  <div className="flex gap-2">
                    {t("Recipes.SearchInput.Values.Planner.OneWeek")}
                  </div>
                </SelectItem>
                <SelectItem value={PlannerAge.TwoWeeks}>
                  <div className="flex gap-2">
                    {t("Recipes.SearchInput.Values.Planner.TwoWeeks")}
                  </div>
                </SelectItem>
                <SelectItem value={PlannerAge.ThreeWeeks}>
                  <div className="flex gap-2">
                    {t("Recipes.SearchInput.Values.Planner.ThreeWeeks")}
                  </div>
                </SelectItem>
                <SelectItem value={PlannerAge.OneMonth}>
                  <div className="flex gap-2">
                    {t("Recipes.SearchInput.Values.Planner.OneMonth")}
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          )}
        </div>
        {showSettings && (
          <DropdownMenu>
            <DropdownMenuTrigger className="flex self-end p-1 text-text2 outline-none transition-all hover:text-text @md:self-center">
              <SlidersHorizontal />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>{t("Recipes.View.View")}</DropdownMenuLabel>
              {settingViewItems}
              {showOrderSettings && (
                <>
                  <DropdownMenuLabel>
                    {t("Recipes.View.OrderBy")}
                  </DropdownMenuLabel>
                  {settingOrderItems}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};

export default RecipeSearchInput;
