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
  CzechDumpling = "czech_dumpling",
  Fries = "fries",
  Soup = "soup",

  Vegetables = "vegetables",
  Fruits = "fruits",
  Mushrooms = "mushrooms",
  Salad = "salad",
  Paprika = "paprika",
  Tomato = "tomato",
  Cucumber = "cucumber",
  Onion = "onion",
  Garlic = "garlic",

  Milk = "milk",
  Cheese = "cheese",
  Eggs = "eggs",

  Sweets = "sweets",
  Dessert = "dessert",
  Pastry = "pastry",
  Sausages = "sausages",

  Baked = "baked",
  Fried = "fried",
  Boiled = "boiled",

  Lunch = "lunch",
  Dinner = "dinner",
  Breakfast = "breakfast",
  Snack = "snack",
}

export function useTagManager() {
  const t = useTranslations("Recipes.Tags");

  const tagOptions = useMemo<Option[]>(() => {
    return [
      // Meat
      {
        label: t("Labels.Chicken"),
        value: Tag.Chicken,
        group: t("Groups.Meat"),
      },
      { label: t("Labels.Beef"), value: Tag.Beef, group: t("Groups.Meat") },
      { label: t("Labels.Pork"), value: Tag.Pork, group: t("Groups.Meat") },
      { label: t("Labels.Fish"), value: Tag.Fish, group: t("Groups.Meat") },
      { label: t("Labels.Rabbit"), value: Tag.Rabbit, group: t("Groups.Meat") },
      {
        label: t("Labels.Sausages"),
        value: Tag.Sausages,
        group: t("Groups.Meat"),
      },
      // Sides
      { label: t("Labels.Rice"), value: Tag.Rice, group: t("Groups.Sides") },
      { label: t("Labels.Pasta"), value: Tag.Pasta, group: t("Groups.Sides") },
      {
        label: t("Labels.CzechDumpling"),
        value: Tag.CzechDumpling,
        group: t("Groups.Sides"),
      },
      {
        label: t("Labels.Potato"),
        value: Tag.Potato,
        group: t("Groups.Sides"),
      },
      { label: t("Labels.Fries"), value: Tag.Fries, group: t("Groups.Sides") },
      { label: t("Labels.Soup"), value: Tag.Soup, group: t("Groups.Sides") },
      // Fruits & Vegetables
      {
        label: t("Labels.Fruits"),
        value: Tag.Fruits,
        group: t("Groups.Vegetables"),
      },
      {
        label: t("Labels.Vegetables"),
        value: Tag.Vegetables,
        group: t("Groups.Vegetables"),
      },
      {
        label: t("Labels.Mushrooms"),
        value: Tag.Mushrooms,
        group: t("Groups.Vegetables"),
      },
      {
        label: t("Labels.Salad"),
        value: Tag.Salad,
        group: t("Groups.Vegetables"),
      },
      {
        label: t("Labels.Paprika"),
        value: Tag.Paprika,
        group: t("Groups.Vegetables"),
      },
      {
        label: t("Labels.Tomato"),
        value: Tag.Tomato,
        group: t("Groups.Vegetables"),
      },
      {
        label: t("Labels.Cucumber"),
        value: Tag.Cucumber,
        group: t("Groups.Vegetables"),
      },
      {
        label: t("Labels.Onion"),
        value: Tag.Onion,
        group: t("Groups.Vegetables"),
      },
      {
        label: t("Labels.Garlic"),
        value: Tag.Garlic,
        group: t("Groups.Vegetables"),
      },
      // Dairy & Eggs
      { label: t("Labels.Milk"), value: Tag.Milk, group: t("Groups.Dairy") },
      {
        label: t("Labels.Cheese"),
        value: Tag.Cheese,
        group: t("Groups.Dairy"),
      },
      { label: t("Labels.Eggs"), value: Tag.Eggs, group: t("Groups.Dairy") },
      // Deserts
      {
        label: t("Labels.Pastry"),
        value: Tag.Pastry,
        group: t("Groups.Pastry"),
      },
      {
        label: t("Labels.Dessert"),
        value: Tag.Dessert,
        group: t("Groups.Pastry"),
      },
      {
        label: t("Labels.Sweets"),
        value: Tag.Sweets,
        group: t("Groups.Pastry"),
      },
      // Dish types

      {
        label: t("Labels.Lunch"),
        value: Tag.Lunch,
        group: t("Groups.DishType"),
      },
      {
        label: t("Labels.Dinner"),
        value: Tag.Dinner,
        group: t("Groups.DishType"),
      },
      {
        label: t("Labels.Breakfast"),
        value: Tag.Breakfast,
        group: t("Groups.DishType"),
      },
      {
        label: t("Labels.Snack"),
        value: Tag.Snack,
        group: t("Groups.DishType"),
      },
      // Cooking Methods
      {
        label: t("Labels.Boiled"),
        value: Tag.Boiled,
        group: t("Groups.CookingMethods"),
      },
      {
        label: t("Labels.Baked"),
        value: Tag.Baked,
        group: t("Groups.CookingMethods"),
      },
      {
        label: t("Labels.Fried"),
        value: Tag.Fried,
        group: t("Groups.CookingMethods"),
      },
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
