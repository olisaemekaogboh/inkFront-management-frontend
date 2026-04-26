import React, {
  createContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";

const THEME_STORAGE_KEY = "agency_platform_theme_preference";
const THEME_OPTIONS = {
  LIGHT: "light",
  DARK: "dark",
  SYSTEM: "system",
};

const THEME_DISPLAY = {
  light: { label: "Light", icon: "☀️", color: "#fbbf24" },
  dark: { label: "Dark", icon: "🌙", color: "#6366f1" },
  system: { label: "System", icon: "💻", color: "#10b981" },
};

export const ThemeContext = createContext(null);

function getStoredThemePreference() {
  if (typeof window === "undefined") {
    return THEME_OPTIONS.SYSTEM;
  }

  try {
    const storedValue = localStorage.getItem(THEME_STORAGE_KEY);
    const isValid = Object.values(THEME_OPTIONS).includes(storedValue);
    return isValid ? storedValue : THEME_OPTIONS.SYSTEM;
  } catch (error) {
    console.error("Failed to read theme preference:", error);
    return THEME_OPTIONS.SYSTEM;
  }
}

function getSystemTheme() {
  if (typeof window === "undefined") {
    return THEME_OPTIONS.LIGHT;
  }

  try {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? THEME_OPTIONS.DARK
      : THEME_OPTIONS.LIGHT;
  } catch (error) {
    console.error("Failed to detect system theme:", error);
    return THEME_OPTIONS.LIGHT;
  }
}

export function ThemeProvider({ children }) {
  const [themePreference, setThemePreference] = useState(
    getStoredThemePreference,
  );
  const [systemTheme, setSystemTheme] = useState(getSystemTheme);

  // Handle system theme changes
  useEffect(() => {
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = (event) => {
      setSystemTheme(event.matches ? THEME_OPTIONS.DARK : THEME_OPTIONS.LIGHT);
    };

    // Modern event listener
    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }

    // Fallback for older browsers
    mediaQuery.addListener(handleChange);
    return () => mediaQuery.removeListener(handleChange);
  }, []);

  // Save theme preference to localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(THEME_STORAGE_KEY, themePreference);
    }
  }, [themePreference]);

  // Compute resolved theme
  const resolvedTheme = useMemo(
    () =>
      themePreference === THEME_OPTIONS.SYSTEM ? systemTheme : themePreference,
    [themePreference, systemTheme],
  );

  // Apply theme to DOM
  useEffect(() => {
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-theme", resolvedTheme);
      document.documentElement.style.colorScheme = resolvedTheme;
    }
  }, [resolvedTheme]);

  // Get current theme display info
  const currentThemeDisplay = useMemo(
    () => THEME_DISPLAY[themePreference] || THEME_DISPLAY.light,
    [themePreference],
  );

  const setTheme = useCallback((newTheme) => {
    if (Object.values(THEME_OPTIONS).includes(newTheme)) {
      setThemePreference(newTheme);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setThemePreference((current) => {
      if (current === THEME_OPTIONS.LIGHT) return THEME_OPTIONS.DARK;
      if (current === THEME_OPTIONS.DARK) return THEME_OPTIONS.SYSTEM;
      return THEME_OPTIONS.LIGHT;
    });
  }, []);

  const value = useMemo(
    () => ({
      theme: resolvedTheme,
      themePreference,
      systemTheme,
      isDarkMode: resolvedTheme === THEME_OPTIONS.DARK,
      isLightMode: resolvedTheme === THEME_OPTIONS.LIGHT,
      isSystemMode: themePreference === THEME_OPTIONS.SYSTEM,
      currentThemeDisplay,
      setTheme,
      toggleTheme,
      themeOptions: THEME_OPTIONS,
    }),
    [
      resolvedTheme,
      themePreference,
      systemTheme,
      currentThemeDisplay,
      setTheme,
      toggleTheme,
    ],
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

// Custom hook for using theme
export function useTheme() {
  const context = React.useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
