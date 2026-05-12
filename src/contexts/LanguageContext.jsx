import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import enTranslations from "../i18n/locales/en";
import haTranslations from "../i18n/locales/ha";
import igTranslations from "../i18n/locales/ig";
import yoTranslations from "../i18n/locales/yo";

export const LanguageContext = createContext(null);

const STORAGE_KEY = "language";

const LANGUAGE_OPTIONS = [
  { code: "EN", label: "English", translations: enTranslations },
  { code: "HA", label: "Hausa", translations: haTranslations },
  { code: "IG", label: "Igbo", translations: igTranslations },
  { code: "YO", label: "Yoruba", translations: yoTranslations },
];

const KEY_ALIASES = {
  home: "pages.home",
  about: "pages.about",
  services: "pages.services",
  portfolio: "pages.portfolio",
  contact: "pages.contact",
};

function getNestedValue(object, path) {
  if (!object || !path) return undefined;

  return path.split(".").reduce((current, key) => {
    if (current && Object.prototype.hasOwnProperty.call(current, key)) {
      return current[key];
    }
    return undefined;
  }, object);
}

function resolveAliasedKey(key) {
  const [firstSegment, ...rest] = key.split(".");
  const aliasRoot = KEY_ALIASES[firstSegment];
  return aliasRoot ? [aliasRoot, ...rest].join(".") : key;
}

function getValidLanguage(value) {
  const normalized = String(value || "")
    .trim()
    .toUpperCase();

  return LANGUAGE_OPTIONS.some((l) => l.code === normalized)
    ? normalized
    : "EN";
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() =>
    getValidLanguage(localStorage.getItem(STORAGE_KEY)),
  );

  const currentTranslations = useMemo(() => {
    return (
      LANGUAGE_OPTIONS.find((l) => l.code === language)?.translations ||
      enTranslations
    );
  }, [language]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language.toLowerCase();
  }, [language]);

  const changeLanguage = useCallback((lang) => {
    setLanguageState(getValidLanguage(lang));
  }, []);

  const t = useCallback(
    (key, fallback = key) => {
      const direct = getNestedValue(currentTranslations, key);
      if (direct != null) return direct;

      const aliasedKey = resolveAliasedKey(key);
      const aliased = getNestedValue(currentTranslations, aliasedKey);
      if (aliased != null) return aliased;

      const enFallback = getNestedValue(enTranslations, key);
      if (enFallback != null) return enFallback;

      return fallback;
    },
    [currentTranslations],
  );

  return (
    <LanguageContext.Provider
      value={{
        language,
        changeLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}
