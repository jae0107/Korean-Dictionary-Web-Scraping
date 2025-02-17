import { SearchResult } from "@/app/types/types";
import { createContext, Dispatch, ReactNode, useContext } from "react";

interface SearchContextType {
  searchResults: SearchResult | null;
  setSearchResults: Dispatch<React.SetStateAction<SearchResult | null>>;
}

export const SearchContext = createContext<SearchContextType | undefined>(undefined);

const SearchProvider = ({ 
  children,
  searchResults,
  setSearchResults,
} : {
  children: ReactNode;
  searchResults: SearchResult | null;
  setSearchResults: Dispatch<React.SetStateAction<SearchResult | null>>;
}) => {
  
  return (
    <SearchContext.Provider value={{ searchResults, setSearchResults }}>
      {children}
    </SearchContext.Provider>
  );
}

export default SearchProvider;