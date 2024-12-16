"use client";
import React, { useState } from "react";
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
}

const Recipe = ({
  id,
  groupId,
  title,
  privilage,
  description,
  imageUrl,
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
        className="min-h-[300px] h-full flex flex-col justify-between items-center"
        onClick={() => setIsRoutingToOverview(true)}
      >
        <div className="relative w-full h-[180px] flex items-center justify-center overflow-hidden bg-[#cecece4b]">
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
            <ImageLucide className="!w-16 !h-16 text-[#CECECE] transition-all group-hover:scale-105" />
          )}
        </div>
        {isRoutingToOverview && (
          <LoaderSpinner classList="absolute top-2 right-2 !text-primary" />
        )}
        <div className="flex flex-col justify-between w-full flex-grow p-2 gap-2">
          <div className="flex flex-col pt-1 px-1 gap-2">
            <h3 className="text-2xl group-hover:text-primary transition-all">
              {title}
            </h3>
            {description && (
              <div className="text-12 text-[#797979]">{description}</div>
            )}
          </div>
          {(privilage === Privilage.Owner ||
            privilage === Privilage.Editor) && <div className="h-10" />}
        </div>
      </Link>
      {(privilage === Privilage.Owner || privilage === Privilage.Editor) && (
        <div className="absolute bottom-0 w-full p-2 flex justify-between items-center pointer-events-none">
          {privilage === Privilage.Owner && (
            <DeleteRecipeButton
              recipeId={id}
              groupId={groupId}
              recipeTitle={title}
            />
          )}
          <LinkButton
            icon={<Pencil className="text-[#7f7f7f]" />}
            href={`/app/${groupId}/${id}/edit`}
            classList="pointer-events-auto"
            variant={ButtonVariant.Minimalistic}
          />
        </div>
      )}
    </Card>
  );
};

export default Recipe;
