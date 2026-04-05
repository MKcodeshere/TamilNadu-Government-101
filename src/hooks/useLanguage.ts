"use client";

import { createContext, useContext, useState, useCallback } from "react";
import type { Language, BilingualText } from "@/lib/types";

interface LanguageContextType {
  lang: Language;
  toggleLang: () => void;
  t: (text: BilingualText) => string;
}

export const LanguageContext = createContext<LanguageContextType>({
  lang: "en",
  toggleLang: () => {},
  t: (text: BilingualText) => text.en,
});

export function useLanguage() {
  return useContext(LanguageContext);
}

export function useLanguageState() {
  const [lang, setLang] = useState<Language>("en");
  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === "en" ? "ta" : "en"));
  }, []);
  const t = useCallback(
    (text: BilingualText) => text[lang] || text.en,
    [lang]
  );
  return { lang, toggleLang, t };
}
