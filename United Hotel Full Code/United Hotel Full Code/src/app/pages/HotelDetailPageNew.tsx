import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { Navigation } from "../components/Navigation";
import { Footer } from "../components/Footer";
import { HotelDetailLoader } from "../components/HotelLoadingState";
import { useBooking } from "../context/BookingContext";
import { hotelService, type PublicHotel, type PublicHotelRoom } from "../services/api";
import { useLanguage } from "../context/LanguageContext";
import {
  MapPin,
  Star,
  Calendar,
  Users,
  ChevronLeft,
  Globe,
  ExternalLink,
  Map,
  Sparkles,
  TrendingDown,
  Building2,
  Clock,
  Phone,
  Mail,
  User,
  BedDouble,
  Hash,
  CheckCircle,
  PawPrint,
  Cigarette,
  Baby,
  AlarmClock,
} from "lucide-react";
import imgImageHotel from "figma:asset/24b94370ae50cf05c8eda404c2045b52c5b68320.png";
import imgImageHotel1 from "figma:asset/126d7e43c8c296ca95f6cc5a2e933adaced67080.png";
import imgImageHotel2 from "figma:asset/2192c11a429594d69f4c28f4fc3ed22cdc4449b5.png";

const STATIC_IMAGES = [imgImageHotel, imgImageHotel1, imgImageHotel2];

// ─── Helpers ───────────────────────────────────────────────────────────────

/** Converts "14:00:00" or "14:00" -> "2:00 PM" */
function formatTime(value: string | null | undefined): string | null {
  if (!value) return null;
  const match = String(value).trim().match(/^(\d{1,2}):(\d{2})/);
  if (!match) return value;
  let hours = parseInt(match[1], 10);
  const minutes = match[2];
  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;
  return minutes === "00" ? `${hours}:00 ${ampm}` : `${hours}:${minutes} ${ampm}`;
}

/** Formats a price number + currency code into a human-readable string */
function formatPrice(amount: number | null | undefined, currencyCode?: string | null): string | null {
  if (amount == null || !Number.isFinite(Number(amount)) || Number(amount) <= 0) return null;
  const code = (currencyCode || "TRY").toUpperCase();
  const symbols: Record<string, string> = { TRY: "TL", USD: "$", EUR: "€", GBP: "£" };
  const symbol = symbols[code] ?? (code + " ");
  const formatted = new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(Number(amount));
  return `${symbol}${formatted}`;
}

/** Returns star count clamped 0-5 */
function getStarCount(starRating: number | null | undefined): number {
  const n = parseInt(String(starRating ?? 0), 10);
  return Number.isNaN(n) ? 0 : Math.max(0, Math.min(5, n));
}

const toAmenityText = (item: { name: string } | string): string => {
  if (typeof item === "string") return item;
  return item?.name || "";
};

const capitalizeWords = (text: string): string =>
  String(text || "")
    .toLowerCase()
    .replace(/\b\w/g, (ch) => ch.toUpperCase());

const normalizeCategory = (v?: string | null) => String(v || "").trim().toLowerCase();

// ─── HotelHero ─────────────────────────────────────────────────────────────

interface HotelHeroProps {
  hotel: PublicHotel;
  image: string;
}

