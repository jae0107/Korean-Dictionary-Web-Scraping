"use client";

import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { SessionProvider } from "next-auth/react";
import { createContext, ReactNode, Suspense, useContext, useEffect, useMemo, useState } from "react";
import NavigationBar from "../NavigationBar/NavigationBar";
import { createTheme, CssBaseline, Theme, ThemeProvider, useMediaQuery } from "@mui/material";
import { ApolloProvider } from "@apollo/client";
import client from "@/app/lib/apolloClient";
import type {} from '@mui/x-data-grid/themeAugmentation';
import { SnackbarProvider } from "@/app/hooks/useSnackbar";
import { SearchResult } from "@/app/types/types";
import SearchProvider from "./SearchProvider";
import ColorModeProvider, { ColorModeContext } from "./ColourModeProvider";

export const useColorModeContext = () => useContext(ColorModeContext);

export const ThemeContext = createContext<Theme | null>(null);

export const useThemeContext = () => useContext(ThemeContext);

const Providers = ({ children } : { children: ReactNode }) => {
  const [mode, setMode] = useState<'light' | 'dark'>('dark');
  const [searchResults, setSearchResults] = useState<SearchResult | null>(null);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          background: {
            'default': mode === 'light' ? '#f4f6f8' : '#353535',
          },
          primary: {
            main: mode === 'dark' ? '#90caf9' : '#5a4fcf', // 메인 색상 변경
            light: '#d1c7ff', 
            contrastText: mode === 'dark' ? 'rgba(0, 0, 0, 0.87)' : '#fff', 
          },
          info: {
            main: mode === 'dark' ? 'rgb(41, 182, 246)' : '#a390e9', 
            dark: mode === 'dark' ? '#0288d1' : '#8066c1',
            light: mode === 'dark' ? '#039be5' : '#c2b3ff',
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
          MuiAppBar: {
            styleOverrides: {
              root: {
                backgroundColor: mode === 'light' ? '#a390e9' : '#121212', 
                '--AppBar-background': mode === 'light' ? '#a390e9' : '#121212', 
              },
            },
          },
          MuiDataGrid: {
            styleOverrides: {
              root: {
                borderColor: mode === 'light' ? '#b4b4b4' : '#515151',
                background: mode === 'light' ? '#ffffff' : 'transparent',
                '& .MuiDataGrid-toolbarContainer': {
                  borderBottom: mode === 'light' ? '0.2px solid #b4b4b4' : '0.2px solid #515151',
                },
                '& [data-field="actions"]': {
                  borderLeft: mode === 'light' ? '0.2px solid #b4b4b4' : '0.2px solid #515151',
                },
                '& [data-field="action"]': {
                  borderLeft: mode === 'light' ? '0.2px solid #b4b4b4' : '0.2px solid #515151',
                },
                '& .MuiDataGrid-cell': {
                  display: 'flex',
                  alignItems: 'center',
                  whiteSpace: 'pre-line !important',
                },
                '[aria-label="more"]': {
                  boxShadow: '0px 3px 1px -2px rgba(0, 0, 0, 0.2), 0px 2px 2px 0px rgba(0, 0, 0, 0.14), 0px 1px 5px 0px rgba(0, 0, 0, 0.12);'
                },
                '& .MuiDataGrid-footerContainer': {
                  borderTop: mode === 'light' ? '1px solid #b4b4b4' : '1px solid #515151',
                },
                '& .MuiDataGrid-topContainer': {
                  borderBottom: mode === 'light' ? '0.2px solid #b4b4b4' : '0.2px solid #515151',
                },
                '& .MuiDataGrid-row': {
                  '&:last-child': {
                    borderBottom: '0px',
                  },
                  borderBottom: mode === 'light' ? '0.2px solid #b4b4b4' : '0.2px solid #515151',
                },
                '& .MuiDataGrid-columnSeparator': {
                  color: mode === 'light' ? '#b4b4b4' : '#515151',
                },
                '& .MuiTablePagination-displayedRows': {
                  display: 'none',
                },
                '& .MuiDataGrid-virtualScroller': {
                  overflowY: 'hidden',
                },
                '& .MuiDataGrid-columnHeaderTitleContainerContent .MuiDataGrid-columnHeaderTitle': {
                  textOverflow: 'unset',
                  whiteSpace: 'normal',
                  wordWrap: 'break-word',
                }
              },
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
                },
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
          MuiDialog: {
            styleOverrides: {
              root: {
                '& .MuiPaper-root': {
                  background: mode === 'light' ? '#f4f6f8' : '#353535',
                },
              },
            },
          },
          MuiMenu: {
            styleOverrides: {
              paper: {
                background: mode === 'light' ? '#ffffff' : '#353535',
              },
            },
          },
          MuiInputBase: {
            styleOverrides: {
              root: {
                background: mode === 'light' ? '#ffffff' : '#353535',
              },
            },
          }
        }
      }),
    [mode],
  );

  return (
    <AppRouterCacheProvider>
      <SessionProvider>
        <ApolloProvider client={client}>
          <ColorModeProvider mode={mode} setMode={setMode}>
            <ThemeProvider theme={theme}>
              <ThemeContext.Provider value={theme}>
                <CssBaseline enableColorScheme />
                <Suspense fallback={null}>
                  <SearchProvider searchResults={searchResults} setSearchResults={setSearchResults}>
                    <SnackbarProvider>
                      <NavigationBar theme={theme} setSearchResults={setSearchResults}/>
                      {children}
                    </SnackbarProvider>
                  </SearchProvider>
                </Suspense>
              </ThemeContext.Provider>
            </ThemeProvider>
          </ColorModeProvider>
        </ApolloProvider>
      </SessionProvider>
    </AppRouterCacheProvider>
  );
}

export default Providers;