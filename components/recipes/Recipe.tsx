"use client";
import React, { ReactNode, useState } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import LinkButton from "../global/LinkButton";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { ButtonVariant, Privilage } from "@/enums";
import DeleteRecipeButton from "./DeleteRecipeButton";
import { Pencil } from "lucide-react";
import LoaderSpinner from "../global/LoaderSpinner";
import { GenericId } from "convex/values";
import { Image as ImageLucide } from "lucide-react";

export interface RecipeProps {
  id: GenericId<"recipes">;
  groupId: GenericId<"groups">;
  title: string;
  privilage: Privilage;
  description?: string;
  imageUrl?: string;
  tags?: Array<string>;
  ingredients?: string;
  recipe?: string;
  recipePhotoUrl?: string;
  vertical?: boolean;
  verticalButton?: ReactNode;
  useVerticalButton?: boolean;
}

const Recipe = ({
  id,
  groupId,
  title,
  privilage,
  description,
  imageUrl,
  vertical = false,
  verticalButton,
  useVerticalButton = false,
}: RecipeProps) => {
  const [isRoutingToOverview, setIsRoutingToOverview] = useState(false);

  return (
    <Card
      className={cn(
        "relative cursor-pointer transition-all overflow-hidden border hover:border-primary group"
      )}
    >
      <Link
        href={`/app/${groupId}/${id}`}
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
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt="Recipe cover"
              className="transition-all group-hover:scale-105"
              width={0}
              height={0}
              sizes="100vw"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }} // optional
            />
          ) : (
            <ImageLucide className="!w-16 !h-16 text-accent transition-all group-hover:scale-105" />
          )}
        </div>
        {isRoutingToOverview && (
          <LoaderSpinner classList="absolute top-2 right-2 !text-primary" />
        )}
        <div className="flex flex-col justify-between w-full flex-grow p-2 gap-2">
          <div className="flex flex-col pt-1 px-1 gap-2">
            <h3
              className={cn(
                "text-xl sm:text-2xl group-hover:text-primary transition-all line-clamp-3",
                { "text-xl": vertical }
              )}
            >
              {title}
            </h3>
            {!vertical && description && (
              <div className="text-12 text-text2 pb-1 line-clamp-3">
                {description}
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
              recipeId={id}
              groupId={groupId}
              recipeTitle={title}
              small
            />
          )}
          <LinkButton
            icon={<Pencil className="!w-5 text-text2" />}
            href={`/app/${groupId}/${id}/edit`}
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
