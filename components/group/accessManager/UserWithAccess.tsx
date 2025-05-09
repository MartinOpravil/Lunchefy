import { useState } from "react";

import { useTranslations } from "next-intl";

import { GenericId } from "convex/values";
import { Pencil, Share2 } from "lucide-react";

import ActionButton from "@/components/global/button/ActionButton";
import BasicDialog from "@/components/global/dialog/BasicDialog";
import UserAccessForm from "@/components/group/accessManager/UserAccessForm";
import PrivilageBadge from "@/components/user/PrivilageBadge";

import { Privilage } from "@/enums";

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
  const t = useTranslations();
  const [isUserUpdateOpen, setIsUserUpdateOpen] = useState(false);

  return (
    <>
      <div className="flex w-full flex-col items-center justify-between gap-2 pt-2 text-text @sm:flex-row">
        <div className="flex w-full flex-col">
          <div>{name}</div>
          <div className="text-12">{email}</div>
        </div>
        <div className="actions flex w-full items-center justify-end gap-4 sm:w-fit">
          <PrivilageBadge privilage={privilage} />
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
        icon={<Share2 className="ml-[-2px]" />}
        title={t("Groups.AccessManager.ChangeAccessTitle")}
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
