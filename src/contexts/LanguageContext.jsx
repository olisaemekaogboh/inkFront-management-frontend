import { createContext, useEffect, useMemo, useState } from "react";
import enTranslations from "../i18n/locales/en";
import haTranslations from "../i18n/locales/ha";
import igTranslations from "../i18n/locales/ig";
import yoTranslations from "../i18n/locales/yo";

export const LanguageContext = createContext(null);

const LANGUAGE_OPTIONS = [
  { code: "EN", label: "English", translations: enTranslations },
  { code: "HA", label: "Hausa", translations: haTranslations },
  { code: "IG", label: "Igbo", translations: igTranslations },
  { code: "YO", label: "Yoruba", translations: yoTranslations },
];

function getNestedValue(object, path) {
  return path.split(".").reduce((current, key) => current?.[key], object);
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem("language");
    return LANGUAGE_OPTIONS.some((item) => item.code === saved) ? saved : "EN";
  });

  const currentTranslations =
    LANGUAGE_OPTIONS.find((opt) => opt.code === language)?.translations ||
    enTranslations;

  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.lang = language.toLowerCase();
  }, [language]);

  const changeLanguage = (nextLanguage) => {
    if (LANGUAGE_OPTIONS.some((item) => item.code === nextLanguage)) {
      setLanguage(nextLanguage);
    }
  };

  const t = (key, fallback = key) => {
    const translation = getNestedValue(currentTranslations, key);
    return translation !== undefined ? translation : fallback;
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage: changeLanguage,
      changeLanguage,
      t,
      languages: LANGUAGE_OPTIONS.map((item) => item.code),
      languageOptions: LANGUAGE_OPTIONS,
      supportedLanguages: LANGUAGE_OPTIONS,
      availableLanguages: LANGUAGE_OPTIONS,
    }),
    [language],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
