import { createContext, useEffect, useMemo, useState } from "react";

export const LanguageContext = createContext(null);

const LANGUAGE_OPTIONS = [
  { code: "EN", label: "English" },
  { code: "IG", label: "Igbo" },
  { code: "HA", label: "Hausa" },
  { code: "YO", label: "Yoruba" },
];

const translations = {
  EN: {
    nav: {
      home: "Home",
      about: "About",
      services: "Services",
      portfolio: "Portfolio",
      products: "Products",
      clients: "Clients",
      contact: "Contact",
      login: "Login",
      register: "Register",
      dashboard: "Dashboard",
      logout: "Logout",
    },
  },
  IG: {
    nav: {
      home: "Ụlọ",
      about: "Gbasara anyị",
      services: "Ọrụ",
      portfolio: "Ọrụ anyị",
      products: "Ngwaahịa",
      clients: "Ndị ahịa",
      contact: "Kpọtụrụ",
      login: "Banye",
      register: "Debanye aha",
      dashboard: "Dashboard",
      logout: "Pụọ",
    },
  },
  HA: {
    nav: {
      home: "Gida",
      about: "Game da mu",
      services: "Ayyuka",
      portfolio: "Ayyukanmu",
      products: "Kayayyaki",
      clients: "Abokan ciniki",
      contact: "Tuntuɓe mu",
      login: "Shiga",
      register: "Yi rajista",
      dashboard: "Dashboard",
      logout: "Fita",
    },
  },
  YO: {
    nav: {
      home: "Ile",
      about: "Nipa wa",
      services: "Iṣẹ",
      portfolio: "Awọn iṣẹ wa",
      products: "Ọja",
      clients: "Onibara",
      contact: "Kan si wa",
      login: "Wọle",
      register: "Forukọsilẹ",
      dashboard: "Dashboard",
      logout: "Jade",
    },
  },
};

function getNestedValue(object, path) {
  return path.split(".").reduce((current, key) => current?.[key], object);
}

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem("language");
    return LANGUAGE_OPTIONS.some((item) => item.code === saved) ? saved : "EN";
  });

  useEffect(() => {
    localStorage.setItem("language", language);
  }, [language]);

  const changeLanguage = (nextLanguage) => {
    if (LANGUAGE_OPTIONS.some((item) => item.code === nextLanguage)) {
      setLanguage(nextLanguage);
    }
  };

  const t = (key, fallback = key) => {
    return (
      getNestedValue(translations[language], key) ||
      getNestedValue(translations.EN, key) ||
      fallback
    );
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
