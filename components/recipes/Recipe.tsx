"use client";
import React, { ReactNode, useState } from "react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import LinkButton from "../global/LinkButton";
import { cn } from "@/lib/utils";
import { ButtonVariant, Privilage } from "@/enums";
import DeleteRecipeButton from "./DeleteRecipeButton";
import { Pencil } from "lucide-react";
import LoaderSpinner from "../global/LoaderSpinner";
import { Doc } from "@/convex/_generated/dataModel";
import ChosenImage from "../global/ChosenImage";

export interface RecipeProps {
  recipe: Doc<"recipes">;
  privilage: Privilage;
  vertical?: boolean;
  verticalButton?: ReactNode;
  useVerticalButton?: boolean;
  classList?: string;
}

const Recipe = ({
  recipe,
  privilage,
  vertical = false,
  verticalButton,
  useVerticalButton = false,
  classList,
}: RecipeProps) => {
  const [isRoutingToOverview, setIsRoutingToOverview] = useState(false);

  if (!recipe) return <></>;

  return (
    <Card
      className={cn(
        "relative cursor-pointer transition-all overflow-hidden border hover:border-primary group",
        classList
      )}
    >
      <Link
        href={`/app/${recipe.groupId}/${recipe._id}`}
        className={cn(
          "relative min-h-[300px] h-full flex flex-col justify-between items-center",
          { "min-h-[240px]": privilage === Privilage.Viewer },
          { "flex-row": vertical },
          { "min-h-fit": vertical }
        )}
        onClick={() => setIsRoutingToOverview(true)}
      >
        <div
          className={cn(
            "relative w-full h-[180px] flex items-center justify-center overflow-hidden bg-accent/30",
            { "min-h-[110px] min-w-[110px] w-[110px] !h-[110px]": vertical }
          )}
        >
          <ChosenImage
            image={recipe.coverImage}
            classList="transition-all group-hover:scale-105"
          />
        </div>
        {isRoutingToOverview && (
          <LoaderSpinner classList="absolute top-2 right-2 !text-primary" />
        )}
        <div className="flex flex-col justify-between w-full flex-grow p-2 gap-2">
          <div className="flex flex-col pt-1 px-1 gap-2">
            <h3
              className={cn(
                "text-xl sm:text-2xl sm:leading-7 group-hover:text-primary transition-all line-clamp-3",
                { "text-xl": vertical }
              )}
            >
              {recipe.name}
            </h3>
            {!vertical && recipe.description && (
              <div className="text-12 text-text2 pb-1 line-clamp-3">
                {recipe.description}
              </div>
            )}
          </div>
          {privilage !== Privilage.Viewer && <div className="h-10" />}
        </div>
        {useVerticalButton && <div className="w-28 h-10" />}
      </Link>
      {privilage !== Privilage.Viewer && (
        <div className="absolute bottom-0 w-full p-2 flex justify-between items-center pointer-events-none">
          {privilage === Privilage.Owner && (
            <DeleteRecipeButton
              recipeId={recipe._id}
              groupId={recipe.groupId}
              recipeTitle={recipe.name}
              small
            />
          )}
          <LinkButton
            icon={<Pencil className="!w-5 text-text2" />}
            href={`/app/${recipe.groupId}/${recipe._id}/edit`}
            classList="pointer-events-auto"
            variant={ButtonVariant.Minimalistic}
          />
        </div>
      )}
      <div className="absolute top-[50%] translate-y-[-50%] right-6">
        {verticalButton}
      </div>
    </Card>
  );
};

export default Recipe;
