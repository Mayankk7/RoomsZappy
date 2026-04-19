import imgImageHotelInspection from "figma:asset/9783e6851bc031fabe001ad50fc466eb1ba42e2e.png";
import { Check, Eye, MapPin, Sparkles, Shield, ClipboardCheck, Award } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
  number: string;
}

function FeatureCard({ icon, title, description, index, number }: FeatureCardProps) {
  const { t } = useLanguage();

  return (
    <div 
      className="group bg-white rounded-2xl p-6 border border-[#e5e7eb] hover:border-[#1abc9c] hover:shadow-xl hover:-translate-x-2 transition-all duration-500 relative overflow-hidden"
      style={{ animationDelay: `${index * 150}ms` }}
    >
      {/* Background gradient on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#1abc9c]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Number badge */}
      <div className="absolute top-4 right-4 font-['Poppins:Bold',sans-serif] text-[48px] text-[#1abc9c]/10 group-hover:text-[#1abc9c]/20 transition-colors duration-500">
        {number}
      </div>

      <div className="flex gap-4 relative z-10">
        {/* Icon */}
        <div className="flex-shrink-0">
          <div className="bg-[#1abc9c]/10 w-12 h-12 rounded-xl flex items-center justify-center text-[#1abc9c] group-hover:bg-[#1abc9c] group-hover:text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-sm">
            {icon}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <h3 className="font-['Poppins:SemiBold',sans-serif] text-[18px] leading-[26px] text-[#3b3b3b] mb-2 group-hover:text-[#1abc9c] transition-colors duration-300">
            {t(title)}
          </h3>
          <p className="font-['Inter:Regular',sans-serif] text-[15px] leading-[24px] text-[#6b7280] group-hover:text-[#374151] transition-colors duration-300">
            {t(description)}
          </p>
        </div>

        {/* Check icon */}
        <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="bg-[#10b981]/10 w-8 h-8 rounded-full flex items-center justify-center">
            <Check className="w-4 h-4 text-[#10b981]" />
          </div>
        </div>
      </div>

      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1abc9c] to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
    </div>
  );
}

export function QualityAssuranceSection() {
  const { t } = useLanguage();

  const features = [
    {
      icon: <Eye className="w-5 h-5" />,
      title: "In-Person Verification",
      description: "Our team visits every hotel before listing to ensure standards",
      number: "01"
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      title: "Location Reality Check",
      description: "We verify walking times, neighborhood safety, and public transport access",
      number: "02"
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: "Cleanliness Audit",
      description: "Unannounced inspections to maintain hygiene standards year-round",
      number: "03"
    },
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Safety Standards",
      description: "Fire safety, security, and emergency procedures are verified",
      number: "04"
    },
    {
      icon: <ClipboardCheck className="w-5 h-5" />,
      title: "Price Transparency",
      description: "No hidden fees. What you see is what you pay at checkout",
      number: "05"
    },
    {
      icon: <Award className="w-5 h-5" />,
      title: "Guest Review Analysis",
      description: "We investigate complaints and delist properties with recurring issues",
      number: "06"
    }
  ];

  return (
    <section id="quality" className="bg-gradient-to-b from-white to-[#fafafa] py-12 md:py-24 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-[#1abc9c]/5 rounded-full blur-3xl" />
      
      <div className="max-w-[1840px] mx-auto px-4 md:px-10 relative">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-16 items-center">
          {/* Left: Image */}
          <div className="relative animate-in fade-in slide-in-from-left-8 duration-700 order-2 lg:order-1">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white group">
              <img 
                src={imgImageHotelInspection}
                alt="Hotel quality inspection"
                className="w-full h-[400px] md:h-[600px] object-cover group-hover:scale-105 transition-transform duration-700"
              />
              
              {/* Overlay gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1abc9c]/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              {/* Badge on image */}
              <div className="absolute bottom-6 md:bottom-8 left-6 md:left-8 bg-white/95 backdrop-blur-sm p-4 md:p-6 rounded-2xl shadow-xl max-w-[280px] md:max-w-sm">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-[#1abc9c] p-2 rounded-lg">
                    <Shield className="w-5 h-5 md:w-6 md:h-6 text-white" />
                  </div>
                  <div>
                    <div className="font-['Poppins:Bold',sans-serif] text-[20px] md:text-[24px] text-[#1abc9c]">100%</div>
                    <div className="font-['Inter:Regular',sans-serif] text-[11px] md:text-[12px] text-[#6b7280]">{t("Verified Hotels")}</div>
                  </div>
                </div>
                <p className="font-['Inter:Medium',sans-serif] text-[12px] md:text-[13px] text-[#3b3b3b] leading-relaxed">
                  {t("Every property undergoes rigorous on-site inspection before listing")}
                </p>
              </div>
            </div>

            {/* Floating badges */}
            <div className="absolute -top-4 -right-4 bg-white shadow-xl rounded-2xl p-3 md:p-4 animate-in fade-in slide-in-from-top-4 duration-700 delay-200 hidden md:block">
              <Award className="w-6 h-6 md:w-8 md:h-8 text-[#1abc9c] mb-2" />
              <div className="font-['Poppins:Bold',sans-serif] text-[14px] md:text-[16px] text-[#3b3b3b]">{t("Certified")}</div>
            </div>
          </div>

          {/* Right: Content */}
          <div className="animate-in fade-in slide-in-from-right-8 duration-700 order-1 lg:order-2">
            <div className="inline-block mb-4 md:mb-6">
              <span className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-[#1abc9c]/10 text-[#1abc9c] rounded-full font-['Inter:SemiBold',sans-serif] text-[12px] md:text-[14px] tracking-wide uppercase">
                <Shield className="w-3 h-3 md:w-4 md:h-4" />
                {t("Quality Guarantee")}
              </span>
            </div>

            <h2 className="font-['Poppins:Bold',sans-serif] text-[32px] md:text-[52px] leading-[40px] md:leading-[60px] text-[#3b3b3b] mb-4 md:mb-6">
              {t("Every Hotel,")}<br />
              <span className="text-[#1abc9c]">{t("Personally Vetted")}</span>
            </h2>

            <p className="font-['Inter:Regular',sans-serif] text-[16px] md:text-[20px] leading-[26px] md:leading-[32px] text-[#6b7280] mb-8 md:mb-12">
              {t("Unlike booking platforms that list anyone who pays, we physically inspect every property. No fake photos, no surprise disappointments.")}
            </p>

            {/* Features List - Mobile: 1 col, Desktop: Can stack */}
            <div className="space-y-4 md:space-y-6">
              {features.map((feature, index) => (
                <FeatureCard 
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  index={index}
                  number={feature.number}
                />
              ))}
            </div>

            {/* Bottom stat */}
            <div className="mt-8 md:mt-12 p-6 md:p-8 bg-gradient-to-r from-[#1abc9c]/10 to-transparent rounded-2xl border-l-4 border-[#1abc9c]">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
                <div className="flex-shrink-0 bg-[#1abc9c] p-3 rounded-xl">
                  <ClipboardCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <p className="font-['Poppins:Bold',sans-serif] text-[18px] md:text-[20px] text-[#3b3b3b] mb-1">
                    {t("Our Promise to You")}
                  </p>
                  <p className="font-['Inter:Regular',sans-serif] text-[14px] md:text-[15px] text-[#6b7280] leading-relaxed">
                    {t("If a hotel doesn't match our listing description, we'll relocate you to a better property at our expense.")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default QualityAssuranceSection;