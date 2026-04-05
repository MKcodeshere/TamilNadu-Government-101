"use client";

import { ReactNode } from "react";
import { LanguageContext, useLanguageState } from "@/hooks/useLanguage";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const languageState = useLanguageState();
  return (
    <LanguageContext.Provider value={languageState}>
      {children}
    </LanguageContext.Provider>
  );
}
