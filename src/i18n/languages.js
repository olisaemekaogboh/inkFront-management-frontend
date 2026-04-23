export const LANGUAGE_CODES = {
  EN: "EN",
  IG: "IG",
  HA: "HA",
  YO: "YO",
};

export const SUPPORTED_LANGUAGES = [
  { code: LANGUAGE_CODES.EN, label: "English", nativeLabel: "English" },
  { code: LANGUAGE_CODES.IG, label: "Igbo", nativeLabel: "Igbo" },
  { code: LANGUAGE_CODES.HA, label: "Hausa", nativeLabel: "Hausa" },
  { code: LANGUAGE_CODES.YO, label: "Yoruba", nativeLabel: "Yorùbá" },
];

export const DEFAULT_LANGUAGE = LANGUAGE_CODES.EN;
export const LANGUAGE_STORAGE_KEY = "agency_platform_language";
