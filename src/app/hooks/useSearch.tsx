import { useContext } from "react";
import { SearchContext } from "../components/Providers/SearchProvider";

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) throw new Error("useSearch must be used within a SearchProvider");
  return context;
};