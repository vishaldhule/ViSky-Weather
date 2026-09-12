/**
 * Location Helper for Indra Forecast
 * Multi-layer geolocation engine ensuring accurate local meteorological detection
 * with smart fallback for users in India and worldwide.
 */

export interface DetectedLocationResult {
  query: string; // Query to send to WeatherAPI (e.g. "28.6139,77.2090" or "Pune")
  displayName: string;
  source: 'gps' | 'ip' | 'saved' | 'timezone_default';
  isIndia: boolean;
}

export const INDIAN_METROS = [
  { name: "New Delhi", region: "Delhi", query: "New Delhi" },
  { name: "Sambhaji Nagar", region: "Maharashtra", query: "19.8773,75.3390" },
  { name: "Mumbai", region: "Maharashtra", query: "Mumbai" },
  { name: "Pune", region: "Maharashtra", query: "Pune" },
  { name: "Bengaluru", region: "Karnataka", query: "Bengaluru" },
  { name: "Hyderabad", region: "Telangana", query: "Hyderabad" },
  { name: "Kolkata", region: "West Bengal", query: "Kolkata" },
  { name: "Chennai", region: "Tamil Nadu", query: "Chennai" },
  { name: "Ahmedabad", region: "Gujarat", query: "Ahmedabad" },
  { name: "Jaipur", region: "Rajasthan", query: "Jaipur" },
  { name: "Lucknow", region: "Uttar Pradesh", query: "Lucknow" },
];

const STORAGE_QUERY_KEY = "indra_saved_location_query";
const STORAGE_NAME_KEY = "indra_saved_location_name";

export function getSavedLocation(): { query: string; name: string } | null {
  try {
    const query = localStorage.getItem(STORAGE_QUERY_KEY);
    const name = localStorage.getItem(STORAGE_NAME_KEY);
    if (query && name) {
      return { query, name };
    }
  } catch (e) {
    // Local storage unavailable
  }
  return null;
}

export function saveLocation(query: string, name: string) {
  try {
    localStorage.setItem(STORAGE_QUERY_KEY, query);
    localStorage.setItem(STORAGE_NAME_KEY, name);
  } catch (e) {
    // Local storage unavailable
  }
}

export function isUserInIndia(): boolean {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || "";
    if (tz.includes("Kolkata") || tz.includes("Calcutta") || tz.includes("India") || tz === "IST") {
      return true;
    }
    const navLang = (navigator.language || "").toLowerCase();
    if (navLang.includes("-in") || navLang.startsWith("hi")) {
      return true;
    }
  } catch (e) {
    // Ignore error
  }
  return false;
}

/**
 * Attempts GPS coordinate acquisition with graceful fallback
 */
function getGpsCoordinates(): Promise<{ lat: number; lon: number }> {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      return reject(new Error("Geolocation not supported"));
    }

    // Try high accuracy first
    navigator.geolocation.getCurrentPosition(
      (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
      () => {
        // Fallback: low accuracy with short timeout
        navigator.geolocation.getCurrentPosition(
          (pos) => resolve({ lat: pos.coords.latitude, lon: pos.coords.longitude }),
          (err) => reject(err),
          { enableHighAccuracy: false, timeout: 5000, maximumAge: 60000 }
        );
      },
      { enableHighAccuracy: true, timeout: 7000, maximumAge: 30000 }
    );
  });
}

/**
 * Attempts IP-based location lookup via client-side and server-side endpoints
 */
async function getIpLocation(): Promise<{ query: string; name: string; isIndia: boolean } | null> {
  // 1. Try server-side IP proxy (reads client's real x-forwarded-for header)
  try {
    const res = await fetch("/api/detect-location");
    if (res.ok) {
      const data = await res.json();
      if (data && data.city) {
        const isIndia = (data.country || "").toLowerCase().includes("india") || (data.country_code === "IN");
        return {
          query: data.lat && data.lon ? `${data.lat},${data.lon}` : data.city,
          name: `${data.city}, ${data.region || data.country}`,
          isIndia
        };
      }
    }
  } catch (e) {
    // Fallback to client-side IP lookup
  }

  // 2. Try direct client-side lookup via ipwho.is (fast, HTTPS, free CORS)
  try {
    const res = await fetch("https://ipwho.is/");
    if (res.ok) {
      const data = await res.json();
      if (data && data.success && data.city) {
        const isIndia = (data.country || "").toLowerCase().includes("india") || data.country_code === "IN";
        return {
          query: `${data.latitude},${data.longitude}`,
          name: `${data.city}, ${data.region || data.country}`,
          isIndia
        };
      }
    }
  } catch (e) {
    // IP lookup failed
  }

  return null;
}

/**
 * Main function to resolve the user's location with full fallback chain:
 * 1. GPS (if available & permitted)
 * 2. Saved Location from localStorage (if existing)
 * 3. Client/Server IP Geolocation
 * 4. Timezone-based regional default (New Delhi for India, etc.)
 */
export async function resolveBestLocation(options?: { forceGps?: boolean }): Promise<DetectedLocationResult> {
  const inIndia = isUserInIndia();

  // If force GPS or on initial request: try GPS first
  if (options?.forceGps || !getSavedLocation()) {
    try {
      const coords = await getGpsCoordinates();
      const query = `${coords.lat.toFixed(4)},${coords.lon.toFixed(4)}`;
      return {
        query,
        displayName: "Current Location (GPS)",
        source: 'gps',
        isIndia: inIndia
      };
    } catch (gpsError) {
      // GPS not granted or unavailable yet
    }
  }

  // Check saved location in localStorage
  const saved = getSavedLocation();
  if (saved && !options?.forceGps) {
    return {
      query: saved.query,
      displayName: saved.name,
      source: 'saved',
      isIndia: inIndia
    };
  }

  // Try IP-based location detection
  try {
    const ipLoc = await getIpLocation();
    if (ipLoc) {
      return {
        query: ipLoc.query,
        displayName: ipLoc.name,
        source: 'ip',
        isIndia: ipLoc.isIndia || inIndia
      };
    }
  } catch (e) {
    // Continue to timezone fallback
  }

  // Timezone and regional default:
  // If user is in Indian timezone or locale, prioritize New Delhi
  if (inIndia) {
    return {
      query: "New Delhi",
      displayName: "New Delhi, India",
      source: 'timezone_default',
      isIndia: true
    };
  }

  // Global fallback default
  return {
    query: "New Delhi",
    displayName: "New Delhi, India",
    source: 'timezone_default',
    isIndia: false
  };
}

/**
 * Listen for runtime geolocation permission changes (e.g. user taps "Allow" after prompt)
 */
export function setupPermissionListener(onGranted: () => void) {
  if (typeof navigator !== 'undefined' && navigator.permissions && navigator.permissions.query) {
    navigator.permissions.query({ name: 'geolocation' as PermissionName })
      .then((permissionStatus) => {
        permissionStatus.onchange = () => {
          if (permissionStatus.state === 'granted') {
            onGranted();
          }
        };
      })
      .catch(() => {
        // Permissions query not supported
      });
  }
}
