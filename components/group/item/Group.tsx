"use client";

import { useState } from "react";

import Link from "next/link";

import { Doc } from "@/convex/_generated/dataModel";
import { Users } from "lucide-react";

import LoaderSpinner from "@/components/global/content/LoaderSpinner";
import ChosenImage from "@/components/global/image/ChosenImage";
import { Avatar } from "@/components/ui/avatar";

import { cn } from "@/lib/utils";

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
          <Avatar className="relative h-[100px] w-[100px] bg-gray-400/20 transition-opacity group-hover:opacity-80">
            <ChosenImage
              image={group.coverImage}
              classList="relative w-[100px] h-[100px]"
              emptyIcon={<Users className="!h-[50px] !w-[50px]" />}
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
