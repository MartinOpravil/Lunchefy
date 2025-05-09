import { useTranslations } from "next-intl";

import NoContent from "@/components/global/content/NoContent";

import { Privilage } from "@/enums";

interface EmptyRecipeListStateProps {
  privilage: Privilage;
}

const EmptyRecipeListState = ({ privilage }: EmptyRecipeListStateProps) => {
  const t = useTranslations();

  return (
    <div className="flex h-full w-full flex-grow flex-col items-center justify-center pb-[64px]">
      <NoContent
        title={t("Groups.Empty.Recipes.title")}
        subTitle={
          privilage === Privilage.Viewer
            ? t("Groups.Empty.Recipes.subTitleNoPermission")
            : t("Groups.Empty.Recipes.subTitle")
        }
      />
    </div>
  );
};

export default EmptyRecipeListState;
