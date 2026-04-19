import type { SiteLanguage } from "../context/LanguageContext";

export function formatCurrency(amount: number | null | undefined, language: SiteLanguage) {
  if (amount === null || amount === undefined || Number.isNaN(amount)) {
    return "N/A";
  }

  return new Intl.NumberFormat(language === "Turkish" ? "tr-TR" : "en-US", {
    style: "currency",
    currency: "TRY",
    maximumFractionDigits: 0,
  }).format(amount);
}