import { createContext, useEffect, useMemo, useState } from "react";
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  SUPPORTED_LANGUAGES,
} from "../i18n/languages";
import { messages } from "../i18n/messages";
import { interpolate, resolveTranslation } from "../i18n/translate";

export const LanguageContext = createContext(null);

function getStoredLanguage() {
  if (typeof window === "undefined") {
    return DEFAULT_LANGUAGE;
  }

  const stored = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  const isSupported = SUPPORTED_LANGUAGES.some((item) => item.code === stored);

  return isSupported ? stored : DEFAULT_LANGUAGE;
}

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(getStoredLanguage);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    }

    document.documentElement.setAttribute("lang", language.toLowerCase());
  }, [language]);

  const setLanguage = (nextLanguage) => {
    const isSupported = SUPPORTED_LANGUAGES.some(
      (item) => item.code === nextLanguage,
    );
    if (isSupported) {
      setLanguageState(nextLanguage);
    }
  };

  const t = (key, values = {}) => {
    const activeMessages = messages[language] || messages[DEFAULT_LANGUAGE];
    const fallbackMessages = messages[DEFAULT_LANGUAGE];

    const resolved =
      resolveTranslation(activeMessages, key) ??
      resolveTranslation(fallbackMessages, key) ??
      key;

    return interpolate(resolved, values);
  };

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      supportedLanguages: SUPPORTED_LANGUAGES,
      t,
    }),
    [language],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}
