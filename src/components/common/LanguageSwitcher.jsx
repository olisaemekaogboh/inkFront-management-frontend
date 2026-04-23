import useLanguage from "../../hooks/useLanguage";

export default function LanguageSwitcher({ id = "language-switcher" }) {
  const { language, setLanguage, supportedLanguages, t } = useLanguage();

  return (
    <div className="language-switcher">
      <label htmlFor={id} className="sr-only">
        {t("language.switcherLabel")}
      </label>

      <select
        id={id}
        value={language}
        onChange={(event) => setLanguage(event.target.value)}
        aria-label={t("language.switcherLabel")}
      >
        {supportedLanguages.map((item) => (
          <option key={item.code} value={item.code}>
            {item.nativeLabel}
          </option>
        ))}
      </select>
    </div>
  );
}
