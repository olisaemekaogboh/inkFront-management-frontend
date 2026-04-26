import { useTheme } from "../../contexts/ThemeContext";

export default function SimpleThemeToggle() {
  const { themePreference, setTheme, isDarkMode } = useTheme();

  return (
    <div className="simple-theme-toggle">
      <button
        onClick={() => setTheme("light")}
        className={`theme-icon ${themePreference === "light" ? "active" : ""}`}
        aria-label="Light mode"
        title="Light mode"
      >
        ☀️
      </button>
      <button
        onClick={() => setTheme("dark")}
        className={`theme-icon ${themePreference === "dark" ? "active" : ""}`}
        aria-label="Dark mode"
        title="Dark mode"
      >
        🌙
      </button>
      <button
        onClick={() => setTheme("system")}
        className={`theme-icon ${themePreference === "system" ? "active" : ""}`}
        aria-label="System mode"
        title="System mode"
      >
        💻
      </button>
    </div>
  );
}
