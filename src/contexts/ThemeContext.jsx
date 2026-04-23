import { createContext, useEffect, useMemo, useState } from "react";

const THEME_STORAGE_KEY = "agency_platform_theme_preference";
const THEME_OPTIONS = {
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system",
};

export const ThemeContext = createContext(null);

function getStoredThemePreference() {
  if (typeof window === "undefined") {
    return THEME_OPTIONS.SYSTEM;
  }

  const storedValue = window.localStorage.getItem(THEME_STORAGE_KEY);
  const isValid = Object.values(THEME_OPTIONS).includes(storedValue);

  return isValid ? storedValue : THEME_OPTIONS.SYSTEM;
}

function getSystemTheme() {
  if (typeof window === "undefined") {
    return THEME_OPTIONS.LIGHT;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? THEME_OPTIONS.DARK
    : THEME_OPTIONS.LIGHT;
}

function getResolvedTheme(themePreference) {
  return themePreference === THEME_OPTIONS.SYSTEM
    ? getSystemTheme()
    : themePreference;
}

export function ThemeProvider({ children }) {
  const [themePreference, setThemePreference] = useState(
    getStoredThemePreference,
  );
  const [systemTheme, setSystemTheme] = useState(getSystemTheme);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    function handleChange(event) {
      setSystemTheme(event.matches ? THEME_OPTIONS.DARK : THEME_OPTIONS.LIGHT);
    }

    setSystemTheme(
      mediaQuery.matches ? THEME_OPTIONS.DARK : THEME_OPTIONS.LIGHT,
    );

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }

    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(THEME_STORAGE_KEY, themePreference);
    }
  }, [themePreference]);

  const resolvedTheme =
    themePreference === THEME_OPTIONS.SYSTEM ? systemTheme : themePreference;

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", resolvedTheme);
    document.documentElement.setAttribute(
      "data-theme-preference",
      themePreference,
    );
    document.documentElement.style.colorScheme = resolvedTheme;
  }, [resolvedTheme, themePreference]);

  const value = useMemo(
    () => ({
      theme: resolvedTheme,
      themePreference,
      systemTheme,
      isDarkMode: resolvedTheme === THEME_OPTIONS.DARK,
      isSystemMode: themePreference === THEME_OPTIONS.SYSTEM,
      setTheme: setThemePreference,
      toggleTheme: () => {
        setThemePreference((current) => {
          if (current === THEME_OPTIONS.LIGHT) {
            return THEME_OPTIONS.DARK;
          }

          if (current === THEME_OPTIONS.DARK) {
            return THEME_OPTIONS.SYSTEM;
          }

          return THEME_OPTIONS.LIGHT;
        });
      },
      themeOptions: THEME_OPTIONS,
    }),
    [resolvedTheme, themePreference, systemTheme],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
