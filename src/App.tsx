/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, useCallback, useMemo } from "react";
import type { ReactNode, FormEvent } from "react";
import { GoogleGenAI, Type } from "@google/genai";
import { 
  Search, 
  MapPin, 
  Wind, 
  Droplets, 
  Sun, 
  Sunrise, 
  Sunset,
  ChevronRight,
  ChevronLeft,
  Navigation,
  Bell,
  BellOff,
  LineChart as LineChartIcon,
  Calendar,
  RotateCcw,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  Bar,
  ComposedChart
} from "recharts";

// --- Types ---
interface WeatherData {
  location: {
    name: string;
    region: string;
    country: string;
    localtime: string;
  };
  current: {
    temp_c: number;
    condition: {
      text: string;
      icon: string;
      code: number;
    };
    wind_kph: number;
    humidity: number;
    uv: number;
    air_quality: {
      "us-epa-index": number;
    };
  };
  forecast: {
    forecastday: Array<{
      date: string;
      day: {
        maxtemp_c: number;
        mintemp_c: number;
        condition: {
          text: string;
          icon: string;
        };
      };
      hour: Array<{
        time: string;
        temp_c: number;
        condition: {
          text: string;
          icon: string;
        };
      }>;
      astro: {
        sunrise: string;
        sunset: string;
      };
    }>;
  };
}

interface NewsArticle {
  title: string;
  description: string;
  url: string;
  image: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

interface LocationSuggestion {
  id: number;
  name: string;
  region: string;
  country: string;
  lat: number;
  lon: number;
  url: string;
}

// --- Constants & Helpers ---
const API_KEY = "8418358e19a94f2fadc175103260905";

const getAQILevel = (index: number) => {
  const levels = [
    { label: "Good", color: "text-green-400", risk: "Low" },
    { label: "Moderate", color: "text-yellow-400", risk: "Moderate" },
    { label: "Unhealthy for Sensitive Groups", color: "text-orange-400", risk: "High" },
    { label: "Unhealthy", color: "text-red-400", risk: "Very High" },
    { label: "Very Unhealthy", color: "text-purple-400", risk: "Extreme" },
    { label: "Hazardous", color: "text-red-600", risk: "Hazardous" },
  ];
  return levels[index - 1] || levels[0];
};

// Weather image logic removed as requested.

const GlassCard = ({ children, className = "" }: { children: ReactNode, className?: string }) => (
  <div className={`backdrop-blur-3xl bg-white/5 border border-white/10 rounded-2xl md:rounded-[2.5rem] p-4 md:p-8 shadow-2xl ${className}`}>
    {children}
  </div>
);


const WeatherEffects = ({ condition }: { condition: string }) => {
  const c = condition.toLowerCase();
  const isRain = c.includes("rain") || c.includes("drizzle") || c.includes("shower");
  const isSnow = c.includes("snow") || c.includes("ice") || c.includes("blizzard");
  const isCloudy = c.includes("cloud") || c.includes("overcast") || c.includes("mist") || c.includes("fog");
  const isSun = c.includes("sun") || c.includes("clear");

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Sun/Clear Effects */}
      {isSun && (
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.2, 0.1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-20 -right-20 w-[600px] h-[600px] bg-yellow-400/20 rounded-full blur-[120px]"
        />
      )}

      {/* Cloud/Mist Effects */}
      {isCloudy && (
        <>
          <motion.div
            animate={{ x: [-100, 100], opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute top-1/4 left-0 w-[800px] h-[400px] bg-white/5 rounded-full blur-[100px]"
          />
          <motion.div
            animate={{ x: [100, -100], opacity: [0.05, 0.2, 0.05] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute bottom-1/4 right-0 w-[600px] h-[300px] bg-blue-400/5 rounded-full blur-[80px]"
          />
        </>
      )}

      {/* Rain Effects */}
      {isRain && (
        <div className="absolute inset-0 flex justify-around">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: -100, opacity: 0 }}
              animate={{ 
                y: [null, 1000],
                opacity: [0, 0.3, 0]
              }}
              transition={{ 
                duration: 1 + Math.random(), 
                repeat: Infinity, 
                delay: Math.random() * 2,
                ease: "linear"
              }}
              className="w-[1px] h-20 bg-blue-300/30 blur-[1px]"
              style={{ marginLeft: `${Math.random() * 100}%` }}
            />
          ))}
        </div>
      )}

      {/* Snow Effects */}
      {isSnow && (
        <div className="absolute inset-0">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ y: -50, x: Math.random() * 100 + "%", opacity: 0 }}
              animate={{ 
                y: [null, 1000],
                x: [null, (Math.random() * 10 + 45) + "%"],
                opacity: [0, 0.5, 0],
                rotate: 360
              }}
              transition={{ 
                duration: 3 + Math.random() * 5, 
                repeat: Infinity, 
                delay: Math.random() * 5,
                ease: "linear"
              }}
              className="w-2 h-2 bg-white/40 rounded-full blur-[1px]"
            />
          ))}
        </div>
      )}
    </div>
  );
};

