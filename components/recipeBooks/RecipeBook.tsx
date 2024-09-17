"use client";
import { RecipeBookProps } from "@/types";
import React from "react";
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
import { Privilage } from "@/enums";
import DeleteRecipeBookButton from "./DeleteRecipeBookButton";

const RecipeBook = ({
  id,
  title,
  description,
  imageUrl,
  privilage,
}: RecipeBookProps) => {
  return (
    <>
      <Card
        className={cn(
          "relative hover:bg-secondary cursor-pointer transition-all bg-accent text-white-1 text-center overflow-hidden",
          {
            "bg-accentTransparent": imageUrl,
            "hover:bg-secondaryTransparent": imageUrl,
          }
        )}
      >
        <Link
          href={`/app/${id}`}
          className="min-h-[300px] flex flex-col justify-center items-center"
        >
          {imageUrl && (
            <Image
              src={imageUrl}
              alt="Recipe book cover"
              className="absolute z-[-1]"
              width={0}
              height={0}
              sizes="100vw"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }} // optional
            />
          )}
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
        </Link>
        <div className="absolute w-full bottom-4 flex justify-between px-4 pointer-events-none">
          {privilage === Privilage.Owner ? (
            <DeleteRecipeBookButton
              recipeBookId={id}
              recipeBookTitle={title}
              classList="!bg-transparent"
            />
          ) : (
            <div></div>
          )}
          {privilage !== Privilage.Viewer ? (
            <LinkButton
              icon="edit"
              href={`/app/${id}/detail`}
              classList="!bg-transparent hover:!bg-accent pointer-events-auto"
            />
          ) : (
            <div></div>
          )}
        </div>
      </Card>
    </>
  );
};

export default RecipeBook;
