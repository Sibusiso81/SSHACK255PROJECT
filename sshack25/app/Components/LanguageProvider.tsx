'use client'
import React, { useState } from "react";
import { LanguageContext } from "./useLanguage";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState("English");
  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}