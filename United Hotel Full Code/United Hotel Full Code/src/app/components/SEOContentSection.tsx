import { Shield, TrendingDown, Eye, MessageCircle, MapPin, Award, Check, Star, DollarSign, Clock } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { formatCurrency } from "../utils/currency";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
}

function FeatureCard({ icon, title, description, index }: FeatureCardProps) {
  const { t } = useLanguage();

  return (
    <div 
      className="group bg-white border-2 border-[#e5e7eb] rounded-2xl p-6 hover:border-[#1abc9c] hover:shadow-xl hover:-translate-y-2 transition-all duration-500 relative overflow-hidden"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1abc9c]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Content */}
      <div className="relative">
        {/* Icon */}
        <div className="bg-[#1abc9c]/10 w-14 h-14 rounded-xl flex items-center justify-center mb-4 text-[#1abc9c] group-hover:bg-[#1abc9c] group-hover:text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
          {icon}
        </div>
        
        {/* Title */}
        <h3 className="font-['Poppins:SemiBold',sans-serif] text-[18px] leading-[26px] text-[#3b3b3b] mb-2 group-hover:text-[#1abc9c] transition-colors duration-300">
          {t(title)}
        </h3>
        
        {/* Description */}
        <p className="font-['Inter:Regular',sans-serif] text-[15px] leading-[24px] text-[#6b7280]">
          {t(description)}
        </p>
      </div>

      {/* Bottom accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-[#1abc9c] to-transparent transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
    </div>
  );
}

interface BenefitItemProps {
  icon: React.ReactNode;
  text: string;
  index: number;
}

function BenefitItem({ icon, text, index }: BenefitItemProps) {
  const { t } = useLanguage();

  return (
    <div 
      className="flex items-center gap-3 group"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex-shrink-0 bg-[#1abc9c]/10 w-8 h-8 rounded-lg flex items-center justify-center text-[#1abc9c] group-hover:bg-[#1abc9c] group-hover:text-white transition-colors duration-300">
        {icon}
      </div>
      <span className="font-['Inter:Medium',sans-serif] text-[15px] text-[#374151] group-hover:text-[#1abc9c] transition-colors duration-300">
        {t(text)}
      </span>
    </div>
  );
}

export function SEOContentSection() {
  const { t, language } = useLanguage();

  const features = [
    {
      icon: <Eye className="w-6 h-6" />,
      title: "Local Expertise",
      description: "Our Turkey-based team personally visits every property to ensure quality standards"
    },
    {
      icon: <TrendingDown className="w-6 h-6" />,
      title: "Direct Rates",
      description: "Better prices through exclusive hotel partnerships—no middleman markups"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Total Transparency",
      description: "What you see is what you pay—no hidden fees, no surprises at checkout"
    },
    {
      icon: <MessageCircle className="w-6 h-6" />,
      title: "24/7 Support",
      description: "WhatsApp assistance from our local team whenever you need help"
    }
  ];

  const benefits = [
    { icon: <Check className="w-4 h-4" />, text: "Free cancellation on most bookings" },
    { icon: <Check className="w-4 h-4" />, text: "Best price guarantee" },
    { icon: <Check className="w-4 h-4" />, text: "Instant booking confirmation" },
    { icon: <Check className="w-4 h-4" />, text: "No booking fees" }
  ];

  const stats = [
    { icon: <MapPin className="w-5 h-5" />, number: "12+", label: "Neighborhoods" },
    { icon: <Award className="w-5 h-5" />, number: "55+", label: "Verified Hotels" },
    { icon: <DollarSign className="w-5 h-5" />, number: formatCurrency(32, language), label: "Starting Price" },
    { icon: <Star className="w-5 h-5" />, number: "4.6", label: "Avg. Rating" }
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background Decorations */}
      <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-[#1abc9c]/3 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-[#1abc9c]/3 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />
      
      <div className="max-w-[1440px] mx-auto px-4 md:px-10 relative">
        {/* Main Heading Section */}
        <div className="max-w-[920px] mx-auto text-center mb-10 md:mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h2 className="font-['Poppins:Bold',sans-serif] text-[28px] md:text-[52px] leading-[36px] md:leading-[68px] text-[#3b3b3b] mb-4 md:mb-8">{t("United Hotels in Turkey —Affordable Stays in Prime Locations")}</h2>
          <p className="font-['Inter:Regular',sans-serif] text-[15px] md:text-[20px] leading-[26px] md:leading-[36px] text-[#4b5563] max-w-[800px] mx-auto">
            {t("Finding quality accommodation in Turkey doesn't mean compromising on comfort or location. At United Hotels, we've personally inspected and selected the best affordable hotels across Turkey's most popular neighborhoods.")}
          </p>
        </div>

        {/* Stats Bar - Responsive: 1 col mobile, 3 cols desktop */}
        <div className="max-w-[960px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mb-12 md:mb-32 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-100">
          {stats.slice(0, 3).map((stat, index) => (
            <div 
              key={index}
              className="relative bg-white border-2 border-[#eaeaea] rounded-2xl p-6 md:p-8 text-center hover:border-[#1abc9c] hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 group overflow-hidden"
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#1abc9c]/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              
              <div className="relative z-10">
                <div className="flex justify-center mb-3 md:mb-4">
                  <div className="bg-gradient-to-br from-[#1abc9c] to-[#16a085] p-3 md:p-4 rounded-xl text-white shadow-lg group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                    {stat.icon}
                  </div>
                </div>
                <div className="font-['Poppins:Bold',sans-serif] text-[36px] md:text-[44px] leading-none bg-gradient-to-r from-[#1abc9c] to-[#16a085] bg-clip-text text-transparent mb-2 md:mb-3 group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="font-['Inter:SemiBold',sans-serif] text-[14px] md:text-[15px] text-[#6b7280] group-hover:text-[#1abc9c] transition-colors duration-300">
                  {t(stat.label)}
                </div>
              </div>
              
              {/* Bottom accent */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#1abc9c] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            </div>
          ))}
        </div>

        {/* Feature Cards Grid - Responsive: 1 col mobile, 3 cols desktop */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 mb-12 md:mb-32 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
          {features.slice(0, 3).map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </div>

        {/* Two Column Layout - Responsive: Stacked mobile, 2 cols desktop */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-20 items-start mb-12 md:mb-32 animate-in fade-in slide-in-from-bottom-4 duration-700 delay-300">
          {/* Left Column - Text Content */}
          <div className="space-y-6 md:space-y-8">
            <div className="bg-gradient-to-br from-[#1abc9c]/5 to-transparent border-l-4 border-[#1abc9c] rounded-r-2xl p-6 md:p-10">
              <div className="flex items-start gap-4 md:gap-5">
                <div className="bg-gradient-to-br from-[#1abc9c] to-[#16a085] p-2.5 md:p-3 rounded-xl shadow-lg flex-shrink-0">
                  <MapPin className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-['Poppins:SemiBold',sans-serif] text-[20px] md:text-[24px] text-[#3b3b3b] mb-3 md:mb-4">
                    {t("Perfect for Every Traveler")}
                  </h3>
                  <p className="font-['Inter:Regular',sans-serif] text-[15px] md:text-[17px] leading-[26px] md:leading-[30px] text-[#4b5563]">
                    {t("Whether you're planning a weekend getaway or extended cultural exploration, our curated selection puts you in Turkey's best neighborhoods without breaking the bank.")}
                  </p>
                </div>
              </div>
            </div>

            {/* Highlight Box */}
            <div className="bg-white rounded-2xl p-6 md:p-8 border-2 border-[#eaeaea] shadow-sm">
              <p className="font-['Inter:Regular',sans-serif] text-[14px] md:text-[16px] leading-[24px] md:leading-[28px] text-[#4b5563]">
                {t("With free cancellation on most bookings and local support, you can book with confidence knowing you're getting authentic value, not inflated OTA prices.")}
              </p>
            </div>
          </div>

          {/* Right Column - Benefits List */}
          <div>
            <div className="bg-white border-2 border-[#e5e7eb] rounded-2xl p-6 md:p-10 hover:border-[#1abc9c] hover:shadow-2xl transition-all duration-500">
              <div className="flex items-center gap-3 md:gap-4 mb-6 md:mb-8">
                <div className="bg-gradient-to-br from-[#10b981] to-[#059669] p-2.5 md:p-3 rounded-xl shadow-lg">
                  <Award className="w-5 h-5 md:w-6 md:h-6 text-white" />
                </div>
                <h3 className="font-['Poppins:SemiBold',sans-serif] text-[20px] md:text-[24px] text-[#3b3b3b]">
                  {t("Your Booking Benefits")}
                </h3>
              </div>

              <div className="space-y-4 md:space-y-5">
                {benefits.map((benefit, index) => (
                  <BenefitItem
                    key={index}
                    icon={benefit.icon}
                    text={benefit.text}
                    index={index}
                  />
                ))}
              </div>

              {/* Additional Info */}
              <div className="mt-6 md:mt-8 pt-6 md:pt-8 border-t-2 border-[#eaeaea]">
                <div className="flex items-center gap-2 md:gap-3 text-[#6b7280]">
                  <Clock className="w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                  <span className="font-['Inter:Medium',sans-serif] text-[12px] md:text-[14px]">
                    {t("Instant confirmation • Secure payment • 24/7 support")}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Trust Bar - Responsive: Vertical mobile, horizontal desktop */}
        <div className="max-w-[1120px] mx-auto bg-gradient-to-r from-white via-[#fafafa] to-white rounded-3xl p-6 md:p-10 border-2 border-[#eaeaea] animate-in fade-in slide-in-from-bottom-4 duration-700 delay-400">
          <div className="text-center mb-6 md:mb-8">
            <p className="font-['Poppins:SemiBold',sans-serif] text-[16px] md:text-[20px] text-[#3b3b3b]">
              {t("Join 1,200+ travelers who chose direct booking")}
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 text-[#6b7280]">
            <div className="flex flex-col items-center gap-3">
              <div className="flex -space-x-2">
                {[...Array(4)].map((_, i) => (
                  <div
                    key={i}
                    className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-[#1abc9c] to-[#16a085] rounded-full border-3 border-white flex items-center justify-center text-white font-['Inter:Bold',sans-serif] text-[13px] md:text-[14px] shadow-md"
                  >
                    ✓
                  </div>
                ))}
              </div>
              <span className="font-['Inter:SemiBold',sans-serif] text-[14px] md:text-[15px] text-[#3b3b3b]">
                {t("Verified Reviews")}
              </span>
            </div>
            
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 md:w-6 md:h-6 fill-[#FFA500] text-[#FFA500]" />
                <span className="font-['Poppins:Bold',sans-serif] text-[24px] md:text-[28px] text-[#3b3b3b]">
                  4.6<span className="text-[#6b7280] text-[16px] md:text-[18px]">/5</span>
                </span>
              </div>
              <span className="font-['Inter:SemiBold',sans-serif] text-[14px] md:text-[15px] text-[#3b3b3b]">
                {t("Average Rating")}
              </span>
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="bg-gradient-to-br from-[#10b981] to-[#059669] p-2.5 md:p-3 rounded-xl shadow-lg">
                <Shield className="w-5 h-5 md:w-6 md:h-6 text-white" />
              </div>
              <span className="font-['Inter:SemiBold',sans-serif] text-[14px] md:text-[15px] text-[#3b3b3b]">
                {t("Secure & Protected")}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SEOContentSection;