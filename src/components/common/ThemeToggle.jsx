import useTheme from "../../hooks/useTheme";
import useLanguage from "../../hooks/useLanguage";

export default function ThemeToggle() {
  const { themePreference, setTheme, themeOptions, theme, systemTheme } =
    useTheme();
  const { t } = useLanguage();

  const helperText =
    themePreference === themeOptions.SYSTEM
      ? `${t("common.theme")}: ${t("theme.system")} (${systemTheme === themeOptions.DARK ? t("theme.dark") : t("theme.light")})`
      : `${t("common.theme")}: ${theme === themeOptions.DARK ? t("theme.dark") : t("theme.light")}`;

  return (
    <div className="theme-toggle-group">
      <label htmlFor="theme-toggle-select" className="sr-only">
        {t("common.theme")}
      </label>

      <select
        id="theme-toggle-select"
        className="theme-toggle-select"
        value={themePreference}
        onChange={(event) => setTheme(event.target.value)}
        aria-label={t("common.theme")}
        title={helperText}
      >
        <option value={themeOptions.LIGHT}>{t("theme.light")}</option>
        <option value={themeOptions.DARK}>{t("theme.dark")}</option>
        <option value={themeOptions.SYSTEM}>{t("theme.system")}</option>
      </select>
    </div>
  );
}
