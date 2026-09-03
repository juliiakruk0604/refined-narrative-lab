export type Country = {
  /** ISO 3166-1 alpha-2 */
  iso: string;
  name: string;
  dialCode: string;
};

/** flagcdn.com — free, no-key, widely used in production; SVG per ISO code.
 * Emoji flags were the first attempt, but plenty of desktop OS/browser/font
 * combinations (Windows chief among them) don't ship the regional-indicator
 * glyphs and just print the two letters instead, which is what actually
 * happened here. */
export function flagUrl(iso: string): string {
  return `https://flagcdn.com/${iso.toLowerCase()}.svg`;
}

/** Common markets first (matches the site's own "EU · UK · MENA · GCC"
 * framing), then the rest of the world alphabetically by name. Not
 * exhaustive — covers the countries a B2B agency audience is realistically
 * dialing from. */
export const COUNTRIES: Country[] = [
  { iso: "US", name: "United States", dialCode: "1" },
  { iso: "GB", name: "United Kingdom", dialCode: "44" },
  { iso: "AE", name: "United Arab Emirates", dialCode: "971" },
  { iso: "SA", name: "Saudi Arabia", dialCode: "966" },
  { iso: "QA", name: "Qatar", dialCode: "974" },
  { iso: "KW", name: "Kuwait", dialCode: "965" },
  { iso: "BH", name: "Bahrain", dialCode: "973" },
  { iso: "OM", name: "Oman", dialCode: "968" },
  { iso: "PL", name: "Poland", dialCode: "48" },
  { iso: "DE", name: "Germany", dialCode: "49" },
  { iso: "FR", name: "France", dialCode: "33" },
  { iso: "ES", name: "Spain", dialCode: "34" },
  { iso: "IT", name: "Italy", dialCode: "39" },
  { iso: "NL", name: "Netherlands", dialCode: "31" },
  { iso: "PT", name: "Portugal", dialCode: "351" },
  { iso: "IE", name: "Ireland", dialCode: "353" },
  { iso: "CH", name: "Switzerland", dialCode: "41" },
  { iso: "AT", name: "Austria", dialCode: "43" },
  { iso: "BE", name: "Belgium", dialCode: "32" },
  { iso: "SE", name: "Sweden", dialCode: "46" },
  { iso: "NO", name: "Norway", dialCode: "47" },
  { iso: "DK", name: "Denmark", dialCode: "45" },
  { iso: "FI", name: "Finland", dialCode: "358" },
  { iso: "IS", name: "Iceland", dialCode: "354" },
  { iso: "CZ", name: "Czechia", dialCode: "420" },
  { iso: "SK", name: "Slovakia", dialCode: "421" },
  { iso: "HU", name: "Hungary", dialCode: "36" },
  { iso: "RO", name: "Romania", dialCode: "40" },
  { iso: "BG", name: "Bulgaria", dialCode: "359" },
  { iso: "GR", name: "Greece", dialCode: "30" },
  { iso: "HR", name: "Croatia", dialCode: "385" },
  { iso: "SI", name: "Slovenia", dialCode: "386" },
  { iso: "LT", name: "Lithuania", dialCode: "370" },
  { iso: "LV", name: "Latvia", dialCode: "371" },
  { iso: "EE", name: "Estonia", dialCode: "372" },
  { iso: "UA", name: "Ukraine", dialCode: "380" },
  { iso: "MT", name: "Malta", dialCode: "356" },
  { iso: "CY", name: "Cyprus", dialCode: "357" },
  { iso: "LU", name: "Luxembourg", dialCode: "352" },
  { iso: "CA", name: "Canada", dialCode: "1" },
  { iso: "MX", name: "Mexico", dialCode: "52" },
  { iso: "BR", name: "Brazil", dialCode: "55" },
  { iso: "AR", name: "Argentina", dialCode: "54" },
  { iso: "CL", name: "Chile", dialCode: "56" },
  { iso: "CO", name: "Colombia", dialCode: "57" },
  { iso: "PE", name: "Peru", dialCode: "51" },
  { iso: "AU", name: "Australia", dialCode: "61" },
  { iso: "NZ", name: "New Zealand", dialCode: "64" },
  { iso: "SG", name: "Singapore", dialCode: "65" },
  { iso: "HK", name: "Hong Kong", dialCode: "852" },
  { iso: "JP", name: "Japan", dialCode: "81" },
  { iso: "KR", name: "South Korea", dialCode: "82" },
  { iso: "CN", name: "China", dialCode: "86" },
  { iso: "TW", name: "Taiwan", dialCode: "886" },
  { iso: "IN", name: "India", dialCode: "91" },
  { iso: "PK", name: "Pakistan", dialCode: "92" },
  { iso: "BD", name: "Bangladesh", dialCode: "880" },
  { iso: "ID", name: "Indonesia", dialCode: "62" },
  { iso: "MY", name: "Malaysia", dialCode: "60" },
  { iso: "TH", name: "Thailand", dialCode: "66" },
  { iso: "PH", name: "Philippines", dialCode: "63" },
  { iso: "VN", name: "Vietnam", dialCode: "84" },
  { iso: "IL", name: "Israel", dialCode: "972" },
  { iso: "TR", name: "Turkey", dialCode: "90" },
  { iso: "EG", name: "Egypt", dialCode: "20" },
  { iso: "JO", name: "Jordan", dialCode: "962" },
  { iso: "LB", name: "Lebanon", dialCode: "961" },
  { iso: "IQ", name: "Iraq", dialCode: "964" },
  { iso: "ZA", name: "South Africa", dialCode: "27" },
  { iso: "NG", name: "Nigeria", dialCode: "234" },
  { iso: "KE", name: "Kenya", dialCode: "254" },
  { iso: "MA", name: "Morocco", dialCode: "212" },
  { iso: "RU", name: "Russia", dialCode: "7" },
  { iso: "KZ", name: "Kazakhstan", dialCode: "7" },
  { iso: "GE", name: "Georgia", dialCode: "995" },
  { iso: "AM", name: "Armenia", dialCode: "374" },
  { iso: "AZ", name: "Azerbaijan", dialCode: "994" },
];

