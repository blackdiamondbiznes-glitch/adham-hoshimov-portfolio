/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { content, type Locale, type PortfolioContent } from "@/config/portfolio";

const STORAGE_KEY = "portfolio-lang";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  copy: PortfolioContent;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

function applyDocumentMeta(copy: PortfolioContent) {
  document.documentElement.lang = copy.locale;
  document.title = copy.seo.title;
  const pairs: Array<[string, string]> = [
    ['meta[name="description"]', copy.seo.description],
    ['meta[property="og:title"]', copy.seo.title],
    ['meta[property="og:description"]', copy.seo.description],
    ['meta[name="twitter:title"]', copy.seo.title],
    ['meta[name="twitter:description"]', copy.seo.description],
  ];
  for (const [selector, value] of pairs) {
    document.querySelector(selector)?.setAttribute("content", value);
  }
  document.querySelector('meta[name="twitter:creator"]')?.remove();
  document.querySelector('meta[name="twitter:site"]')?.remove();
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("uz");
  const copy = useMemo(() => content(locale), [locale]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "ru" || saved === "uz") setLocaleState(saved);
  }, []);

  useEffect(() => {
    applyDocumentMeta(copy);
  }, [copy]);

  function setLocale(next: Locale) {
    localStorage.setItem(STORAGE_KEY, next);
    setLocaleState(next);
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale, copy }}>{children}</LocaleContext.Provider>
  );
}

export function useContent() {
  const value = useContext(LocaleContext);
  if (!value) throw new Error("useContent LocaleProvider ichida ishlatiladi");
  return value;
}
