import { type CSSProperties, type ReactNode, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import { ValuePropositionSection } from "../components/ValuePropositionSection";
import { FeaturedHotelsSection } from "../components/FeaturedHotelsSection";
import { QualityAssuranceSection } from "../components/QualityAssuranceSection";
import { DestinationsSection } from "../components/DestinationsSection";
import { SEOContentSection } from "../components/SEOContentSection";
import { useScrollReveal } from "../hooks/useScrollReveal";
import { useLanguage } from "../context/LanguageContext";
import imgRectangle10 from "figma:asset/2e73560823491cb7aae2b44b94830399bada8384.png";
import {
  MapPin,
  Calendar,
  Users,
  Search,
  Check,
  ChevronDown,
} from "lucide-react";

interface RevealSectionProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

function RevealSection({ children, delay = 0, className = "" }: RevealSectionProps) {
  const revealRef = useScrollReveal<HTMLDivElement>();

  return (
    <div
      ref={revealRef}
      className={`reveal ${className}`.trim()}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  );
}

// Enhanced Hero Section with functional search
function HeroSection() {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const [searchData, setSearchData] = useState({
    destination: "",
    checkIn: "",
    checkOut: "",
    guests: "",
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Navigate to listing page with search params
    navigate("/listing");
  };

  return (
    <div
      id="home"
      className="relative min-h-[600px] md:h-[827px] overflow-hidden"
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          alt="Turkey cityscape with mosques and Bosphorus"
          className="absolute h-full w-full object-cover"
          src={imgRectangle10}
        />
        <div className="absolute inset-0 bg-black/20" />
        <div className="hero-aurora" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col">
        {/* Centered Hero Text */}
        <div className="flex-1 flex items-center justify-center px-4 md:px-10 pt-24 md:pt-0">
          <div className="text-center max-w-[1057px]">
            <h1 className="font-['Poppins:Bold',sans-serif] text-[36px] md:text-[64px] leading-[44px] md:leading-[72px] text-[#fafafa] mb-4 md:mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              {t("Stay Smart. Stay United.")}
            </h1>
            <p className="font-['Inter:Regular',sans-serif] text-[16px] md:text-[20px] leading-[24px] md:leading-[28.8px] text-[#fafafa] max-w-[737px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
              {t(
                "Handpicked affordable hotels in the best neighborhoods of Turkey. Verified. Transparent. Local support.",
              )}
            </p>
          </div>
        </div>

        {/* Search Form Card - Mobile Optimized */}
        <div className="px-4 md:px-10 pb-6 md:pb-20">
          <div className="max-w-[1840px] mx-auto">
            <form
              onSubmit={handleSearch}
              className="bg-white/96 backdrop-blur-sm rounded-xl md:rounded-xl shadow-[0px_18px_45px_0px_rgba(0,0,0,0.18)] border border-[#1abc9c] p-4 md:p-10 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-200 max-w-full overflow-hidden"
            >
              {/* Desktop Layout */}
              <div className="hidden md:flex items-end gap-12">
                {/* Destination */}
                <div className="flex-1 flex flex-col gap-2">
                  <label
                    htmlFor="destination"
                    className="font-['Inter:Medium',sans-serif] text-[14px] text-[#3b3b3b]"
                  >
                    {t("Destination")}
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#8c8c8c] pointer-events-none" />
                    <input
                      id="destination"
                      type="text"
                      value={searchData.destination}
                      onChange={(e) =>
                        setSearchData({
                          ...searchData,
                          destination: e.target.value,
                        })
                      }
                      className="w-full h-[49px] pl-10 pr-4 bg-[#fafafa] border border-[#eaeaea] rounded-lg font-['Inter:Regular',sans-serif] text-[16px] text-[#0a0a0a] focus:outline-none focus:border-[#1abc9c] focus:ring-2 focus:ring-[#1abc9c]/20 transition-all"
                    />
                  </div>
                </div>

                {/* Check-in */}
                <div className="flex-1 flex flex-col gap-2">
                  <label
                    htmlFor="checkIn"
                    className="font-['Inter:Medium',sans-serif] text-[14px] text-[#3b3b3b]"
                  >
                    {t("Check-in")}
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#8c8c8c] pointer-events-none" />
                    <input
                      id="checkIn"
                      type="date"
                      value={searchData.checkIn}
                      onChange={(e) =>
                        setSearchData({
                          ...searchData,
                          checkIn: e.target.value,
                        })
                      }
                      min={new Date().toISOString().split("T")[0]}
                      placeholder="Select date"
                      className="w-full h-[49px] pl-10 pr-3 border border-[#eaeaea] rounded-lg font-['Inter:Regular',sans-serif] text-[16px] text-[rgba(10,10,10,0.5)] focus:outline-none focus:border-[#1abc9c] focus:ring-2 focus:ring-[#1abc9c]/20 transition-all"
                    />
                  </div>
                </div>

                {/* Check-out */}
                <div className="flex-1 flex flex-col gap-2">
                  <label
                    htmlFor="checkOut"
                    className="font-['Inter:Medium',sans-serif] text-[14px] text-[#3b3b3b]"
                  >
                    {t("Check-out")}
                  </label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#8c8c8c] pointer-events-none" />
                    <input
                      id="checkOut"
                      type="date"
                      value={searchData.checkOut}
                      onChange={(e) =>
                        setSearchData({
                          ...searchData,
                          checkOut: e.target.value,
                        })
                      }
                      min={
                        searchData.checkIn ||
                        new Date().toISOString().split("T")[0]
                      }
                      placeholder="Select date"
                      className="w-full h-[49px] pl-10 pr-3 border border-[#eaeaea] rounded-lg font-['Inter:Regular',sans-serif] text-[16px] text-[rgba(10,10,10,0.5)] focus:outline-none focus:border-[#1abc9c] focus:ring-2 focus:ring-[#1abc9c]/20 transition-all"
                    />
                  </div>
                </div>

                {/* Guests */}
                <div className="flex-1 flex flex-col gap-2">
                  <label
                    htmlFor="guests"
                    className="font-['Inter:Medium',sans-serif] text-[14px] text-[#3b3b3b]"
                  >
                    {t("Guests")}
                  </label>
                  <div className="relative">
                    <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-[#8c8c8c] pointer-events-none" />
                    <select
                      id="guests"
                      value={searchData.guests}
                      onChange={(e) =>
                        setSearchData({ ...searchData, guests: e.target.value })
                      }
                      className="w-full h-[50px] pl-10 pr-4 border border-[#eaeaea] rounded-lg font-['Inter:Regular',sans-serif] text-[16px] text-[rgba(10,10,10,0.5)] focus:outline-none focus:border-[#1abc9c] focus:ring-2 focus:ring-[#1abc9c]/20 transition-all appearance-none bg-white"
                    >
                      <option value="">{t("Number of guests")}</option>
                      <option value="1">{t("1 guest")}</option>
                      <option value="2">{t("2 guests")}</option>
                      <option value="3">{t("3 guests")}</option>
                      <option value="4">{t("4+ guests")}</option>
                    </select>
                  </div>
                </div>

                {/* Search Button */}
                <button
                  type="submit"
                  className="bg-[#1abc9c] text-white px-8 h-[50px] rounded-lg hover:bg-[#16a085] transition-all hover:shadow-lg font-['Inter:SemiBold',sans-serif] text-[16px] flex items-center justify-center gap-2 shrink-0"
                >
                  <Search className="w-5 h-5" />
                  {t("Find Hotels")}
                </button>
              </div>

              {/* Mobile Layout - Stacked */}
              <div className="flex md:hidden flex-col gap-4 max-w-full">
                {/* Destination */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="destination-mobile"
                    className="font-['Inter:SemiBold',sans-serif] text-[13px] text-[#3b3b3b]"
                  >
                    {t("Where are you going?")}
                  </label>
                  <div className="relative">
                    <MapPin
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1abc9c]"
                      strokeWidth={2}
                    />
                    <input
                      id="destination-mobile"
                      type="text"
                      value={searchData.destination}
                      onChange={(e) =>
                        setSearchData({
                          ...searchData,
                          destination: e.target.value,
                        })
                      }
                      className="w-full h-[52px] pl-12 pr-4 bg-[#fafafa] border-2 border-[#eaeaea] rounded-xl font-['Inter:Regular',sans-serif] text-[15px] text-[#0a0a0a] focus:outline-none focus:border-[#1abc9c] focus:bg-white transition-all"
                      placeholder="Turkey"
                    />
                  </div>
                </div>

                {/* Check-in & Check-out - Stacked on mobile */}
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="checkIn-mobile"
                      className="font-['Inter:SemiBold',sans-serif] text-[13px] text-[#3b3b3b]"
                    >
                      {t("Check-in")}
                    </label>
                    <div className="relative">
                      <Calendar
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1abc9c]"
                        strokeWidth={2}
                      />
                      <input
                        id="checkIn-mobile"
                        type="date"
                        value={searchData.checkIn}
                        onChange={(e) =>
                          setSearchData({
                            ...searchData,
                            checkIn: e.target.value,
                          })
                        }
                        min={new Date().toISOString().split("T")[0]}
                        className="w-full max-w-full h-[52px] pl-10 pr-3 border-2 border-[#eaeaea] rounded-xl font-['Inter:Regular',sans-serif] text-[14px] text-[#0a0a0a] focus:outline-none focus:border-[#1abc9c] focus:bg-white transition-all box-border"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="checkOut-mobile"
                      className="font-['Inter:SemiBold',sans-serif] text-[13px] text-[#3b3b3b]"
                    >
                      {t("Check-out")}
                    </label>
                    <div className="relative">
                      <Calendar
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1abc9c]"
                        strokeWidth={2}
                      />
                      <input
                        id="checkOut-mobile"
                        type="date"
                        value={searchData.checkOut}
                        onChange={(e) =>
                          setSearchData({
                            ...searchData,
                            checkOut: e.target.value,
                          })
                        }
                        min={
                          searchData.checkIn ||
                          new Date().toISOString().split("T")[0]
                        }
                        className="w-full max-w-full h-[52px] pl-10 pr-3 border-2 border-[#eaeaea] rounded-xl font-['Inter:Regular',sans-serif] text-[14px] text-[#0a0a0a] focus:outline-none focus:border-[#1abc9c] focus:bg-white transition-all box-border"
                      />
                    </div>
                  </div>
                </div>

                {/* Guests */}
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="guests-mobile"
                    className="font-['Inter:SemiBold',sans-serif] text-[13px] text-[#3b3b3b]"
                  >
                    {t("Guests")}
                  </label>
                  <div className="relative">
                    <Users
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#1abc9c]"
                      strokeWidth={2}
                    />
                    <select
                      id="guests-mobile"
                      value={searchData.guests}
                      onChange={(e) =>
                        setSearchData({ ...searchData, guests: e.target.value })
                      }
                      className="w-full h-[52px] pl-12 pr-4 border-2 border-[#eaeaea] rounded-xl font-['Inter:Regular',sans-serif] text-[15px] text-[#3b3b3b] focus:outline-none focus:border-[#1abc9c] focus:bg-white transition-all appearance-none bg-white"
                    >
                      <option value="">{t("Select guests")}</option>
                      <option value="1">{t("1 guest")}</option>
                      <option value="2">{t("2 guests")}</option>
                      <option value="3">{t("3 guests")}</option>
                      <option value="4">{t("4+ guests")}</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8c8c8c] pointer-events-none" />
                  </div>
                </div>

                {/* Search Button - Full Width */}
                <button
                  type="submit"
                  className="w-full bg-[#1abc9c] text-white h-[52px] rounded-xl hover:bg-[#16a085] active:scale-[0.98] transition-all shadow-lg hover:shadow-xl font-['Inter:Bold',sans-serif] text-[16px] flex items-center justify-center gap-3 mt-2"
                >
                  <Search className="w-5 h-5" strokeWidth={2.5} />
                  {t("Search Hotels")}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// Trust Building Section
function TrustBuildingSection() {
  return <QualityAssuranceSection />;
}

// Destination Discovery Section
function DestinationDiscoverySection() {
  return <DestinationsSection />;
}

// FAQ Section
function FAQSection() {
  const { t } = useLanguage();
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const faqs = [
    {
      question: "What is the average price of hotels in Turkey?",
      answer:
        "Our hotels in Turkey range from $32 to $75 per night, with most properties averaging around $45-50 per night. Prices vary by neighborhood and season.",
    },
    {
      question: "Are hotels in Turkey safe?",
      answer:
        "Yes, all hotels on our platform are personally inspected by our local team. We verify security measures, location safety, and guest reviews before listing any property.",
    },
    {
      question: "When is the best time to visit Turkey?",
      answer:
        "April-May and September-October offer the best weather and moderate prices. Winter (November-March) offers the lowest rates but cooler weather.",
    },
  ];

  return (
    <section id="faqs" className="py-24 bg-[#fafafa]">
      <div className="max-w-[744px] mx-auto px-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="font-['Poppins:Bold',sans-serif] text-[48px] leading-[60px] text-[#3b3b3b] mb-4">
            {t("Frequently Asked Questions")}
          </h2>
          <p className="font-['Inter:Regular',sans-serif] text-[18px] text-[#6b7280]">
            {t("Everything you need to know about hotels in Turkey")}
          </p>
        </div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white border border-[#eaeaea] rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <span className="font-['Poppins:SemiBold',sans-serif] text-[16px] text-[#3b3b3b]">
                  {t(faq.question)}
                </span>
                <ChevronDown
                  className={`w-5 h-5 text-[#1abc9c] transition-transform ${
                    openIndex === index ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-5">
                  <p className="font-['Inter:Regular',sans-serif] text-[15px] text-[#6b7280] leading-[24px]">
                    {t(faq.answer)}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// CTA Section
function CTASection() {
  const { t } = useLanguage();
  return (
    <section className="relative py-20 md:py-32 bg-[#1abc9c] overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-[920px] mx-auto px-4 md:px-10 text-center">
        <h2 className="font-['Poppins:Bold',sans-serif] text-[36px] md:text-[56px] leading-[48px] md:leading-[68px] text-white mb-6 animate-[soft-rise_700ms_ease-out]">
          {t("Ready to Book Your Turkey Stay?")}
        </h2>
        <p className="font-['Inter:Regular',sans-serif] text-[18px] md:text-[22px] text-white/95 mb-10 animate-[soft-rise_700ms_ease-out] [animation-delay:120ms] [animation-fill-mode:both]">
          {t("Join thousands of travelers who chose direct booking and saved money")}
        </p>

        <Link
          to="/listing"
          className="glossy-cta bg-white text-[#1abc9c] px-8 md:px-10 py-4 md:py-5 rounded-xl hover:shadow-2xl transition-all font-['Inter:Bold',sans-serif] text-[16px] md:text-[18px] inline-flex items-center gap-3"
        >
          <Search className="w-6 h-6" />
          {t("Find Hotels in Turkey Now")}
        </Link>

        {/* Trust Indicators */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-12 mt-12 text-white animate-[soft-rise_700ms_ease-out] [animation-delay:220ms] [animation-fill-mode:both]">
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5" />
            <span className="text-[15px]">{t("Free cancellation")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5" />
            <span className="text-[15px]">{t("No hidden fees")}</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-5 h-5" />
            <span className="text-[15px]">{t("Local support 24/7")}</span>
          </div>
        </div>
      </div>
    </section>
  );
}

// Main HomePage Component
export default function HomePage() {
  return (
    <div className="bg-[#fafafa] min-h-screen">
      <Navigation />
      <HeroSection />
      <RevealSection className="section-shell" delay={30}>
        <ValuePropositionSection />
      </RevealSection>
      <RevealSection className="section-shell" delay={60}>
        <FeaturedHotelsSection />
      </RevealSection>
      <RevealSection className="section-shell" delay={90}>
        <TrustBuildingSection />
      </RevealSection>
      <RevealSection className="section-shell" delay={120}>
        <DestinationDiscoverySection />
      </RevealSection>
      <RevealSection className="section-shell" delay={150}>
        <SEOContentSection />
      </RevealSection>
      <RevealSection className="section-shell" delay={180}>
        <FAQSection />
      </RevealSection>
      <RevealSection className="section-shell" delay={210}>
        <CTASection />
      </RevealSection>
      <Footer />
    </div>
  );
}
