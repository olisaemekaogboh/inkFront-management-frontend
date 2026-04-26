import useLanguage from "../../hooks/useLanguage";

export default function LanguageSwitcher() {
  const {
    language = "EN",
    changeLanguage,
    setLanguage,
    languageOptions,
    supportedLanguages,
    availableLanguages,
    languages,
  } = useLanguage();

  const options =
    languageOptions ||
    supportedLanguages ||
    availableLanguages ||
    (Array.isArray(languages)
      ? languages.map((code) => ({ code, label: code }))
      : [
          { code: "EN", label: "English" },
          { code: "IG", label: "Igbo" },
          { code: "HA", label: "Hausa" },
          { code: "YO", label: "Yoruba" },
        ]);

  const handleChange = (event) => {
    const nextLanguage = event.target.value;

    if (typeof changeLanguage === "function") {
      changeLanguage(nextLanguage);
      return;
    }

    if (typeof setLanguage === "function") {
      setLanguage(nextLanguage);
    }
  };

  return (
    <select
      value={language}
      onChange={handleChange}
      className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 outline-none transition hover:border-blue-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-blue-950"
      aria-label="Select language"
    >
      {options.map((item) => {
        const code = item.code || item.value || item;
        const label = item.label || item.name || code;

        return (
          <option key={code} value={code}>
            {label}
          </option>
        );
      })}
    </select>
  );
}
