import { ColumnSort } from "@tanstack/react-table";
import {
  createParser,
  parseAsArrayOf,
  parseAsString,
  useQueryState,
} from "nuqs";

export const columnSortParser = createParser<ColumnSort[]>({
  parse(queryValue: string): ColumnSort[] | null {
    if (!queryValue) return null;
    return queryValue
      .split(";")
      .map((part) => {
        const [desc, id] = part.split(",");
        if ((desc !== "true" && desc !== "false") || !id) {
          return null; // invalid format
        }
        return { desc: desc === "true", id };
      })
      .filter((cs): cs is ColumnSort => cs !== null);
  },
  serialize(values: ColumnSort[]): string {
    return values.map((value) => `${value.desc},${value.id}`).join(";");
  },
});

export const useArrayQueryState = (name: string) =>
  useQueryState(name, parseAsArrayOf(parseAsString).withDefault([]));
