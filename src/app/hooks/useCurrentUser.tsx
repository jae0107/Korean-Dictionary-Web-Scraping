import { useContext } from "react";
import { CurrentUserContext, CurrentUserContextValueWithUser } from "../components/Providers/Providers";

export function useCurrentUser() {
  const context = useContext(CurrentUserContext);
  if (!context) {
    throw new Error(
      'useCurrentUser must be used within CurrentUserContext.Provider'
    );
  }
  return context as CurrentUserContextValueWithUser;
}