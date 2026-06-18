import { useState, useEffect, useRef } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// ROOM IMAGE SETS  (exterior + interior rooms per property type)
// All Unsplash royalty-free. Replace with client's real photos later.
// ─────────────────────────────────────────────────────────────────────────────
const ROOM_SETS = {
  villa: [
    { label: "Exterior",  url: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=900&q=85" },
    { label: "Living Room", url: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=900&q=85" },
    { label: "Master Bedroom", url: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=900&q=85" },
    { label: "Kitchen",   url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&q=85" },
    { label: "Bathroom",  url: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=900&q=85" },
    { label: "Garden",    url: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=900&q=85" },
  ],
  bungalow: [
    { label: "Exterior",  url: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=900&q=85" },
    { label: "Hall",      url: "https://images.unsplash.com/photo-1600210492493-0946911123ea?w=900&q=85" },
    { label: "Bedroom",   url: "https://images.unsplash.com/photo-1505693314120-0d443867891c?w=900&q=85" },
    { label: "Kitchen",   url: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=900&q=85" },
    { label: "Bathroom",  url: "https://images.unsplash.com/photo-1604578762246-41134e37f9cc?w=900&q=85" },
    { label: "Garden",    url: "https://images.unsplash.com/photo-1585320806297-9794b3e4aaae?w=900&q=85" },
  ],
  house: [
    { label: "Exterior",  url: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=900&q=85" },
    { label: "Living Room", url: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=900&q=85" },
    { label: "Bedroom",   url: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=900&q=85" },
    { label: "Kitchen",   url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&q=85" },
    { label: "Bathroom",  url: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=900&q=85" },
    { label: "Toilet",    url: "https://images.unsplash.com/photo-1604578762246-41134e37f9cc?w=900&q=85" },
  ],
  apartment: [
    { label: "Exterior",  url: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=900&q=85" },
    { label: "Hall",      url: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=900&q=85" },
    { label: "Bedroom",   url: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=900&q=85" },
    { label: "Kitchen",   url: "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=900&q=85" },
    { label: "Bathroom",  url: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=900&q=85" },
  ],
  shared: [
    { label: "Common Area", url: "https://images.unsplash.com/photo-1555636222-cae831e670b3?w=900&q=85" },
    { label: "Room",      url: "https://images.unsplash.com/photo-1631049552240-59c37f38802b?w=900&q=85" },
    { label: "Kitchen",   url: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=900&q=85" },
    { label: "Bathroom",  url: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=900&q=85" },
  ],
};

function roomSet(type) {
  const t = type.toLowerCase();
  if (t.includes("villa"))    return ROOM_SETS.villa;
  if (t.includes("bungalow")) return ROOM_SETS.bungalow;
  if (t.includes("house"))    return ROOM_SETS.house;
  if (t.includes("shared"))   return ROOM_SETS.shared;
  return ROOM_SETS.apartment;
}

// ─────────────────────────────────────────────────────────────────────────────
// PROPERTIES — fictional names & fictional locations, every filter covered
// ─────────────────────────────────────────────────────────────────────────────
const PROPERTIES = [
  // ── HOUSE ─────────────────────────────────
  {
    id: 1, name: "Emerald Hills 4BHK House", location: "Greenwood Heights, Northvale",
    price: 13500000, priceLabel: "₹1.35 Cr", purpose: "Buy", type: "House",
    beds: 4, baths: 3, area: "2,600 sq ft",
    desc: "Independent 4-bedroom house in a peaceful hillside community. Vaulted ceilings, open terrace, and a private garden backing onto the nature reserve. Perfect for families who value space and serenity.",
    amenities: ["Private Garden", "Open Terrace", "Modular Kitchen", "CCTV", "Solar Water Heater", "2-Car Garage"],
    featured: true,
  },
  {
    id: 2, name: "Maple Grove House 3BHK", location: "Silverleaf Colony, Westbridge",
    price: 8200000, priceLabel: "₹82 L", purpose: "Buy", type: "House",
    beds: 3, baths: 2, area: "1,950 sq ft",
    desc: "Charming 3-bedroom independent house with a large front yard, teak wood flooring, and a classic wrap-around porch. Quiet neighbourhood, top-rated schools nearby.",
    amenities: ["Front Yard", "Teak Flooring", "Power Backup", "Rainwater Harvesting", "CCTV"],
    featured: false,
  },
  {
    id: 3, name: "Riverside Nest 2BHK House", location: "Maplewood Lane, Eastford",
    price: 45000, priceLabel: "₹45,000/mo", purpose: "Rent", type: "House",
    beds: 2, baths: 2, area: "1,200 sq ft",
    desc: "Cosy 2-bedroom rental home by the riverside with a private garden, gated compound, and covered parking. Ideal for small families and working couples.",
    amenities: ["Private Garden", "Covered Parking", "Gated", "Pet-Friendly", "Power Backup"],
    featured: false,
  },

  // ── BUNGALOW ───────────────────────────────
  {
    id: 4, name: "The Ashwood Bungalow 5BHK", location: "Palm Ridge Estate, Sunvale",
    price: 22000000, priceLabel: "₹2.2 Cr", purpose: "Buy", type: "Bungalow",
    beds: 5, baths: 4, area: "4,800 sq ft",
    desc: "Corner bungalow with sprawling interiors, a chef's kitchen, and a Zen-inspired courtyard garden. Crafted with Italian marble and premium teakwood throughout.",
    amenities: ["Private Courtyard", "Study Room", "Staff Quarters", "Smart Home", "Jacuzzi", "Garden"],
    featured: true,
  },
  {
    id: 5, name: "Royal Palms Bungalow 5BHK", location: "Hilltop Gardens, Goldencrest",
    price: 31000000, priceLabel: "₹3.1 Cr", purpose: "Buy", type: "Bungalow",
    beds: 5, baths: 5, area: "6,200 sq ft",
    desc: "Ultra-luxury bungalow with resort-style swimming pool, basement home theatre, and a 6-car garage. Unmatched craftsmanship — an estate that sets a new benchmark.",
    amenities: ["Resort Pool", "Home Theatre", "Wine Cellar", "Elevator", "Smart Home", "Staff Quarters"],
    featured: true,
  },
  {
    id: 6, name: "Sunset Breeze Bungalow Rental", location: "Amber Vale, Northcliff",
    price: 95000, priceLabel: "₹95,000/mo", purpose: "Rent", type: "Bungalow",
    beds: 4, baths: 3, area: "3,400 sq ft",
    desc: "Furnished bungalow for rent with a lush private garden, open-air dining deck, and breathtaking sunset views. Available immediately for senior executives and diplomats.",
    amenities: ["Furnished", "Private Garden", "Open Deck", "Smart TV", "Pool", "Housekeeping"],
    featured: false,
  },

  // ── APARTMENT ──────────────────────────────
  {
    id: 7, name: "Skyline Residences 3BHK", location: "Crystal Tower Road, Lakecrest",
    price: 9500000, priceLabel: "₹95 L", purpose: "Buy", type: "Apartment",
    beds: 3, baths: 2, area: "1,450 sq ft",
    desc: "Luxury 3BHK apartment with panoramic city views on the 14th floor. Italian marble flooring, modular kitchen, and a dedicated workspace alcove.",
    amenities: ["Gym", "Rooftop Garden", "Concierge", "EV Charging", "Club House"],
    featured: true,
  },
  {
    id: 8, name: "Pearl Tower 3BHK Apartment", location: "Sunrise Boulevard, Hillpark",
    price: 7800000, priceLabel: "₹78 L", purpose: "Buy", type: "Apartment",
    beds: 3, baths: 2, area: "1,280 sq ft",
    desc: "Premium 3BHK offering stunning mountain views. Vastu-compliant layout with ample cross ventilation, premium fixtures, and a spacious balcony.",
    amenities: ["Club House", "Amphitheatre", "Jogging Track", "Smart Security"],
    featured: true,
  },
  {
    id: 9, name: "Azure Skypad 2BHK", location: "Riverside Walk, Clearwater",
    price: 5800000, priceLabel: "₹58 L", purpose: "Buy", type: "Apartment",
    beds: 2, baths: 2, area: "1,050 sq ft",
    desc: "Thoughtfully designed 2BHK with large bay windows and a wrap-around balcony. Near the commercial district and top international schools.",
    amenities: ["Balcony", "Power Backup", "Swimming Pool", "Gym", "Visitor Parking"],
    featured: false,
  },
  {
    id: 10, name: "Sapphire Studio 1BHK", location: "Tech Hub Lane, Ironwood",
    price: 18000, priceLabel: "₹18,000/mo", purpose: "Rent", type: "Apartment",
    beds: 1, baths: 1, area: "520 sq ft",
    desc: "Fully furnished studio apartment ideal for working professionals. 2 minutes from the IT corridor, with high-speed internet and all modern amenities.",
    amenities: ["Furnished", "High-Speed WiFi", "Power Backup", "Parking"],
    featured: false,
  },
  {
    id: 11, name: "Lotus Garden 2BHK Flat", location: "Garden View Complex, Maplewood",
    price: 28000, priceLabel: "₹28,000/mo", purpose: "Rent", type: "Apartment",
    beds: 2, baths: 2, area: "980 sq ft",
    desc: "Spacious 2BHK in a gated complex with 24×7 security, landscaped gardens, and proximity to business parks and top schools.",
    amenities: ["Gym", "Swimming Pool", "Kids Play Area", "Visitor Parking"],
    featured: false,
  },

  // ── VILLA ──────────────────────────────────
  {
    id: 12, name: "Verdant Heights Villa 4BHK", location: "Azure Lake Road, Ridgemont",
    price: 18500000, priceLabel: "₹1.85 Cr", purpose: "Buy", type: "Villa",
    beds: 4, baths: 3, area: "3,200 sq ft",
    desc: "Majestic 4-bedroom villa with a private pool, landscaped garden, and top-of-the-line finishes. An address that announces your arrival in the finest gated community.",
    amenities: ["Swimming Pool", "Modular Kitchen", "Home Theatre", "3-Car Garage", "Solar Panels", "24×7 Security"],
    featured: true,
  },
  {
    id: 13, name: "Ivory Crest Villa 3BHK", location: "Forest Edge Drive, Pinehurst",
    price: 12500000, priceLabel: "₹1.25 Cr", purpose: "Buy", type: "Villa",
    beds: 3, baths: 3, area: "2,400 sq ft",
    desc: "Contemporary villa with a double-height living room, infinity-edge rooftop pool, and floor-to-ceiling glass walls that bring the outdoors in.",
    amenities: ["Rooftop Pool", "Double-Height Hall", "Smart Lighting", "Landscaped Garden", "EV Charging"],
    featured: false,
  },
  {
    id: 14, name: "Seaview Villa Rental 4BHK", location: "Cliffside Boulevard, Briarwood",
    price: 75000, priceLabel: "₹75,000/mo", purpose: "Rent", type: "Villa",
    beds: 4, baths: 3, area: "2,800 sq ft",
    desc: "Premium furnished villa for rent with a private pool and panoramic valley views. Corporate and family lets welcome. All utilities included.",
    amenities: ["Private Pool", "Furnished", "Utility Included", "CCTV", "2 Parking Spots"],
    featured: false,
  },

  // ── SHARED APARTMENT ───────────────────────
  {
    id: 15, name: "Monarch Co-Living Shared Apt", location: "Central Square, Oakfield",
    price: 11000, priceLabel: "₹11,000/mo", purpose: "Sharing", type: "Shared Apartment",
    beds: 1, baths: 1, area: "Shared",
    desc: "Private room in a premium 3-BHK shared apartment for working professionals. Fully furnished with Netflix, high-speed WiFi, smart TV, and weekly housekeeping.",
    amenities: ["WiFi", "Netflix", "Smart TV", "AC", "2-Wheeler Parking"],
    featured: false,
  },
  {
    id: 16, name: "Serenity Co-Living Studio Share", location: "Metro Park Road, Brookvale",
    price: 9000, priceLabel: "₹9,000/mo", purpose: "Sharing", type: "Shared Apartment",
    beds: 1, baths: 1, area: "Shared",
    desc: "Co-living space with like-minded young professionals. Clean, safe, well-maintained, with a warm community feel, rooftop lounge, and weekly social events.",
    amenities: ["WiFi", "Washing Machine", "Common Lounge", "Rooftop", "Security"],
    featured: false,
  },

  // ── SHARED HOUSE ───────────────────────────
  {
    id: 17, name: "Crimson House Share (Female)", location: "IT Corridor West, Stonebridge",
    price: 8500, priceLabel: "₹8,500/mo", purpose: "Sharing", type: "Shared House",
    beds: 1, baths: 1, area: "Shared",
    desc: "Private furnished room in a 4-bedroom house. Female-only occupancy. Common kitchen, living room, and weekly housekeeping included in rent.",
    amenities: ["Furnished Room", "WiFi Included", "Housekeeping", "Metro Nearby", "CCTV"],
    featured: false,
  },
  {
    id: 18, name: "Blue Horizon House Share", location: "College Road, Silvergate",
    price: 7500, priceLabel: "₹7,500/mo", purpose: "Sharing", type: "Shared House",
    beds: 1, baths: 1, area: "Shared",
    desc: "Cosy shared house near the university and metro. Mixed-gender occupancy. Large common hall, fast WiFi, and a fully equipped kitchen. Ideal for students and interns.",
    amenities: ["WiFi", "Common Kitchen", "Parking", "24×7 Water", "Power Backup"],
    featured: false,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────
const WA_NUMBER = "919999999999";
const WA_LINK   = `https://wa.me/${WA_NUMBER}?text=Hi%2C%20I%20found%20your%20listing%20on%20LuxeEstates%20and%20I%27m%20interested%20in%20a%20property.`;
const MAIL_LINK = "mailto:hello@luxeestates.in?subject=Property%20Inquiry%20via%20LuxeEstates";

// ─────────────────────────────────────────────────────────────────────────────
// SMALL REUSABLE BITS
// ─────────────────────────────────────────────────────────────────────────────
function Badge({ purpose }) {
  const map = {
    Buy:     "bg-[#0F172A] text-white",
    Rent:    "bg-amber-500 text-white",
    Sharing: "bg-emerald-600 text-white",
  };
  return (
    <span className={`text-xs font-bold px-3 py-1 rounded-full ${map[purpose]}`}>
      {purpose === "Sharing" ? "Sharing" : `For ${purpose}`}
    </span>
  );
}

const WA_SVG = ({ cls = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={cls}>
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
  </svg>
);

const MAIL_SVG = ({ cls = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={cls}>
    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
  </svg>
);

// ─────────────────────────────────────────────────────────────────────────────
// ANIMATED COUNTER
// ─────────────────────────────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = "" }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      let cur = 0;
      const step = Math.max(1, Math.ceil(target / 70));
      const timer = setInterval(() => {
        cur = Math.min(cur + step, target);
        setCount(cur);
        if (cur >= target) clearInterval(timer);
      }, 20);
      obs.disconnect();
    });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{count}{suffix}</span>;
}

// ─────────────────────────────────────────────────────────────────────────────
// PROPERTY CARD
// ─────────────────────────────────────────────────────────────────────────────
function PropertyCard({ p, onOpen }) {
  const rooms = roomSet(p.type);
  return (
    <div
      onClick={() => onOpen(p)}
      className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl border border-slate-100 cursor-pointer transition-all duration-300 hover:-translate-y-1"
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: "210px" }}>
        <img
          src={rooms[0].url}
          alt={p.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <div className="absolute top-3 left-3">
          <Badge purpose={p.purpose} />
        </div>
        {p.featured && (
          <div className="absolute top-3 right-3 bg-[#D4AF37] text-[#0F172A] text-xs font-extrabold px-2 py-0.5 rounded-full tracking-wide">
            ★ FEATURED
          </div>
        )}
        <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm rounded-xl px-3 py-1 shadow">
          <span className="font-extrabold text-[#0F172A] text-sm">{p.priceLabel}</span>
        </div>
        {/* Photo count pill */}
        <div className="absolute bottom-3 left-3 bg-black/50 rounded-full px-2 py-0.5 text-white text-xs">
          📷 {rooms.length} photos
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="font-bold text-[#0F172A] text-base leading-snug mb-1">{p.name}</h3>
        <div className="flex items-center gap-1 text-slate-500 text-sm mb-3">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4 flex-shrink-0">
            <path d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7Z"/><circle cx="12" cy="9" r="2.5"/>
          </svg>
          <span className="truncate">{p.location}</span>
        </div>
        <div className="flex items-center justify-between text-slate-600 text-xs border-t border-slate-100 pt-3 gap-2">
          <span className="flex items-center gap-1">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
              <path d="M2 9V19M22 19V9M2 14h20M2 9a5 5 0 0 1 5-5h10a5 5 0 0 1 5 5"/>
            </svg>
            {p.beds} Bed
          </span>
          <span className="flex items-center gap-1">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
              <path d="M4 12h16v4a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-4Z"/><path d="M6 12V6a2 2 0 0 1 2-2h1"/>
            </svg>
            {p.baths} Bath
          </span>
          <span className="flex items-center gap-1">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
              <rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M9 3v18"/>
            </svg>
            {p.area}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PROPERTY DETAIL MODAL  — full room gallery + close button
// ─────────────────────────────────────────────────────────────────────────────
function Modal({ p, onClose }) {
  const [imgIdx, setImgIdx] = useState(0);
  const rooms = roomSet(p.type);

  // Lock body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // Keyboard ESC
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="bg-white w-full sm:max-w-2xl sm:rounded-3xl overflow-hidden shadow-2xl"
        style={{ maxHeight: "92vh", overflowY: "auto" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Main image ── */}
        <div className="relative" style={{ height: "280px" }}>
          <img
            src={rooms[imgIdx].url}
            alt={rooms[imgIdx].label}
            className="w-full h-full object-cover"
          />
          {/* CLOSE BUTTON — always visible */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-4 right-4 z-10 bg-white text-[#0F172A] rounded-full p-2 shadow-lg hover:bg-[#D4AF37] hover:text-white transition-all duration-200"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-5 h-5">
              <path d="M6 6l12 12M18 6l-12 12"/>
            </svg>
          </button>
          <div className="absolute top-4 left-4">
            <Badge purpose={p.purpose} />
          </div>
          {/* Room label */}
          <div className="absolute bottom-4 left-4 bg-[#0F172A]/80 text-white text-xs font-semibold px-3 py-1 rounded-full backdrop-blur-sm">
            {rooms[imgIdx].label}
          </div>
          {/* Nav arrows */}
          {rooms.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); setImgIdx((imgIdx - 1 + rooms.length) % rooms.length); }}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow transition"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
                  <path d="M15 18l-6-6 6-6"/>
                </svg>
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); setImgIdx((imgIdx + 1) % rooms.length); }}
                className="absolute right-12 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 shadow transition"
              >
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
                  <path d="M9 18l6-6-6-6"/>
                </svg>
              </button>
            </>
          )}
        </div>

        {/* ── Thumbnail strip ── */}
        <div className="flex gap-2 px-4 py-3 overflow-x-auto bg-slate-50 border-b border-slate-100">
          {rooms.map((r, i) => (
            <button
              key={i}
              onClick={() => setImgIdx(i)}
              className={`flex-shrink-0 rounded-xl overflow-hidden border-2 transition-all ${i === imgIdx ? "border-[#D4AF37] opacity-100" : "border-transparent opacity-60 hover:opacity-90"}`}
              style={{ width: "72px", height: "52px" }}
            >
              <img src={r.url} alt={r.label} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>

        {/* ── Details ── */}
        <div className="p-5">
          <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
            <h2 className="text-xl font-extrabold text-[#0F172A] leading-tight">{p.name}</h2>
            <span className="text-xl font-extrabold text-[#D4AF37]">{p.priceLabel}</span>
          </div>
          <div className="flex items-center gap-1 text-slate-500 text-sm mb-4">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
              <path d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7Z"/><circle cx="12" cy="9" r="2.5"/>
            </svg>
            {p.location}
          </div>

          {/* Stats row */}
          <div className="flex flex-wrap gap-4 text-sm text-slate-600 bg-slate-50 rounded-2xl px-4 py-3 mb-4">
            <span className="flex items-center gap-1.5 font-medium">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4 text-[#D4AF37]">
                <path d="M2 9V19M22 19V9M2 14h20M2 9a5 5 0 0 1 5-5h10a5 5 0 0 1 5 5"/>
              </svg>
              {p.beds} {p.beds === 1 ? "Bedroom" : "Bedrooms"}
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4 text-[#D4AF37]">
                <path d="M4 12h16v4a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4v-4Z"/><path d="M6 12V6a2 2 0 0 1 2-2h1"/>
              </svg>
              {p.baths} {p.baths === 1 ? "Bathroom" : "Bathrooms"}
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4 text-[#D4AF37]">
                <rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M9 3v18"/>
              </svg>
              {p.area}
            </span>
          </div>

          <p className="text-slate-600 text-sm leading-relaxed mb-5">{p.desc}</p>

          {/* Amenities */}
          <div className="mb-6">
            <h4 className="font-bold text-[#0F172A] text-sm mb-3 flex items-center gap-2">
              <span className="w-5 h-0.5 bg-[#D4AF37] inline-block rounded-full" />
              Amenities & Features
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {p.amenities.map((a) => (
                <div key={a} className="flex items-center gap-2 text-sm text-slate-600">
                  <svg viewBox="0 0 24 24" fill="none" stroke="#D4AF37" strokeWidth={2.5} className="w-4 h-4 flex-shrink-0">
                    <path d="M5 13l4 4L19 7"/>
                  </svg>
                  {a}
                </div>
              ))}
            </div>
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => window.open(WA_LINK, "_blank")}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm text-white transition-all duration-200 hover:opacity-90 active:scale-95"
              style={{ background: "#25D366" }}
            >
              <WA_SVG cls="w-5 h-5" />
              WhatsApp Us
            </button>
            <button
              onClick={() => window.open(MAIL_LINK)}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm border-2 border-[#0F172A] text-[#0F172A] hover:bg-[#0F172A] hover:text-white transition-all duration-200 active:scale-95"
            >
              <MAIL_SVG cls="w-5 h-5" />
              Email Enquiry
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN APP
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [modal,     setModal]     = useState(null);
  const [search,    setSearch]    = useState("");
  const [filters,   setFilters]   = useState({ type: "", purpose: "", price: "", beds: "" });
  const [formData,  setFormData]  = useState({ name: "", mobile: "", email: "", interest: "", message: "" });
  const [formSent,  setFormSent]  = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);

  // Shrink nav on scroll
  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 60);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setMenuOpen(false);
  };

  // ── Filtering logic ────────────────────────────────────────────────────────
  const filtered = PROPERTIES.filter((p) => {
    const q = search.trim().toLowerCase();
    const matchSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.location.toLowerCase().includes(q) ||
      p.type.toLowerCase().includes(q);
    const matchType    = !filters.type    || p.type    === filters.type;
    const matchPurpose = !filters.purpose || p.purpose === filters.purpose;
    const matchBeds    = !filters.beds    || (filters.beds === "5+" ? p.beds >= 5 : p.beds === parseInt(filters.beds));
    const matchPrice   = !filters.price   || (() => {
      const v = filters.price;
      if (v === "u10")    return p.price < 1000000;
      if (v === "10-25")  return p.price >= 1000000  && p.price < 2500000;
      if (v === "25-50")  return p.price >= 2500000  && p.price < 5000000;
      if (v === "50-1cr") return p.price >= 5000000  && p.price < 10000000;
      if (v === "1cr+")   return p.price >= 10000000;
      return true;
    })();
    return matchSearch && matchType && matchPurpose && matchBeds && matchPrice;
  });

  // ── Form submit ────────────────────────────────────────────────────────────
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSent(true);
    setFormData({ name: "", mobile: "", email: "", interest: "", message: "" });
    setTimeout(() => setFormSent(false), 5000);
  };

  const inputCls =
    "w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm bg-white text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition";

  const selCls =
    "w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm bg-white text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#D4AF37] focus:border-transparent transition appearance-none cursor-pointer";

  const RENTALS  = PROPERTIES.filter((p) => p.purpose === "Rent");
  const SHARING  = PROPERTIES.filter((p) => p.purpose === "Sharing");

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F8FAFC]" style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>

      {/* ══════════════════════════════════════════════════════════════════════
          NAVIGATION
      ══════════════════════════════════════════════════════════════════════ */}
      <nav
        className="fixed top-0 left-0 right-0 z-40 transition-all duration-300"
        style={{
          background: navScrolled ? "rgba(15,23,42,0.98)" : "rgba(15,23,42,0.92)",
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          boxShadow: navScrolled ? "0 4px 24px rgba(0,0,0,0.3)" : "none",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">

          {/* Brand */}
          <button onClick={() => scrollTo("hero")} className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: "#D4AF37" }}
            >
              <svg viewBox="0 0 24 24" fill="#0F172A" className="w-5 h-5">
                <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/>
              </svg>
            </div>
            <span className="text-white font-extrabold text-xl tracking-tight leading-none">
              Luxe<span style={{ color: "#D4AF37" }}>Estates</span>
            </span>
          </button>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {[["Home","hero"],["Properties","properties"],["Rentals","rentals"],["Contact","contact"]].map(([label, id]) => (
              <button
                key={label}
                onClick={() => scrollTo(id)}
                className="text-slate-300 hover:text-white text-sm font-medium transition-colors duration-200"
              >
                {label}
              </button>
            ))}
            <button
              onClick={() => window.open(WA_LINK, "_blank")}
              className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 hover:opacity-90 active:scale-95"
              style={{ background: "#D4AF37", color: "#0F172A" }}
            >
              <WA_SVG cls="w-4 h-4" />
              WhatsApp Us
            </button>
          </div>

          {/* Mobile burger */}
          <button
            className="md:hidden p-2 text-white rounded-lg hover:bg-white/10 transition"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-6 h-6">
              {menuOpen
                ? <path d="M6 6l12 12M18 6l-12 12"/>
                : <path d="M4 6h16M4 12h16M4 18h16"/>}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden px-4 pb-4 pt-2 flex flex-col gap-3 border-t border-white/10">
            {[["Home","hero"],["Properties","properties"],["Rentals","rentals"],["Contact","contact"]].map(([label, id]) => (
              <button
                key={label}
                onClick={() => scrollTo(id)}
                className="text-slate-300 hover:text-white text-left py-2 text-sm font-medium transition border-b border-white/5"
              >
                {label}
              </button>
            ))}
            <button
              onClick={() => { window.open(WA_LINK, "_blank"); setMenuOpen(false); }}
              className="flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm text-white mt-1"
              style={{ background: "#25D366" }}
            >
              <WA_SVG cls="w-5 h-5" />
              Chat on WhatsApp
            </button>
          </div>
        )}
      </nav>

      {/* ══════════════════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="hero" className="relative flex items-center justify-center overflow-hidden" style={{ minHeight: "100vh" }}>
        {/* BG image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1800&q=90"
            alt="Luxury Property"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0" style={{ background: "linear-gradient(to bottom, rgba(15,23,42,0.82) 0%, rgba(15,23,42,0.65) 50%, rgba(15,23,42,0.92) 100%)" }} />
        </div>

        <div className="relative z-10 text-center px-4 w-full max-w-4xl mx-auto pt-24 pb-16">
          {/* Pill */}
          <div
            className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-8 text-sm font-semibold"
            style={{ background: "rgba(212,175,55,0.15)", border: "1px solid rgba(212,175,55,0.35)", color: "#D4AF37" }}
          >
            <span className="w-2 h-2 rounded-full animate-pulse" style={{ background: "#D4AF37" }} />
            500+ Premium Properties Available Now
          </div>

          <h1 className="text-white font-black leading-none mb-5" style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)" }}>
            Find Your <span style={{ color: "#D4AF37" }}>Perfect</span><br />Property
          </h1>
          <p className="text-slate-300 text-lg sm:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
            Buy, Rent, Share and Invest in Premium Properties across the finest addresses.
          </p>

          {/* Search bar */}
          <div className="bg-white rounded-2xl p-3 shadow-2xl flex flex-col sm:flex-row gap-3 max-w-2xl mx-auto">
            <div className="flex items-center gap-2 flex-1 rounded-xl px-4 py-2.5" style={{ background: "#F8FAFC" }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth={2} className="w-5 h-5 flex-shrink-0">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && scrollTo("properties")}
                placeholder="Search property, location, type…"
                className="flex-1 bg-transparent text-sm text-slate-700 focus:outline-none placeholder:text-slate-400"
              />
            </div>
            <button
              onClick={() => scrollTo("properties")}
              className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-white font-bold text-sm transition hover:opacity-90 active:scale-95 whitespace-nowrap"
              style={{ background: "#0F172A" }}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              Search
            </button>
          </div>

          {/* Quick filters */}
          <div className="flex flex-wrap justify-center gap-2 mt-5">
            {["House","Apartment","Villa","Bungalow","Rent","Sharing"].map((tag) => (
              <button
                key={tag}
                onClick={() => {
                  const isPurpose = ["Rent","Sharing"].includes(tag);
                  if (isPurpose) setFilters(f => ({ ...f, purpose: f.purpose === tag ? "" : tag }));
                  else           setFilters(f => ({ ...f, type:    f.type    === tag ? "" : tag }));
                  scrollTo("properties");
                }}
                className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 hover:scale-105"
                style={{
                  background: "rgba(255,255,255,0.12)",
                  color: "#fff",
                  border: "1px solid rgba(255,255,255,0.25)",
                }}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-10 mt-14">
            {[["500+","Properties"],["1,000+","Happy Clients"],["50+","Locations"],["100+","Rentals"]].map(([n, l]) => (
              <div key={l} className="text-center">
                <div className="text-3xl sm:text-4xl font-black" style={{ color: "#D4AF37" }}>{n}</div>
                <div className="text-slate-400 text-sm mt-0.5">{l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Bounce arrow */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-10">
          <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} className="w-6 h-6 opacity-50">
            <path d="M12 5v14M5 12l7 7 7-7"/>
          </svg>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          FILTERS + FEATURED PROPERTIES
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="properties" className="py-16 px-4">
        <div className="max-w-7xl mx-auto">

          {/* Section heading */}
          <div className="text-center mb-10">
            <p className="text-xs font-extrabold uppercase tracking-widest mb-2" style={{ color: "#D4AF37" }}>Browse Listings</p>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A]">Featured Properties</h2>
            <p className="text-slate-500 mt-2 text-sm">Handpicked premium listings across the finest neighbourhoods.</p>
          </div>

          {/* Filter panel */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-md p-5 mb-10">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {/* Property Type */}
              <div className="relative">
                <label className="text-xs font-semibold text-slate-400 mb-1 block uppercase tracking-wide">Type</label>
                <select value={filters.type} onChange={(e) => setFilters(f => ({ ...f, type: e.target.value }))} className={selCls}>
                  <option value="">All Types</option>
                  <option>House</option>
                  <option>Bungalow</option>
                  <option>Apartment</option>
                  <option>Villa</option>
                  <option>Shared Apartment</option>
                  <option>Shared House</option>
                </select>
              </div>
              {/* Purpose */}
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1 block uppercase tracking-wide">Purpose</label>
                <select value={filters.purpose} onChange={(e) => setFilters(f => ({ ...f, purpose: e.target.value }))} className={selCls}>
                  <option value="">Buy / Rent / Share</option>
                  <option>Buy</option>
                  <option>Rent</option>
                  <option>Sharing</option>
                </select>
              </div>
              {/* Price */}
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1 block uppercase tracking-wide">Budget</label>
                <select value={filters.price} onChange={(e) => setFilters(f => ({ ...f, price: e.target.value }))} className={selCls}>
                  <option value="">Any Price</option>
                  <option value="u10">Under ₹10 Lakhs</option>
                  <option value="10-25">₹10 – 25 Lakhs</option>
                  <option value="25-50">₹25 – 50 Lakhs</option>
                  <option value="50-1cr">₹50 L – 1 Crore</option>
                  <option value="1cr+">Above ₹1 Crore</option>
                </select>
              </div>
              {/* Beds */}
              <div>
                <label className="text-xs font-semibold text-slate-400 mb-1 block uppercase tracking-wide">Bedrooms</label>
                <select value={filters.beds} onChange={(e) => setFilters(f => ({ ...f, beds: e.target.value }))} className={selCls}>
                  <option value="">Any BHK</option>
                  <option value="1">1 BHK</option>
                  <option value="2">2 BHK</option>
                  <option value="3">3 BHK</option>
                  <option value="4">4 BHK</option>
                  <option value="5+">5+ BHK</option>
                </select>
              </div>
            </div>
            {/* Active filter tags + clear */}
            {(filters.type || filters.purpose || filters.price || filters.beds || search) && (
              <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                <span className="text-xs text-slate-400 font-semibold">Active:</span>
                {search && <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full">"{search}"</span>}
                {filters.type && <span className="text-xs px-3 py-1 rounded-full text-white" style={{background:"#0F172A"}}>{filters.type}</span>}
                {filters.purpose && <span className="text-xs px-3 py-1 rounded-full text-white bg-amber-500">{filters.purpose}</span>}
                {filters.beds && <span className="text-xs px-3 py-1 rounded-full text-white bg-slate-500">{filters.beds} BHK</span>}
                <button
                  onClick={() => { setFilters({ type: "", purpose: "", price: "", beds: "" }); setSearch(""); }}
                  className="text-xs font-bold ml-auto underline transition"
                  style={{ color: "#D4AF37" }}
                >
                  Clear all
                </button>
              </div>
            )}
          </div>

          {/* Results count */}
          <p className="text-sm text-slate-400 mb-5 font-medium">{filtered.length} propert{filtered.length === 1 ? "y" : "ies"} found</p>

          {filtered.length === 0 ? (
            <div className="text-center py-20 text-slate-400">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.2} className="w-16 h-16 mx-auto mb-4 opacity-30">
                <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
              </svg>
              <p className="text-lg font-semibold text-slate-600">No properties match your filters.</p>
              <p className="text-sm mt-1">Try adjusting or clearing your search.</p>
              <button
                onClick={() => { setFilters({ type: "", purpose: "", price: "", beds: "" }); setSearch(""); }}
                className="mt-5 px-6 py-2.5 rounded-full font-bold text-sm text-white transition hover:opacity-90"
                style={{ background: "#D4AF37", color: "#0F172A" }}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((p) => <PropertyCard key={p.id} p={p} onOpen={setModal} />)}
            </div>
          )}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          RENTALS SECTION
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="rentals" className="py-16" style={{ background: "#0F172A" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-xs font-extrabold uppercase tracking-widest mb-2" style={{ color: "#D4AF37" }}>Move-In Ready</p>
            <h2 className="text-3xl sm:text-4xl font-black text-white">Properties for Rent</h2>
            <p className="text-slate-400 mt-2 text-sm">Fully verified, ready-to-move rental homes.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {RENTALS.map((p) => <PropertyCard key={p.id} p={p} onOpen={setModal} />)}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          CO-LIVING / SHARING
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-16" style={{ background: "#F1F5F9" }}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <p className="text-xs font-extrabold uppercase tracking-widest mb-2" style={{ color: "#D4AF37" }}>Shared Living</p>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A]">Co-Living & Sharing</h2>
            <p className="text-slate-500 mt-2 text-sm">Safe, affordable shared spaces for modern professionals and students.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {SHARING.map((p) => {
              const rooms = roomSet(p.type);
              return (
                <div
                  key={p.id}
                  onClick={() => setModal(p)}
                  className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl border border-slate-100 cursor-pointer group transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="relative overflow-hidden" style={{ height: "180px" }}>
                    <img src={rooms[0].url} alt={p.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute top-3 left-3"><Badge purpose={p.purpose} /></div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-[#0F172A] text-sm leading-snug mb-1">{p.name}</h3>
                    <div className="flex items-center gap-1 text-slate-500 text-xs mb-3">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className="w-3.5 h-3.5 flex-shrink-0">
                        <path d="M12 2a7 7 0 0 1 7 7c0 5-7 13-7 13S5 14 5 9a7 7 0 0 1 7-7Z"/><circle cx="12" cy="9" r="2.5"/>
                      </svg>
                      <span className="truncate">{p.location}</span>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-extrabold text-base" style={{ color: "#D4AF37" }}>{p.priceLabel}</span>
                      <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{p.type}</span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {p.amenities.slice(0, 3).map((a) => (
                        <span key={a} className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-100">{a}</span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          WHY CHOOSE US
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-xs font-extrabold uppercase tracking-widest mb-2" style={{ color: "#D4AF37" }}>Our Promise</p>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A]">Why Choose LuxeEstates?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {[
              { emoji: "✅", title: "Verified Listings",     desc: "Every property is personally visited and verified by our team before listing." },
              { emoji: "🤝", title: "Trusted Agents",        desc: "RERA-registered agents with deep local market expertise and integrity." },
              { emoji: "💎", title: "Transparent Pricing",   desc: "No hidden costs. No surprises. What you see is exactly what you pay." },
              { emoji: "⚡", title: "Quick Response",         desc: "Our team responds to every single inquiry within 60 minutes, guaranteed." },
              { emoji: "🏆", title: "Premium Properties",    desc: "Curated selection of the finest homes in the finest locations." },
            ].map(({ emoji, title, desc }) => (
              <div
                key={title}
                className="text-center p-6 rounded-2xl border border-slate-100 transition-all duration-300 cursor-default group"
                style={{ background: "#F8FAFC" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#0F172A"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "#F8FAFC"; }}
              >
                <div className="text-4xl mb-4">{emoji}</div>
                <h4 className="font-bold text-base mb-2 text-[#0F172A] group-hover:text-[#D4AF37] transition-colors" style={{}}>{title}</h4>
                <p className="text-sm text-slate-500 group-hover:text-slate-300 transition-colors leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          COUNTERS
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-16" style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)" }}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {[
              { target: 500, suffix: "+", label: "Properties Listed" },
              { target: 1000, suffix: "+", label: "Happy Clients" },
              { target: 50, suffix: "+", label: "Locations" },
              { target: 100, suffix: "+", label: "Rental Options" },
            ].map(({ target, suffix, label }) => (
              <div key={label}>
                <div className="font-black mb-1" style={{ fontSize: "clamp(2rem, 6vw, 3.25rem)", color: "#D4AF37" }}>
                  <AnimatedCounter target={target} suffix={suffix} />
                </div>
                <div className="text-slate-400 text-sm font-medium">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          CONTACT
      ══════════════════════════════════════════════════════════════════════ */}
      <section id="contact" className="py-16 px-4" style={{ background: "#F8FAFC" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-xs font-extrabold uppercase tracking-widest mb-2" style={{ color: "#D4AF37" }}>Get in Touch</p>
            <h2 className="text-3xl sm:text-4xl font-black text-[#0F172A]">Enquire About a Property</h2>
            <p className="text-slate-500 mt-2 text-sm">Fill the form and we'll respond within the hour.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* Form */}
            <form onSubmit={handleSubmit} className="md:col-span-3 bg-white rounded-2xl shadow-md border border-slate-100 p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Full Name *</label>
                  <input required value={formData.name} onChange={(e) => setFormData(f => ({ ...f, name: e.target.value }))} placeholder="Your Name" className={inputCls} />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 mb-1 block">Mobile Number *</label>
                  <input required value={formData.mobile} onChange={(e) => setFormData(f => ({ ...f, mobile: e.target.value }))} placeholder="+91 98765 43210" className={inputCls} />
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">Email Address *</label>
                <input required type="email" value={formData.email} onChange={(e) => setFormData(f => ({ ...f, email: e.target.value }))} placeholder="you@example.com" className={inputCls} />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">I'm Interested In *</label>
                <select required value={formData.interest} onChange={(e) => setFormData(f => ({ ...f, interest: e.target.value }))} className={inputCls}>
                  <option value="">Select your interest…</option>
                  <option>Buying a Property</option>
                  <option>Renting a Property</option>
                  <option>Shared Accommodation</option>
                  <option>Property Investment</option>
                  <option>Listing My Property</option>
                  <option>General Inquiry</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 mb-1 block">Message</label>
                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData(f => ({ ...f, message: e.target.value }))}
                  placeholder="Tell us your requirements — location, budget, BHK, or anything else…"
                  className={`${inputCls} resize-none`}
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-2xl font-bold text-sm text-white transition-all duration-200 hover:opacity-90 active:scale-95 flex items-center justify-center gap-2"
                style={{ background: "#0F172A" }}
              >
                Send Enquiry
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </button>
              {formSent && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-2xl p-4 text-sm text-center font-semibold">
                  ✅ Enquiry sent! Our team will contact you within the hour.
                </div>
              )}
            </form>

            {/* Right panel */}
            <div className="md:col-span-2 flex flex-col gap-4">
              {/* Contact card */}
              <div className="rounded-2xl p-6 text-white flex-1" style={{ background: "#0F172A" }}>
                <h4 className="font-extrabold text-base mb-5" style={{ color: "#D4AF37" }}>Contact Directly</h4>
                <div className="space-y-3.5">
                  {[
                    ["📍", "Greenwood Heights, Northvale – 400001"],
                    ["📞", "+91 99999 99999"],
                    ["✉️", "hello@luxeestates.in"],
                    ["🕐", "Mon – Sat, 9 AM – 7 PM"],
                  ].map(([icon, text]) => (
                    <div key={text} className="flex items-start gap-3 text-sm text-slate-300">
                      <span className="text-lg leading-tight">{icon}</span>
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => window.open(WA_LINK, "_blank")}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold text-white transition hover:opacity-90 active:scale-95"
                    style={{ background: "#25D366" }}
                  >
                    <WA_SVG cls="w-4 h-4" />
                    WhatsApp
                  </button>
                  <button
                    onClick={() => window.open(MAIL_LINK)}
                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold border transition hover:border-[#D4AF37] active:scale-95"
                    style={{ borderColor: "rgba(255,255,255,0.2)", color: "#fff" }}
                  >
                    <MAIL_SVG cls="w-4 h-4" />
                    Email
                  </button>
                </div>
              </div>

              {/* List your property card */}
              <div className="rounded-2xl p-5 border" style={{ background: "#FEFCE8", borderColor: "#FDE68A" }}>
                <div className="text-3xl mb-2">🏠</div>
                <h5 className="font-extrabold text-[#0F172A] mb-2">List Your Property</h5>
                <p className="text-slate-600 text-xs leading-relaxed">
                  Are you an owner or builder? List with LuxeEstates and reach thousands of genuine buyers and renters today.
                </p>
                <button
                  onClick={() => scrollTo("contact")}
                  className="mt-3 text-xs font-extrabold flex items-center gap-1 hover:gap-2 transition-all"
                  style={{ color: "#D4AF37" }}
                >
                  Get Started
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="w-4 h-4">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════════════════════ */}
      <footer className="py-10 px-4 border-t" style={{ background: "#0F172A", borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-5 text-slate-400">
          {/* Brand */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "#D4AF37" }}>
              <svg viewBox="0 0 24 24" fill="#0F172A" className="w-5 h-5"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z"/></svg>
            </div>
            <span className="text-white font-extrabold text-lg">
              Luxe<span style={{ color: "#D4AF37" }}>Estates</span>
            </span>
          </div>
          <p className="text-xs text-center">© 2025 LuxeEstates — Premium Real Estate Platform. All rights reserved.</p>
          <div className="flex gap-5 text-xs">
            {["Privacy","Terms","RERA"].map((t) => (
              <a key={t} href="#" className="hover:text-[#D4AF37] transition">{t}</a>
            ))}
          </div>
        </div>
      </footer>

      {/* ══════════════════════════════════════════════════════════════════════
          FLOATING WHATSAPP BUTTON
      ══════════════════════════════════════════════════════════════════════ */}
      <button
        onClick={() => window.open(WA_LINK, "_blank")}
        title="Chat on WhatsApp"
        aria-label="Chat on WhatsApp"
        className="fixed bottom-6 right-5 z-50 flex items-center justify-center rounded-full shadow-2xl transition-all duration-200 hover:scale-110 active:scale-95"
        style={{ width: "58px", height: "58px", background: "#25D366" }}
      >
        <WA_SVG cls="w-7 h-7 text-white" />
        {/* Notification dot */}
        <span
          className="absolute -top-1 -right-1 flex items-center justify-center text-white font-extrabold text-xs rounded-full"
          style={{ width: "18px", height: "18px", background: "#EF4444", fontSize: "10px" }}
        >
          1
        </span>
      </button>

      {/* ══════════════════════════════════════════════════════════════════════
          MODAL
      ══════════════════════════════════════════════════════════════════════ */}
      {modal && <Modal p={modal} onClose={() => setModal(null)} />}
    </div>
  );
}
