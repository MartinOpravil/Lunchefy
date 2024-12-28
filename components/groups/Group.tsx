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
import { Pencil, Users } from "lucide-react";
import { GenericId } from "convex/values";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Doc } from "@/convex/_generated/dataModel";

export interface GroupProps {
  group: Doc<"groups">;
  privilage: string;
}

const Group = ({ group, privilage }: GroupProps) => {
  const [isRoutingToOverview, setIsRoutingToOverview] = useState(false);

  if (!group) return <></>;

  return (
    <>
      <div className={cn("group-button group")}>
        <Link
          href={`/app/${group._id}`}
          className="link"
          onClick={() => setIsRoutingToOverview(true)}
        >
          <Avatar className="relative w-[100px] h-[100px]">
            <AvatarImage
              src={group.coverImage?.imageUrl || group.coverImage?.externalUrl}
              alt="group"
              className="transition-all group-hover:opacity-90 object-cover"
            />
            <AvatarFallback className="bg-primary/20">
              <Users className="!w-[50px] !h-[50px]" />
            </AvatarFallback>
            {isRoutingToOverview && (
              <LoaderSpinner classList="text-primary/90 absolute !w-[130px] !h-[130px]" />
            )}
          </Avatar>

          <div className="gap-2 transition-all group-hover:opacity-90">
            <h3>{group.name}</h3>
            {/* {description && <span>{description}</span>} */}
          </div>
        </Link>
      </div>
    </>
  );
};

export default Group;
