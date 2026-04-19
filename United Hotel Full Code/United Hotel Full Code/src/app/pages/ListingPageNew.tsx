import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router";
import { useLocation } from "react-router";
import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import { HotelGridLoader } from "../components/HotelLoadingState";
import { hotelService, type PublicHotel } from "../services/api";
import { formatCurrency } from "../utils/currency";
import { useLanguage } from "../context/LanguageContext";
import { MapPin, Search, Sparkles, Star, TrendingDown } from "lucide-react";
import imgImageHotel from "figma:asset/24b94370ae50cf05c8eda404c2045b52c5b68320.png";
import imgImageHotel1 from "figma:asset/126d7e43c8c296ca95f6cc5a2e933adaced67080.png";
import imgImageHotel2 from "figma:asset/2192c11a429594d69f4c28f4fc3ed22cdc4449b5.png";

const STATIC_IMAGES = [imgImageHotel, imgImageHotel1, imgImageHotel2];
const FETCH_BATCH_SIZE = 50;
const LISTING_PAGE_SIZE = 12;

const capitalizeWords = (text: string): string =>
  String(text || "")
    .toLowerCase()
    .replace(/\b\w/g, (ch) => ch.toUpperCase());

type ListingHotel = {
  id: string;
  name: string;
  location: string;
  district: string;
  rating: number;
  reviewCount: number;
  amenities: string[];
  directPrice: number;
  basePrice: number | null;
  discountPercent: number;
  savings: number;
  image: string;
};

const toAmenityText = (item: { name: string } | string) => {
  if (typeof item === "string") return item;
  return item?.name || "Amenity";
};

const mapHotel = (hotel: PublicHotel, index: number): ListingHotel => {
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

  const rooms = Array.isArray(hotel.rooms) ? hotel.rooms : [];
  const minBase =
    rooms
      .map((room) => Number(room.price_per_night || room.base_price || 0))
      .filter((n) => Number.isFinite(n) && n > 0)
      .sort((a, b) => a - b)[0] || 0;

  const directPrice = bestRecommended?.recommendedPrice || minBase;
  const basePrice = bestRecommended?.basePrice && bestRecommended.basePrice > directPrice
    ? bestRecommended.basePrice
    : minBase > directPrice
      ? minBase
      : null;
  const savings = Number.isFinite(bestRecommended?.savingsAmount)
    ? Math.max(0, bestRecommended?.savingsAmount || 0)
    : Math.max(0, (basePrice || 0) - directPrice);

  return {
    id: String(hotel.id),
    name: hotel.name || "Hotel",
    location: hotel.location || "Turkey",
    district: hotel.district || "",
    rating: Number(hotel.rating || 4),
    reviewCount: Number(hotel.reviewCount || 0),
    amenities: (hotel.amenities || []).map(toAmenityText),
    directPrice,
    basePrice,
    discountPercent: Number(bestRecommended?.discountPercent || 0),
    savings,
    image: STATIC_IMAGES[index % STATIC_IMAGES.length],
  };
};

