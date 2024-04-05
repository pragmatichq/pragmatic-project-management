import { createContext } from "react";

export type BreadcrumbContextType = {
  breadcrumbs: string[];
  setBreadcrumbs: React.Dispatch<React.SetStateAction<string[]>>;
};

export const BreadcrumbContext = createContext<BreadcrumbContextType>({
  breadcrumbs: [],
  setBreadcrumbs: () => {},
});
