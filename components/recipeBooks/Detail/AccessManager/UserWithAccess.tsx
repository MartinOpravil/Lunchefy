import ActionButton from "@/components/global/ActionButton";
import BasicDialog from "@/components/global/BasicDialog";
import PrivilageBadge from "@/components/users/PrivilageBadge";
import { UserWithAccessProps } from "@/types";
import Image from "next/image";
import React, { useState } from "react";
import UserAccessForm from "./UserAccessForm";

const UserWithAccess = ({
  name,
  email,
  privilage,
  relationShipId,
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
        <div className="actions flex gap-2 w-full sm:w-fit justify-between">
          <ActionButton
            icon="edit"
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
            relationShipId={relationShipId}
          />
        }
      />
    </>
  );
};

export default UserWithAccess;
