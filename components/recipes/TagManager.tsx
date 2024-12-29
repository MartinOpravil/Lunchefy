import { useMemo } from "react";
import { Option } from "@/components/ui/multiple-selector";
import { useTranslations } from "next-intl";

export enum Tag {
  Chicken = "chicken",
  Pork = "pork",
  Beef = "beef",
  Fish = "fish",
  Rabbit = "rabbit",
  Potato = "potato",
  Rice = "rice",
  Pasta = "pasta",
  Vegetables = "vegetables",
  Fruits = "fruits",
  Sweets = "sweets",
  Dessert = "dessert",
  Cheese = "cheese",
  Eggs = "eggs",
  Pastry = "pastry",
  Mushrooms = "mushrooms",
  Sausages = "sausages",
  CzechDumpling = "czech_dumpling",

  Baked = "baked",
  Fried = "fried",
  Boiled = "boiled",

  Soup = "soup",
  MainDish = "main_dish",
}

export function useTagManager() {
  const t = useTranslations("Recipes");

  const tagOptions = useMemo<Option[]>(() => {
    return [
      { label: t("Tags.Chicken"), value: Tag.Chicken },
      { label: t("Tags.Beef"), value: Tag.Beef },
      { label: t("Tags.Pork"), value: Tag.Pork },
      { label: t("Tags.Fish"), value: Tag.Fish },
      { label: t("Tags.Rabbit"), value: Tag.Rabbit },
      { label: t("Tags.Rice"), value: Tag.Rice },
      { label: t("Tags.Pasta"), value: Tag.Pasta },
      { label: t("Tags.CzechDumpling"), value: Tag.CzechDumpling },
      { label: t("Tags.Potato"), value: Tag.Potato },
      { label: t("Tags.Cheese"), value: Tag.Cheese },
      { label: t("Tags.Pastry"), value: Tag.Pastry },
      { label: t("Tags.Mushrooms"), value: Tag.Mushrooms },
      { label: t("Tags.Eggs"), value: Tag.Eggs },
      { label: t("Tags.Vegetables"), value: Tag.Vegetables },
      { label: t("Tags.Fruits"), value: Tag.Fruits },
      { label: t("Tags.Sausages"), value: Tag.Sausages },
      { label: t("Tags.Dessert"), value: Tag.Dessert },
      { label: t("Tags.Sweets"), value: Tag.Sweets },
      { label: t("Tags.Soup"), value: Tag.Soup },
      { label: t("Tags.MainDish"), value: Tag.MainDish },
      { label: t("Tags.Boiled"), value: Tag.Boiled },
      { label: t("Tags.Baked"), value: Tag.Baked },
      { label: t("Tags.Fried"), value: Tag.Fried },
    ].sort((a, b) => (a.label > b.label ? 1 : -1));
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
