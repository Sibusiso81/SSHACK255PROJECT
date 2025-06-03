'use client';
import  { createContext, useContext } from "react";

export const LanguageContext = createContext<{language: string, setLanguage: (l: string) => void}>({
  language: "en",
  setLanguage: () => {},
});

export function useLanguage() {
  return useContext(LanguageContext);
}