export function ListingPageNew() {
  const { language, t } = useLanguage();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hotels, setHotels] = useState<ListingHotel[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const destination = params.get("destination") || "";
    setSearchTerm(destination);
    setCurrentPage(1);
  }, [location.search]);

  useEffect(() => {
    let active = true;

    const loadHotels = async () => {
      try {
        setLoading(true);
        setError(null);

        const allHotels: PublicHotel[] = [];

        const firstResponse = await hotelService.getPublicHotels({
          status: "active",
          includeRecommendedPrices: false,
          refreshPrices: false,
          limit: FETCH_BATCH_SIZE,
          offset: 0,
        });

        allHotels.push(...(firstResponse.hotels || []));

        const totalCount = Number(firstResponse.count || allHotels.length);
        for (let offset = allHotels.length; offset < totalCount; offset += FETCH_BATCH_SIZE) {
          const nextResponse = await hotelService.getPublicHotels({
            status: "active",
            includeRecommendedPrices: false,
            refreshPrices: false,
            limit: FETCH_BATCH_SIZE,
            offset,
          });
          allHotels.push(...(nextResponse.hotels || []));
        }

        const pricingPayload = await hotelService
          .getAllRecommended("active", true)
          .catch(() => null);

        const recommendedByHotelId = new Map<string, any[]>();
        if (pricingPayload && Array.isArray(pricingPayload.hotels)) {
          for (const item of pricingPayload.hotels) {
            recommendedByHotelId.set(String(item.hotelId), item.recommendedPrices || []);
          }
        }

        if (!active) return;

        const mergedHotels = allHotels.map((hotel) => ({
          ...hotel,
          recommendedPrices:
            recommendedByHotelId.get(String(hotel.id)) ||
            hotel.recommendedPrices ||
            [],
        }));

        const mapped = mergedHotels.map((hotel, index) => mapHotel(hotel, index));
        setHotels(mapped);
      } catch (e: any) {
        if (!active) return;
        setError(e?.data?.error || e?.message || "Failed to load hotels");
      } finally {
        if (active) setLoading(false);
      }
    };

    loadHotels();
    return () => {
      active = false;
    };
  }, []);

  const filteredHotels = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return hotels;

    return hotels.filter((hotel) => {
      const haystack = `${hotel.name} ${hotel.location} ${hotel.district} ${hotel.amenities.join(" ")}`.toLowerCase();
      return haystack.includes(q);
    });
  }, [hotels, searchTerm]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredHotels.length / LISTING_PAGE_SIZE));

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  const paginatedHotels = useMemo(() => {
    const start = (currentPage - 1) * LISTING_PAGE_SIZE;
    return filteredHotels.slice(start, start + LISTING_PAGE_SIZE);
  }, [filteredHotels, currentPage]);

  const pageWindowStart = Math.max(1, currentPage - 2);
  const pageWindowEnd = Math.min(totalPages, pageWindowStart + 4);
  const visiblePages = Array.from({ length: pageWindowEnd - pageWindowStart + 1 }, (_, idx) => pageWindowStart + idx);

  return (
    <div className="bg-[#fafafa] min-h-screen">
      <Navigation />

      <main className="max-w-[1840px] mx-auto px-4 md:px-10 py-6 md:py-10 fade-up-enter">
        <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="font-['Poppins:Bold',sans-serif] text-[24px] md:text-[40px] leading-8 md:leading-12 text-[#3b3b3b]">
              Hotels in Turkey
            </h1>
            <p className="font-['Inter:Regular',sans-serif] text-[14px] md:text-[16px] text-[#8c8c8c] mt-2">
              {filteredHotels.length} properties found
            </p>
          </div>

          <div className="w-full md:w-[420px] relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8c8c8c]" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by city, district, hotel or amenity"
              className="w-full pl-12 pr-4 py-3 border border-[#eaeaea] rounded-lg bg-white focus:outline-none focus:border-[#1abc9c]"
            />
          </div>
        </div>

        {loading && <HotelGridLoader count={6} />}

        {!loading && error && (
          <div className="bg-white border border-red-200 rounded-2xl p-8 text-center text-red-600">
            {error}
          </div>
        )}

        {!loading && !error && filteredHotels.length === 0 && (
          <div className="bg-white border border-[#eaeaea] rounded-2xl p-8 text-center text-[#6b7280]">
            No hotels matched your search.
          </div>
        )}

        {!loading && !error && filteredHotels.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {paginatedHotels.map((hotel) => {
              const fullStars = Math.floor(hotel.rating);

              return (
                <Link
                  to={`/hotel/${hotel.id}`}
                  key={hotel.id}
                  onClick={() => window.scrollTo({ top: 0, left: 0, behavior: "auto" })}
                  className="group bg-white rounded-[28px] overflow-hidden border border-[#e8eeec] hover:shadow-[0_24px_70px_rgba(15,23,42,0.12)] hover:-translate-y-1.5 transition-all duration-500 animate-in fade-in slide-in-from-bottom-4"
                >
                  <div className="relative h-[220px] overflow-hidden">
                    <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]" />
                    <div className="absolute inset-0 bg-linear-to-t from-[#0f172a]/40 via-transparent to-transparent" />
                    {hotel.discountPercent > 0 && (
                      <div className="absolute top-4 right-4 bg-[#10b981] text-white px-3.5 py-2 rounded-2xl text-[12px] font-bold flex items-center gap-1.5 shadow-lg shadow-[#10b981]/20">
                        <TrendingDown className="w-3.5 h-3.5" />-{hotel.discountPercent.toFixed(0)}%
                      </div>
                    )}
                    <div className="absolute left-4 bottom-4 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/15 px-3 py-1.5 text-white backdrop-blur-md">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span className="text-[12px] font-semibold tracking-[0.12em] uppercase">Live direct rate</span>
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-['Poppins:SemiBold',sans-serif] text-[22px] text-[#22324a] mb-2 line-clamp-1">{t(hotel.name)}</h3>
                    <div className="flex items-center gap-2 mb-3 text-[#667085] text-[14px]">
                      <MapPin className="w-4 h-4" />
                      <span className="line-clamp-1">{t(hotel.location)}</span>
                    </div>

                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${i < fullStars ? "fill-[#FFA500] text-[#FFA500]" : "text-[#E5E7EB]"}`}
                          />
                        ))}
                      </div>
                      <span className="text-[13px] text-[#8c8c8c]">({hotel.reviewCount})</span>
                    </div>

                    <div className="mb-4 flex flex-wrap gap-2">
                      {hotel.amenities.slice(0, 3).map((amenity, index) => (
                        <span key={`${hotel.id}-${amenity}-${index}`} className="rounded-full border border-[#e5eeeb] bg-[#f7fbfa] px-3 py-1.5 text-[12px] font-medium text-[#4d6674]">
                          {t(capitalizeWords(amenity))}
                        </span>
                      ))}
                    </div>

                    <div className="h-px bg-[#eaeaea] mb-4" />

                    <div className="flex items-center justify-between">
                      <div>
                        {hotel.basePrice && hotel.basePrice > hotel.directPrice && (
                          <div className="text-[12px] text-[#8c8c8c] line-through">{formatCurrency(hotel.basePrice, language)}</div>
                        )}
                        <div className="text-[30px] leading-8 font-['Poppins:Bold',sans-serif] text-[#22324a]">
                          {formatCurrency(hotel.directPrice, language)}
                        </div>
                        <div className="text-[12px] text-[#667085]">per night</div>
                        {hotel.savings > 0 && (
                          <div className="mt-1 text-[12px] font-medium text-[#0f766e]">You save {formatCurrency(hotel.savings, language)} on the direct rate</div>
                        )}
                      </div>
                      <div className="rounded-2xl bg-[#1abc9c] px-4 py-2.5 text-[13px] font-semibold text-white shadow-lg shadow-[#1abc9c]/20 transition-all duration-300 group-hover:bg-[#159a81]">
                        View
                      </div>
                    </div>
                  </div>
                </Link>
              );
              })}
            </div>

            <div className="mt-8 flex items-center justify-center gap-2 md:gap-3">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-2 rounded-lg border border-[#d1d5db] bg-white text-[#374151] disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#1abc9c]"
              >
                Prev
              </button>

              {visiblePages.map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`min-w-[40px] px-3 py-2 rounded-lg border text-[14px] font-semibold transition-colors ${
                    page === currentPage
                      ? "bg-[#1abc9c] border-[#1abc9c] text-white"
                      : "bg-white border-[#d1d5db] text-[#374151] hover:border-[#1abc9c]"
                  }`}
                >
                  {page}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-2 rounded-lg border border-[#d1d5db] bg-white text-[#374151] disabled:opacity-50 disabled:cursor-not-allowed hover:border-[#1abc9c]"
              >
                Next
              </button>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
