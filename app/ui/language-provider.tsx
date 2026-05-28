"use client";

import { createContext, useContext, useMemo, useState } from "react";
import { getDictionary, getPetCopy, languages, normalizeLanguage } from "../../src/lib/i18n.js";

type LanguageContextValue = {
  language: string;
  setLanguage: (language: string) => void;
  dictionary: ReturnType<typeof getDictionary>;
  petCopy: typeof getPetCopy;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState("en");
  const normalized = normalizeLanguage(language);
  const dictionary = getDictionary(normalized);

  function setLanguage(nextLanguage: string) {
    setLanguageState(normalizeLanguage(nextLanguage));
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
