"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { en } from "@/dictionaries/en"
import { bn } from "@/dictionaries/bn"

type Language = "en" | "bn"
type Translations = typeof en

type I18nContextType = {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: keyof Translations) => string
}

const I18nContext = createContext<I18nContextType | undefined>(undefined)

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")
  const [translations, setTranslations] = useState<Translations>(en)

  useEffect(() => {
    // Load saved language preference from localStorage
    const savedLanguage = localStorage.getItem("ms-furniture-language") as Language | null
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "bn")) {
      setLanguage(savedLanguage)
    } else {
      // Try to detect browser language
      const browserLang = navigator.language.split("-")[0]
      if (browserLang === "bn") {
        setLanguage("bn")
      }
    }
  }, [])

  useEffect(() => {
    // Update translations when language changes
    setTranslations(language === "en" ? en : bn)

    // Save language preference
    localStorage.setItem("ms-furniture-language", language)

    // Update html lang attribute
    document.documentElement.lang = language
  }, [language])

  // Translation function
  const t = (key: keyof Translations): string => {
    return translations[key] || String(key)
  }

  return <I18nContext.Provider value={{ language, setLanguage, t }}>{children}</I18nContext.Provider>
}

export function useTranslation() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error("useTranslation must be used within an I18nProvider")
  }
  return context
}