/** IANA timezone -> ISO country. The OS/system clock sets this, which tracks
 * physical location far more reliably than browser language ever does — a
 * Ukrainian user on a ru-RU Windows locale still has Europe/Kyiv as their
 * timezone, but detecting from language alone put them in Russia. Only zones
 * relevant to COUNTRIES above; multi-zone countries (US, RU, CA, AU...) list
 * every zone that maps back to them. */
const TIMEZONE_TO_ISO: Record<string, string> = {
  "America/New_York": "US",
  "America/Chicago": "US",
  "America/Denver": "US",
  "America/Los_Angeles": "US",
  "America/Anchorage": "US",
  "America/Phoenix": "US",
  "America/Detroit": "US",
  "America/Boise": "US",
  "America/Indiana/Indianapolis": "US",
  "Pacific/Honolulu": "US",
  "Europe/London": "GB",
  "Asia/Dubai": "AE",
  "Asia/Riyadh": "SA",
  "Asia/Qatar": "QA",
  "Asia/Kuwait": "KW",
  "Asia/Bahrain": "BH",
  "Asia/Muscat": "OM",
  "Europe/Warsaw": "PL",
  "Europe/Berlin": "DE",
  "Europe/Paris": "FR",
  "Europe/Madrid": "ES",
  "Atlantic/Canary": "ES",
  "Europe/Rome": "IT",
  "Europe/Amsterdam": "NL",
  "Europe/Lisbon": "PT",
  "Atlantic/Madeira": "PT",
  "Atlantic/Azores": "PT",
  "Europe/Dublin": "IE",
  "Europe/Zurich": "CH",
  "Europe/Vienna": "AT",
  "Europe/Brussels": "BE",
  "Europe/Stockholm": "SE",
  "Europe/Oslo": "NO",
  "Europe/Copenhagen": "DK",
  "Europe/Helsinki": "FI",
  "Atlantic/Reykjavik": "IS",
  "Europe/Prague": "CZ",
  "Europe/Bratislava": "SK",
  "Europe/Budapest": "HU",
  "Europe/Bucharest": "RO",
  "Europe/Sofia": "BG",
  "Europe/Athens": "GR",
  "Europe/Zagreb": "HR",
  "Europe/Ljubljana": "SI",
  "Europe/Vilnius": "LT",
  "Europe/Riga": "LV",
  "Europe/Tallinn": "EE",
  "Europe/Kyiv": "UA",
  "Europe/Kiev": "UA",
  "Europe/Simferopol": "UA",
  "Europe/Malta": "MT",
  "Asia/Nicosia": "CY",
  "Europe/Nicosia": "CY",
  "Europe/Luxembourg": "LU",
  "America/Toronto": "CA",
  "America/Vancouver": "CA",
  "America/Edmonton": "CA",
  "America/Winnipeg": "CA",
  "America/Halifax": "CA",
  "America/St_Johns": "CA",
  "America/Mexico_City": "MX",
  "America/Tijuana": "MX",
  "America/Cancun": "MX",
  "America/Sao_Paulo": "BR",
  "America/Manaus": "BR",
  "America/Argentina/Buenos_Aires": "AR",
  "America/Santiago": "CL",
  "America/Bogota": "CO",
  "America/Lima": "PE",
  "Australia/Sydney": "AU",
  "Australia/Melbourne": "AU",
  "Australia/Brisbane": "AU",
  "Australia/Perth": "AU",
  "Australia/Adelaide": "AU",
  "Australia/Darwin": "AU",
  "Pacific/Auckland": "NZ",
  "Asia/Singapore": "SG",
  "Asia/Hong_Kong": "HK",
  "Asia/Tokyo": "JP",
  "Asia/Seoul": "KR",
  "Asia/Shanghai": "CN",
  "Asia/Taipei": "TW",
  "Asia/Kolkata": "IN",
  "Asia/Karachi": "PK",
  "Asia/Dhaka": "BD",
  "Asia/Jakarta": "ID",
  "Asia/Kuala_Lumpur": "MY",
  "Asia/Bangkok": "TH",
  "Asia/Manila": "PH",
  "Asia/Ho_Chi_Minh": "VN",
  "Asia/Jerusalem": "IL",
  "Asia/Tel_Aviv": "IL",
  "Europe/Istanbul": "TR",
  "Africa/Cairo": "EG",
  "Asia/Amman": "JO",
  "Asia/Beirut": "LB",
  "Asia/Baghdad": "IQ",
  "Africa/Johannesburg": "ZA",
  "Africa/Lagos": "NG",
  "Africa/Nairobi": "KE",
  "Africa/Casablanca": "MA",
  "Europe/Moscow": "RU",
  "Europe/Kaliningrad": "RU",
  "Asia/Yekaterinburg": "RU",
  "Asia/Omsk": "RU",
  "Asia/Novosibirsk": "RU",
  "Asia/Krasnoyarsk": "RU",
  "Asia/Irkutsk": "RU",
  "Asia/Yakutsk": "RU",
  "Asia/Vladivostok": "RU",
  "Asia/Almaty": "KZ",
  "Asia/Aqtobe": "KZ",
  "Asia/Tbilisi": "GE",
  "Asia/Yerevan": "AM",
  "Asia/Baku": "AZ",
};

/** Timezone first (set by the OS/system clock, tracks physical location),
 * then browser language region as a fallback, then the US. No permission
 * prompt, no network call, works offline. */
export function detectDefaultCountry(): Country {
  const fallback = COUNTRIES[0];
  if (typeof Intl === "undefined") return fallback;

  try {
    const zone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const iso = zone ? TIMEZONE_TO_ISO[zone] : undefined;
    if (iso) {
      const match = COUNTRIES.find((c) => c.iso === iso);
      if (match) return match;
    }
  } catch {
    // Intl.DateTimeFormat with no args can't actually throw here, but the
    // fallback below covers it either way.
  }

  if (typeof navigator !== "undefined") {
    const region = new Intl.Locale(navigator.language || "en-US").region;
    const match = region && COUNTRIES.find((c) => c.iso === region);
    if (match) return match;
  }

  return fallback;
}
