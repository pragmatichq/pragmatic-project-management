import { createContext } from "react";

export type FilterContextType = {
  breadcrumbs: string[];
  setBreadcrumbs: React.Dispatch<React.SetStateAction<string[]>>;
};

export const LayoutContext = createContext<FilterContextType>({
  breadcrumbs: [],
  setBreadcrumbs: () => {},
});
