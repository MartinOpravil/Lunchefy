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
import { Privilage } from "@/enums";
import DeleteGroupButton from "./DeleteGroupButton";
import LoaderSpinner from "../global/LoaderSpinner";
import { Pencil } from "lucide-react";
import { GenericId } from "convex/values";

export interface GroupProps {
  id: GenericId<"groups">;
  title: string;
  description?: string;
  imageUrl?: string;
  privilage: string;
}

const Group = ({ id, title, description, imageUrl, privilage }: GroupProps) => {
  const [isRoutingToOverview, setIsRoutingToOverview] = useState(false);

  return (
    <>
      <Card
        className={cn(
          "relative hover:bg-secondary cursor-pointer transition-all bg-accent text-white-1 text-center overflow-hidden",
          {
            "bg-accent/80": imageUrl,
            "hover:bg-secondary/80": imageUrl,
          }
        )}
      >
        <Link
          href={`/app/${id}`}
          className="min-h-[300px] flex flex-col justify-center items-center"
          onClick={() => setIsRoutingToOverview(true)}
        >
          {imageUrl && (
            <Image
              src={imageUrl}
              alt="Group cover"
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
          {isRoutingToOverview && (
            <LoaderSpinner classList="absolute top-2 right-2" />
          )}
          <CardHeader className="gap-2">
            <CardTitle>{title}</CardTitle>
            {description && <CardDescription>{description}</CardDescription>}
          </CardHeader>
        </Link>
        <div className="absolute w-full bottom-4 flex justify-between px-4 pointer-events-none">
          {privilage === Privilage.Owner ? (
            <DeleteGroupButton
              groupId={id}
              groupTitle={title}
              classList="!bg-transparent hover:!bg-primary"
            />
          ) : (
            <div></div>
          )}
          {privilage !== Privilage.Viewer ? (
            <LinkButton
              icon={<Pencil />}
              href={`/app/${id}/edit`}
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

export default Group;
