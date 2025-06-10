"use client";

import { ReactNode, useState } from "react";

import Link from "next/link";

import { Doc } from "@/convex/_generated/dataModel";
import { Pencil } from "lucide-react";

import LinkButton from "@/components/global/button/LinkButton";
import LoaderSpinner from "@/components/global/content/LoaderSpinner";
import ChosenImage from "@/components/global/image/ChosenImage";
import AssignRecipeToDateButton from "@/components/recipe/button/AssignRecipeToDateButton";
import DeleteRecipeButton from "@/components/recipe/button/DeleteRecipeButton";
import RecipeTagList from "@/components/recipe/tag/RecipeTagList";
import { Card } from "@/components/ui/card";

import { ButtonVariant, Privilage } from "@/enums";
import { cn } from "@/lib/utils";
import { useGroupStore } from "@/store/group";

export interface RecipeProps {
  recipe: Doc<"recipes">;
  privilage: Privilage;
  vertical?: boolean;
  verticalButton?: ReactNode;
  useVerticalButton?: boolean;
  showTags?: boolean;
  classList?: string;
}

const Recipe = ({
  recipe,
  privilage,
  vertical = false,
  verticalButton,
  useVerticalButton = false,
  showTags = false,
  classList,
}: RecipeProps) => {
  const { isRecipeInTodayList } = useGroupStore();
  const [isRoutingToOverview, setIsRoutingToOverview] = useState(false);

  if (!recipe) return <></>;

  return (
    <Card
      className={cn(
        "group relative cursor-pointer overflow-hidden border border-accent transition-all hover:border-primary",
        classList,
      )}
    >
      <Link
        href={`/app/${recipe.groupId}/${recipe._id}`}
        className={cn(
          "relative flex h-full min-h-[200px] flex-col items-center justify-between",
          { "min-h-[240px]": privilage === Privilage.Viewer },
          { "flex-row": vertical },
          { "min-h-fit": vertical },
        )}
        onClick={() => setIsRoutingToOverview(true)}
      >
        <div
          className={cn(
            "relative flex h-[180px] w-full items-center justify-center overflow-hidden bg-accent/30",
            { "!h-[110px] min-h-[110px] w-[110px] min-w-[110px]": vertical },
          )}
        >
          <ChosenImage
            image={recipe.coverImage}
            classList="transition-all group-hover:scale-105"
          />
        </div>
        {isRoutingToOverview && (
          <LoaderSpinner classList="absolute top-2 left-2 !text-primary" />
        )}
        <div className="flex w-full flex-grow flex-col justify-between gap-2 p-2">
          <div className="flex flex-col gap-2 px-1 pb-2 pt-1">
            <h3
              className={cn(
                "line-clamp-3 text-xl transition-all group-hover:text-primary sm:text-2xl sm:leading-7",
                { "text-xl": vertical },
              )}
            >
              {recipe.name}
            </h3>
            {!vertical && recipe.description && (
              <div className="text-12 line-clamp-3 text-text2">
                {recipe.description}
              </div>
            )}
          </div>
          {/* {privilage !== Privilage.Viewer && <div className="h-10" />} */}
        </div>
        {useVerticalButton && <div className="h-10 w-28" />}
      </Link>
      <div className="pointer-events-none absolute top-2 w-full px-2">
        {!vertical && (
          <>
            {showTags && recipe.tags && (
              <div className="mx-auto mb-2 w-fit rounded-xl bg-background px-2 opacity-60 transition-all group-hover:opacity-80">
                <RecipeTagList recipeTags={recipe.tags} useName={false} dense />
              </div>
            )}

            <div className="text-right">
              <AssignRecipeToDateButton recipe={recipe} isCardVariant />
            </div>
          </>
        )}
      </div>
      {privilage !== Privilage.Viewer && (
        <div className="pointer-events-none absolute top-[7.75rem] flex w-full items-center justify-between p-2">
          {privilage === Privilage.Owner && (
            <DeleteRecipeButton
              recipeId={recipe._id}
              groupId={recipe.groupId}
              recipeTitle={recipe.name}
              small
              classList="opacity-60 group-hover:opacity-80 hover:!opacity-100"
            />
          )}
          <LinkButton
            icon={<Pencil className="!w-5 text-text2" />}
            href={`/app/${recipe.groupId}/${recipe._id}/edit`}
            classList="pointer-events-auto opacity opacity-60 group-hover:opacity-80 hover:!opacity-100 ml-auto"
            variant={ButtonVariant.Minimalistic}
          />
        </div>
      )}
      <div className="absolute right-6 top-[50%] translate-y-[-50%]">
        {verticalButton}
      </div>
    </Card>
  );
};

export default Recipe;
