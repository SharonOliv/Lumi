import { createSlice } from "@reduxjs/toolkit";

export type Theme = "dark" | "light";

const STORAGE_KEY = "lumi_theme";

const getInitialTheme = (): Theme => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "dark" || stored === "light") return stored;
  // No saved preference yet — default to the OS preference, falling back
  // to dark (the app's primary "cinema at night" identity).
  return window.matchMedia?.("(prefers-color-scheme: light)").matches ? "light" : "dark";
};

interface ThemeState {
  mode: Theme;
}

const initialState: ThemeState = {
  mode: getInitialTheme(),
};

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.mode = state.mode === "dark" ? "light" : "dark";
      localStorage.setItem(STORAGE_KEY, state.mode);
    },
    setTheme: (state, action: { payload: Theme }) => {
      state.mode = action.payload;
      localStorage.setItem(STORAGE_KEY, state.mode);
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;
