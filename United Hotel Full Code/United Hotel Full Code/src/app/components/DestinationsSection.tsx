import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import imgImageSultanahmetFatih from "figma:asset/87fe0e3882960f57017f9db63227776eab6248b5.png";
import imgImageTaksimBeyoglu from "figma:asset/2d09c265965430947a0286c570bc0fa5fbd6debe.png";
import imgImageKadikoyAsianSide from "figma:asset/250023f532e568305b14dfb57c614f51c1fba582.png";
import { MapPin, Building2, TrendingDown, ChevronRight, Navigation, Compass, Star, DollarSign } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { formatCurrency } from "../utils/currency";
import { hotelService, type PublicHotel } from "../services/api";

interface Destination {
  image: string;
  title: string;
  description: string;
  hotelCount: number;
  avgPrice: number;
  rating: number;
  highlights: string[];
  badge?: string;
  distanceFromAirport?: string;
}

const STATIC_IMAGES = [imgImageSultanahmetFatih, imgImageTaksimBeyoglu, imgImageKadikoyAsianSide];

const cityFromHotel = (hotel: PublicHotel): string => {
  const raw = (hotel.location || hotel.location_raw || "").trim();
  if (!raw) return "Turkey";
  const parts = raw.split(",").map((p) => p.trim()).filter(Boolean);
  const first = parts[0] || raw;
  const words = first.split(/\s+/).filter(Boolean);
  if (words.length > 1 && words[0].toLowerCase() === "old") return words.slice(0, 2).join(" ");
  return words[0] || first;
};

const lowestHotelPrice = (hotel: PublicHotel): number => {
  const recommended = Array.isArray(hotel.recommendedPrices) ? hotel.recommendedPrices : [];
  const recommendedMin = recommended
    .map((r) => Number(r.recommendedPrice || 0))
    .filter((n) => Number.isFinite(n) && n > 0)
    .sort((a, b) => a - b)[0] || 0;
  const roomMin = (Array.isArray(hotel.rooms) ? hotel.rooms : [])
    .map((r) => Number(r.price_per_night || r.base_price || 0))
    .filter((n) => Number.isFinite(n) && n > 0)
    .sort((a, b) => a - b)[0] || 0;
  return recommendedMin || roomMin || 0;
};

interface DestinationCardProps {
  destination: Destination;
  index: number;
}