function HotelHero({ hotel, image }: HotelHeroProps) {
  const { t } = useLanguage();
  const starCount = getStarCount(hotel.starRating ?? hotel.star_rating);
  const name = hotel.hotel_name || hotel.name || "Hotel";
  const address = hotel.location_raw || hotel.address || hotel.location || "";
  const websiteUrl = hotel.hotel_link || hotel.hotelLink;
  const mapsUrl =
    hotel.google_maps_link ||
    hotel.googleMapsLink ||
    (() => {
      const q = [name, address].filter(Boolean).join(", ");
      return q ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(q)}` : null;
    })();

  return (
    <div className="relative h-[260px] md:h-[420px] rounded-2xl overflow-hidden mb-6">
      <img src={image} alt={name} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/30 to-transparent" />

      {starCount > 0 && (
        <div className="absolute top-4 left-4 flex gap-0.5">
          {Array.from({ length: starCount }).map((_, i) => (
            <Star key={i} className="w-5 h-5 fill-[#FFA500] text-[#FFA500] drop-shadow" />
          ))}
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
        <h1 className="font-['Poppins:Bold',sans-serif] text-[28px] md:text-[42px] leading-tight text-white mb-2 drop-shadow-lg">
          {t(name)}
        </h1>
        {address && (
          <div className="flex items-start gap-2 text-white/90 text-[14px] md:text-[16px]">
            <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{t(address)}</span>
          </div>
        )}
        <div className="flex flex-wrap gap-3 mt-4">
          {websiteUrl && (
            <a
              href={websiteUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/20 backdrop-blur-sm px-4 py-2 text-[13px] font-semibold text-white hover:bg-white/30 transition-all"
            >
              <Globe className="w-4 h-4" /> Official Website <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          {mapsUrl && (
            <a
              href={mapsUrl}
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/20 backdrop-blur-sm px-4 py-2 text-[13px] font-semibold text-white hover:bg-white/30 transition-all"
            >
              <Map className="w-4 h-4" /> Google Maps <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── HotelQuickFacts ───────────────────────────────────────────────────────

interface HotelQuickFactsProps {
  hotel: PublicHotel;
}

function HotelQuickFacts({ hotel }: HotelQuickFactsProps) {
  const checkIn = formatTime(hotel.check_in_time ?? hotel.checkInTime);
  const checkOut = formatTime(hotel.check_out_time ?? hotel.checkOutTime);
  const phone = hotel.contact_phone || hotel.contactPhone;

  type Fact = { icon: React.ReactNode; label: string; value: string };
  const facts: Fact[] = [
    checkIn && ({
      icon: <AlarmClock className="w-5 h-5 text-[#1abc9c]" />,
      label: "Check-in from",
      value: checkIn,
    } as Fact),
    checkOut && ({
      icon: <Clock className="w-5 h-5 text-[#1abc9c]" />,
      label: "Check-out by",
      value: checkOut,
    } as Fact),
    phone && ({
      icon: <Phone className="w-5 h-5 text-[#1abc9c]" />,
      label: "Phone",
      value: phone,
    } as Fact),
  ].filter(Boolean) as Fact[];

  if (!facts.length) return null;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
      {facts.map((fact) => (
        <div
          key={fact.label}
          className="bg-white rounded-2xl border border-[#eaeaea] p-4 flex items-start gap-3"
        >
          <div className="mt-0.5 shrink-0">{fact.icon}</div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#9ca3af] mb-1">
              {fact.label}
            </div>
            <div className="text-[15px] font-semibold text-[#1f2937]">{fact.value}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── AmenitiesList ─────────────────────────────────────────────────────────

interface AmenitiesListProps {
  amenities: string[];
}

function AmenitiesList({ amenities }: AmenitiesListProps) {
  const { t } = useLanguage();
  if (!amenities.length) {
    return (
      <p className="text-[14px] text-[#9ca3af] italic">No amenities listed for this hotel.</p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {amenities.map((name, i) => (
        <span
          key={`${name}-${i}`}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#f0fdf9] border border-[#bbf7e4] rounded-full text-[13px] font-medium text-[#0f766e]"
        >
          {t(capitalizeWords(name))}
        </span>
      ))}
    </div>
  );
}

// ─── RoomCategoryCard ──────────────────────────────────────────────────────

interface RoomCategoryCardProps {
  room: PublicHotelRoom;
  index: number;
  recommendation?: { recommendedPrice?: number; basePrice?: number; discountPercent?: number; savingsAmount?: number } | null;
  isSelected: boolean;
  onSelect: () => void;
  canBook: boolean;
}

function RoomCategoryCard({ room, index, recommendation, isSelected, onSelect, canBook }: RoomCategoryCardProps) {
  const { t } = useLanguage();
  const image = STATIC_IMAGES[index % STATIC_IMAGES.length];
  const currency = room.currency_code || "TRY";
  const recommendedPrice = Number(recommendation?.recommendedPrice || 0);
  const fallbackBase = Number(room.price_per_night || room.base_price || 0);
  const displayPrice = recommendedPrice > 0 ? recommendedPrice : fallbackBase;
  const basePrice = Number(recommendation?.basePrice || fallbackBase || 0);
  const hasDiscount = Number(recommendation?.discountPercent || 0) > 0 && basePrice > displayPrice;
  const savings = Number(recommendation?.savingsAmount || Math.max(0, basePrice - displayPrice));

  const occupancyLabel =
    room.occupancy_type === "single_double" ? "Single / Double" :
    room.occupancy_type === "single" ? "Single" :
    room.occupancy_type === "double" ? "Double" :
    room.occupancy_type === "triple" ? "Triple" :
    room.occupancy_type ? String(room.occupancy_type) : null;

  return (
    <div
      className={`border rounded-3xl overflow-hidden transition-all duration-300 ${
        isSelected
          ? "border-[#1abc9c] shadow-[0_12px_40px_rgba(26,188,156,0.15)] bg-[#f0fdf9]"
          : "border-[#eaeaea] hover:border-[#a7f3d0] hover:shadow-[0_8px_30px_rgba(0,0,0,0.07)]"
      }`}
    >
      <div className="grid grid-cols-1 md:grid-cols-[160px_1fr_auto]">
        <div className="relative h-[140px] md:h-full overflow-hidden">
          <img src={image} alt={room.room_name} className="w-full h-full object-cover" />
          {hasDiscount && (
            <div className="absolute top-2 left-2 inline-flex items-center gap-1 rounded-full bg-[#10b981] px-2.5 py-1 text-[11px] font-bold text-white">
              <TrendingDown className="w-3 h-3" />
              -{Number(recommendation?.discountPercent || 0).toFixed(0)}%
            </div>
          )}
        </div>

        <div className="p-4 md:p-5">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <h3 className="font-['Poppins:SemiBold',sans-serif] text-[18px] text-[#1f2937]">
              {t(room.room_name || `Room ${index + 1}`)}
            </h3>
            <span className="inline-flex items-center gap-1 rounded-full border border-[#d9ece6] bg-[#f5fbf8] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-[#0f766e]">
              <Sparkles className="w-3 h-3" /> Direct rate
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-[13px] text-[#6b7280] mb-3">
            {room.room_category && room.room_category !== "unknown" && (
              <span className="inline-flex items-center gap-1 capitalize">
                <BedDouble className="w-3.5 h-3.5" /> {t(room.room_category)}
              </span>
            )}
            {occupancyLabel && (
              <span className="inline-flex items-center gap-1">
                <Users className="w-3.5 h-3.5" /> {t(occupancyLabel)}
              </span>
            )}
            {room.occupancy_code && (
              <span className="inline-flex items-center gap-1">
                <Hash className="w-3.5 h-3.5" /> {room.occupancy_code}
              </span>
            )}
          </div>

          {room.price_raw && (
            <div className="text-[12px] text-[#9ca3af]">{room.price_raw}</div>
          )}
        </div>

        <div className="flex flex-col items-end justify-between p-4 md:p-5 border-t md:border-t-0 md:border-l border-[#f3f4f6]">
          <div className="text-right mb-3">
            {hasDiscount && basePrice > displayPrice && (
              <div className="text-[12px] text-[#9ca3af] line-through">
                {formatPrice(basePrice, currency)}
              </div>
            )}
            {displayPrice > 0 ? (
              <>
                <div className="text-[28px] leading-8 font-['Poppins:Bold',sans-serif] text-[#0f766e]">
                  {formatPrice(displayPrice, currency)}
                </div>
                <div className="text-[12px] text-[#9ca3af]">per night</div>
              </>
            ) : (
              <div className="text-[14px] text-[#9ca3af] italic">Price on request</div>
            )}
            {savings > 0 && (
              <div className="mt-1 text-[12px] font-medium text-[#10b981]">
                Save {formatPrice(savings, currency)}
              </div>
            )}
          </div>

          {canBook && (
            <button
              onClick={onSelect}
              className={`px-4 py-2 rounded-xl text-[13px] font-semibold min-w-[110px] transition-all ${
                isSelected
                  ? "bg-[#1abc9c] text-white shadow-[0_4px_14px_rgba(26,188,156,0.35)]"
                  : "bg-[#1abc9c] text-white hover:bg-[#16a085]"
              }`}
            >
              {isSelected ? (
                <span className="inline-flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4" /> Selected
                </span>
              ) : (
                "Select Room"
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── HotelPolicies ─────────────────────────────────────────────────────────

interface HotelPoliciesProps {
  childPolicy?: string | null;
  petPolicy?: string | null;
  smokingPolicy?: string | null;
}

function HotelPolicies({ childPolicy, petPolicy, smokingPolicy }: HotelPoliciesProps) {
  const { t } = useLanguage();
  type Policy = { icon: React.ReactNode; label: string; text: string; bg: string; titleColor: string };
  const policies: Policy[] = [
    childPolicy && ({
      icon: <Baby className="w-5 h-5 text-[#6366f1]" />,
      label: "Children Policy",
      text: childPolicy,
      bg: "bg-[#f5f3ff] border-[#ede9fe]",
      titleColor: "text-[#6366f1]",
    } as Policy),
    petPolicy && ({
      icon: <PawPrint className="w-5 h-5 text-[#f59e0b]" />,
      label: "Pet Policy",
      text: petPolicy,
      bg: "bg-[#fffbeb] border-[#fde68a]",
      titleColor: "text-[#d97706]",
    } as Policy),
    smokingPolicy && ({
      icon: <Cigarette className="w-5 h-5 text-[#ef4444]" />,
      label: "Smoking Policy",
      text: smokingPolicy,
      bg: "bg-[#fef2f2] border-[#fecaca]",
      titleColor: "text-[#ef4444]",
    } as Policy),
  ].filter(Boolean) as Policy[];

  if (!policies.length) {
    return <p className="text-[14px] text-[#9ca3af] italic">No policy information available.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {policies.map((p) => (
        <div key={p.label} className={`rounded-2xl border p-4 ${p.bg}`}>
          <div className={`flex items-center gap-2 mb-2 font-semibold text-[14px] ${p.titleColor}`}>
            {p.icon} {t(p.label)}
          </div>
          <p className="text-[13px] text-[#374151] leading-[20px]">{t(p.text)}</p>
        </div>
      ))}
    </div>
  );
}

// ─── HotelContactCard ──────────────────────────────────────────────────────

interface HotelContactCardProps {
  contactName?: string | null;
  contactPhone?: string | null;
  email?: string | null;
}

function HotelContactCard({ contactName, contactPhone, email }: HotelContactCardProps) {
  return (
    <div className="bg-[#f8fafc] rounded-2xl border border-[#e2e8f0] p-5 flex flex-col gap-4">
      {contactName && (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#e0f2fe] flex items-center justify-center shrink-0">
            <User className="w-4 h-4 text-[#0284c7]" />
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#94a3b8]">Contact Person</div>
            <div className="text-[15px] font-semibold text-[#1e293b]">{contactName}</div>
          </div>
        </div>
      )}
      {contactPhone && (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#dcfce7] flex items-center justify-center shrink-0">
            <Phone className="w-4 h-4 text-[#16a34a]" />
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#94a3b8]">Phone</div>
            <a href={`tel:${contactPhone}`} className="text-[15px] font-semibold text-[#1e293b] hover:text-[#1abc9c] transition-colors">
              {contactPhone}
            </a>
          </div>
        </div>
      )}
      {email && (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#fef3c7] flex items-center justify-center shrink-0">
            <Mail className="w-4 h-4 text-[#d97706]" />
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#94a3b8]">Email</div>
            <a href={`mailto:${email}`} className="text-[15px] font-semibold text-[#1e293b] hover:text-[#1abc9c] transition-colors wrap-break-word">
              {email}
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Section wrapper ────────────────────────────────────────────────────────

function Section({ title, icon, children }: { title: string; icon?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl p-5 md:p-8 border border-[#eaeaea] mb-5">
      <div className="flex items-center gap-2.5 mb-5">
        {icon && <span className="text-[#1abc9c]">{icon}</span>}
        <h2 className="font-['Poppins:Bold',sans-serif] text-[22px] text-[#1f2937]">{title}</h2>
      </div>
      {children}
    </div>
  );
}

// ─── ViewRoom type (for booking sidebar) ───────────────────────────────────

type ViewRoom = {
  id: string;
  name: string;
  price: number;
  basePrice: number | null;
  savingsAmount: number;
  available: number;
};

const getRoomRecommendation = (room: PublicHotelRoom, hotel: PublicHotel, index: number) => {
  const recommendations = Array.isArray(hotel.recommendedPrices) ? hotel.recommendedPrices : [];
  const roomId = room.id == null ? null : Number(room.id);
  const roomCategory = normalizeCategory(room.room_category || room.category);
  return (
    recommendations.find((e) => Number(e.roomId) === roomId) ||
    recommendations.find((e) => normalizeCategory(e.category || e.roomCategory) === roomCategory) ||
    recommendations[index] ||
    null
  );
};

const mapToViewRoom = (room: PublicHotelRoom, hotel: PublicHotel, index: number): ViewRoom => {
  const rec = getRoomRecommendation(room, hotel, index);
  const recommendedPrice = Number(rec?.recommendedPrice || 0);
  const fallbackBase = Number(room.price_per_night || room.base_price || 0);
  const roomPrice = recommendedPrice > 0 ? recommendedPrice : fallbackBase;
  const basePriceValue = Number(rec?.basePrice || fallbackBase || 0);
  const basePrice = basePriceValue > roomPrice ? basePriceValue : null;
  return {
    id: String(room.id || `room-${index + 1}`),
    name: room.room_name || `Room ${index + 1}`,
    price: roomPrice,
    basePrice,
    savingsAmount: Number(rec?.savingsAmount || Math.max(0, (basePrice || 0) - roomPrice)),
    available: Number(room.available_rooms ?? 1),
  };
};

// ─── Main page ──────────────────────────────────────────────────────────────

export function HotelDetailPageNew() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { setHotel, setRoom, setDates, setGuests, setRoomCount } = useBooking();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hotel, setHotelState] = useState<PublicHotel | null>(null);
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guestCount, setGuestCount] = useState(2);
  const [roomCount, setSelectedRoomCount] = useState(1);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [id]);

  useEffect(() => {
    const today = new Date();
    const tomorrow = new Date(Date.now() + 86400000);
    setCheckIn(today.toISOString().split("T")[0]);
    setCheckOut(tomorrow.toISOString().split("T")[0]);
  }, []);

  useEffect(() => {
    if (!checkIn || !checkOut) return;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    if (end <= start) {
      const next = new Date(start.getTime() + 86400000);
      setCheckOut(next.toISOString().split("T")[0]);
    }
  }, [checkIn, checkOut]);

  useEffect(() => {
    if (!id) return;
    let active = true;
    setLoading(true);
    setError(null);
    hotelService
      .getById(id)
      .then((found) => {
        if (!active) return;
        if (!found) setError("Hotel not found");
        else setHotelState(found);
      })
      .catch((e: any) => {
        if (!active) return;
        setError(e?.data?.error || e?.message || "Failed to load hotel");
      })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id]);

  const bookableRooms = useMemo<ViewRoom[]>(() => {
    if (!hotel || !Array.isArray(hotel.rooms)) return [];
    return hotel.rooms
      .map((room, index) => mapToViewRoom(room, hotel, index))
      .filter((room) => room.price > 0 && Number.isFinite(Number(room.id)));
  }, [hotel]);

  const selectedRoom = bookableRooms.find((r) => r.id === selectedRoomId) ?? null;

  const roomCountOptions = useMemo(() => {
    const max = Math.max(1, Math.min(selectedRoom?.available ?? 1, 8));
    return Array.from({ length: max }, (_, i) => i + 1);
  }, [selectedRoom]);

  useEffect(() => {
    if (roomCount > roomCountOptions.length) setSelectedRoomCount(roomCountOptions.length);
  }, [roomCount, roomCountOptions]);

  const handleSelectRoom = (viewRoom: ViewRoom) => {
    setSelectedRoomId(viewRoom.id);
    if (!hotel) return;
    setHotel({
      id: String(hotel.id),
      name: hotel.hotel_name || hotel.name || "Hotel",
      location: hotel.location_raw || hotel.location || "Turkey",
      image: STATIC_IMAGES[0],
    });
    setRoom({ id: viewRoom.id, name: viewRoom.name, price: viewRoom.price });
    setDates(checkIn, checkOut);
    setGuests(guestCount);
    setRoomCount(roomCount);
  };

  const handleContinue = () => {
    if (!selectedRoom || !hotel) return;
    setGuests(guestCount);
    setRoomCount(roomCount);
    navigate("/booking/step1");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa]">
        <Navigation />
        <main className="max-w-[1840px] mx-auto px-4 md:px-10 py-10"><HotelDetailLoader /></main>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="min-h-screen bg-[#fafafa]">
        <Navigation />
        <main className="max-w-[1840px] mx-auto px-4 md:px-10 py-10">
          <div className="bg-white border border-red-200 rounded-2xl p-8 text-red-600 mb-4">{error || "Hotel not found"}</div>
          <Link to="/listing" className="text-[#1abc9c] hover:text-[#16a085]">← Back to listing</Link>
        </main>
      </div>
    );
  }

  // Derived data
  const heroImage = STATIC_IMAGES[0];
  const amenities = (hotel.amenities || []).map(toAmenityText).filter(Boolean);
  const description = hotel.hotel_description || hotel.description;
  const childPolicy = hotel.child_policy || hotel.childPolicy;
  const petPolicy = hotel.pet_policy || hotel.petPolicy;
  const smokingPolicy = hotel.smoking_policy || hotel.smokingPolicy;
  const contactName = hotel.contact_name || hotel.contactName;
  const contactPhone = hotel.contact_phone || hotel.contactPhone;
  const email = hotel.email;

  // All rooms for display: prefer hotel.rooms (with IDs), fallback to roomCategories
  const allDisplayRooms: PublicHotelRoom[] =
    Array.isArray(hotel.rooms) && hotel.rooms.length > 0
      ? hotel.rooms
      : (Array.isArray(hotel.roomCategories)
          ? hotel.roomCategories.map((rc: any, i: number) => ({
              id: null,
              room_name: rc.room_name || `Room ${i + 1}`,
              room_category: rc.room_category || "standard",
              occupancy_code: rc.occupancy_code || null,
              occupancy_type: rc.occupancy_type || null,
              price_per_night: Number(rc.base_price || 0),
              base_price: Number(rc.base_price || 0),
              currency_code: rc.currency_code || "TRY",
              price_raw: rc.price_raw || null,
            }))
          : []);

  const priceDisplay = selectedRoom?.price
    ? formatPrice(selectedRoom.price, "TRY") ?? `${selectedRoom.price.toFixed(2)}`
    : null;

  const nights = checkIn && checkOut
    ? Math.max(1, Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / 86400000))
    : 1;

  return (
    <div className="bg-[#fafafa] min-h-screen">
      <Navigation />

      <main className="max-w-[1840px] mx-auto px-4 md:px-10 py-6 md:py-10 fade-up-enter">
        <Link
          to="/listing"
          className="inline-flex items-center gap-1.5 text-[#1abc9c] hover:text-[#16a085] mb-4 text-[14px] font-semibold"
        >
          <ChevronLeft className="w-4 h-4" /> Back to all hotels
        </Link>

        {/* 1. Hero */}
        <HotelHero hotel={hotel} image={heroImage} />

        {/* 2. Quick Facts */}
        <HotelQuickFacts hotel={hotel} />

        {/* Two-column layout */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_380px] gap-6 items-start">

          {/* ── Left column ── */}
          <div>

            {/* 3. About */}
            {description && (
              <Section title="About This Hotel" icon={<Building2 className="w-5 h-5" />}>
                <p className="text-[15px] text-[#4b5563] leading-[26px] whitespace-pre-line">{t(description)}</p>
              </Section>
            )}

            {/* 4. Amenities */}
            <Section title="Amenities" icon={<CheckCircle className="w-5 h-5" />}>
              <AmenitiesList amenities={amenities} />
            </Section>

            {/* 5. Room Categories */}
            <Section title="Room Types" icon={<BedDouble className="w-5 h-5" />}>
              {allDisplayRooms.length === 0 ? (
                <p className="text-[14px] text-[#9ca3af] italic">No room information available for this hotel.</p>
              ) : (
                <div className="space-y-4">
                  {allDisplayRooms.map((room, index) => {
                    const viewRoom = bookableRooms.find(
                      (br) => (room.id != null && String(br.id) === String(room.id)) || br.name === room.room_name
                    );
                    const isSelected = !!viewRoom && selectedRoomId === viewRoom.id;
                    const rec = getRoomRecommendation(room, hotel, index);
                    return (
                      <RoomCategoryCard
                        key={room.id != null ? String(room.id) : `dr-${index}`}
                        room={room}
                        index={index}
                        recommendation={rec}
                        isSelected={isSelected}
                        onSelect={() => { if (viewRoom) handleSelectRoom(viewRoom); }}
                        canBook={!!viewRoom}
                      />
                    );
                  })}
                </div>
              )}
            </Section>

            {/* 6. Policies */}
            {(childPolicy || petPolicy || smokingPolicy) && (
              <Section title="Hotel Policies" icon={<CheckCircle className="w-5 h-5" />}>
                <HotelPolicies childPolicy={childPolicy} petPolicy={petPolicy} smokingPolicy={smokingPolicy} />
              </Section>
            )}

            {/* 7. Contact */}
            {(contactName || contactPhone || email) && (
              <Section title="Contact Information" icon={<Phone className="w-5 h-5" />}>
                <HotelContactCard contactName={contactName} contactPhone={contactPhone} email={email} />
              </Section>
            )}

          </div>

          {/* ── Sticky Booking Sidebar ── */}
          <aside className="bg-white rounded-2xl p-5 md:p-6 border border-[#eaeaea] h-fit md:sticky md:top-24">
            <h3 className="font-['Poppins:SemiBold',sans-serif] text-[20px] text-[#1f2937] mb-4">
              Reserve Your Stay
            </h3>

            <div className="space-y-4 mb-5">
              <div>
                <label className="block text-[13px] font-medium text-[#6b7280] mb-1">Check-in</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8c8c8c]" />
                  <input
                    type="date"
                    value={checkIn}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setCheckIn(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 border border-[#eaeaea] rounded-lg text-[14px] focus:outline-none focus:border-[#1abc9c] focus:ring-2 focus:ring-[#1abc9c]/15"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#6b7280] mb-1">Check-out</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8c8c8c]" />
                  <input
                    type="date"
                    value={checkOut}
                    min={checkIn || new Date().toISOString().split("T")[0]}
                    onChange={(e) => setCheckOut(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 border border-[#eaeaea] rounded-lg text-[14px] focus:outline-none focus:border-[#1abc9c] focus:ring-2 focus:ring-[#1abc9c]/15"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#6b7280] mb-1">Guests</label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8c8c8c]" />
                  <select
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                    className="w-full pl-9 pr-3 py-2.5 border border-[#eaeaea] rounded-lg text-[14px] focus:outline-none focus:border-[#1abc9c] appearance-none"
                  >
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <option key={n} value={n}>{n} {n === 1 ? "guest" : "guests"}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[13px] font-medium text-[#6b7280] mb-1">Rooms</label>
                <select
                  value={roomCount}
                  onChange={(e) => setSelectedRoomCount(Number(e.target.value))}
                  disabled={!selectedRoom}
                  className="w-full px-3 py-2.5 border border-[#eaeaea] rounded-lg text-[14px] focus:outline-none focus:border-[#1abc9c] disabled:opacity-50"
                >
                  {roomCountOptions.map((n) => (
                    <option key={n} value={n}>{n} {n === 1 ? "room" : "rooms"}</option>
                  ))}
                </select>
                <p className="mt-1 text-[12px] text-[#9ca3af]">
                  {selectedRoom ? `${selectedRoom.available} available` : "Select a room first"}
                </p>
              </div>
            </div>

            <div className="mb-4 rounded-xl bg-[#f0fdf9] border border-[#bbf7e4] px-3 py-2 text-[13px] text-[#0f766e] font-medium">
              {nights} {nights === 1 ? "night" : "nights"} selected
            </div>

            {/* Selected room summary */}
            <div className="rounded-xl border border-[#eaeaea] bg-[#fafafa] p-4 mb-4">
              <div className="text-[12px] font-semibold uppercase tracking-[0.1em] text-[#9ca3af] mb-1">
                Selected Room
              </div>
              {selectedRoom ? (
                <>
                  <div className="font-semibold text-[#1f2937] text-[15px]">{selectedRoom.name}</div>
                  <div className="text-[13px] text-[#6b7280] mt-0.5">
                    {priceDisplay} per night × {roomCount} {roomCount === 1 ? "room" : "rooms"}
                  </div>
                  {selectedRoom.basePrice && selectedRoom.basePrice > selectedRoom.price && (
                    <div className="mt-1 text-[12px] text-[#10b981] font-medium">
                      Save {formatPrice(selectedRoom.savingsAmount * roomCount, "TRY")} vs. base rate
                    </div>
                  )}
                </>
              ) : (
                <div className="text-[14px] text-[#9ca3af] italic">No room selected yet</div>
              )}
            </div>

            <button
              onClick={handleContinue}
              disabled={!selectedRoom}
              className="w-full bg-[#1abc9c] text-white py-3.5 rounded-xl font-semibold text-[15px] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#16a085] transition-colors shadow-[0_4px_14px_rgba(26,188,156,0.3)]"
            >
              Continue to Booking
            </button>

            <p className="mt-3 text-[12px] text-[#9ca3af] text-center">
              Free cancellation on most rooms · No card required yet
            </p>
          </aside>

        </div>
      </main>

      <Footer />
    </div>
  );
}
