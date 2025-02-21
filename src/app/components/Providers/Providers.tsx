"use client";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { SessionProvider } from "next-auth/react";
import { createContext, ReactNode, Suspense, useContext, useEffect, useMemo, useState } from "react";
import NavigationBar from "../NavigationBar/NavigationBar";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { createTheme, CssBaseline, Theme, ThemeProvider, useMediaQuery } from "@mui/material";
import { ApolloProvider } from "@apollo/client";
import client from "@/app/lib/apolloClient";
import type {} from '@mui/x-data-grid/themeAugmentation';
import { CurrentUserProvider } from "./CurrentUserProvider";
import { SnackbarProvider } from "@/app/hooks/useSnackbar";
import { SearchResult } from "@/app/types/types";
import SearchProvider from "./SearchProvider";

const ColorModeContext = createContext({ toggleColorMode: () => {} });
export const useColorModeContext = () => useContext(ColorModeContext);

export interface CurrentUserContextValue {
  refetch: () => void;
  loading: boolean;
  userRole: string | null;
  networkStatus: number;
}

export interface CurrentUserContextValueWithUser
  extends Omit<CurrentUserContextValue, 'user'> {
  userRole: string;
}

export const CurrentUserContext = createContext<CurrentUserContextValue | null>(
  null
);

export const ThemeContext = createContext<Theme | null>(null);

export const useThemeContext = () => useContext(ThemeContext);

const Providers = ({ children } : { children: ReactNode }) => {
  const [queryClient] = useState(new QueryClient());
  const prefersMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [mode, setMode] = useState<'light' | 'dark'>('dark');
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);

  useEffect(() => {
    setMode(prefersMode ? 'dark' : 'light');
  }, [prefersMode]);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
    }),
    [],
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          background: {
            'default': mode === 'light' ? '#f5f5f5' : '#353535',
          }
        },
        components: {
          MuiCssBaseline: {
            styleOverrides: {
              '&.Mui-disabled': {
                cursor: 'not-allowed !important',
              },
              '[aria-disabled="true"]': {
                cursor: 'not-allowed !important',
              },
            },
          },
          MuiDataGrid: {
            styleOverrides: {
              root: {
                '& .MuiDataGrid-toolbarContainer': {
                  borderBottom: mode === 'light' ? '1px solid #e0e0e0' : '1px solid #515151',
                },
                '& [data-field="actions"]': {
                  borderLeft: mode === 'light' ? '1px solid #e0e0e0' : '1px solid #515151',
                },
                '& [data-field="action"]': {
                  borderLeft: mode === 'light' ? '1px solid #e0e0e0' : '1px solid #515151',
                },
                '& .MuiDataGrid-cell': {
                  display: 'flex',
                  alignItems: 'center',
                  whiteSpace: 'pre-line !important',
                },
                '[aria-label="more"]': {
                  boxShadow: '0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);'
                }
              }
            }
          },
          MuiTab: {
            styleOverrides: {
              root: {
                '&.Mui-selected': {
                  fontWeight: 'bold',
                },
                textTransform: 'none',
                '@media (max-width:545px)': {
                  flex: 1,
                }
              },
            },
          },
          MuiFormLabel: {
            styleOverrides: {
              root: {
                '.MuiFormLabel-asterisk': {
                  color: '#f44336',
                },
              },
            },
          },
        }
      }),
    [mode],
  );

  return (
    <AppRouterCacheProvider>
      <SessionProvider>
        <QueryClientProvider client={queryClient}>
          <ApolloProvider client={client}>
            <ColorModeContext.Provider value={colorMode}>
              <ThemeProvider theme={theme}>
                <ThemeContext.Provider value={theme}>
                  <CssBaseline enableColorScheme />
                  <Suspense fallback={null}>
                    <SearchProvider searchResults={searchResults} setSearchResults={setSearchResults}>
                      <SnackbarProvider>
                        <CurrentUserProvider>
                          <NavigationBar theme={theme} colorMode={colorMode} setSearchResults={setSearchResults}/>
                          {children}
                        </CurrentUserProvider>
                      </SnackbarProvider>
                    </SearchProvider>
                  </Suspense>
                </ThemeContext.Provider>
              </ThemeProvider>
            </ColorModeContext.Provider>
          </ApolloProvider>
        </QueryClientProvider>
      </SessionProvider>
    </AppRouterCacheProvider>
  );
}

export default Providers;