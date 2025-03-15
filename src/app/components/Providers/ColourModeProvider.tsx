import { createTheme } from '@mui/material';
import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react';

interface ColorModeContextType {
  mode: "light" | "dark";
  toggleColorMode: () => void;
};

export const ColorModeContext = createContext<ColorModeContextType>({
  mode: "dark", // 기본값
  toggleColorMode: () => {},
});

const ColorModeProvider = ({ 
  children,
  mode,
  setMode,
} : { 
  children: ReactNode;
  mode: "light" | "dark";
  setMode: Dispatch<SetStateAction<"light" | "dark">>;
}) => {
  const toggleColorMode = () => {
    setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };

  const theme = createTheme({
    palette: {
      mode,
    },
  });
  
  return (
    <ColorModeContext.Provider value={{ mode, toggleColorMode }}>
      {children}
    </ColorModeContext.Provider>
  );
}

export default ColorModeProvider;