"use client";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { SessionProvider } from "next-auth/react";
import { createContext, ReactNode, Suspense, useEffect, useMemo, useState } from "react";
import NavigationBar from "../NavigationBar/NavigationBar";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import { createTheme, CssBaseline, Theme, ThemeProvider, useMediaQuery } from "@mui/material";
import { ApolloProvider } from "@apollo/client";
import client from "@/app/lib/apolloClient";
import type {} from '@mui/x-data-grid/themeAugmentation';
import { CurrentUserProvider } from "./CurrentUserProvider";

const ColorModeContext = createContext({ toggleColorMode: () => {} });

export interface CurrentUserContextValue {
  refetch: () => void;
  loading: boolean;
  userRole: string | null;
}

export interface CurrentUserContextValueWithUser
  extends Omit<CurrentUserContextValue, 'user'> {
  userRole: string;
}

export const CurrentUserContext = createContext<CurrentUserContextValue | null>(
  null
);

const Providers = ({ children } : { children: ReactNode }) => {
  const [queryClient] = useState(new QueryClient());
  const prefersMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [mode, setMode] = useState<'light' | 'dark'>('dark');

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
              <CssBaseline enableColorScheme />
              {/* <NavigationBar theme={theme} colorMode={colorMode}/> */}
              <Suspense fallback={null}>
                <CurrentUserProvider>
                  <NavigationBar theme={theme} colorMode={colorMode} />
                  {children}
                </CurrentUserProvider>
              </Suspense>
            </ThemeProvider>
          </ColorModeContext.Provider>
        </ApolloProvider>
        </QueryClientProvider>
      </SessionProvider>
    </AppRouterCacheProvider>
  );
}

export default Providers;