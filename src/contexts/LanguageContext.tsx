import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { UILanguage } from "../types/prayer";

interface LanguageContextValue {
  uiLanguage: UILanguage;
  setUILanguage: (lang: UILanguage) => void;
}

const LanguageContext = createContext<LanguageContextValue>({
  uiLanguage: "english",
  setUILanguage: () => {},
});

const STORAGE_KEY = "qp-ui-language";

/** Map navigator.language prefixes to our UILanguage keys */
function detectBrowserLanguage(): UILanguage {
  const nav = navigator.language?.toLowerCase() ?? "";
  if (nav.startsWith("ur")) return "urdu";
  if (nav.startsWith("hi")) return "hindi";
  return "english";
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [uiLanguage, setUILanguageState] = useState<UILanguage>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "english" || stored === "urdu" || stored === "hindi") {
        return stored;
      }
    } catch {
      // localStorage unavailable
    }
    return detectBrowserLanguage();
  });

  const setUILanguage = (lang: UILanguage) => {
    setUILanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      // localStorage unavailable
    }
  };

  // Update html lang attribute when language changes
  useEffect(() => {
    const langCode =
      uiLanguage === "urdu" ? "ur" : uiLanguage === "hindi" ? "hi" : "en";
    document.documentElement.lang = langCode;
  }, [uiLanguage]);

  return (
    <LanguageContext.Provider value={{ uiLanguage, setUILanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useUILanguage() {
  return useContext(LanguageContext);
}
