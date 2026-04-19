import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

export type SiteLanguage = "English" | "Turkish";

interface LanguageContextValue {
  language: SiteLanguage;
  setLanguage: (language: SiteLanguage) => void;
  t: (text: string) => string;
}

const STORAGE_KEY = "united-hotels-language";

const TR_TRANSLATIONS: Record<string, string> = {
  Home: "Ana Sayfa",
  "Why Choose United Hotels": "Neden United Hotels",
  "Featured Hotels": "One Cikan Oteller",
  Quality: "Kalite",
  FAQ: "SSS",
  Login: "Giris",
  "Guest Portal": "Misafir Paneli",
  "Manage bookings": "Rezervasyonlari yonetin",
  "Admin Login": "Yonetici Girisi",
  "Staff access": "Personel erisimi",
  Destinations: "Destinasyonlar",
  Istanbul: "Istanbul",
  Antalya: "Antalya",
  Cappadocia: "Kapadokya",
  "Login / Guest Portal": "Giris / Misafir Paneli",
  Turkey: "Turkiye",
  "Turkey - Language": "Turkiye - Dil",
  English: "Ingilizce",
  Turkish: "Turkce",
  "Stay Smart. Stay United.": "Akilli Konakla. United ile Kal.",
  "Handpicked affordable hotels in the best neighborhoods of Turkey. Verified. Transparent. Local support.": "Turkiye'nin en iyi semtlerinde secilmis uygun fiyatli oteller. Dogrulandi. Seffaf. Yerel destek.",
  Destination: "Destinasyon",
  "Check-in": "Giris",
  "Check-out": "Cikis",
  Guests: "Misafir",
  "Find Hotels": "Otel Bul",
  "Where are you going?": "Nereye gidiyorsunuz?",
  "Select guests": "Misafir secin",
  "Search Hotels": "Otel Ara",
  "Number of guests": "Misafir sayisi",
  "1 guest": "1 misafir",
  "2 guests": "2 misafir",
  "3 guests": "3 misafir",
  "4+ guests": "4+ misafir",
  "Why Choose Us": "Neden Biz",
  "Not Another OTA.": "Siradan bir OTA degiliz.",
  "We specialize exclusively stays in Turkey. Here's how we're different.": "Sadece Turkiye konaklamalarina odaklaniyoruz. Farkimiz su:",
  "Personally Selected": "Ozenle Secildi",
  "Each hotel is handpicked by our local team": "Her otel yerel ekibimiz tarafindan ozenle secilir",
  "Better Direct Rates": "Daha Iyi Dogrudan Fiyatlar",
  "Negotiated prices you won't find elsewhere": "Baska yerde bulamayacaginiz anlasmali fiyatlar",
  "Total Price Upfront": "Toplam Fiyat Onceden",
  "No surprise fees at checkout": "Odeme sirasinda surpriz ucret yok",
  "WhatsApp Support": "WhatsApp Destegi",
  "Real people, instant responses": "Gercek insanlar, aninda cevap",
  "Flexible Cancellation": "Esnek Iptal",
  "Most hotels offer free cancellation": "Cogu otelde ucretsiz iptal var",
  "Happy Guests": "Mutlu Misafir",
  "Partner Hotels": "Is Ortagi Oteller",
  "Average Rating": "Ortalama Puan",
  "Trusted by travelers from over 40 countries": "40'tan fazla ulkeden gezginler bize guveniyor",
  "Turkey's Best-Kept Secrets": "Turkiye'nin En Iyi Gizli Noktalari",
  "Personally selected hotels combining authentic charm with modern comfort": "Otantik cekicilik ve modern konforu birlestiren ozenle secilmis oteller",
  "Explore All Hotels": "Tum Otelleri Kesfet",
  reviews: "yorum",
  "OTA Price": "OTA Fiyati",
  night: "gece",
  off: "indirim",
  "vs booking sites": "rezervasyon sitelerine gore",
  "View Rooms & Availability": "Odalar ve Musaitligi Gor",
  "Only 2 rooms left at this price": "Bu fiyattan sadece 2 oda kaldi",
  "Free cancellation until 48h before": "48 saat oncesine kadar ucretsiz iptal",
  "Booked 12 times in the last 24 hours": "Son 24 saatte 12 kez rezerve edildi",
  "Best Seller": "Cok Satan",
  "Top Rated": "En Yuksek Puan",
  "Explore Neighborhoods": "Semtleri Kesfet",
  "Where to Stay in Turkey": "Turkiye'de Nerede Kalinir",
  "Each neighborhood offers its own character. We'll help you find the perfect match.": "Her semtin kendine ozgu bir karakteri var. Size en uygun secimi bulmaniza yardimci oluyoruz.",
  Hotels: "Oteller",
  "Avg/night": "Ort/gece",
  Rating: "Puan",
  "Historical Sites": "Tarihi Yerler",
  Bosphorus: "Bogaz",
  "Cultural Hub": "Kultur Merkezi",
  "Beach Resorts": "Sahil Resortlari",
  "Ancient Ruins": "Antik Kalintilar",
  "Water Sports": "Su Sporlari",
  "Hot Air Balloons": "Balon Turlari",
  "Cave Hotels": "Magara Otelleri",
  "UNESCO Site": "UNESCO Alani",
  "Most Popular": "En Populer",
  "Unique Experience": "Esiz Deneyim",
  "Explore Istanbul": "Istanbul'u Kesfet",
  "Explore Antalya": "Antalya'yi Kesfet",
  "Explore Cappadocia": "Kapadokya'yi Kesfet",
  "Not sure which area is right for you?": "Hangi bolgenin size uygun oldugundan emin degil misiniz?",
  "View All Neighborhoods": "Tum Semtleri Gor",
  "Quality Guarantee": "Kalite Garantisi",
  "Every Hotel,": "Her Otel,",
  "Personally Vetted": "Bizzat Denetlendi",
  "Unlike booking platforms that list anyone who pays, we physically inspect every property. No fake photos, no surprise disappointments.": "Ucret odeyen herkesi listeleyen platformlardan farkli olarak her tesisi yerinde denetliyoruz. Sahte foto yok, surpriz hayal kirikligi yok.",
  "In-Person Verification": "Yerinde Dogrulama",
  "Our team visits every hotel before listing to ensure standards": "Ekibimiz standartlari dogrulamak icin listeleme oncesi her oteli ziyaret eder",
  "Location Reality Check": "Konum Dogrulama",
  "We verify walking times, neighborhood safety, and public transport access": "Yurume surelerini, semt guvenligini ve toplu tasima erisimini dogrulariz",
  "Cleanliness Audit": "Temizlik Denetimi",
  "Unannounced inspections to maintain hygiene standards year-round": "Hijyen standartlarini korumak icin habersiz denetimler yapilir",
  "Safety Standards": "Guvenlik Standartlari",
  "Fire safety, security, and emergency procedures are verified": "Yangin guvenligi, guvenlik ve acil durum prosedurleri dogrulanir",
  "Price Transparency": "Fiyat Seffafligi",
  "No hidden fees. What you see is what you pay at checkout": "Gizli ucret yok. Gordugunuz tutari odersiniz",
  "Guest Review Analysis": "Misafir Yorum Analizi",
  "We investigate complaints and delist properties with recurring issues": "Sikayetleri inceler, tekrarlayan sorunlu tesisleri listeden cikaririz",
  "Verified Hotels": "Dogrulanmis Oteller",
  "Every property undergoes rigorous on-site inspection before listing": "Her tesis listelenmeden once detayli yerinde denetimden gecer",
  Certified: "Sertifikali",
  "Our Promise to You": "Size Sozumuz",
  "If a hotel doesn't match our listing description, we'll relocate you to a better property at our expense.": "Bir otel ilandaki aciklamayla uyusmazsa, sizi masrafi bize ait daha iyi bir tesise tasiriz.",
  "United Hotels in Turkey —Affordable Stays in Prime Locations": "Turkiye'de United Hotels — Merkezi Konumlarda Uygun Konaklama",
  "Finding quality accommodation in Turkey doesn't mean compromising on comfort or location. At United Hotels, we've personally inspected and selected the best affordable hotels across Turkey's most popular neighborhoods.": "Turkiye'de kaliteli konaklama bulmak konfor veya konumdan vazgecmek demek degildir. United Hotels olarak Turkiye'nin en populer semtlerindeki en iyi uygun fiyatli otelleri bizzat denetleyip seciyoruz.",
  Neighborhoods: "Semtler",
  "Starting Price": "Baslangic Fiyati",
  "Local Expertise": "Yerel Uzmanlik",
  "Our Turkey-based team personally visits every property to ensure quality standards": "Turkiye merkezli ekibimiz kalite standartlari icin her tesisi bizzat ziyaret eder",
  "Direct Rates": "Dogrudan Fiyatlar",
  "Better prices through exclusive hotel partnerships—no middleman markups": "Ozel otel ortakliklariyla daha iyi fiyatlar, araci komisyonu yok",
  "Total Transparency": "Tam Seffaflik",
  "What you see is what you pay—no hidden fees, no surprises at checkout": "Gordugunuz fiyat odediginiz fiyattir, gizli ucret veya surpriz yok",
  "24/7 Support": "7/24 Destek",
  "WhatsApp assistance from our local team whenever you need help": "Yardima ihtiyaciniz oldugunda yerel ekibimizden WhatsApp destegi",
  "Perfect for Every Traveler": "Her Gezgin Icin Uygun",
  "Whether you're planning a weekend getaway or extended cultural exploration, our curated selection puts you in Turkey's best neighborhoods without breaking the bank.": "Hafta sonu kacamagi ya da uzun kultur gezisi planliyor olun, secili portfoyumuz sizi butcenizi asmadan Turkiye'nin en iyi semtlerine goturur.",
  "With free cancellation on most bookings and local support, you can book with confidence knowing you're getting authentic value, not inflated OTA prices.": "Cogu rezervasyonda ucretsiz iptal ve yerel destekle, sisirilmis OTA fiyatlari yerine gercek deger aldiginizi bilerek guvenle rezervasyon yapabilirsiniz.",
  "Your Booking Benefits": "Rezervasyon Avantajlariniz",
  "Free cancellation on most bookings": "Cogu rezervasyonda ucretsiz iptal",
  "Best price guarantee": "En iyi fiyat garantisi",
  "Instant booking confirmation": "Aninda rezervasyon onayi",
  "No booking fees": "Rezervasyon ucreti yok",
  "Instant confirmation • Secure payment • 24/7 support": "Aninda onay • Guvenli odeme • 7/24 destek",
  "Join 1,200+ travelers who chose direct booking": "Dogrudan rezervasyonu secen 1.200+ gezgine katilin",
  "Verified Reviews": "Dogrulanmis Yorumlar",
  "Secure & Protected": "Guvenli ve Korumali",
  "Frequently Asked Questions": "Sikca Sorulan Sorular",
  "Everything you need to know about hotels in Turkey": "Turkiye'deki oteller hakkinda bilmeniz gereken her sey",
  "What is the average price of hotels in Turkey?": "Turkiye'deki otellerin ortalama fiyati nedir?",
  "Our hotels in Turkey range from $32 to $75 per night, with most properties averaging around $45-50 per night. Prices vary by neighborhood and season.": "Turkiye'deki otellerimiz gecelik 32$ ile 75$ arasindadir; cogu tesisin ortalamasi 45-50$ civarindadir. Fiyatlar semte ve sezona gore degisir.",
  "Are hotels in Turkey safe?": "Turkiye'deki oteller guvenli mi?",
  "Yes, all hotels on our platform are personally inspected by our local team. We verify security measures, location safety, and guest reviews before listing any property.": "Evet, platformumuzdaki tum oteller yerel ekibimiz tarafindan bizzat denetlenir. Listeleme oncesinde guvenlik onlemleri, konum guvenligi ve misafir yorumlari dogrulanir.",
  "When is the best time to visit Turkey?": "Turkiye'yi ziyaret etmek icin en iyi zaman ne zaman?",
  "April-May and September-October offer the best weather and moderate prices. Winter (November-March) offers the lowest rates but cooler weather.": "Nisan-Mayis ve Eylul-Ekim en iyi hava ve orta fiyatlar sunar. Kis donemi (Kasim-Mart) daha dusuk fiyatlar sunar ancak hava daha serindir.",
  "Ready to Book Your Turkey Stay?": "Turkiye Konaklamanizi Rezerve Etmeye Hazir misiniz?",
  "Join thousands of travelers who chose direct booking and saved money": "Dogrudan rezervasyonla tasarruf eden binlerce gezgine katilin",
  "Find Hotels in Turkey Now": "Turkiye'de Otel Bul",
  "Free cancellation": "Ucretsiz iptal",
  "No hidden fees": "Gizli ucret yok",
  "Local support 24/7": "7/24 yerel destek",
  "Quick Links": "Hizli Baglantilar",
  "My Bookings": "Rezervasyonlarim",
  "Contact Us": "Bize Ulasin",
  "All rights reserved.": "Tum haklari saklidir.",
  "Privacy Policy": "Gizlilik Politikasi",
  "Terms of Service": "Kullanim Kosullari",
  Support: "Destek",
  "Turkey's hotel experts. Direct rates, transparent pricing, local support.": "Turkiye'nin otel uzmanlari. Dogrudan fiyatlar, seffaf fiyatlandirma, yerel destek."
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

function translateText(text: string, language: SiteLanguage) {
  if (language === "English") {
    return text;
  }

  return TR_TRANSLATIONS[text] ?? text;
}

async function translateWithApi(text: string, language: SiteLanguage): Promise<string | null> {
  if (language === "English") return text;

  try {
    const endpoint = import.meta.env.VITE_TRANSLATE_API_URL || "https://api.mymemory.translated.net/get";
    const url = `${endpoint}?q=${encodeURIComponent(text)}&langpair=en|tr`;
    const response = await fetch(url);
    if (!response.ok) return null;
    const data = await response.json();
    const translated = data?.responseData?.translatedText;
    if (typeof translated === "string" && translated.trim()) {
      return translated.trim();
    }
  } catch {
    return null;
  }

  return null;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<SiteLanguage>(() => {
    if (typeof window === "undefined") {
      return "English";
    }

    const saved = window.localStorage.getItem(STORAGE_KEY);
    return saved === "Turkish" ? "Turkish" : "English";
  });
  const [runtimeTranslations, setRuntimeTranslations] = useState<Record<string, string>>({});
  const pendingTranslations = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, language);
    }

    document.documentElement.lang = language === "Turkish" ? "tr" : "en";
  }, [language]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      t: (text: string) => {
        const staticTranslated = translateText(text, language);
        if (staticTranslated !== text || language === "English") {
          return staticTranslated;
        }

        const cacheKey = `${language}::${text}`;
        const cached = runtimeTranslations[cacheKey];
        if (cached) return cached;

        if (!pendingTranslations.current.has(cacheKey)) {
          pendingTranslations.current.add(cacheKey);
          void translateWithApi(text, language)
            .then((translated) => {
              if (translated && translated !== text) {
                setRuntimeTranslations((prev) => ({ ...prev, [cacheKey]: translated }));
              }
            })
            .finally(() => {
              pendingTranslations.current.delete(cacheKey);
            });
        }

        return text;
      },
    }),
    [language, runtimeTranslations],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }

  return context;
}
