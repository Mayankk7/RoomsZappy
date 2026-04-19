import { useState } from "react";
import { Link } from "react-router";
import svgPaths from "../../imports/svg-nkrjt6kvoj";
import { ChevronDown, Globe, User, Menu, X, Check } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export function Navigation() {
  const [isDestinationsOpen, setIsDestinationsOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isLanguageOpen, setIsLanguageOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  return (
    <nav className="bg-white/95 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-[1840px] mx-auto px-4 md:px-10">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          >
            <div className="h-[22px] w-[24px] md:h-[26px] md:w-[28px]">
              <svg
                className="block size-full"
                fill="none"
                preserveAspectRatio="none"
                viewBox="0 0 28 26"
              >
                <mask fill="white" id="path-1-inside-1_20_512">
                  <path d={svgPaths.p32095b00} />
                </mask>
                <path
                  d={svgPaths.p32095b00}
                  fill="#1ABC9C"
                  mask="url(#path-1-inside-1_20_512)"
                  stroke="#1ABC9C"
                  strokeWidth="0.4"
                />
              </svg>
            </div>
            <span className="font-['Poppins:SemiBold',sans-serif] text-[17px] md:text-[20px] text-[#1abc9c]">
              United Hotels
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            <a
              href="/#home"
              className="text-[#3b3b3b] hover:text-[#1abc9c] transition-colors font-['Inter:Medium',sans-serif] text-[15px] min-h-[44px] flex items-center"
            >
              {t("Home")}
            </a>
            <a
              href="/#why-choose-united-hotels"
              className="text-[#3b3b3b] hover:text-[#1abc9c] transition-colors font-['Inter:Medium',sans-serif] text-[15px] min-h-[44px] flex items-center"
            >
              {t("Why Choose United Hotels")}
            </a>
            <a
              href="/#featured-hotels"
              className="text-[#3b3b3b] hover:text-[#1abc9c] transition-colors font-['Inter:Medium',sans-serif] text-[15px] min-h-[44px] flex items-center"
            >
              {t("Featured Hotels")}
            </a>
            <a
              href="/#quality"
              className="text-[#3b3b3b] hover:text-[#1abc9c] transition-colors font-['Inter:Medium',sans-serif] text-[15px] min-h-[44px] flex items-center"
            >
              {t("Quality")}
            </a>
            <a
              href="/#faqs"
              className="text-[#3b3b3b] hover:text-[#1abc9c] transition-colors font-['Inter:Medium',sans-serif] text-[15px] min-h-[44px] flex items-center"
            >
              {t("FAQ")}
            </a>
          </div>

          {/* Desktop Right Actions */}
          <div className="hidden lg:flex items-center gap-6">
            <div className="relative">
              <button
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                className="flex items-center gap-2 text-[#3b3b3b] hover:text-[#1abc9c] transition-colors min-h-[44px] px-4 rounded-lg hover:bg-gray-50"
                aria-expanded={isLanguageOpen}
                aria-haspopup="true"
                aria-label="Change language"
              >
                <Globe className="w-4 h-4" />
                <span className="text-[14px] font-['Inter:Medium',sans-serif]">
                  {language === "English" ? "English" : "Turkish"}
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>

              {isLanguageOpen && (
                <div className="absolute top-full right-0 pt-2 w-52" role="menu">
                  <div className="bg-white rounded-lg shadow-lg border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <button
                      onClick={() => {
                        setLanguage("English");
                        setIsLanguageOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-4 py-2.5 text-[#3b3b3b] hover:bg-gray-50 text-[14px] font-['Inter:Medium',sans-serif]"
                      role="menuitem"
                    >
                      <span>{t("English")}</span>
                      {language === "English" && <Check className="w-4 h-4 text-[#1abc9c]" />}
                    </button>
                    <button
                      onClick={() => {
                        setLanguage("Turkish");
                        setIsLanguageOpen(false);
                      }}
                      className="w-full flex items-center justify-between px-4 py-2.5 text-[#3b3b3b] hover:bg-gray-50 text-[14px] font-['Inter:Medium',sans-serif]"
                      role="menuitem"
                    >
                      <span>{t("Turkish")}</span>
                      {language === "Turkish" && <Check className="w-4 h-4 text-[#1abc9c]" />}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Login Button with Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsLoginOpen(!isLoginOpen)}
                className="flex items-center gap-2 text-[#3b3b3b] hover:text-[#1abc9c] transition-colors min-h-[44px] px-4 rounded-lg hover:bg-gray-50"
                aria-expanded={isLoginOpen}
                aria-haspopup="true"
              >
                <User className="w-4 h-4" />
                <span className="text-[14px] font-['Inter:Medium',sans-serif]">
                  {t("Login")}
                </span>
                <ChevronDown className="w-4 h-4" />
              </button>
              {isLoginOpen && (
                <div
                  className="absolute top-full right-0 pt-2 w-56"
                  role="menu"
                >
                  <div className="bg-white rounded-lg shadow-lg border border-gray-100 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                    <Link
                      to="/portal"
                      className="px-4 py-3 text-[#3b3b3b] hover:bg-gray-50 text-[14px] min-h-[44px] flex flex-col justify-center border-b border-gray-100"
                      role="menuitem"
                    >
                      <div className="font-['Inter:SemiBold',sans-serif]">
                        {t("Guest Portal")}
                      </div>
                      <div className="text-[12px] text-[#8c8c8c]">
                        {t("Manage bookings")}
                      </div>
                    </Link>
                    <Link
                      to="/admin/login"
                      className="px-4 py-3 text-[#3b3b3b] hover:bg-gray-50 text-[14px] min-h-[44px] flex flex-col justify-center"
                      role="menuitem"
                    >
                      <div className="font-['Inter:SemiBold',sans-serif]">
                        {t("Admin Login")}
                      </div>
                      <div className="text-[12px] text-[#8c8c8c]">
                        {t("Staff access")}
                      </div>
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden flex items-center justify-center h-11 w-11 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-[#3b3b3b]" strokeWidth={2} />
            ) : (
              <Menu className="w-6 h-6 text-[#3b3b3b]" strokeWidth={2} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 animate-in slide-in-from-top duration-200">
          <div className="px-4 py-4 space-y-1">
            {/* Destinations */}
            <div className="space-y-1">
              <button
                onClick={() => setIsDestinationsOpen(!isDestinationsOpen)}
                className="w-full flex items-center justify-between px-4 py-3 text-[#3b3b3b] hover:bg-gray-50 rounded-lg transition-colors font-['Inter:Medium',sans-serif] text-[15px]"
              >
                {t("Destinations")}
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${isDestinationsOpen ? "rotate-180" : ""}`}
                />
              </button>
              {isDestinationsOpen && (
                <div className="pl-4 space-y-1">
                  <Link
                    to="/listing"
                    className="block px-4 py-3 text-[#8c8c8c] hover:bg-gray-50 rounded-lg text-[14px]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t("Istanbul")}
                  </Link>
                  <Link
                    to="/listing"
                    className="block px-4 py-3 text-[#8c8c8c] hover:bg-gray-50 rounded-lg text-[14px]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t("Antalya")}
                  </Link>
                  <Link
                    to="/listing"
                    className="block px-4 py-3 text-[#8c8c8c] hover:bg-gray-50 rounded-lg text-[14px]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {t("Cappadocia")}
                  </Link>
                </div>
              )}
            </div>

            <a
              href="/#home"
              className="block px-4 py-3 text-[#3b3b3b] hover:bg-gray-50 rounded-lg transition-colors font-['Inter:Medium',sans-serif] text-[15px]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t("Home")}
            </a>
            <a
              href="/#why-choose-united-hotels"
              className="block px-4 py-3 text-[#3b3b3b] hover:bg-gray-50 rounded-lg transition-colors font-['Inter:Medium',sans-serif] text-[15px]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t("Why Choose United Hotels")}
            </a>
            <a
              href="/#featured-hotels"
              className="block px-4 py-3 text-[#3b3b3b] hover:bg-gray-50 rounded-lg transition-colors font-['Inter:Medium',sans-serif] text-[15px]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t("Featured Hotels")}
            </a>
            <a
              href="/#quality"
              className="block px-4 py-3 text-[#3b3b3b] hover:bg-gray-50 rounded-lg transition-colors font-['Inter:Medium',sans-serif] text-[15px]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t("Quality")}
            </a>
            <a
              href="/#faqs"
              className="block px-4 py-3 text-[#3b3b3b] hover:bg-gray-50 rounded-lg transition-colors font-['Inter:Medium',sans-serif] text-[15px]"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t("FAQ")}
            </a>

            {/* Mobile Actions */}
            <div className="pt-4 border-t border-gray-100 space-y-3">
              <div className="px-4">
                <label
                  htmlFor="language-mobile"
                  className="block text-[13px] text-[#8c8c8c] font-['Inter:Medium',sans-serif] mb-2"
                >
                  {t("Turkey - Language")}
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1abc9c]" />
                  <select
                    id="language-mobile"
                    value={language}
                    onChange={(e) =>
                      setLanguage(e.target.value as "English" | "Turkish")
                    }
                    className="w-full h-11 pl-10 pr-4 rounded-lg border border-gray-200 bg-white text-[14px] text-[#3b3b3b] font-['Inter:Medium',sans-serif] focus:outline-none focus:border-[#1abc9c]"
                  >
                    <option value="English">{t("English")}</option>
                    <option value="Turkish">{t("Turkish")}</option>
                  </select>
                </div>
              </div>

              <Link
                to="/portal"
                className="flex items-center gap-3 px-4 py-3 bg-[#1abc9c]/10 text-[#1abc9c] rounded-lg font-['Inter:SemiBold',sans-serif] text-[15px]"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User className="w-5 h-5" />
                {t("Login / Guest Portal")}
              </Link>

              <Link
                to="/admin/login"
                className="flex items-center gap-3 px-4 py-3 bg-gray-100 text-[#3b3b3b] rounded-lg font-['Inter:Medium',sans-serif] text-[14px]"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {t("Admin Login")}
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
