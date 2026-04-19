import svgPaths from "../../imports/svg-ecjbnguh0k";
import { useLanguage } from "../context/LanguageContext";

interface ValueCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay?: number;
}

function ValueCard({ icon, title, description, delay = 0 }: ValueCardProps) {
  const { t } = useLanguage();

  return (
    <div
      className="group bg-white border border-[#eaeaea] rounded-2xl p-8 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 relative overflow-hidden"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1abc9c]/10 via-[#1abc9c]/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none px-[20px] py-[0px]" />

      {/* Icon Container */}
      <div className="relative mb-6">
        <div className="bg-[#1abc9c]/10 w-16 h-16 rounded-2xl flex items-center justify-center group-hover:bg-[#1abc9c] group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-sm group-hover:shadow-lg">
          {icon}
        </div>
        {/* Decorative circle */}
        <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#1abc9c]/20 rounded-full group-hover:scale-150 group-hover:bg-[#1abc9c]/40 transition-all duration-500" />
      </div>

      {/* Content */}
      <div className="relative">
        <h3 className="font-['Poppins:SemiBold',sans-serif] text-[22px] leading-[30px] text-[#3b3b3b] mb-3 group-hover:text-[#1abc9c] transition-colors duration-300">
          {t(title)}
        </h3>
        <p className="font-['Inter:Regular',sans-serif] text-[16px] leading-[26px] text-[#8c8c8c] group-hover:text-[#6b7280] transition-colors duration-300">
          {t(description)}
        </p>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#1abc9c] to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
    </div>
  );
}

