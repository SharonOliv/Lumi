import { beforeEach, describe, expect, it } from "vitest";
import themeReducer, { setTheme, toggleTheme } from "../slices/themeSlice";

describe("themeSlice", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("toggles from dark to light and persists the choice", () => {
    const state = themeReducer({ mode: "dark" }, toggleTheme());
    expect(state.mode).toBe("light");
    expect(localStorage.getItem("lumi_theme")).toBe("light");
  });

  it("toggles from light back to dark", () => {
    const state = themeReducer({ mode: "light" }, toggleTheme());
    expect(state.mode).toBe("dark");
  });

  it("setTheme sets an explicit value and persists it", () => {
    const state = themeReducer({ mode: "dark" }, setTheme("light"));
    expect(state.mode).toBe("light");
    expect(localStorage.getItem("lumi_theme")).toBe("light");
  });
});
