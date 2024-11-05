import { Option } from "@/components/ui/multiple-selector";

export enum Tag {
  Chicken = "chicken",
  Beef = "beef",
  Pork = "pork",
  Rice = "rice",
  Pasta = "pasta",
  Fish = "fish",
}

export class TagManager {
  private static tagOptions: Option[] = [
    { label: "Chicken", value: Tag.Chicken },
    { label: "Beef", value: Tag.Beef },
    { label: "Pork", value: Tag.Pork },
    { label: "Rice", value: Tag.Rice },
    { label: "Pasta", value: Tag.Pasta },
    { label: "Fish", value: Tag.Fish },
  ];

  static getTagOptions(): Option[] {
    return this.tagOptions;
  }

  // Convert tags (Option[]) to their string values (string[])
  static convertToValues(tags: Option[]): string[] {
    return tags.map((tag) => tag.value);
  }

  // Convert string values (string[]) to tag options (Option[])
  static convertToTags(values: string[]): Option[] {
    return values
      .map((value) =>
        this.tagOptions.find((option) => option.value === (value as Tag))
      )
      .filter((option): option is Option => option !== undefined);
  }

  // Convert a single string value to a Tag enum
  static valueToTag(value: string): Tag | undefined {
    return Object.values(Tag).find((tag) => tag === value);
  }

  // Convert a Tag enum to its corresponding Option
  static tagToOption(tag: Tag): Option | undefined {
    return this.tagOptions.find((option) => option.value === tag);
  }
}
