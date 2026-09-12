/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, useCallback, useRef } from "react";
import type { FormEvent, MouseEvent } from "react";
import { 
  Search, 
  MapPin, 
  Wind, 
  Droplets, 
  Sun, 
  Moon,
  Sunrise, 
  Sunset,
  Navigation,
  RefreshCw,
  Sparkles,
  Gauge,
  CalendarDays,
  LocateFixed,
  Eye,
  Compass,
  ChevronRight,
  Clock,
  ArrowUp,
  ArrowDown,
  X,
  Settings as SettingsIcon,
  ShieldCheck,
  Building2,
  Check,
  CloudSun,
  Activity,
  Trash2,
  Globe
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { WeatherData, LocationSuggestion, MobileTab } from "./types";
import { GlassCard } from "./components/GlassCard";
import { WeatherEffects } from "./components/WeatherEffects";
import { PWAInstallButton } from "./components/PWAInstallButton";
import { OfflineIndicator } from "./components/OfflineIndicator";
import { SettingsModal } from "./components/SettingsModal";
import { MobileBottomNav } from "./components/MobileBottomNav";
import { WeatherSimpleSummary } from "./components/WeatherSimpleSummary";
import { INDIAN_METROS } from "./utils/locationHelper";
import { TRANSLATIONS, LanguageCode, TranslationStrings, AVAILABLE_LANGUAGES } from "./utils/translations";
import {
  searchLocationsUniversal,
  resolveQueryToCoordinates,
  getSearchHistory,
  saveSearchHistory,
  removeSearchHistoryItem,
  clearAllSearchHistory,
  UniversalLocationResult,
  SearchHistoryItem
} from "./utils/universalGeocoder";

const API_KEY = "8418358e19a94f2fadc175103260905";

const getAQILevel = (index: number, t: TranslationStrings) => {
  const levels = [
    { label: t.good, color: "text-emerald-300", bg: "bg-emerald-400/15", border: "border-emerald-400/30" },
    { label: t.moderate, color: "text-amber-300", bg: "bg-amber-400/15", border: "border-amber-400/30" },
    { label: t.unhealthySensitive, color: "text-orange-300", bg: "bg-orange-400/15", border: "border-orange-400/30" },
    { label: t.unhealthy, color: "text-rose-300", bg: "bg-rose-400/15", border: "border-rose-400/30" },
    { label: t.veryUnhealthy, color: "text-purple-300", bg: "bg-purple-400/15", border: "border-purple-400/30" },
    { label: t.hazardous, color: "text-red-400", bg: "bg-red-500/15", border: "border-red-500/30" },
  ];
  return levels[index - 1] || levels[0];
};

export default function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [unit, setUnit] = useState<"C" | "F">("C");
  const [activeTab, setActiveTab] = useState<MobileTab>("today");
  const [isLiveLocation, setIsLiveLocation] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [isPermissionDenied, setIsPermissionDenied] = useState(false);
  const [showPermissionTip, setShowPermissionTip] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Search Focus Mode & Universal Geocoding State
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>(() => getSearchHistory());
  const [universalSuggestions, setUniversalSuggestions] = useState<UniversalLocationResult[]>([]);
  const [isSearchingLocations, setIsSearchingLocations] = useState(false);
  const [customDisplayName, setCustomDisplayName] = useState<string | null>(null);

  // Language state (default: English, can be changed in settings)
  const [language, setLanguage] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem("indra_weather_lang");
    return (saved && saved in TRANSLATIONS) ? (saved as LanguageCode) : "en";
  });
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  // Blue Sky Theme (default active) with optional deep-indigo mode
  const [skyTheme, setSkyTheme] = useState<"blue-sky" | "deep-indigo">("blue-sky");

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Active translation dictionary
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const handleSelectLanguage = (lang: LanguageCode) => {
    setLanguage(lang);
    localStorage.setItem("indra_weather_lang", lang);
    showToast(`Language changed to ${lang.toUpperCase()}`);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const formatTemp = (tempC: number) => {
    if (unit === "C") return `${Math.round(tempC)}°`;
    return `${Math.round((tempC * 9) / 5 + 32)}°`;
  };

  // Weather data fetcher with custom display name support
  const fetchWeather = useCallback(async (location: string, isGps = false, overrideName?: string) => {
    setLoading(true);
    setError("");
    setUniversalSuggestions([]);
    setShowSuggestions(false);
    setIsSearchFocused(false);

    if (overrideName) {
      setCustomDisplayName(overrideName);
    } else if (isGps) {
      setCustomDisplayName(null);
    } else {
      setCustomDisplayName(null);
    }

    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(location)}&days=7&aqi=yes&alerts=yes`
      );
      if (!response.ok) throw new Error("Location not found");
      const data = await response.json();
      setWeather(data);
      setIsLiveLocation(isGps);
      setSearchQuery("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load weather");
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  // Request user's live GPS coordinates when permission is granted
  const handleRequestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      showToast("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    showToast("Detecting location...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const query = `${position.coords.latitude.toFixed(4)},${position.coords.longitude.toFixed(4)}`;
        fetchWeather(query, true);
        setIsPermissionDenied(false);
        setShowPermissionTip(false);
        showToast("📍 Live location updated!");
        setIsLocating(false);
      },
      (err) => {
        setIsLocating(false);
        if (err.code === err.PERMISSION_DENIED) {
          setIsPermissionDenied(true);
          setShowPermissionTip(true);
          showToast("Location access blocked in browser.");
        } else {
          showToast("Could not get GPS signal. Keeping current city.");
        }
      },
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 30000 }
    );
  }, [fetchWeather]);

  // Initial Boot: Auto-select New Delhi & check for existing permissions
  useEffect(() => {
    // 1. Auto-select New Delhi immediately
    fetchWeather("New Delhi", false);

    // 2. Check if user has already granted location permission previously
    if (navigator.permissions && navigator.permissions.query) {
      navigator.permissions.query({ name: 'geolocation' as PermissionName })
        .then((permissionStatus) => {
          if (permissionStatus.state === 'granted') {
            setIsPermissionDenied(false);
            navigator.geolocation.getCurrentPosition(
              (pos) => {
                const query = `${pos.coords.latitude.toFixed(4)},${pos.coords.longitude.toFixed(4)}`;
                fetchWeather(query, true);
              },
              () => {
                // Keep New Delhi silently if background fetch fails
              }
            );
          } else if (permissionStatus.state === 'denied') {
            setIsPermissionDenied(true);
          }

          permissionStatus.onchange = () => {
            if (permissionStatus.state === 'granted') {
              setIsPermissionDenied(false);
              setShowPermissionTip(false);
              handleRequestLocation();
            } else if (permissionStatus.state === 'denied') {
              setIsPermissionDenied(true);
            }
          };
        })
        .catch(() => {
          // Permissions API not available, New Delhi remains active
        });
    }
  }, [fetchWeather, handleRequestLocation]);

  // Universal micro-city & global autocomplete search
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setUniversalSuggestions([]);
      setIsSearchingLocations(false);
      return;
    }

    setIsSearchingLocations(true);
    const timer = setTimeout(async () => {
      try {
        const results = await searchLocationsUniversal(searchQuery, API_KEY);
        setUniversalSuggestions(results);
        setShowSuggestions(true);
      } catch {
        // Ignore autocomplete network errors
      } finally {
        setIsSearchingLocations(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Escape key closes search focus
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isSearchFocused) {
        setIsSearchFocused(false);
        setShowSuggestions(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSearchFocused]);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    setIsSearchingLocations(true);
    try {
      const resolved = await resolveQueryToCoordinates(query, API_KEY);
      const nameToDisplay = resolved.displayName || query;

      // Extract coords to save to search history
      const coords = resolved.query.split(',');
      if (coords.length === 2) {
        const lat = parseFloat(coords[0]);
        const lon = parseFloat(coords[1]);
        if (!isNaN(lat) && !isNaN(lon)) {
          const updated = saveSearchHistory({
            name: nameToDisplay,
            region: "",
            country: "",
            lat,
            lon,
            type: "City"
          });
          setSearchHistory(updated);
        }
      }

      fetchWeather(resolved.query, false, nameToDisplay);
    } catch {
      fetchWeather(query, false);
    } finally {
      setIsSearchingLocations(false);
      setIsSearchFocused(false);
      setShowSuggestions(false);
    }
  };

  const handleSelectLocation = (item: UniversalLocationResult) => {
    const updated = saveSearchHistory({
      name: item.name,
      region: item.region,
      country: item.country,
      lat: item.lat,
      lon: item.lon,
      type: item.type
    });
    setSearchHistory(updated);
    fetchWeather(`${item.lat},${item.lon}`, false, item.name);
    setIsSearchFocused(false);
    setShowSuggestions(false);
    setSearchQuery("");
  };

  const handleSelectHistoryItem = (item: SearchHistoryItem) => {
    const updated = saveSearchHistory({
      name: item.name,
      region: item.region,
      country: item.country,
      lat: item.lat,
      lon: item.lon,
      type: item.type
    });
    setSearchHistory(updated);
    fetchWeather(`${item.lat},${item.lon}`, false, item.name);
    setIsSearchFocused(false);
    setShowSuggestions(false);
    setSearchQuery("");
  };

  const handleRemoveHistory = (e: MouseEvent, id: string) => {
    e.stopPropagation();
    const updated = removeSearchHistoryItem(id);
    setSearchHistory(updated);
  };

  const handleClearAllHistory = (e: MouseEvent) => {
    e.stopPropagation();
    clearAllSearchHistory();
    setSearchHistory([]);
  };

  const handleRefresh = () => {
    if (!weather) return;
    setIsRefreshing(true);
    const query = weather.location.lat && weather.location.lon 
      ? `${weather.location.lat},${weather.location.lon}` 
      : weather.location.name;
    fetchWeather(query, isLiveLocation);
  };

  const aqiInfo = weather?.current.air_quality 
    ? getAQILevel(weather.current.air_quality["us-epa-index"], t) 
    : { label: t.good, color: "text-emerald-300", bg: "bg-emerald-400/15", border: "border-emerald-400/30" };

  const isBlueSky = skyTheme === "blue-sky";

  return (
    <div 
      className={`min-h-screen text-white font-sans selection:bg-amber-400 selection:text-black antialiased relative overflow-x-hidden transition-colors duration-500 ${
        isBlueSky 
          ? "bg-[#0b1e42] bg-gradient-to-br from-[#0e2a5e] via-[#0b1e42] to-[#07132b]" 
          : "bg-[#070e1c] bg-gradient-to-br from-[#0c162e] via-[#070e1c] to-[#040812]"
      }`}
    >
      {/* Radiant atmospheric Blue Sky ambient lighting */}
      <div 
        className={`fixed inset-0 pointer-events-none -z-10 transition-opacity duration-700 ${
          isBlueSky
            ? "bg-[radial-gradient(ellipse_120%_80%_at_50%_-10%,rgba(14,165,233,0.38)_0%,rgba(37,99,235,0.25)_35%,rgba(11,30,66,1)_90%)]"
            : "bg-[radial-gradient(ellipse_100%_70%_at_50%_0%,rgba(30,58,138,0.28)_0%,rgba(7,14,28,1)_85%)]"
        }`} 
      />

      {/* Subtle Sun Corona Flare */}
      {isBlueSky && (
        <div className="fixed -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-b from-sky-400/25 via-amber-300/10 to-transparent blur-3xl pointer-events-none -z-10" />
      )}
      
      {weather && <WeatherEffects condition={weather.current.condition.text} />}
      <OfflineIndicator />

      {/* Floating Status Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-2xl bg-[#0e244d]/95 border border-sky-400/30 text-white text-xs font-medium shadow-2xl backdrop-blur-2xl flex items-center gap-2"
          >
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Aesthetic Header */}
      <header className="sticky top-0 z-40 bg-[#0b1e42]/90 backdrop-blur-2xl border-b border-white/[0.12] px-4 py-3 shadow-md">
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2.5">
          {/* Logo / Brand - Hidden when search is focused */}
          {!isSearchFocused && (
            <div 
              onClick={() => fetchWeather("New Delhi", false)} 
              className="flex items-center gap-2 cursor-pointer group shrink-0"
              title="Indra Weather - Reset to New Delhi"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-400/30 to-amber-400/20 border border-sky-400/40 flex items-center justify-center text-amber-300 group-hover:scale-105 transition-transform shadow-md">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="text-base font-bold tracking-tight text-white group-hover:text-sky-300 transition-colors hidden sm:inline">
                {t.appName.split(' ')[0]}
              </span>
            </div>
          )}

          {/* Search Bar - Expands to full width with intense NEON styling */}
          <div className={`relative transition-all duration-300 ${isSearchFocused ? "w-full flex-1 max-w-none" : "flex-1 max-w-md"}`}>
            <form onSubmit={handleSearch} className="relative flex items-center gap-2">
              <div className="relative flex-1">
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder={isSearchFocused ? "Search any city, micro-city, village, or taluka worldwide..." : t.searchPlaceholder}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    setIsSearchFocused(true);
                    setShowSuggestions(true);
                  }}
                  className={`w-full rounded-2xl py-2.5 px-3.5 pl-10 pr-9 text-xs sm:text-sm font-medium text-white placeholder:text-white/40 focus:outline-none transition-all ${
                    isSearchFocused
                      ? "bg-[#051126]/95 border-2 border-cyan-400 text-white shadow-[0_0_24px_rgba(34,211,238,0.65),0_0_48px_rgba(6,182,212,0.3),inset_0_0_12px_rgba(34,211,238,0.2)] ring-2 ring-cyan-400/30"
                      : "bg-white/[0.08] hover:bg-white/[0.12] border border-white/15 focus:border-sky-400/60 shadow-inner"
                  }`}
                />
                <Search className={`absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none transition-colors ${
                  isSearchFocused ? "text-cyan-400 drop-shadow-[0_0_8px_#22d3ee]" : "text-white/50"
                }`} />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery("");
                      setUniversalSuggestions([]);
                      searchInputRef.current?.focus();
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full text-white/50 hover:text-white hover:bg-white/10"
                    title="Clear text"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Close / Cancel Button in Search Focus Mode */}
              {isSearchFocused && (
                <button
                  type="button"
                  onClick={() => {
                    setIsSearchFocused(false);
                    setShowSuggestions(false);
                  }}
                  className="px-3.5 py-2.5 rounded-2xl bg-cyan-500/15 hover:bg-cyan-500/25 border border-cyan-400/40 text-cyan-300 hover:text-white text-xs font-semibold flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(34,211,238,0.25)] shrink-0 active:scale-95"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Cancel</span>
                </button>
              )}
            </form>

            {/* Suggestions & Search History Dropdown with Neon Accents */}
            <AnimatePresence>
              {isSearchFocused && showSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  transition={{ duration: 0.18 }}
                  className="absolute top-full left-0 right-0 mt-2 bg-[#08152e]/95 backdrop-blur-3xl border-2 border-cyan-400/70 rounded-2xl overflow-hidden shadow-[0_0_35px_rgba(34,211,238,0.4),0_0_70px_rgba(6,182,212,0.2)] z-50 max-h-[75vh] sm:max-h-96 overflow-y-auto"
                >
                  {/* Neon Top Glowing Line */}
                  <div className="h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent shadow-[0_0_12px_#22d3ee]" />

                  {/* Engine Tag Header */}
                  <div className="px-4 py-2 bg-cyan-950/40 border-b border-cyan-400/20 flex items-center justify-between text-[11px] text-cyan-300 font-medium">
                    <div className="flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                      <span className="font-bold tracking-wide uppercase">Universal Micro-City & Village Engine</span>
                    </div>
                    <span className="text-[10px] text-cyan-300/60 font-mono">Worldwide Coverage</span>
                  </div>

                  {/* CASE 1: Query is empty/short -> Show Search History & Quick City Chips */}
                  {searchQuery.trim().length < 2 && (
                    <div className="p-3 space-y-4">
                      {/* Search History Section */}
                      <div>
                        <div className="flex items-center justify-between mb-2 px-1">
                          <div className="flex items-center gap-1.5 text-xs font-bold text-white/90">
                            <Clock className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Recent Searches ({searchHistory.length})</span>
                          </div>
                          {searchHistory.length > 0 && (
                            <button
                              type="button"
                              onClick={handleClearAllHistory}
                              className="text-[11px] text-rose-300/80 hover:text-rose-200 flex items-center gap-1 transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                              <span>Clear All</span>
                            </button>
                          )}
                        </div>

                        {searchHistory.length > 0 ? (
                          <div className="space-y-1">
                            {searchHistory.map((item) => (
                              <div
                                key={item.id}
                                onClick={() => handleSelectHistoryItem(item)}
                                className="w-full px-3 py-2 rounded-xl bg-white/[0.04] hover:bg-cyan-500/15 border border-white/[0.06] hover:border-cyan-400/40 flex items-center justify-between group transition-all cursor-pointer"
                              >
                                <div className="flex items-center gap-2.5 min-w-0">
                                  <div className="w-7 h-7 rounded-lg bg-cyan-400/10 border border-cyan-400/20 flex items-center justify-center text-cyan-400 group-hover:scale-105 shrink-0">
                                    <Clock className="w-3.5 h-3.5" />
                                  </div>
                                  <div className="truncate text-left">
                                    <div className="flex items-center gap-2">
                                      <span className="font-semibold text-xs text-white group-hover:text-cyan-300 truncate">
                                        {item.name}
                                      </span>
                                      {item.type && (
                                        <span className="px-1.5 py-0.2 text-[9px] rounded-md bg-white/10 text-cyan-200/80 font-mono">
                                          {item.type}
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-[10px] text-white/50 truncate">
                                      {item.region ? `${item.region}, ` : ''}{item.country || "Coordinates"}
                                    </p>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={(e) => handleRemoveHistory(e, item.id)}
                                  className="p-1 rounded-lg text-white/30 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                                  title="Remove from history"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="px-3 py-3 rounded-xl bg-white/[0.03] border border-dashed border-white/10 text-center">
                            <p className="text-xs text-white/50">No search history yet.</p>
                            <p className="text-[10px] text-cyan-300/60 mt-0.5">Type any village, taluka, town, or city above.</p>
                          </div>
                        )}
                      </div>

                      {/* Quick Popular & Micro-City Suggestions */}
                      <div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-white/80 mb-2 px-1">
                          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                          <span>Quick Search Suggestions</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {[
                            { name: "Sambhaji Nagar", query: "19.8773,75.3390", tag: "Maharashtra" },
                            { name: "Mumbai", query: "Mumbai", tag: "Metro" },
                            { name: "Pune", query: "Pune", tag: "Maharashtra" },
                            { name: "New Delhi", query: "New Delhi", tag: "Capital" },
                            { name: "Bengaluru", query: "Bengaluru", tag: "Tech Hub" },
                            { name: "London", query: "London", tag: "UK" },
                            { name: "Tokyo", query: "Tokyo", tag: "Japan" },
                            { name: "Dubai", query: "Dubai", tag: "UAE" },
                            { name: "New York", query: "New York", tag: "USA" },
                          ].map((chip) => (
                            <button
                              key={chip.name}
                              type="button"
                              onClick={() => {
                                fetchWeather(chip.query, false, chip.name);
                                setIsSearchFocused(false);
                                setShowSuggestions(false);
                                setSearchQuery("");
                              }}
                              className="px-2.5 py-1 rounded-xl bg-white/[0.06] hover:bg-cyan-500/20 hover:border-cyan-400/50 border border-white/10 text-xs font-medium text-white/90 hover:text-cyan-200 transition-all flex items-center gap-1.5 active:scale-95"
                            >
                              <span>{chip.name}</span>
                              <span className="text-[9px] text-cyan-300/60">({chip.tag})</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* CASE 2: Query has >= 2 characters -> Show Live Universal Results */}
                  {searchQuery.trim().length >= 2 && (
                    <div className="divide-y divide-white/[0.06]">
                      {isSearchingLocations ? (
                        <div className="py-8 text-center space-y-2">
                          <div className="w-6 h-6 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto shadow-[0_0_10px_#22d3ee]" />
                          <p className="text-xs text-cyan-200 font-medium animate-pulse">
                            Searching global micro-cities & villages for "{searchQuery}"...
                          </p>
                        </div>
                      ) : universalSuggestions.length > 0 ? (
                        universalSuggestions.map((s) => (
                          <button
                            key={s.id}
                            type="button"
                            onClick={() => handleSelectLocation(s)}
                            className="w-full px-4 py-3 text-left hover:bg-cyan-500/15 flex items-center justify-between group transition-all text-xs"
                          >
                            <div className="flex items-start gap-3 min-w-0">
                              <div className="w-7 h-7 rounded-lg bg-cyan-400/15 border border-cyan-400/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 shrink-0 mt-0.5 shadow-sm">
                                <MapPin className="w-3.5 h-3.5" />
                              </div>
                              <div className="truncate">
                                <div className="flex items-center gap-2">
                                  <p className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors truncate">
                                    {s.name}
                                  </p>
                                  {s.type && (
                                    <span className="px-1.5 py-0.5 text-[9px] rounded-md bg-cyan-400/20 border border-cyan-400/30 text-cyan-200 font-semibold uppercase">
                                      {s.type}
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-white/60 mt-0.5 truncate">
                                  {s.region ? `${s.region}, ` : ''}{s.country}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1.5 shrink-0 text-white/40 group-hover:text-cyan-300">
                              <span className="text-[10px] hidden sm:inline text-white/40 font-mono">
                                {s.lat.toFixed(2)}°, {s.lon.toFixed(2)}°
                              </span>
                              <ChevronRight className="w-4 h-4" />
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="py-8 text-center px-4">
                          <p className="text-xs text-white/70 font-semibold">No direct match found for "{searchQuery}"</p>
                          <p className="text-[11px] text-cyan-300/70 mt-1">Press Enter to force direct coordinates lookup across our global satellites.</p>
                          <button
                            type="button"
                            onClick={handleSearch}
                            className="mt-3 px-4 py-1.5 rounded-xl bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-400/30 hover:bg-cyan-300 transition-all"
                          >
                            Force Search "{searchQuery}"
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Action Controls - Hidden when search is focused ("side wale icon garab") */}
          {!isSearchFocused && (
            <div className="flex items-center gap-1.5 shrink-0 transition-opacity">
              {/* Live Location Button */}
              <button
                id="live-gps-btn"
                onClick={handleRequestLocation}
                disabled={isLocating}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 shadow-sm ${
                  isLiveLocation
                    ? "bg-emerald-400/20 text-emerald-300 border-emerald-400/40"
                    : "bg-white/[0.08] hover:bg-white/[0.14] text-white/85 hover:text-white border-white/15"
                }`}
                title="Use current GPS location"
              >
                <LocateFixed className={`w-3.5 h-3.5 ${isLocating ? "animate-spin text-amber-400" : isLiveLocation ? "text-emerald-400" : "text-sky-300"}`} />
                <span className="hidden sm:inline">
                  {isLiveLocation ? t.liveLocation : t.myLocation}
                </span>
              </button>

              {/* Blue Sky Theme Toggle */}
              <button
                id="sky-theme-toggle"
                onClick={() => setSkyTheme((themeVal) => (themeVal === "blue-sky" ? "deep-indigo" : "blue-sky"))}
                className={`px-2.5 py-1.5 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all active:scale-95 shadow-sm ${
                  isBlueSky
                    ? "bg-sky-400/20 text-sky-200 border-sky-400/40"
                    : "bg-white/[0.08] hover:bg-white/[0.14] text-white/80 border-white/15"
                }`}
                title="Toggle Theme"
              >
                {isBlueSky ? (
                  <>
                    <Sun className="w-3.5 h-3.5 text-amber-300" />
                    <span className="hidden md:inline">{t.blueSky}</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-3.5 h-3.5 text-indigo-300" />
                    <span className="hidden md:inline">{t.midnight}</span>
                  </>
                )}
              </button>

              {/* Unit Toggle */}
              <button
                id="temp-unit-toggle"
                onClick={() => setUnit((u) => (u === "C" ? "F" : "C"))}
                className="px-2.5 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] active:scale-95 border border-white/15 text-xs font-bold text-amber-300 transition-all shadow-sm"
                title="Toggle Celsius / Fahrenheit"
              >
                °{unit}
              </button>

              {/* Refresh */}
              <button
                id="refresh-weather-btn"
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] active:scale-95 border border-white/15 text-white/80 hover:text-white transition-all shadow-sm"
                title={t.refresh}
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? "animate-spin text-amber-400" : ""}`} />
              </button>

              {/* Settings Button */}
              <button
                id="app-settings-btn"
                onClick={() => setIsSettingsOpen(true)}
                className="p-2 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] active:scale-95 border border-white/15 text-white/80 hover:text-amber-300 transition-all shadow-sm"
                title={t.settings}
              >
                <SettingsIcon className="w-3.5 h-3.5 text-sky-300" />
              </button>

              <PWAInstallButton variant="header" />
            </div>
          )}
        </div>
      </header>

      {/* Search Focus Backdrop - Blurs and darkens everything behind search */}
      <AnimatePresence>
        {isSearchFocused && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => {
              setIsSearchFocused(false);
              setShowSuggestions(false);
            }}
            className="fixed inset-0 z-30 bg-black/80 backdrop-blur-md"
          />
        )}
      </AnimatePresence>

      {/* Main App Content Viewport - Blurs when search is focused */}
      <main className={`max-w-4xl mx-auto px-4 py-4 pb-28 space-y-4 transition-all duration-300 ${
        isSearchFocused ? "filter blur-md opacity-25 pointer-events-none select-none" : ""
      }`}>
        {/* Gentle Location Access Tip (shows smoothly only if user tapped My Location and browser blocked it) */}
        <AnimatePresence>
          {showPermissionTip && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="p-3 px-4 rounded-2xl bg-white/[0.08] border border-sky-400/30 backdrop-blur-md flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-white shadow-md"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-6 h-6 rounded-full bg-sky-400/20 flex items-center justify-center text-sky-300 shrink-0">
                  <LocateFixed className="w-3.5 h-3.5" />
                </div>
                <p className="text-sky-100 text-xs">
                  {t.locationOffTip}
                </p>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
                <button
                  onClick={handleRequestLocation}
                  disabled={isLocating}
                  className="px-3 py-1 rounded-lg bg-sky-400 hover:bg-sky-300 text-slate-950 font-bold text-xs active:scale-95 transition-all shadow-sm"
                >
                  {isLocating ? "Checking..." : t.tryAgain}
                </button>
                <button
                  onClick={() => setShowPermissionTip(false)}
                  className="p-1 rounded-lg text-white/50 hover:text-white hover:bg-white/10 transition-colors"
                  title="Close"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        {loading && !weather && (
          <div className="py-24 text-center">
            <div className="w-10 h-10 border-2 border-sky-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs text-sky-200/60 uppercase tracking-widest font-semibold">{t.loadingCity}</p>
          </div>
        )}

        {/* Error Notice */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-200 text-xs font-medium flex items-center justify-between">
            <span>{error}</span>
            <button 
              onClick={() => fetchWeather("New Delhi", false)} 
              className="underline hover:text-white text-[11px]"
            >
              {t.resetDefaultCity}
            </button>
          </div>
        )}

        {/* Weather Content Organized Across 4 Core App Sections */}
        {weather && (
          <AnimatePresence mode="wait">
            {/* ===================== SECTION 1: TODAY (OVERVIEW) ===================== */}
            {activeTab === "today" && (
              <motion.div
                key="tab-today"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.22 }}
                className="space-y-4"
              >
                {/* Quick Indian Metros Bar */}
                <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                  {INDIAN_METROS.map((metro) => {
                    const isSelected = !isLiveLocation && (
                      (customDisplayName && customDisplayName.toLowerCase().includes(metro.name.toLowerCase())) ||
                      weather.location.name.toLowerCase().includes(metro.name.toLowerCase())
                    );
                    return (
                      <button
                        key={metro.name}
                        onClick={() => fetchWeather(metro.query, false, metro.name)}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all active:scale-95 border ${
                          isSelected
                            ? "bg-amber-400/25 text-amber-300 border-amber-400/50 shadow-[0_0_12px_rgba(251,191,36,0.2)] font-semibold"
                            : "bg-white/[0.06] hover:bg-white/[0.12] text-white/70 hover:text-white border-white/10"
                        }`}
                      >
                        {metro.name}
                      </button>
                    );
                  })}
                </div>

                {/* Centerpiece Hero Card */}
                <GlassCard className="p-6 sm:p-8 relative overflow-hidden bg-gradient-to-b from-white/[0.12] via-white/[0.06] to-transparent border-white/20 shadow-xl">
                  {/* Top Meta Line: Location & Status */}
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2 min-w-0">
                      <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                      <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white truncate">
                        {customDisplayName || weather.location.name}
                      </h1>
                      <span className="text-xs text-sky-200/60 truncate hidden sm:inline">
                        {weather.location.region ? `${weather.location.region}, ` : ''}{weather.location.country}
                      </span>
                    </div>

                    {isLiveLocation ? (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-400/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>{t.liveLocation}</span>
                      </div>
                    ) : (
                      <div className="text-[10px] text-sky-200/50 font-medium">
                        {weather.location.name.toLowerCase() === "new delhi" ? t.defaultCity : t.selectedCity}
                      </div>
                    )}
                  </div>

                  {/* Main Temperature & Condition Row */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2">
                    <div className="flex items-center gap-4">
                      <div className="text-7xl sm:text-8xl font-light tracking-tighter text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
                        {formatTemp(weather.current.temp_c)}
                      </div>
                      <div className="space-y-1">
                        <div className="text-base sm:text-lg font-medium text-white/95">
                          {weather.current.condition.text}
                        </div>
                        <div className="text-xs text-sky-200/70 space-x-2">
                          <span>{t.feelsLike} {formatTemp(weather.current.feelslike_c ?? weather.current.temp_c)}</span>
                        </div>
                      </div>
                    </div>

                    {/* Weather Illustration */}
                    <div className="shrink-0 flex items-center justify-center">
                      <img
                        src={weather.current.condition.icon.replace('64x64', '128x128')}
                        alt={weather.current.condition.text}
                        className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-[0_12px_24px_rgba(251,191,36,0.35)]"
                      />
                    </div>
                  </div>

                  {/* High / Low Bar */}
                  <div className="flex items-center justify-between pt-4 mt-2 border-t border-white/10 text-xs text-sky-200/70">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1 text-white/90">
                        <ArrowUp className="w-3.5 h-3.5 text-amber-400" />
                        {t.high} {formatTemp(weather.forecast.forecastday[0].day.maxtemp_c)}
                      </span>
                      <span className="flex items-center gap-1 text-white/90">
                        <ArrowDown className="w-3.5 h-3.5 text-sky-400" />
                        {t.low} {formatTemp(weather.forecast.forecastday[0].day.mintemp_c)}
                      </span>
                    </div>
                    <div className="text-[11px] text-sky-200/50">
                      {weather.location.localtime ? `Local: ${weather.location.localtime.split(' ')[1]}` : 'Real-time'}
                    </div>
                  </div>
                </GlassCard>

                {/* 4 Minimal Metric Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {/* Wind */}
                  <GlassCard className="p-4 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-sky-200/60 mb-2">
                      <span className="text-[11px] font-medium">{t.wind}</span>
                      <Wind className="w-4 h-4 text-sky-400" />
                    </div>
                    <div>
                      <span className="text-xl font-semibold text-white">
                        {Math.round(weather.current.wind_kph)}
                      </span>
                      <span className="text-xs text-sky-200/60 ml-1">km/h</span>
                    </div>
                  </GlassCard>

                  {/* Humidity */}
                  <GlassCard className="p-4 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-sky-200/60 mb-2">
                      <span className="text-[11px] font-medium">{t.humidity}</span>
                      <Droplets className="w-4 h-4 text-blue-400" />
                    </div>
                    <div>
                      <span className="text-xl font-semibold text-white">
                        {weather.current.humidity}
                      </span>
                      <span className="text-xs text-sky-200/60 ml-1">%</span>
                    </div>
                  </GlassCard>

                  {/* UV Index */}
                  <GlassCard className="p-4 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-sky-200/60 mb-2">
                      <span className="text-[11px] font-medium">{t.uvIndex}</span>
                      <Sun className="w-4 h-4 text-amber-400" />
                    </div>
                    <div>
                      <span className="text-xl font-semibold text-white">
                        {weather.current.uv}
                      </span>
                      <span className="text-xs text-amber-300 ml-1 font-semibold">
                        {weather.current.uv >= 8 ? t.uvVeryHigh : weather.current.uv >= 6 ? t.uvHigh : weather.current.uv >= 3 ? t.uvMod : t.uvLow}
                      </span>
                    </div>
                  </GlassCard>

                  {/* Air Quality */}
                  <GlassCard className="p-4 flex flex-col justify-between">
                    <div className="flex items-center justify-between text-sky-200/60 mb-2">
                      <span className="text-[11px] font-medium">{t.airQuality}</span>
                      <Gauge className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <span className={`text-sm font-semibold truncate block ${aqiInfo.color}`}>
                        {aqiInfo.label}
                      </span>
                      <span className="text-[10px] text-sky-200/50">US EPA Index</span>
                    </div>
                  </GlassCard>
                </div>

                {/* 24-Hour Forecast (Clean Horizontal Scroll) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1 text-xs text-sky-200/70">
                    <div className="flex items-center gap-1.5 font-semibold text-white">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>{t.hourlyForecast}</span>
                    </div>
                    <span className="text-[11px]">{t.next24h}</span>
                  </div>

                  <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {weather.forecast.forecastday[0].hour
                      .filter((_, idx) => idx % 2 === 0)
                      .map((h, i) => {
                        const hourTime = new Date(h.time).getHours();
                        const hourDisplay = `${hourTime.toString().padStart(2, '0')}:00`;
                        return (
                          <div
                            key={i}
                            className="flex-shrink-0 w-20 py-3 px-2 rounded-2xl bg-white/[0.07] hover:bg-white/[0.12] border border-white/10 flex flex-col items-center gap-1.5 text-center transition-all shadow-sm"
                          >
                            <span className="text-[10px] text-sky-200/60 font-medium">{hourDisplay}</span>
                            <img src={h.condition.icon} alt="hour condition" className="w-8 h-8" />
                            <span className="text-xs font-semibold text-white">{formatTemp(h.temp_c)}</span>
                            {h.chance_of_rain !== undefined && h.chance_of_rain > 0 ? (
                              <span className="text-[9px] text-sky-300 font-medium">{h.chance_of_rain}%</span>
                            ) : (
                              <span className="text-[9px] text-white/30">-</span>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Sun Glance Tiles */}
                <div className="grid grid-cols-2 gap-3">
                  <GlassCard className="p-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sunrise className="w-4 h-4 text-amber-400" />
                      <div>
                        <p className="text-[10px] text-sky-200/60 font-medium">{t.sunrise}</p>
                        <p className="text-xs font-bold text-white">{weather.forecast.forecastday[0].astro.sunrise}</p>
                      </div>
                    </div>
                  </GlassCard>
                  <GlassCard className="p-3.5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sunset className="w-4 h-4 text-orange-400" />
                      <div>
                        <p className="text-[10px] text-sky-200/60 font-medium">{t.sunset}</p>
                        <p className="text-xs font-bold text-white">{weather.forecast.forecastday[0].astro.sunset}</p>
                      </div>
                    </div>
                  </GlassCard>
                </div>

                {/* Plain-Language Mini Weather Summary (Zero Jargon • Easy to Understand) */}
                <WeatherSimpleSummary 
                  weather={weather} 
                  activeLanguage={language} 
                  onLanguageChange={(code) => {
                    if (AVAILABLE_LANGUAGES.some(l => l.code === code)) {
                      handleSelectLanguage(code as LanguageCode);
                    }
                  }}
                />
              </motion.div>
            )}

            {/* ===================== SECTION 2: FORECAST (7-DAY OUTLOOK) ===================== */}
            {activeTab === "forecast" && (
              <motion.div
                key="tab-forecast"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.22 }}
                className="space-y-4"
              >
                {/* Section Header */}
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-5 h-5 text-amber-400" />
                    <div>
                      <h2 className="text-base font-bold text-white tracking-tight">{t.weeklyForecast}</h2>
                      <p className="text-xs text-sky-200/60">{weather.location.name} • 7-Day Extended Forecast</p>
                    </div>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded-full bg-white/[0.08] border border-white/15 text-amber-300 font-semibold">
                    7 Days
                  </span>
                </div>

                {/* 7-Day Forecast (Minimal Row List) */}
                <GlassCard className="p-4 sm:p-5 space-y-2">
                  <div className="divide-y divide-white/[0.08]">
                    {weather.forecast.forecastday.map((d, index) => {
                      const dayDate = new Date(d.date);
                      const dayName = index === 0 ? t.today : dayDate.toLocaleDateString(language === 'en' ? 'en-US' : language, { weekday: "short" });
                      const rainChance = d.day.daily_chance_of_rain ?? 0;
                      return (
                        <div
                          key={d.date}
                          className="py-3 px-1 flex items-center justify-between gap-3 text-xs hover:bg-white/[0.03] rounded-xl transition-colors"
                        >
                          {/* Day Name */}
                          <div className="w-20 shrink-0">
                            <span className="font-semibold text-white text-sm block">
                              {dayName}
                            </span>
                            <span className="text-[10px] text-sky-200/50">
                              {dayDate.toLocaleDateString([], { month: "short", day: "numeric" })}
                            </span>
                          </div>

                          {/* Condition Icon & Text */}
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <img src={d.day.condition.icon} alt="condition" className="w-8 h-8 shrink-0" />
                            <div className="min-w-0">
                              <span className="text-white/90 truncate text-xs block font-medium">
                                {d.day.condition.text}
                              </span>
                              {rainChance > 10 && (
                                <span className="text-[10px] text-sky-300 font-medium">
                                  🌧️ {rainChance}% rain
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Min / Max Range */}
                          <div className="flex items-center gap-2 shrink-0 font-medium">
                            <span className="text-sky-200/60 text-xs">
                              {formatTemp(d.day.mintemp_c)}
                            </span>
                            <div className="w-16 sm:w-28 h-2 rounded-full bg-white/10 overflow-hidden relative">
                              <div className="absolute inset-0 bg-gradient-to-r from-sky-400 via-emerald-400 to-amber-400 rounded-full" />
                            </div>
                            <span className="text-white font-bold text-xs">
                              {formatTemp(d.day.maxtemp_c)}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </GlassCard>

                {/* Detailed 24-Hour Timeline */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1 text-xs text-sky-200/70">
                    <div className="flex items-center gap-1.5 font-semibold text-white">
                      <Clock className="w-3.5 h-3.5 text-amber-400" />
                      <span>{t.hourlyForecast}</span>
                    </div>
                    <span className="text-[11px]">{t.next24h}</span>
                  </div>

                  <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {weather.forecast.forecastday[0].hour
                      .filter((_, idx) => idx % 2 === 0)
                      .map((h, i) => {
                        const hourTime = new Date(h.time).getHours();
                        const hourDisplay = `${hourTime.toString().padStart(2, '0')}:00`;
                        return (
                          <div
                            key={i}
                            className="flex-shrink-0 w-20 py-3 px-2 rounded-2xl bg-white/[0.07] hover:bg-white/[0.12] border border-white/10 flex flex-col items-center gap-1.5 text-center transition-all shadow-sm"
                          >
                            <span className="text-[10px] text-sky-200/60 font-medium">{hourDisplay}</span>
                            <img src={h.condition.icon} alt="hour condition" className="w-8 h-8" />
                            <span className="text-xs font-semibold text-white">{formatTemp(h.temp_c)}</span>
                            {h.chance_of_rain !== undefined && h.chance_of_rain > 0 ? (
                              <span className="text-[9px] text-sky-300 font-medium">{h.chance_of_rain}%</span>
                            ) : (
                              <span className="text-[9px] text-white/30">-</span>
                            )}
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Sun & Atmospheric Details */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <GlassCard className="p-4">
                    <div className="flex items-center gap-1.5 text-sky-200/60 text-[11px] mb-1">
                      <Sunrise className="w-3.5 h-3.5 text-amber-400" />
                      <span>{t.sunrise}</span>
                    </div>
                    <div className="text-sm font-semibold text-white">
                      {weather.forecast.forecastday[0].astro.sunrise}
                    </div>
                  </GlassCard>

                  <GlassCard className="p-4">
                    <div className="flex items-center gap-1.5 text-sky-200/60 text-[11px] mb-1">
                      <Sunset className="w-3.5 h-3.5 text-orange-400" />
                      <span>{t.sunset}</span>
                    </div>
                    <div className="text-sm font-semibold text-white">
                      {weather.forecast.forecastday[0].astro.sunset}
                    </div>
                  </GlassCard>

                  <GlassCard className="p-4">
                    <div className="flex items-center gap-1.5 text-sky-200/60 text-[11px] mb-1">
                      <Eye className="w-3.5 h-3.5 text-sky-400" />
                      <span>{t.visibility}</span>
                    </div>
                    <div className="text-sm font-semibold text-white">
                      {weather.current.vis_km ?? 10} km
                    </div>
                  </GlassCard>

                  <GlassCard className="p-4">
                    <div className="flex items-center gap-1.5 text-sky-200/60 text-[11px] mb-1">
                      <Compass className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{t.pressure}</span>
                    </div>
                    <div className="text-sm font-semibold text-white">
                      {weather.current.pressure_mb ?? 1012} hPa
                    </div>
                  </GlassCard>
                </div>
              </motion.div>
            )}

            {/* ===================== SECTION 3: AIR & INTEL ===================== */}
            {activeTab === "intel" && (
              <motion.div
                key="tab-intel"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.22 }}
                className="space-y-4"
              >
                {/* Section Header */}
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <Gauge className="w-5 h-5 text-emerald-400" />
                    <div>
                      <h2 className="text-base font-bold text-white tracking-tight">{t.airQuality} & Environmental Intel</h2>
                      <p className="text-xs text-sky-200/60">Live air health & telemetry for {weather.location.name}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold border ${aqiInfo.bg} ${aqiInfo.color} ${aqiInfo.border}`}>
                    {aqiInfo.label}
                  </span>
                </div>

                {/* Big AQI Diagnostic Card */}
                <GlassCard className="p-6 relative overflow-hidden bg-gradient-to-b from-white/[0.1] to-white/[0.04] border-white/20">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs uppercase tracking-wider font-bold text-sky-300">US EPA Standard</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${aqiInfo.bg} ${aqiInfo.color} ${aqiInfo.border}`}>
                          Index: {weather.current.air_quality?.["us-epa-index"] ?? 1} / 6
                        </span>
                      </div>
                      <h3 className={`text-2xl font-bold ${aqiInfo.color}`}>
                        {aqiInfo.label} Air Quality
                      </h3>
                      <p className="text-xs text-sky-100/70 max-w-lg leading-relaxed pt-1">
                        {weather.current.air_quality?.["us-epa-index"] === 1 && "Air quality is considered satisfactory, and air pollution poses little or no risk. Perfect for outdoor exercises and morning runs."}
                        {weather.current.air_quality?.["us-epa-index"] === 2 && "Air quality is acceptable; however, very sensitive individuals may experience minor symptoms. General public can enjoy outdoors normally."}
                        {weather.current.air_quality?.["us-epa-index"] === 3 && "Members of sensitive groups (children, elderly, people with asthma) may experience health effects. Limit prolonged outdoor exertion."}
                        {weather.current.air_quality?.["us-epa-index"] === 4 && "Everyone may begin to experience health effects. Members of sensitive groups may experience more serious health effects. Wearing an N95 mask is recommended outdoors."}
                        {weather.current.air_quality?.["us-epa-index"] >= 5 && "Health alert: The risk of health effects is increased for everyone. Keep windows closed, use air purifiers, and avoid outdoor physical activities."}
                      </p>
                    </div>

                    <div className="shrink-0 flex items-center gap-3">
                      <div className="w-16 h-16 rounded-2xl bg-white/[0.08] border border-white/15 flex flex-col items-center justify-center text-center">
                        <Activity className="w-6 h-6 text-emerald-400 mb-1" />
                        <span className="text-[10px] font-bold text-white/80">AQI Live</span>
                      </div>
                    </div>
                  </div>

                  {/* AQI 6-step Spectrum Bar */}
                  <div className="mt-5 pt-4 border-t border-white/10 space-y-1.5">
                    <div className="flex justify-between text-[10px] font-medium text-sky-200/60">
                      <span>Good (1)</span>
                      <span>Moderate (2)</span>
                      <span>Sensitive (3)</span>
                      <span>Unhealthy (4)</span>
                      <span>Hazardous (6)</span>
                    </div>
                    <div className="grid grid-cols-6 gap-1 h-2 rounded-full overflow-hidden bg-white/10">
                      <div className="bg-emerald-400 rounded-l-full" />
                      <div className="bg-amber-400" />
                      <div className="bg-orange-400" />
                      <div className="bg-rose-500" />
                      <div className="bg-purple-500" />
                      <div className="bg-red-700 rounded-r-full" />
                    </div>
                  </div>
                </GlassCard>

                {/* UV Index & Sun Protection Station */}
                <GlassCard className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sun className="w-4 h-4 text-amber-400" />
                      <h3 className="text-sm font-bold text-white">{t.uvIndex} Station</h3>
                    </div>
                    <span className="text-xs font-bold text-amber-300">
                      UV {weather.current.uv} • {weather.current.uv >= 8 ? t.uvVeryHigh : weather.current.uv >= 6 ? t.uvHigh : weather.current.uv >= 3 ? t.uvMod : t.uvLow}
                    </span>
                  </div>

                  <p className="text-xs text-sky-200/70 leading-relaxed">
                    {weather.current.uv <= 2 && "Minimal danger from the sun's UV rays for the average person. Wear sunglasses on bright days."}
                    {weather.current.uv >= 3 && weather.current.uv <= 5 && "Moderate risk of harm from unprotected sun exposure. Stay in shade near midday, apply SPF 30+ sunscreen, wear protective sunglasses."}
                    {weather.current.uv >= 6 && weather.current.uv <= 7 && "High risk of harm from unprotected sun exposure. Protection against skin and eye damage is needed. Reduce time in the sun between 10 a.m. and 4 p.m."}
                    {weather.current.uv >= 8 && "Very high risk of harm from unprotected sun exposure. Take extra precautions because unprotected skin and eyes will burn quickly."}
                  </p>
                </GlassCard>

                {/* Atmospheric Telemetry Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <GlassCard className="p-4">
                    <div className="flex items-center gap-1.5 text-sky-200/60 text-[11px] mb-1">
                      <Compass className="w-3.5 h-3.5 text-emerald-400" />
                      <span>{t.pressure}</span>
                    </div>
                    <div className="text-sm font-semibold text-white">
                      {weather.current.pressure_mb ?? 1012} hPa
                    </div>
                    <span className="text-[10px] text-sky-200/50 mt-1 block">Barometric</span>
                  </GlassCard>

                  <GlassCard className="p-4">
                    <div className="flex items-center gap-1.5 text-sky-200/60 text-[11px] mb-1">
                      <Eye className="w-3.5 h-3.5 text-sky-400" />
                      <span>{t.visibility}</span>
                    </div>
                    <div className="text-sm font-semibold text-white">
                      {weather.current.vis_km ?? 10} km
                    </div>
                    <span className="text-[10px] text-sky-200/50 mt-1 block">Atmosphere</span>
                  </GlassCard>

                  <GlassCard className="p-4">
                    <div className="flex items-center gap-1.5 text-sky-200/60 text-[11px] mb-1">
                      <Droplets className="w-3.5 h-3.5 text-blue-400" />
                      <span>{t.humidity}</span>
                    </div>
                    <div className="text-sm font-semibold text-white">
                      {weather.current.humidity}%
                    </div>
                    <span className="text-[10px] text-sky-200/50 mt-1 block">Moisture</span>
                  </GlassCard>

                  <GlassCard className="p-4">
                    <div className="flex items-center gap-1.5 text-sky-200/60 text-[11px] mb-1">
                      <Wind className="w-3.5 h-3.5 text-sky-300" />
                      <span>{t.wind}</span>
                    </div>
                    <div className="text-sm font-semibold text-white">
                      {Math.round(weather.current.wind_kph)} km/h
                    </div>
                    <span className="text-[10px] text-sky-200/50 mt-1 block">Speed</span>
                  </GlassCard>
                </div>
              </motion.div>
            )}

            {/* ===================== SECTION 4: CITIES (LOCATIONS & METROS) ===================== */}
            {activeTab === "cities" && (
              <motion.div
                key="tab-cities"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.22 }}
                className="space-y-4"
              >
                {/* Cities Hub Header */}
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-amber-400" />
                    <div>
                      <h2 className="text-base font-bold text-white tracking-tight">Cities & Metro Hub</h2>
                      <p className="text-xs text-sky-200/60">Switch city or search any global location</p>
                    </div>
                  </div>
                  <button
                    onClick={() => fetchWeather("New Delhi", false)}
                    className="text-xs px-3 py-1 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 text-amber-300 font-medium transition-colors"
                  >
                    Reset New Delhi
                  </button>
                </div>

                {/* GPS Location Instant Card */}
                <GlassCard 
                  onClick={handleRequestLocation}
                  className={`p-4 cursor-pointer transition-all hover:bg-white/[0.12] active:scale-[0.99] border ${
                    isLiveLocation 
                      ? 'bg-emerald-400/15 border-emerald-400/40 shadow-[0_0_20px_rgba(52,211,153,0.15)]' 
                      : 'border-white/15'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                        isLiveLocation ? 'bg-emerald-400/25 text-emerald-300' : 'bg-white/10 text-sky-300'
                      }`}>
                        <LocateFixed className={`w-5 h-5 ${isLocating ? 'animate-spin text-amber-400' : ''}`} />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-white text-sm">
                            {isLiveLocation ? "Live Device GPS Active" : "Detect Current GPS Location"}
                          </h4>
                          {isLiveLocation && <Check className="w-4 h-4 text-emerald-400" />}
                        </div>
                        <p className="text-xs text-sky-200/60">
                          {isLiveLocation ? `Active at ${weather.location.name}` : "Tap to automatically detect your real-time coordinates"}
                        </p>
                      </div>
                    </div>

                    <button
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                        isLiveLocation 
                          ? 'bg-emerald-400 text-slate-950 shadow-md' 
                          : 'bg-white/15 hover:bg-white/25 text-white'
                      }`}
                    >
                      {isLocating ? "Detecting..." : isLiveLocation ? "Connected" : "Use GPS"}
                    </button>
                  </div>
                </GlassCard>

                {/* Indian Metros Grid */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1 text-xs text-sky-200/70">
                    <span className="font-semibold text-white">Popular Indian Cities</span>
                    <span className="text-[11px] text-sky-200/50">One-tap weather switch</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {INDIAN_METROS.map((metro) => {
                      const isSelected = !isLiveLocation && weather.location.name.toLowerCase() === metro.name.toLowerCase();
                      return (
                        <button
                          key={metro.name}
                          onClick={() => {
                            fetchWeather(metro.query, false);
                            setActiveTab("today");
                          }}
                          className={`p-3.5 rounded-2xl text-left transition-all active:scale-95 border flex items-center justify-between group ${
                            isSelected
                              ? "bg-amber-400/20 border-amber-400/50 shadow-[0_0_15px_rgba(251,191,36,0.15)]"
                              : "bg-white/[0.07] hover:bg-white/[0.12] border-white/10"
                          }`}
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-1">
                              <p className={`font-bold text-xs truncate ${isSelected ? 'text-amber-300' : 'text-white group-hover:text-amber-300'}`}>
                                {metro.name}
                              </p>
                              {isSelected && <Check className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                            </div>
                            <p className="text-[10px] text-sky-200/50 truncate">India</p>
                          </div>

                          <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-amber-400' : 'text-white/30 group-hover:text-white group-hover:translate-x-0.5'}`} />
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}

        {/* Minimal Clean Footer */}
        <footer className="pt-4 pb-6 text-center text-[11px] text-sky-200/40">
          <p>{t.footerNote}</p>
        </footer>
      </main>

      {/* Persistent Native Application Bottom Navigation Bar (4 Core Sections) */}
      <MobileBottomNav 
        activeTab={activeTab} 
        onChangeTab={setActiveTab} 
        language={language} 
      />

      {/* Settings & Language Customization Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        currentLanguage={language}
        onSelectLanguage={handleSelectLanguage}
        unit={unit}
        onToggleUnit={setUnit}
        skyTheme={skyTheme}
        onToggleTheme={setSkyTheme}
        t={t}
      />

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap');
        
        body {
          font-family: 'Plus Jakarta Sans', sans-serif;
          margin: 0;
        }
      `}</style>
    </div>
  );
}
