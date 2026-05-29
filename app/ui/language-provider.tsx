"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  getDictionary,
  getPetCopy,
  getPreferredLanguage,
  languages,
  normalizeLanguage
} from "../../src/lib/i18n.js";

type LanguageContextValue = {
  language: string;
  setLanguage: (language: string) => void;
  dictionary: ReturnType<typeof getDictionary>;
  petCopy: typeof getPetCopy;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);
const languageStorageKey = "petdev-language";

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState("en");
  const normalized = normalizeLanguage(language);
  const dictionary = getDictionary(normalized);

  useEffect(() => {
    setLanguageState(getPreferredLanguage(readStoredLanguage(), getBrowserLanguages()));
  }, []);

  function setLanguage(nextLanguage: string) {
    const normalizedLanguage = normalizeLanguage(nextLanguage);
    setLanguageState(normalizedLanguage);
    writeStoredLanguage(normalizedLanguage);
  }

  const value = useMemo(
    () => ({
      language: normalized,
      setLanguage,
      dictionary,
      petCopy: getPetCopy
    }),
    [dictionary, normalized]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

function getBrowserLanguages() {
  const browserLanguages = navigator.languages?.length ? navigator.languages : [navigator.language];
  return Array.from(browserLanguages);
}

function readStoredLanguage() {
  try {
    return window.localStorage.getItem(languageStorageKey);
  } catch {
    return null;
  }
}

function writeStoredLanguage(language: string) {
  try {
    window.localStorage.setItem(languageStorageKey, language);
  } catch {
    // Ignore storage failures so the language toggle still works in restricted browsers.
  }
}

export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return value;
}

export function LanguageToggle() {
  const { dictionary, language, setLanguage } = useLanguage();

  return (
    <div className="languageToggle" aria-label={dictionary.common.languageToggleLabel}>
      {languages.map((item) => (
        <button
          aria-pressed={language === item.code}
          className={language === item.code ? "active" : ""}
          key={item.code}
          onClick={() => setLanguage(item.code)}
          type="button"
        >
          {item.shortLabel}
        </button>
      ))}
    </div>
  );
}