function DestinationCard({ destination, index }: DestinationCardProps) {
  const { t, language } = useLanguage();

  return (
    <Link
      to={`/listing?destination=${encodeURIComponent(destination.title)}`}
      className="group relative min-h-[520px] md:min-h-[540px] rounded-2xl overflow-hidden border border-[#e5e7eb] hover:border-[#1abc9c] hover:shadow-2xl hover:-translate-y-4 transition-all duration-500 bg-white flex flex-col h-full"
      style={{ animationDelay: `${index * 150}ms` }}
    >
      {/* Image Container */}
      <div className="relative h-[280px] overflow-hidden">
        <img 
          src={destination.image}
          alt={destination.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
        />
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        
        {/* Badge */}
        {destination.badge && (
          <div className="absolute top-4 right-4 bg-[#1abc9c] text-white px-4 py-2 rounded-xl shadow-lg font-['Inter:Bold',sans-serif] text-[12px] flex items-center gap-1.5 backdrop-blur-sm">
            <Star className="w-3.5 h-3.5 fill-white" />
            {destination.badge ? t(destination.badge) : ""}
          </div>
        )}

        {/* Location Icon - Top Left */}
        <div className="absolute top-4 left-4 bg-white/20 backdrop-blur-md p-2.5 rounded-xl">
          <MapPin className="w-5 h-5 text-white" />
        </div>

        {/* Distance Badge - Bottom Right on Image */}
        {destination.distanceFromAirport && (
          <div className="absolute bottom-4 right-4 z-10 bg-black/40 backdrop-blur-md text-white px-3 py-1.5 rounded-lg font-['Inter:Medium',sans-serif] text-[12px] flex items-center gap-1.5 whitespace-nowrap">
            <Navigation className="w-3.5 h-3.5" />
            {destination.distanceFromAirport}
          </div>
        )}

        {/* Title & Description - Bottom Left on Image */}
        <div className="absolute bottom-0 left-0 right-0 p-6 pr-32 md:pr-36">
          <h3 className="font-['Poppins:Bold',sans-serif] text-[26px] leading-[32px] text-white mb-2 group-hover:text-[#1abc9c] transition-colors duration-300">
            {t(destination.title)}
          </h3>
          <p className="font-['Inter:Regular',sans-serif] text-[14px] text-white/90 leading-[20px] line-clamp-2">
            {t(destination.description)}
          </p>
        </div>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-[#1abc9c]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      {/* Content Section */}
      <div className="p-6 flex-1 flex flex-col">
        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-3 mb-5">
          {/* Hotel Count */}
          <div className="text-center bg-[#fafafa] rounded-xl p-3 group-hover:bg-[#1abc9c]/10 transition-colors duration-300">
            <div className="flex items-center justify-center mb-1">
              <Building2 className="w-4 h-4 text-[#1abc9c]" />
            </div>
            <div className="font-['Poppins:Bold',sans-serif] text-[18px] text-[#1abc9c]">
              {destination.hotelCount}+
            </div>
            <div className="font-['Inter:Regular',sans-serif] text-[11px] text-[#6b7280]">
              {t("Hotels")}
            </div>
          </div>

          {/* Average Price */}
          <div className="text-center bg-[#fafafa] rounded-xl p-3 group-hover:bg-[#1abc9c]/10 transition-colors duration-300">
            <div className="flex items-center justify-center mb-1">
              <DollarSign className="w-4 h-4 text-[#1abc9c]" />
            </div>
            <div className="font-['Poppins:Bold',sans-serif] text-[18px] text-[#1abc9c]">
              {formatCurrency(destination.avgPrice, language)}
            </div>
            <div className="font-['Inter:Regular',sans-serif] text-[11px] text-[#6b7280]">
              {t("Avg/night")}
            </div>
          </div>

          {/* Rating */}
          <div className="text-center bg-[#fafafa] rounded-xl p-3 group-hover:bg-[#1abc9c]/10 transition-colors duration-300">
            <div className="flex items-center justify-center mb-1">
              <Star className="w-4 h-4 text-[#FFA500] fill-[#FFA500]" />
            </div>
            <div className="font-['Poppins:Bold',sans-serif] text-[18px] text-[#1abc9c]">
              {destination.rating}
            </div>
            <div className="font-['Inter:Regular',sans-serif] text-[11px] text-[#6b7280]">
              {t("Rating")}
            </div>
          </div>
        </div>

        {/* Highlights */}
        <div className="mb-5">
          <div className="flex flex-wrap gap-2">
            {destination.highlights.map((highlight, idx) => (
              <span 
                key={idx}
                className="bg-white border border-[#eaeaea] text-[#6b7280] px-3 py-1.5 rounded-lg font-['Inter:Medium',sans-serif] text-[12px] group-hover:border-[#1abc9c] group-hover:text-[#1abc9c] transition-colors duration-300"
              >
                {t(highlight)}
              </span>
            ))}
          </div>
        </div>

        {/* CTA Button */}
        <div
          className="mt-auto w-full bg-[#1abc9c] text-white py-3 rounded-xl hover:bg-[#16a085] transition-all duration-300 font-['Inter:Bold',sans-serif] text-[14px] flex items-center justify-center gap-2 group/btn shadow-md hover:shadow-lg relative overflow-hidden"
        >
          <Compass className="w-4 h-4 relative z-10 group-hover/btn:rotate-180 transition-transform duration-500" />
          <span className="relative z-10">{t(`Explore ${destination.title.split('&')[0].trim()}`)}</span>
          <ChevronRight className="w-4 h-4 relative z-10 group-hover/btn:translate-x-1 transition-transform" />
          
          {/* Button shimmer */}
          <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>
      </div>

      {/* Decorative corner elements */}
      <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-to-br from-[#1abc9c]/10 to-transparent rounded-br-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute bottom-0 right-0 w-16 h-16 bg-gradient-to-tl from-[#1abc9c]/10 to-transparent rounded-tl-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
    </Link>
  );
}

export function DestinationsSection() {
  const { t } = useLanguage();
  const [hotels, setHotels] = useState<PublicHotel[]>([]);

  useEffect(() => {
    let active = true;
    hotelService
      .getPublicHotels({ status: "active", includeRecommendedPrices: true, refreshPrices: true, limit: 200, offset: 0 })
      .then((res) => {
        if (!active) return;
        setHotels(Array.isArray(res.hotels) ? res.hotels : []);
      })
      .catch(() => {
        if (!active) return;
        setHotels([]);
      });
    return () => {
      active = false;
    };
  }, []);

  const destinations = useMemo<Destination[]>(() => {
    if (!hotels.length) {
      return [
        {
          image: STATIC_IMAGES[0],
          title: "Turkey",
          description: "Handpicked neighborhoods with direct hotel rates",
          hotelCount: 0,
          avgPrice: 0,
          rating: 4.5,
          highlights: ["Verified Hotels", "Direct Rates", "Local Support"],
          badge: "Most Popular",
        },
      ];
    }

    const byCity = new Map<string, { hotels: PublicHotel[]; amenityCount: Map<string, number> }>();
    for (const hotel of hotels) {
      const city = cityFromHotel(hotel);
      if (!byCity.has(city)) byCity.set(city, { hotels: [], amenityCount: new Map<string, number>() });
      const bucket = byCity.get(city)!;
      bucket.hotels.push(hotel);
      const amenities = Array.isArray(hotel.amenities) ? hotel.amenities : [];
      for (const item of amenities) {
        const key = (typeof item === "string" ? item : item?.name || "").trim();
        if (!key) continue;
        bucket.amenityCount.set(key, (bucket.amenityCount.get(key) || 0) + 1);
      }
    }

    return Array.from(byCity.entries())
      .map(([city, data], index) => {
        const prices = data.hotels.map(lowestHotelPrice).filter((n) => n > 0);
        const ratings = data.hotels
          .map((h) => Number(h.starRating ?? h.star_rating ?? h.rating ?? 0))
          .filter((n) => Number.isFinite(n) && n > 0);
        const topAmenities = Array.from(data.amenityCount.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(0, 3)
          .map(([name]) => name);

        return {
          image: STATIC_IMAGES[index % STATIC_IMAGES.length],
          title: city,
          description: `Top-value stays in ${city} with transparent direct booking rates`,
          hotelCount: data.hotels.length,
          avgPrice: prices.length ? Math.round(prices.reduce((s, p) => s + p, 0) / prices.length) : 0,
          rating: ratings.length ? Number((ratings.reduce((s, r) => s + r, 0) / ratings.length).toFixed(1)) : 4.5,
          highlights: topAmenities.length ? topAmenities : ["Verified Hotels", "Direct Rates", "Local Support"],
          badge: index === 0 ? "Most Popular" : undefined,
        };
      })
      .sort((a, b) => b.hotelCount - a.hotelCount)
      .slice(0, 3);
  }, [hotels]);

  return (
    <section className="bg-white py-12 md:py-24 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-20 left-0 w-[400px] h-[400px] bg-gradient-to-br from-[#1abc9c]/10 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-0 w-[400px] h-[400px] bg-gradient-to-tl from-[#1abc9c]/10 to-transparent rounded-full blur-3xl" />
      
      <div className="max-w-[1840px] mx-auto px-4 md:px-10 relative">
        {/* Header */}
        <div className="text-center mb-10 md:mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-block mb-3 md:mb-4">
            <span className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 bg-[#1abc9c]/10 text-[#1abc9c] rounded-full font-['Inter:SemiBold',sans-serif] text-[12px] md:text-[14px] tracking-wide uppercase">
              <Compass className="w-3 h-3 md:w-4 md:h-4" />
              {t("Explore Neighborhoods")}
            </span>
          </div>
          
          <h2 className="font-['Poppins:Bold',sans-serif] text-[32px] md:text-[56px] leading-[40px] md:leading-[68px] text-[#3b3b3b] mb-4 md:mb-6 px-4">
            {t("Where to Stay in Turkey")}
          </h2>
          
          <p className="font-['Inter:Regular',sans-serif] text-[16px] md:text-[22px] leading-[26px] md:leading-[34px] text-[#6b7280] max-w-[720px] mx-auto px-4">
            {t("Each neighborhood offers its own character. We'll help you find the perfect match.")}
          </p>

          {/* Decorative line */}
          <div className="flex items-center justify-center gap-2 mt-4 md:mt-6">
            <div className="w-16 h-1 bg-gradient-to-r from-transparent to-[#1abc9c] rounded-full" />
            <div className="w-2 h-2 bg-[#1abc9c] rounded-full" />
            <div className="w-16 h-1 bg-gradient-to-l from-transparent to-[#1abc9c] rounded-full" />
          </div>
        </div>

        {/* Destinations Grid - Mobile: 1 col, Tablet: 2 cols, Desktop: 3 cols */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-10 md:mb-16">
          {destinations.map((destination, index) => (
            <DestinationCard key={destination.title} destination={destination} index={index} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center animate-in fade-in duration-700 delay-300">
          <p className="font-['Inter:Regular',sans-serif] text-[14px] md:text-[16px] text-[#6b7280] mb-6">
            {t("Not sure which area is right for you?")}
          </p>
          <Link 
            to="/listing"
            className="inline-flex items-center gap-3 bg-[#1abc9c] text-white px-6 md:px-8 py-3 md:py-4 rounded-xl hover:bg-[#16a085] transition-all hover:shadow-xl font-['Inter:SemiBold',sans-serif] text-[15px] md:text-[16px] group"
          >
            {t("View All Neighborhoods")}
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </section>
  );
}

export default DestinationsSection;