import { useEffect, useState } from "react";
import { Link } from "react-router";
import { MapPin, Star, TrendingDown, ChevronRight, Sparkles } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { formatCurrency } from "../utils/currency";
import { HotelGridLoader } from "./HotelLoadingState";
import { hotelService, type PublicHotel } from "../services/api";
import imgImageHotel from "figma:asset/24b94370ae50cf05c8eda404c2045b52c5b68320.png";
import imgImageHotel1 from "figma:asset/126d7e43c8c296ca95f6cc5a2e933adaced67080.png";
import imgImageHotel2 from "figma:asset/2192c11a429594d69f4c28f4fc3ed22cdc4449b5.png";

const STATIC_IMAGES = [imgImageHotel, imgImageHotel1, imgImageHotel2];

type CardHotel = {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviews: number;
  directPrice: number;
  basePrice: number | null;
  discountPercent: number;
  savings: number;
  image: string;
};

const mapHotel = (hotel: PublicHotel, index: number): CardHotel => {
  const rooms = Array.isArray(hotel.rooms) ? hotel.rooms : [];
  const recommended = Array.isArray(hotel.recommendedPrices) ? hotel.recommendedPrices : [];

  const bestRecommended =
    recommended
      .map((entry) => ({
        recommendedPrice: Number(entry.recommendedPrice || 0),
        basePrice: Number(entry.basePrice || 0),
        discountPercent: Number(entry.discountPercent || 0),
        savingsAmount: Number(entry.savingsAmount || 0),
      }))
      .filter((entry) => Number.isFinite(entry.recommendedPrice) && entry.recommendedPrice > 0)
      .sort((a, b) => a.recommendedPrice - b.recommendedPrice)[0] || null;

  const directPrice =
    bestRecommended?.recommendedPrice ||
    rooms
      .map((r) => Number(r.price_per_night || r.base_price || 0))
      .filter((n) => Number.isFinite(n) && n > 0)
      .sort((a, b) => a - b)[0] ||
    0;

  const basePrice = bestRecommended?.basePrice && bestRecommended.basePrice > directPrice ? bestRecommended.basePrice : null;
  const savings = Number.isFinite(bestRecommended?.savingsAmount)
    ? Math.max(0, bestRecommended?.savingsAmount || 0)
    : Math.max(0, (basePrice || 0) - directPrice);

  return {
    id: String(hotel.id),
    name: hotel.name || "Hotel",
    location: hotel.location || "Turkey",
    rating: Number(hotel.rating || 4),
    reviews: Number(hotel.reviewCount || 0),
    directPrice,
    basePrice,
    discountPercent: Number(bestRecommended?.discountPercent || 0),
    savings,
    image: STATIC_IMAGES[index % STATIC_IMAGES.length],
  };
};

export function FeaturedHotelsSection() {
  const { t, language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [hotels, setHotels] = useState<CardHotel[]>([]);

  useEffect(() => {
    let active = true;

    const load = async () => {
      try {
        const response = await hotelService.getPublicHotels({
          status: "active",
          includeRecommendedPrices: true,
          refreshPrices: false,
          limit: 3,
          offset: 0,
        });

        if (!active) return;
        setHotels((response.hotels || []).slice(0, 3).map((hotel, idx) => mapHotel(hotel, idx)));
      } catch {
        if (active) setHotels([]);
      } finally {
        if (active) setLoading(false);
      }
    };

    load();
    return () => {
      active = false;
    };
  }, []);

  return (
    <section id="featured-hotels" className="bg-linear-to-b from-[#fafafa] to-white py-12 md:py-24">
      <div className="max-w-[1840px] mx-auto px-4 md:px-10">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="font-['Poppins:Bold',sans-serif] text-[32px] md:text-[56px] text-[#3b3b3b] mb-4">
            {t("Featured Hotels")}
          </h2>
          <p className="font-['Inter:Regular',sans-serif] text-[16px] md:text-[20px] text-[#6b7280] max-w-[680px] mx-auto">
            {t("Live rates and hotel details from the United Hotels backend")}
          </p>
        </div>

        {loading && <HotelGridLoader count={3} />}

        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {hotels.map((hotel, index) => {
              const fullStars = Math.floor(hotel.rating);

              return (
                <div key={hotel.id} className="group bg-white rounded-[28px] overflow-hidden border border-[#e5ece9] hover:shadow-[0_24px_70px_rgba(15,23,42,0.12)] hover:-translate-y-1 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${index * 100}ms`, animationFillMode: "both" }}>
                  <div className="relative overflow-hidden">
                    <img src={hotel.image} alt={hotel.name} className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                    <div className="absolute inset-0 bg-linear-to-t from-[#0f172a]/35 via-transparent to-transparent" />
                    {hotel.discountPercent > 0 && (
                      <div className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-[#10b981] px-3.5 py-2 text-[12px] font-bold text-white shadow-lg shadow-[#10b981]/20">
                        <TrendingDown className="w-3.5 h-3.5" />-{hotel.discountPercent.toFixed(0)}%
                      </div>
                    )}
                    <div className="absolute bottom-4 left-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-3 py-1.5 text-white backdrop-blur-md">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span className="text-[12px] font-semibold tracking-[0.12em] uppercase">Backend powered</span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-['Poppins:SemiBold',sans-serif] text-[20px] text-[#3b3b3b] mb-2">{hotel.name}</h3>
                    <div className="flex items-center gap-2 text-[#6b7280] mb-3"><MapPin className="w-4 h-4" />{hotel.location}</div>

                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`w-4 h-4 ${i < fullStars ? "fill-[#FFA500] text-[#FFA500]" : "text-[#E5E7EB]"}`} />
                        ))}
                      </div>
                      <span className="text-[13px] text-[#8c8c8c]">({hotel.reviews})</span>
                    </div>

                    <div className="bg-[#f9fafb] rounded-xl p-4 border border-[#eaeaea] mb-4">
                      {hotel.basePrice && hotel.basePrice > hotel.directPrice && (
                        <div className="text-[12px] text-[#8c8c8c] line-through">{formatCurrency(hotel.basePrice, language)}</div>
                      )}
                      <div className="flex items-end justify-between">
                        <div>
                          <div className="font-['Poppins:Bold',sans-serif] text-[32px] leading-[34px] text-[#1abc9c]">{formatCurrency(hotel.directPrice, language)}</div>
                          <div className="text-[13px] text-[#6b7280]">/night direct booking</div>
                        </div>
                        {hotel.savings > 0 && (
                          <div className="text-[#10b981] text-[13px] font-bold inline-flex items-center gap-1">
                            <TrendingDown className="w-3.5 h-3.5" /> {formatCurrency(hotel.savings, language)} off
                          </div>
                        )}
                      </div>
                    </div>

                    <Link to={`/hotel/${hotel.id}`} className="w-full inline-flex items-center justify-center gap-2 bg-[#1abc9c] text-white py-3 rounded-xl font-semibold hover:bg-[#16a085] transition-colors">
                      {t("View Rooms & Availability")} <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <div className="text-center mt-10 md:mt-14">
          <Link
            to="/listing"
            onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "auto" })}
            className="inline-flex items-center gap-2 border-2 border-[#1abc9c] text-[#1abc9c] px-6 py-3 rounded-xl hover:bg-[#1abc9c] hover:text-white transition-colors"
          >
            {t("Explore All Hotels")} <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default FeaturedHotelsSection;
