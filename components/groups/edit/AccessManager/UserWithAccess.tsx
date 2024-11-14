import ActionButton from "@/components/global/ActionButton";
import BasicDialog from "@/components/global/BasicDialog";
import PrivilageBadge from "@/components/users/PrivilageBadge";
import Image from "next/image";
import React, { useState } from "react";
import UserAccessForm from "./UserAccessForm";
import { Pencil } from "lucide-react";
import { Privilage } from "@/enums";
import { GenericId } from "convex/values";

export interface UserWithAccessProps {
  name: string;
  email: string;
  privilage: Privilage;
  relationshipId: GenericId<"userGroupRelationship">;
}

const UserWithAccess = ({
  name,
  email,
  privilage,
  relationshipId,
}: UserWithAccessProps) => {
  const [isUserUpdateOpen, setIsUserUpdateOpen] = useState(false);

  return (
    <>
      <div className="w-full flex justify-between items-center gap-2 pt-2 flex-wrap">
        <div className="flex flex-col">
          <div>{name}</div>
          <div className="text-12">{email}</div>
        </div>
        <PrivilageBadge privilage={privilage} />
        <div className="actions flex gap-2 w-full sm:w-fit justify-end">
          <ActionButton
            icon={<Pencil />}
            onClick={() => {
              setIsUserUpdateOpen(true);
            }}
          />
        </div>
      </div>
      <BasicDialog
        isOpen={isUserUpdateOpen}
        setIsOpen={setIsUserUpdateOpen}
        icon={
          <Image
            src="/icons/share_primary.svg"
            alt="access"
            width={20}
            height={20}
          />
        }
        title="Change access for"
        description={`${name} (${email})`}
        content={
          <UserAccessForm
            name={name}
            email={email}
            privilage={privilage}
            relationshipId={relationshipId}
            actionClicked={() => setIsUserUpdateOpen(false)}
          />
        }
      />
    </>
  );
};

export default UserWithAccess;
