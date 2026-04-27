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
  servicesPage: "pages.servicesPage",
  portfolio: "pages.portfolio",
  portfolioPage: "pages.portfolioPage",
  products: "pages.products",
  productsPage: "pages.productsPage",
  blueprint: "pages.blueprint",
  clientsPage: "pages.clientsPage",
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

  if (!aliasRoot) return key;

  return [aliasRoot, ...rest].join(".");
}

function getValidLanguage(value) {
  const normalized = String(value || "")
    .trim()
    .toUpperCase();

  return LANGUAGE_OPTIONS.some((item) => item.code === normalized)
    ? normalized
    : "EN";
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    return getValidLanguage(localStorage.getItem(STORAGE_KEY));
  });

  const currentTranslations = useMemo(() => {
    return (
      LANGUAGE_OPTIONS.find((item) => item.code === language)?.translations ||
      enTranslations
    );
  }, [language]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, language);
    document.documentElement.lang = language.toLowerCase();
    document.documentElement.setAttribute("data-language", language);
  }, [language]);

  const changeLanguage = useCallback((nextLanguage) => {
    setLanguageState(getValidLanguage(nextLanguage));
  }, []);

  const t = useCallback(
    (key, fallback = key) => {
      const directTranslation = getNestedValue(currentTranslations, key);

      if (directTranslation !== undefined && directTranslation !== null) {
        return directTranslation;
      }

      const aliasedKey = resolveAliasedKey(key);
      const aliasedTranslation = getNestedValue(
        currentTranslations,
        aliasedKey,
      );

      if (aliasedTranslation !== undefined && aliasedTranslation !== null) {
        return aliasedTranslation;
      }

      const englishDirect = getNestedValue(enTranslations, key);

      if (englishDirect !== undefined && englishDirect !== null) {
        return englishDirect;
      }

      const englishAliased = getNestedValue(enTranslations, aliasedKey);

      if (englishAliased !== undefined && englishAliased !== null) {
        return englishAliased;
      }

      return fallback;
    },
    [currentTranslations],
  );

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
      currentLanguage:
        LANGUAGE_OPTIONS.find((item) => item.code === language) ||
        LANGUAGE_OPTIONS[0],
    }),
    [language, changeLanguage, t],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