export function ValuePropositionSection() {
  const { t } = useLanguage();

  const values = [
    {
      icon: (
        <svg
          className="w-7 h-7 stroke-[#1abc9c] group-hover:stroke-white transition-colors duration-300"
          fill="none"
          viewBox="0 0 28 28"
        >
          <path
            d={svgPaths.p15ff1180}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.33333"
          />
          <path
            d={svgPaths.p4cb2400}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.33333"
          />
        </svg>
      ),
      title: "Personally Selected",
      description: "Each hotel is handpicked by our local team",
    },
    {
      icon: (
        <svg
          className="w-7 h-7 stroke-[#1abc9c] group-hover:stroke-white transition-colors duration-300"
          fill="none"
          viewBox="0 0 28 28"
        >
          <path
            d="M14 2.33333V25.6667"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.33333"
          />
          <path
            d={svgPaths.p2a38c0}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.33333"
          />
        </svg>
      ),
      title: "Better Direct Rates",
      description: "Negotiated prices you won't find elsewhere",
    },
    {
      icon: (
        <svg
          className="w-7 h-7 stroke-[#1abc9c] group-hover:stroke-white transition-colors duration-300"
          fill="none"
          viewBox="0 0 28 28"
        >
          <path
            d={svgPaths.p390c3680}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.33333"
          />
          <path
            d={svgPaths.p3c16f780}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.33333"
          />
        </svg>
      ),
      title: "Total Price Upfront",
      description: "No surprise fees at checkout",
    },
    {
      icon: (
        <svg
          className="w-7 h-7 stroke-[#1abc9c] group-hover:stroke-white transition-colors duration-300"
          fill="none"
          viewBox="0 0 28 28"
        >
          <path
            d={svgPaths.p65a0a80}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.33333"
          />
        </svg>
      ),
      title: "WhatsApp Support",
      description: "Real people, instant responses",
    },
    {
      icon: (
        <svg
          className="w-7 h-7 stroke-[#1abc9c] group-hover:stroke-white transition-colors duration-300"
          fill="none"
          viewBox="0 0 28 28"
        >
          <path
            d={svgPaths.p2bb5a00}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.33333"
          />
        </svg>
      ),
      title: "Flexible Cancellation",
      description: "Most hotels offer free cancellation",
    },
  ];

  return (
    <section
      id="why-choose-united-hotels"
      className="bg-white py-12 md:py-24 relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-[#1abc9c]/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-[#1abc9c]/5 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="max-w-[1840px] mx-auto px-4 md:px-10 relative">
        {/* Header */}
        <div className="text-center mb-10 md:mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-block mb-3 md:mb-4">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-[#1abc9c]/10 text-[#1abc9c] rounded-full font-['Inter:SemiBold',sans-serif] text-[12px] md:text-[14px] tracking-wide uppercase">
              <span className="w-2 h-2 bg-[#1abc9c] rounded-full animate-pulse" />
              {t("Why Choose Us")}
            </span>
          </div>

          <h2 className="font-['Poppins:Bold',sans-serif] text-[32px] md:text-[56px] leading-[40px] md:leading-[68px] text-[#3b3b3b] mb-4 md:mb-6 bg-clip-text px-4">
            {t("Not Another OTA.")}
          </h2>

          <p className="font-['Inter:Regular',sans-serif] text-[16px] md:text-[22px] leading-[26px] md:leading-[34px] text-[#6b7280] max-w-[680px] mx-auto px-4">
            {t("We specialize exclusively stays in Turkey. Here's how we're different.")}
          </p>

          {/* Decorative underline */}
          <div className="flex items-center justify-center gap-2 mt-4 md:mt-6">
            <div className="w-12 h-1 bg-[#1abc9c] rounded-full" />
            <div className="w-3 h-1 bg-[#1abc9c]/50 rounded-full" />
            <div className="w-1.5 h-1 bg-[#1abc9c]/30 rounded-full" />
          </div>
        </div>

        {/* Value Cards Grid - Mobile: 1 col, Tablet: 2 cols, Desktop: 5 cols */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          {values.map((value, index) => (
            <ValueCard
              key={index}
              icon={value.icon}
              title={value.title}
              description={value.description}
              delay={index * 100}
            />
          ))}
        </div>

        {/* Bottom Stats Bar - Mobile: Stacked, Desktop: Row */}
        <div className="mt-10 md:mt-20 bg-gradient-to-r from-[#1abc9c]/5 via-[#1abc9c]/10 to-[#1abc9c]/5 rounded-2xl p-6 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 text-center">
            <div className="group">
              <div className="font-['Poppins:Bold',sans-serif] text-[36px] md:text-[42px] text-[#1abc9c] mb-2 group-hover:scale-110 transition-transform inline-block">
                1,200+
              </div>
              <div className="font-['Inter:Medium',sans-serif] text-[14px] md:text-[15px] text-[#6b7280]">
                {t("Happy Guests")}
              </div>
            </div>
            <div className="group md:border-x border-[#eaeaea] py-4 md:py-0">
              <div className="font-['Poppins:Bold',sans-serif] text-[36px] md:text-[42px] text-[#1abc9c] mb-2 group-hover:scale-110 transition-transform inline-block">
                50+
              </div>
              <div className="font-['Inter:Medium',sans-serif] text-[14px] md:text-[15px] text-[#6b7280]">
                {t("Partner Hotels")}
              </div>
            </div>
            <div className="group">
              <div className="font-['Poppins:Bold',sans-serif] text-[36px] md:text-[42px] text-[#1abc9c] mb-2 group-hover:scale-110 transition-transform inline-block">
                4.8★
              </div>
              <div className="font-['Inter:Medium',sans-serif] text-[14px] md:text-[15px] text-[#6b7280]">
                {t("Average Rating")}
              </div>
            </div>
          </div>
        </div>

        {/* Trust Badge */}
        <div className="mt-8 md:mt-16 text-center animate-in fade-in duration-700 delay-500">
          <p className="font-['Inter:Regular',sans-serif] text-[14px] md:text-[15px] text-[#8c8c8c] mb-4">
            {t("Trusted by travelers from over 40 countries")}
          </p>
        </div>
      </div>
    </section>
  );
}

export default ValuePropositionSection;