const TemperatureChart = ({ data, type = 'hourly' }: { data: any[], type?: 'hourly' | 'daily' }) => {
  const chartData = type === 'hourly' 
    ? data.filter((_, i) => i % 2 === 0).map(h => ({
        time: new Date(h.time).getHours() + ":00",
        temp: Math.round(h.temp_c),
        precip: h.chance_of_rain > h.chance_of_snow ? h.chance_of_rain : h.chance_of_snow,
      }))
    : data.map(d => ({
        time: new Date(d.date).toLocaleDateString([], { weekday: 'short' }),
        temp: Math.round(d.day.maxtemp_c),
        precip: d.day.daily_chance_of_rain > d.day.daily_chance_of_snow ? d.day.daily_chance_of_rain : d.day.daily_chance_of_snow,
      }));

  return (
    <div className="h-48 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={chartData}>
          <defs>
            <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#facd15" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#facd15" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorPrecip" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(26, 17, 71, 0.9)', 
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '1rem',
              color: '#fff',
              fontSize: '12px',
              backdropFilter: 'blur(10px)'
            }}
            itemStyle={{ fontSize: '11px', fontWeight: 'bold' }}
            cursor={{ stroke: 'rgba(255, 255, 255, 0.1)', strokeWidth: 2 }}
          />
          <XAxis 
            dataKey="time" 
            hide 
          />
          <YAxis 
            yAxisId="left"
            hide 
            domain={['dataMin - 5', 'dataMax + 5']} 
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            hide 
            domain={[0, 100]}
          />
          <Area 
            yAxisId="left"
            type="monotone" 
            dataKey="temp" 
            name="Temp (°C)"
            stroke="#facd15" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorTemp)" 
          />
          <Bar 
            yAxisId="right"
            dataKey="precip" 
            name="Precip (%)"
            fill="#3b82f6" 
            radius={[4, 4, 0, 0]}
            opacity={0.3}
            barSize={10}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

