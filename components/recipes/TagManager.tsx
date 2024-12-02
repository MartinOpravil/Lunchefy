import { useMemo } from "react";
import { Option } from "@/components/ui/multiple-selector";
import { useTranslations } from "next-intl";

export enum Tag {
  Chicken = "chicken",
  Beef = "beef",
  Pork = "pork",
  Rice = "rice",
  Pasta = "pasta",
  Fish = "fish",
}

export function useTagManager() {
  const t = useTranslations("Recipes");

  const tagOptions = useMemo<Option[]>(() => {
    return [
      { label: t("Tags.Chicken"), value: Tag.Chicken },
      { label: t("Tags.Beef"), value: Tag.Beef },
      { label: t("Tags.Pork"), value: Tag.Pork },
      { label: t("Tags.Rice"), value: Tag.Rice },
      { label: t("Tags.Pasta"), value: Tag.Pasta },
      { label: t("Tags.Fish"), value: Tag.Fish },
    ];
  }, [t]);

  // Convert tags (Option[]) to their string values (string[])
  const convertToValues = (tags: Option[]): string[] => {
    return tags.map((tag) => tag.value);
  };

  // Convert string values (string[]) to tag options (Option[])
  const convertToTags = (values: string): Option[] => {
    return values
      .split(" ")
      .map((value) =>
        tagOptions.find((option) => option.value === (value as Tag))
      )
      .filter((option): option is Option => option !== undefined);
  };

  // Convert a single string value to a Tag enum
  const valueToTag = (value: string): Option | undefined => {
    return tagOptions.find((option) => option.value === value);
  };

  // Convert a Tag enum to its corresponding Option
  const tagToOption = (tag: Tag): Option | undefined => {
    return tagOptions.find((option) => option.value === tag);
  };

  return {
    tagOptions,
    convertToValues,
    convertToTags,
    valueToTag,
    tagToOption,
  };
}
