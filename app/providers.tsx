"use client";

import { ThemeProvider, useTheme } from "next-themes";
import { AuthContextProvider } from "@/contexts/authContext";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import HomeContext from "@/contexts/homeContext";
import { HomeInitialState, initialState } from "@/contexts/homeContext/state";
import { useCreateReducer } from "@/hooks/useCreateReducer";

export function Providers({ children }: { children: React.ReactNode }) {
  const { theme, resolvedTheme } = useTheme();
  const contextValue = useCreateReducer<HomeInitialState>({
    initialState,
  });


  return (
    <HomeContext.Provider value={{ ...contextValue }}>
      <AuthContextProvider>
        {children}
        < ToastContainer
          position="top-center"
          autoClose={2000}
          theme={resolvedTheme === "dark" ? "dark" : "light"}
          hideProgressBar={true}
          draggable={true}
        />
      </AuthContextProvider >
    </HomeContext.Provider>
  );
}