export default function App() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [worldHighlights, setWorldHighlights] = useState<any[]>([]);
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [loadingNews, setLoadingNews] = useState(false);
  const [newsError, setNewsError] = useState<string | null>(null);
  const [newsScope, setNewsScope] = useState<"city" | "country" | "global">("city");
  const [newsCategory, setNewsCategory] = useState<string>("weather");
  const [newsFrom, setNewsFrom] = useState<string>("");
  const [newsTo, setNewsTo] = useState<string>("");

  const ai = useMemo(() => new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" }), []);

  const filterNewsWithAI = async (articles: NewsArticle[]) => {
    if (!articles.length) return [];
    
    try {
      const articleData = articles.map((a, i) => ({
        index: i,
        title: a.title,
        description: a.description
      }));

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `You are a meteorological news filter. Analyze these news articles and identify only those that are STRICTLY about weather (storms, temperature records, meteorology, climate change impact on weather, forecasting, natural disasters caused by weather).
        Reject articles that only mention weather in passing while focusing on politics, business, sports, or celebrities.
        Return a JSON array containing ONLY the indices of the strictly weather-related articles.
        
        Articles:
        ${JSON.stringify(articleData)}`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: { type: Type.INTEGER }
          }
        }
      });

      const indices = JSON.parse(response.text || "[]");
      return indices.map((idx: number) => articles[idx]).filter(Boolean);
    } catch (err) {
      console.error("AI Filtering failed", err);
      // Fallback to basic keyword check if AI fails
      const weatherKeywords = ['weather', 'storm', 'rain', 'temp', 'forecast', 'climate', 'flood', 'heat', 'cold', 'snow'];
      return articles.filter(art => {
        const content = `${art.title} ${art.description}`.toLowerCase();
        return weatherKeywords.some(kw => content.includes(kw));
      });
    }
  };

  // Location system state
  const [tracking, setTracking] = useState(false);
  const [view, setView] = useState<"welcome" | "app">("welcome");
  const [showNotifConsent, setShowNotifConsent] = useState(false);
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );

  const requestNotifPermission = async () => {
    if (!("Notification" in window)) return;
    const permission = await Notification.requestPermission();
    setNotifPermission(permission);
    setShowNotifConsent(false);
    if (permission === 'granted') {
      new Notification("ViSky Alerts Active", {
        body: `You'll now receive updates for significant weather changes in ${weather?.location.name || 'your area'}.`,
        icon: "https://cdn-icons-png.flaticon.com/512/3222/3222800.png"
      });
    }
  };

  const fetchNews = useCallback(async (location: string, country: string, category: string = "weather", from: string = "", to: string = "") => {
    setLoadingNews(true);
    setNews([]);
    setNewsError(null);
    setNewsScope("city");
    
    try {
      const performFetch = async (query: string) => {
        // More aggressive API query to narrow down results to actual weather reporting
        const strictQuery = `${query} AND (weather OR meteorology OR forecast OR "weather report" OR "climate updates")`;
        let url = `/api/news?q=${encodeURIComponent(strictQuery)}&language=en&sortBy=publishedAt&pageSize=60`;
        if (from) url += `&from=${from}`;
        if (to) url += `&to=${to}`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        if (data.status === "error") {
          throw new Error(data.message || "News API unavailable");
        }
        
        const mappedArticles = (data.articles || []).map((art: any) => ({
          ...art,
          image: art.urlToImage
        }));

        // Use AI to filter results for strict meteorological relevance
        const filtered = await filterNewsWithAI(mappedArticles);
        return filtered.slice(0, 6);
      };

      // Construct base query - strictly weather related
      const baseQuery = category === "weather" ? "weather" : `${category}`;

      // 1. City Weather Attempt
      try {
        // Enforce weather context in query
        const cityArticles = await performFetch(`"${location}" weather`);
        if (cityArticles.length > 0) {
          setNews(cityArticles);
          setNewsScope("city");
          setLoadingNews(false);
          return;
        }
      } catch (e: any) {
        const msg = e.message.toLowerCase();
        if (msg.includes("key") || msg.includes("token") || msg.includes("unauthorized") || msg.includes("401")) {
          setNewsError(`News API Key Issue: ${e.message}`);
          setLoadingNews(false);
          return;
        }
        console.warn("City news fetch failed, trying country...", e);
      }

      // 2. Country Weather Fallback
      try {
        const countryArticles = await performFetch(`"${country}" weather`);
        if (countryArticles.length > 0) {
          setNews(countryArticles);
          setNewsScope("country");
          setLoadingNews(false);
          return;
        }
      } catch (e: any) {
        console.warn("Country news fetch failed, trying global...", e);
      }

      // 3. Global Weather Fallback - Strictly meteorological
      const globalArticles = await performFetch(baseQuery);
      setNews(globalArticles);
      setNewsScope("global");
    } catch (err: any) {
      console.error("News fetch failed", err);
      setNewsError(err.message || "Failed to sync with global news network");
    } finally {
      setLoadingNews(false);
    }
  }, []);

  // Re-fetch news when filters change
  useEffect(() => {
    if (weather) {
      fetchNews(weather.location.name, weather.location.country, newsCategory, newsFrom, newsTo);
    }
  }, [newsCategory, newsFrom, newsTo, fetchNews]);

  const fetchWeather = useCallback(async (location: string) => {
    setLoading(true);
    setError("");
    setSuggestions([]);
    setShowSuggestions(false);
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${location}&days=7&aqi=yes&alerts=yes`
      );
      if (!response.ok) throw new Error("City not found");
      const data = await response.json();
      setWeather(data);
      setSearchQuery("");
      setView("app");

      // Fetch news for the new location
      fetchNews(data.location.name, data.location.country);

      // Check for significant weather alerts immediately
      if (data.alerts?.alert?.length > 0 && Notification.permission === 'granted') {
        data.alerts.alert.forEach((alert: any) => {
          new Notification(`⚠️ ViSky Alert: ${alert.event}`, {
            body: `${alert.headline}`,
            icon: "https://cdn-icons-png.flaticon.com/512/3222/3222800.png"
          });
        });
      }

      // Show consent prompt after 3s if not yet decided or granted
      if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
        setTimeout(() => setShowNotifConsent(true), 3000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch weather");
      setView("app"); // Still show the app so user can try again
    } finally {
      setLoading(false);
    }
  }, [fetchNews]);

  const startTracking = useCallback(() => {
    if (navigator.geolocation) {
      setTracking(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(`${position.coords.latitude},${position.coords.longitude}`);
        },
        () => {
          setTracking(false);
          setError("Location access denied");
        }
      );
    }
  }, [fetchWeather]);

  const fetchWorldHighlights = useCallback(async () => {
    const cities = ["New York", "Tokyo", "London", "Dubai"];
    try {
      const promises = cities.map(city => 
        fetch(`https://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${city}`)
          .then(res => res.json())
          .catch(() => null)
      );
      const results = await Promise.all(promises);
      setWorldHighlights(results.filter(r => r !== null));
    } catch (err) {
      console.error("Failed to fetch world highlights", err);
    }
  }, []);

  const fetchSuggestions = async (query: string) => {
    if (!query.trim() || query.length < 3) {
      setSuggestions([]);
      return;
    }
    try {
      const response = await fetch(
        `https://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${query}`
      );
      if (response.ok) {
        const data = await response.json();
        setSuggestions(data);
        setShowSuggestions(true);
      }
    } catch (err) {
      console.error("Suggestion fetch failed", err);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        fetchSuggestions(searchQuery);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    fetchWorldHighlights();
    // Initial load
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeather(`${position.coords.latitude},${position.coords.longitude}`);
        },
        () => fetchWeather("London")
      );
    } else {
      fetchWeather("London");
    }
  }, [fetchWeather, fetchWorldHighlights]);

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchWeather(searchQuery);
    }
  };

  if (loading && !weather) {
    return (
      <div className="min-h-screen bg-[#110B33] flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-yellow-400 border-t-transparent rounded-full shadow-[0_0_20px_rgba(250,204,21,0.2)]"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#110B33] bg-gradient-to-br from-[#7A44B4] via-[#110B33] to-[#0D0D1D] text-white p-2 md:p-6 font-sans overflow-x-hidden selection:bg-yellow-400 selection:text-black">
      {weather && <WeatherEffects condition={weather.current.condition.text} />}
      
      <AnimatePresence mode="wait">
        {view === "welcome" ? (
          /* Splash/Welcome Screen based on screenshot left panel */
          <motion.div
            key="welcome"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, x: -100 }}
            className="flex flex-col items-center justify-center min-h-[85vh] text-center space-y-6 md:space-y-12 max-w-md mx-auto px-6"
          >
            <div className="relative group">
              <motion.div
                animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative z-10"
              >
                <img 
                  src="https://cdn-icons-png.flaticon.com/512/3222/3222800.png" 
                  alt="3D Sun Cloud" 
                  className="w-40 h-40 md:w-64 md:h-64 filter drop-shadow-[0_20px_40px_rgba(250,204,21,0.5)] transition-transform group-hover:scale-110 duration-700"
                />
              </motion.div>
              <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-28 h-6 bg-black/50 blur-[30px] rounded-full" />
            </div>

            <div className="space-y-3 md:space-y-6">
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-[0.8] mb-4">
                ViSky <br />
                <span className="text-yellow-400">Weather</span>
              </h1>
              <p className="text-white/30 font-bold uppercase tracking-[0.4em] text-[7px] md:text-[10px]">Aura Intelligence v2.0.4</p>
            </div>

            <motion.button 
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(250,204,21,0.4)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setView("app");
                startTracking();
              }}
              className="bg-yellow-400 text-black px-8 md:px-16 py-3.5 md:py-6 rounded-full font-black text-base md:text-2xl shadow-[0_20px_50px_rgba(250,204,21,0.3)] flex items-center gap-3 md:gap-4 group transition-all"
            >
              Get Started <ChevronRight className="w-4 h-4 md:w-6 md:h-6 group-hover:translate-x-2 transition-transform" strokeWidth={3} />
            </motion.button>
          </motion.div>
        ) : (
          /* Main Application Grid */
          <motion.div
            key="app"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6 md:gap-12 pb-12 pt-2 md:pt-4"
          >
            {/* Left/Middle Column: Current Status (Like screenshot center) */}
            <div className="flex-1 w-full space-y-6 md:space-y-8 max-w-xl mx-auto md:mx-0 px-2 md:px-0">
              <header className="flex items-center gap-2 md:gap-4">
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setView("welcome")}
                  className="p-2.5 md:p-4 bg-white/5 rounded-xl md:rounded-3xl border border-white/10 hover:bg-white/10 transition-all shadow-xl"
                >
                  <ChevronLeft className="w-5 h-5 md:w-6 md:h-6" />
                </motion.button>
                <div className="flex-1 space-y-1">
                  <h1 className="text-xl md:text-3xl font-black tracking-tight leading-none uppercase">
                    ViSky
                  </h1>
                  <p className="text-[7px] md:text-[10px] font-black text-white/20 tracking-[0.3em] uppercase">Global Tracking v2</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={requestNotifPermission}
                    className={`p-2.5 md:p-4 rounded-xl md:rounded-3xl border border-white/10 transition-all shadow-xl ${notifPermission === 'granted' ? 'text-green-400 bg-green-400/10' : 'text-white/40 bg-white/5'}`}
                    title="Alert Notifications"
                  >
                    {notifPermission === 'granted' ? <Bell className="w-5 h-5 md:w-6 md:h-6" /> : <BellOff className="w-5 h-5 md:w-6 md:h-6" />}
                  </button>
                  <button 
                      onClick={startTracking}
                      className={`p-2.5 md:p-4 rounded-xl md:rounded-3xl border border-white/10 transition-all shadow-xl ${tracking ? 'text-yellow-400 bg-yellow-400/10' : 'text-white/40 bg-white/5'}`}
                      title="Track My Location"
                    >
                      <Navigation className={`w-5 h-5 md:w-6 md:h-6 rotate-45 ${tracking ? 'animate-pulse' : ''}`} />
                  </button>
                </div>
              </header>

              <div className="relative group">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    placeholder="Search any city..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => searchQuery.length >= 3 && setShowSuggestions(true)}
                    className="w-full bg-white/5 backdrop-blur-3xl border border-white/10 rounded-2xl md:rounded-[2rem] py-3.5 md:py-4.5 px-6 md:px-8 pl-13 md:pl-15 focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all placeholder:text-white/20 text-sm md:text-lg font-bold shadow-2xl"
                  />
                  <Search className="absolute left-5 md:left-6 top-1/2 -translate-y-1/2 text-white/30 w-5 h-5 md:w-6 md:h-6" />
                </form>
                
                <AnimatePresence>
                  {showSuggestions && suggestions.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 right-0 mt-4 bg-[#1A1147]/95 backdrop-blur-[40px] border border-white/10 rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-[0_30px_100px_rgba(0,0,0,0.8)] z-[200]"
                    >
                      {suggestions.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => fetchWeather(`${s.lat},${s.lon}`)}
                          className="w-full px-8 md:px-10 py-5 md:py-6 text-left hover:bg-white/10 flex items-center justify-between group transition-colors"
                        >
                          <div>
                            <p className="font-black text-white group-hover:text-yellow-400 uppercase tracking-tight text-md md:text-lg">{s.name}</p>
                            <p className="text-[10px] text-white/40 font-black uppercase tracking-widest">{s.region}, {s.country}</p>
                          </div>
                          <ChevronRight className="w-5 h-5 text-white/20 group-hover:text-yellow-400 group-hover:translate-x-2 transition-all" />
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <AnimatePresence>
                {showNotifConsent && (
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="z-[250] mb-6"
                  >
                    <GlassCard className="bg-yellow-400/10 border-yellow-400/20 p-4 md:p-6 flex flex-col md:flex-row items-center gap-4">
                      <div className="p-3 bg-yellow-400 rounded-2xl shadow-lg">
                        <Bell className="w-6 h-6 text-black" />
                      </div>
                      <div className="flex-1 text-center md:text-left">
                        <h4 className="text-lg font-black uppercase tracking-tight">Weather Alerts</h4>
                        <p className="text-[10px] md:text-xs font-bold text-white/60">Notify me about significant weather changes in {weather?.location.name}.</p>
                      </div>
                      <div className="flex gap-3 w-full md:w-auto">
                        <button 
                          onClick={() => setShowNotifConsent(false)}
                          className="flex-1 md:px-6 py-2 rounded-xl border border-white/10 text-xs font-black uppercase tracking-widest hover:bg-white/5"
                        >
                          Later
                        </button>
                        <button 
                          onClick={requestNotifPermission}
                          className="flex-1 md:px-6 py-2 rounded-xl bg-yellow-400 text-black text-xs font-black uppercase tracking-widest hover:scale-105 transition-transform"
                        >
                          Enable
                        </button>
                      </div>
                    </GlassCard>
                  </motion.div>
                )}
              </AnimatePresence>

              {weather && (
                <div className="space-y-6 md:space-y-12">

                  <div className="flex flex-col items-center text-center w-full">
                    <motion.div
                      animate={{ y: [0, -10, 0], scale: [1, 1.05, 1] }}
                      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                      className="relative mb-[-10px] md:mb-[-20px]"
                    >
                      <img 
                        src={weather.current.condition.icon.replace('64x64', '128x128')} 
                        alt="Icon" 
                        className="w-28 h-28 md:w-48 md:h-48 filter drop-shadow-[0_20px_40px_rgba(255,255,255,0.4)]"
                      />
                    </motion.div>
                    
                    <h2 className="text-7xl md:text-9xl font-black tracking-tighter leading-none drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
                      {Math.round(weather.current.temp_c)}<span className="text-yellow-400/80">°</span>
                    </h2>
                    
                    <div className="space-y-1 md:space-y-2 w-full">
                      <p className="text-base md:text-2xl font-black text-white/60 tracking-widest uppercase">
                        {weather.current.condition.text}
                      </p>
                      {tracking && (
                        <div className="flex items-center justify-center gap-2 text-[8px] md:text-[10px] font-black text-yellow-400 uppercase tracking-widest bg-yellow-400/10 px-3 md:px-4 py-1 rounded-full mx-auto w-fit">
                          <span className="w-1 md:w-1.5 h-1 md:h-1.5 bg-yellow-400 rounded-full animate-ping" />
                          Live Tracking
                        </div>
                      )}
                    </div>

                    <div className="flex gap-4 md:gap-6 justify-center text-[9px] md:text-sm font-black text-white/30 uppercase tracking-[0.3em] font-mono mt-3 md:mt-4">
                      <span>Max: {Math.round(weather.forecast.forecastday[0].day.maxtemp_c)}°</span>
                      <span>Min: {Math.round(weather.forecast.forecastday[0].day.mintemp_c)}°</span>
                    </div>

                    {/* Location System Track Info */}
                    <div className="w-full grid grid-cols-2 gap-3 md:gap-4 mt-6 md:mt-8">
                       <GlassCard className="flex flex-col items-center justify-center gap-1 md:gap-2 py-4 md:py-6">
                          <Wind className="w-4 h-4 md:w-6 md:h-6 text-white/20" />
                          <p className="text-[8px] md:text-[10px] font-black text-white/20 uppercase tracking-widest">Wind Speed</p>
                          <p className="text-lg md:text-2xl font-black">{Math.round(weather.current.wind_kph)} <span className="text-[10px] text-white/40">km/h</span></p>
                       </GlassCard>
                       <GlassCard className="flex flex-col items-center justify-center gap-1 md:gap-2 py-4 md:py-6">
                          <Droplets className="w-4 h-4 md:w-6 md:h-6 text-white/20" />
                          <p className="text-[8px] md:text-[10px] font-black text-white/20 uppercase tracking-widest">Humidity</p>
                          <p className="text-lg md:text-2xl font-black">{weather.current.humidity}%</p>
                       </GlassCard>
                    </div>

                    {/* Interactive Temperature Chart */}
                    <div className="w-full space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-[10px] md:text-[11px] font-black uppercase tracking-[0.4em] text-white/40">Temperature Analysis</h3>
                        <LineChartIcon className="w-4 h-4 text-white/20" />
                      </div>
                      <GlassCard className="py-2 px-0 bg-white/[0.02]">
                        <TemperatureChart data={weather.forecast.forecastday[0].hour} type="hourly" />
                      </GlassCard>
                    </div>
                  </div>

                  {/* Hourly List */}
                  <div className="flex gap-3 md:gap-4 overflow-x-auto pb-4 md:pb-6 no-scrollbar px-2">
                    {weather.forecast.forecastday[0].hour.filter((_, i) => i % 3 === 0).map((h, i) => (
                      <div key={i} className="flex-shrink-0 w-24 md:w-28 py-6 md:py-8 bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl flex flex-col items-center gap-4 md:gap-6 hover:bg-white/10 transition-all">
                        <span className="text-[9px] md:text-[10px] font-black uppercase text-white/30 tracking-widest">{new Date(h.time).getHours()}:00</span>
                        <img src={h.condition.icon} alt="h" className="w-10 h-10 md:w-12 md:h-12" />
                        <span className="text-lg md:text-xl font-black">{Math.round(h.temp_c)}°</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right/Third Column: Details (Like screenshot right panel) */}
            <div className="flex-1 w-full space-y-6 md:space-y-10 md:pt-4 px-2 md:px-0">
              {weather && (
                <>
                  <div className="space-y-1 text-center md:text-left">
                    <h2 className="text-2xl md:text-4xl font-black truncate tracking-tighter">{weather.location.name}</h2>
                    <p className="text-xs md:text-sm font-black text-white/30 tracking-[0.3em] uppercase">{weather.location.country}</p>
                  </div>

                  {/* 7 Day Forecast Pills */}
                  <section className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                       <h3 className="text-[8px] md:text-[11px] font-black uppercase tracking-[0.4em] text-white/40">7-Day Forecast</h3>
                    </div>
                    <div className="flex gap-2 md:gap-4 overflow-x-auto pb-4 no-scrollbar px-1">
                      {weather.forecast.forecastday.map((d, i) => (
                        <motion.div 
                          key={i} 
                          whileHover={{ y: -5 }}
                          className="flex-shrink-0 w-20 md:w-26 py-6 md:py-10 bg-white/5 border border-white/10 rounded-xl md:rounded-[3rem] flex flex-col items-center gap-3 md:gap-6 hover:bg-white/15 transition-all shadow-xl"
                        >
                          <span className="text-base md:text-xl font-black">{Math.round(d.day.maxtemp_c)}°</span>
                          <img src={d.day.condition.icon} alt="day" className="w-10 h-10 md:w-14 md:h-14" />
                          <span className="text-[8px] md:text-xs font-black uppercase tracking-widest text-white/30">
                            {new Date(d.date).toLocaleDateString([], { weekday: 'short' })}
                          </span>
                        </motion.div>
                      ))}
                    </div>
                  </section>

                  {/* Detailed Stats Cards */}
                  <section className="grid grid-cols-2 gap-4 md:gap-6">
                    {/* Air Quality Card */}
                    <GlassCard className="col-span-2 group cursor-pointer hover:bg-white/10 transition-all p-4 md:p-8">
                      <div className="flex items-center gap-4 md:gap-6">
                        <div className="p-2.5 md:p-4 bg-yellow-400 rounded-xl md:rounded-[2rem] shadow-[0_10px_30px_rgba(250,204,21,0.3)]">
                          <Wind className="w-5 h-5 md:w-8 md:h-8 text-black" />
                        </div>
                        <div className="flex-1">
                          <p className="text-[7px] md:text-[10px] font-black uppercase text-white/20 tracking-widest mb-0.5 md:mb-1">Air Quality</p>
                          <h4 className={`text-lg md:text-2xl font-black flex items-center gap-2 ${getAQILevel(weather.current.air_quality["us-epa-index"]).color}`}>
                            {getAQILevel(weather.current.air_quality["us-epa-index"]).label}
                          </h4>
                        </div>
                      </div>
                    </GlassCard>

                    {/* Sunrise & UV */}
                    <GlassCard className="flex flex-col justify-between aspect-square p-4 md:p-8">
                       <Sunrise className="text-yellow-400 w-6 h-6 md:w-10 md:h-10" />
                       <div className="space-y-0.5 md:space-y-1">
                          <p className="text-[7px] md:text-[10px] font-black uppercase text-white/20 tracking-widest">Sunrise</p>
                          <h4 className="text-base md:text-2xl font-black tracking-tight">{weather.forecast.forecastday[0].astro.sunrise}</h4>
                       </div>
                    </GlassCard>

                    <GlassCard className="flex flex-col justify-between aspect-square p-4 md:p-8">
                       <Sun className="text-orange-400 w-6 h-6 md:w-10 md:h-10" strokeWidth={3} />
                       <div className="space-y-0.5 md:space-y-1">
                          <p className="text-[7px] md:text-[10px] font-black uppercase text-white/20 tracking-widest">UV Index</p>
                          <h4 className="text-2xl md:text-4xl font-black">{weather.current.uv}</h4>
                       </div>
                    </GlassCard>

                    {/* Global Snapshots */}
                    <div className="col-span-2 space-y-4 md:space-y-6 pt-2 md:pt-4">
                      <h3 className="text-[9px] md:text-[11px] font-black uppercase tracking-[0.4em] text-white/40 px-1">Global Snapshots</h3>
                      <div className="grid grid-cols-2 gap-3 md:gap-4">
                        {worldHighlights.map((w, i) => (
                          <motion.button
                            key={i}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              fetchWeather(w.location.name);
                              fetchNews(w.location.name, w.location.country);
                            }}
                            className="bg-white/5 border border-white/5 rounded-xl md:rounded-[2.5rem] p-3.5 md:p-6 text-left hover:bg-white/10 transition-all shadow-xl group w-full"
                          >
                            <div className="flex justify-between items-start mb-2 md:mb-4">
                              <span className="text-[7px] md:text-[9px] font-black uppercase tracking-[0.2em] text-white/20 truncate">{w.location.name}</span>
                              <img src={w.current.condition.icon} alt="i" className="w-5 h-5 md:w-8 md:h-8 group-hover:scale-110 transition-transform" />
                            </div>
                            <p className="text-lg md:text-2xl font-black tracking-tighter">{Math.round(w.current.temp_c)}<span className="text-yellow-400/40">°</span></p>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  </section>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* News Section */}
      {view === "app" && weather && (
        <motion.section 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto mt-12 px-2 md:px-0 mb-24"
        >
          <div className="md:flex items-end justify-between mb-12 gap-8 space-y-6 md:space-y-0">
            <div className="space-y-1">
              <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight">
                {newsScope === "global" ? "Global Weather Intel" : newsScope === "country" ? "National Weather Intel" : "Weather Intelligence"}
              </h3>
              <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em]">
                {newsScope === "global" 
                  ? "Atmospheric highlights from around the world" 
                  : newsScope === "country" 
                    ? `Regional updates for ${weather.location.country}`
                    : `Recent local updates for ${weather.location.name}`}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              {/* Category Filter */}
              <div className="relative group">
                <select 
                  value={newsCategory}
                  onChange={(e) => setNewsCategory(e.target.value)}
                  className="appearance-none bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 pr-10 text-[10px] font-black uppercase tracking-widest outline-none focus:border-yellow-400/50 transition-all cursor-pointer hover:bg-white/10"
                >
                  <option value="weather">All Weather Events</option>
                  <option value="storm">Storms & Extreme Events</option>
                  <option value="temperature">Thermal Intelligence</option>
                  <option value="climate change">Climate & Environment</option>
                  <option value="flood">Hydrological Shifts</option>
                  <option value="wildfire">Ecological Fire Alerts</option>
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-white/20">
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>

              {/* Date Filters */}
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2 hover:bg-white/10 transition-all group focus-within:border-yellow-400/50">
                <Calendar className="w-4 h-4 text-white/20 group-hover:text-yellow-400 transition-colors" />
                <input 
                  type="date"
                  value={newsFrom}
                  onChange={(e) => setNewsFrom(e.target.value)}
                  className="bg-transparent border-none outline-none text-[10px] font-black uppercase tracking-widest text-white/60 [color-scheme:dark]"
                  placeholder="From"
                />
                <span className="text-white/20 text-[10px] font-black uppercase tracking-widest">To</span>
                <input 
                  type="date"
                  value={newsTo}
                  onChange={(e) => setNewsTo(e.target.value)}
                  className="bg-transparent border-none outline-none text-[10px] font-black uppercase tracking-widest text-white/60 [color-scheme:dark]"
                  placeholder="To"
                />
              </div>

              {loadingNews && (
                <div className="w-5 h-5 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
              )}

              {(newsCategory !== "weather" || newsFrom || newsTo) && (
                <button 
                  onClick={() => {
                    setNewsCategory("weather");
                    setNewsFrom("");
                    setNewsTo("");
                  }}
                  className="p-2.5 bg-red-400/10 border border-red-400/20 rounded-xl text-red-100 hover:bg-red-400/20 transition-all group"
                  title="Reset Filters"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {newsError ? (
              <div className="col-span-full py-12 px-8 text-center bg-red-500/5 border border-red-500/20 rounded-[3rem]">
                <div className="mb-4 inline-block p-4 bg-red-500/10 rounded-full">
                  <BellOff className="w-8 h-8 text-red-500/40" />
                </div>
                <h4 className="text-sm font-black uppercase tracking-widest text-red-500/60 mb-2">News Sync Interrupted</h4>
                <p className="text-xs text-white/40 max-w-md mx-auto">{newsError}</p>
              </div>
            ) : loadingNews ? (
              // Skeleton Loaders
              [...Array(3)].map((_, i) => (
                <div key={i} className="h-[400px] bg-white/5 rounded-[2rem] animate-pulse border border-white/5" />
              ))
            ) : news.length > 0 ? (
              news.map((item, idx) => (
                <motion.a
                  key={idx}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="group block"
                >
                  <GlassCard className="h-full p-0 overflow-hidden md:rounded-[2rem] hover:bg-white/10 transition-all border-white/10">
                    <div className="relative aspect-video">
                      <img 
                        src={item.image || "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?auto=format&fit=crop&q=80&w=1000"} 
                        alt="News" 
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      <span className="absolute bottom-4 left-6 text-[10px] font-black uppercase tracking-widest text-yellow-400 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                        {item.source.name}
                      </span>
                    </div>
                    <div className="p-6 md:p-8 space-y-4">
                      <h4 className="text-lg font-black line-clamp-2 leading-tight group-hover:text-yellow-400 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs font-medium text-white/40 line-clamp-3 leading-relaxed">
                        {item.description}
                      </p>
                      <div className="pt-2 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/20">
                        <span>{new Date(item.publishedAt).toLocaleDateString()}</span>
                        <div className="w-1 h-1 bg-white/20 rounded-full" />
                        <span className="text-yellow-400/30">Verified Intel</span>
                      </div>
                    </div>
                  </GlassCard>
                </motion.a>
              ))
            ) : (
              <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-[3rem] bg-white/5">
                <div className="mb-4 inline-block p-4 bg-white/5 rounded-full">
                  <Wind className="w-8 h-8 text-white/10" />
                </div>
                <p className="text-white/20 font-black uppercase tracking-widest text-xs">No recent meteorological highlights for this area</p>
                <p className="text-white/10 text-[9px] uppercase tracking-widest mt-2 font-bold">Only weather-centric intelligence is permitted on this channel</p>
              </div>
            )}
          </div>
        </motion.section>
      )}

      <footer className="text-center opacity-30 mt-12 pb-12 select-none">
         <p className="text-[9px] font-black uppercase tracking-[1em] mb-2 text-white/40">Aura Virtual Engine • Infinite Atmosphere</p>
         <p className="text-[10px] font-black uppercase tracking-[0.3em] text-yellow-400/60">Developed by VISHAL DHULE</p>
      </footer>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Space+Grotesk:wght@300;400;500;600;700&display=swap');
        
        body {
          font-family: 'Plus Jakarta Sans', sans-serif;
          background-color: #110B33;
          margin: 0;
          overflow-y: auto;
        }

        h2, h4, .font-black {
          font-family: 'Space Grotesk', sans-serif;
        }

        ::placeholder {
          font-weight: 800;
          letter-spacing: -0.02em;
        }
          
        * {
          transition: border-color 0.3s ease;
        }
      `}</style>
    </div>
  );
}
