import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    t,
  } = useLanguage();

  const [isOpen, setIsOpen] = useState(false);
  const hoverTimeoutRef = useRef(null);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const options =
    languageOptions ||
    supportedLanguages ||
    availableLanguages ||
    (Array.isArray(languages)
      ? languages.map((code) => ({ code, label: code, nativeLabel: code }))
      : [
          { code: "EN", label: "English", nativeLabel: "English", flag: "🇬🇧" },
          { code: "IG", label: "Igbo", nativeLabel: "Igbo", flag: "🇳🇬" },
          { code: "HA", label: "Hausa", nativeLabel: "Hausa", flag: "🇳🇬" },
          { code: "YO", label: "Yoruba", nativeLabel: "Yorùbá", flag: "🇳🇬" },
        ]);

  const currentOption = options.find((opt) => {
    const code = opt.code || opt.value || opt;
    return code === language;
  });

  const currentFlag = currentOption?.flag || "🌐";
  const currentLabel =
    currentOption?.nativeLabel || currentOption?.label || language;

  const handleMouseEnter = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  useEffect(() => {
    function handleClickOutside(event) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);

      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  const handleLanguageChange = (nextLanguage) => {
    if (typeof changeLanguage === "function") {
      changeLanguage(nextLanguage);
    } else if (typeof setLanguage === "function") {
      setLanguage(nextLanguage);
    }

    setIsOpen(false);
  };

  return (
    <div
      className="language-switcher"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        ref={buttonRef}
        type="button"
        className={`language-switcher__button ${
          isOpen ? "language-switcher__button--active" : ""
        }`}
        onClick={() => setIsOpen((current) => !current)}
        aria-label={t("language.selectPlaceholder")}
        aria-expanded={isOpen}
      >
        <span className="language-switcher__flag">{currentFlag}</span>
        <span className="language-switcher__code">{currentLabel}</span>
        <svg
          className={`language-switcher__arrow ${
            isOpen ? "language-switcher__arrow--open" : ""
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={dropdownRef}
            className="language-switcher__dropdown"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {options.map((item) => {
              const code = item.code || item.value || item;
              const label = item.nativeLabel || item.label || item.name || code;
              const flag = item.flag || "🌐";

              return (
                <button
                  key={code}
                  type="button"
                  className={`language-switcher__option ${
                    language === code ? "language-switcher__option--active" : ""
                  }`}
                  onClick={() => handleLanguageChange(code)}
                >
                  <span className="language-switcher__option-flag">{flag}</span>
                  <span className="language-switcher__option-label">
                    {label}
                  </span>
                  <span className="language-switcher__option-code">{code}</span>

                  {language === code && (
                    <svg
                      className="language-switcher__check"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
