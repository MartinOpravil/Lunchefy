"use client";
import React, { useState } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Users } from "lucide-react";
import { Doc } from "@/convex/_generated/dataModel";
import { Avatar } from "@/components/ui/avatar";
import ChosenImage from "@/components/global/image/ChosenImage";
import LoaderSpinner from "@/components/global/content/LoaderSpinner";

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
          <Avatar className="relative w-[100px] h-[100px] bg-gray-400/20 transition-opacity group-hover:opacity-80">
            <ChosenImage
              image={group.coverImage}
              classList="relative w-[100px] h-[100px]"
              emptyIcon={<Users className="!w-[50px] !h-[50px]" />}
            />
            {isRoutingToOverview && (
              <LoaderSpinner classList="text-primary/90 absolute !w-[130px] !h-[130px]" />
            )}
          </Avatar>
          <div className="gap-2 transition-all group-hover:opacity-80">
            <h3>{group.name}</h3>
            {/* {description && <span>{description}</span>} */}
          </div>
        </Link>
      </div>
    </>
  );
};

export default Group;
