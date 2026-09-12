import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, 
  Umbrella, 
  ShieldCheck, 
  Shirt, 
  Sun,
  Moon,
  Globe, 
  Search, 
  X, 
  Check, 
  Volume2,
  VolumeX,
  Compass,
  ArrowUpRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { WeatherData } from '../types';
import { 
  ALL_WORLD_LANGUAGES, 
  WorldLanguage, 
  getSummaryLocale 
} from '../utils/summaryTranslator';

interface WeatherSimpleSummaryProps {
  weather: WeatherData;
  activeLanguage?: string;
  onLanguageChange?: (langCode: string) => void;
}

export const WeatherSimpleSummary: React.FC<WeatherSimpleSummaryProps> = ({ 
  weather,
  activeLanguage = 'en',
  onLanguageChange
}) => {
  const [summaryLang, setSummaryLang] = useState<string>(activeLanguage);
  const [isLangModalOpen, setIsLangModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  // Auto-sync whenever user changes app language in the settings
  useEffect(() => {
    if (activeLanguage) {
      setSummaryLang(activeLanguage);
    }
  }, [activeLanguage]);

  const current = weather.current;
  const todayForecast = weather.forecast.forecastday[0];
  const maxTemp = Math.round(todayForecast.day.maxtemp_c);
  const minTemp = Math.round(todayForecast.day.mintemp_c);
  const currentTemp = Math.round(current.temp_c);
  const rainChance = todayForecast.day.daily_chance_of_rain ?? 0;
  const uv = current.uv;
  const conditionText = current.condition.text.toLowerCase();
  const epaIndex = current.air_quality?.["us-epa-index"] ?? 1;

  // Analysis condition flags
  const isRainLikely = rainChance >= 40 || conditionText.includes('rain') || conditionText.includes('drizzle') || conditionText.includes('storm');
  const isDrizzle = rainChance >= 20 && rainChance < 40;
  const isVeryHot = maxTemp >= 36;
  const isChilly = maxTemp < 20 || minTemp <= 12;
  const isVeryCold = maxTemp <= 14 || minTemp <= 6;
  const isPleasant = maxTemp >= 20 && maxTemp < 28 && minTemp >= 14;
  const isHighUV = uv >= 6;
  const isBadAir = epaIndex >= 4;

  const locale = useMemo(() => getSummaryLocale(summaryLang), [summaryLang]);

  const currentLangInfo = useMemo(() => {
    return ALL_WORLD_LANGUAGES.find(l => l.code === summaryLang) || {
      code: summaryLang,
      name: summaryLang.toUpperCase(),
      nativeName: summaryLang.toUpperCase(),
      flag: '🌐',
      region: 'World'
    };
  }, [summaryLang]);

  const filteredLanguages = useMemo(() => {
    if (!searchQuery.trim()) return ALL_WORLD_LANGUAGES;
    const q = searchQuery.toLowerCase();
    return ALL_WORLD_LANGUAGES.filter(l => 
      l.name.toLowerCase().includes(q) ||
      l.nativeName.toLowerCase().includes(q) ||
      l.region.toLowerCase().includes(q) ||
      l.code.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const verdict = useMemo(() => {
    const v = locale.verdicts;
    if (isRainLikely) return v.rain;
    if (isVeryHot) return v.hot;
    if (isVeryCold) return v.cold;
    if (isChilly) return v.cool;
    if (isPleasant) return v.pleasant;
    return v.normal;
  }, [locale, isRainLikely, isVeryHot, isVeryCold, isChilly, isPleasant]);

  const deciders = useMemo(() => {
    const d = locale.deciders;

    // 1. Umbrella
    const umbrellaAnswer = isRainLikely 
      ? d.umbrella.yes 
      : isDrizzle 
      ? d.umbrella.maybe 
      : d.umbrella.no;
    const umbrellaNote = isRainLikely 
      ? `${rainChance}% ${d.umbrella.rainChanceSuffix}` 
      : d.umbrella.clearSky;

    // 2. Clothes
    const clothesAnswer = (isVeryCold || isChilly)
      ? d.clothes.warm
      : isVeryHot
      ? d.clothes.light
      : d.clothes.casual;
    const clothesNote = `${minTemp}°C - ${maxTemp}°C`;

    // 3. Going Outside
    const outsideAnswer = isRainLikely
      ? d.outside.checkRain
      : isVeryHot
      ? d.outside.avoidSun
      : isBadAir
      ? d.outside.wearMask
      : d.outside.great;
    const outsideNote = isHighUV ? d.outside.highUv : d.outside.fairAir;

    // 4. Air Quality
    const airAnswer = epaIndex <= 2
      ? d.air.clean
      : epaIndex === 3
      ? d.air.moderate
      : d.air.polluted;
    const airNote = epaIndex <= 2 ? d.air.safeBreathe : d.air.takePrecautions;

    return [
      {
        icon: Umbrella,
        color: isRainLikely 
          ? "text-sky-300 bg-sky-500/15 border-sky-400/25" 
          : "text-emerald-300 bg-emerald-500/15 border-emerald-400/25",
        title: d.umbrella.title,
        answer: umbrellaAnswer,
        note: umbrellaNote
      },
      {
        icon: Shirt,
        color: "text-amber-300 bg-amber-500/15 border-amber-400/25",
        title: d.clothes.title,
        answer: clothesAnswer,
        note: clothesNote
      },
      {
        icon: Compass,
        color: "text-cyan-300 bg-cyan-500/15 border-cyan-400/25",
        title: d.outside.title,
        answer: outsideAnswer,
        note: outsideNote
      },
      {
        icon: ShieldCheck,
        color: isBadAir 
          ? "text-rose-300 bg-rose-500/15 border-rose-400/25" 
          : "text-emerald-300 bg-emerald-500/15 border-emerald-400/25",
        title: d.air.title,
        answer: airAnswer,
        note: airNote
      }
    ];
  }, [locale, isRainLikely, isDrizzle, isVeryHot, isVeryCold, isChilly, isBadAir, isHighUV, rainChance, minTemp, maxTemp, epaIndex]);

  // Read Aloud / Text-to-Speech
  const handleSpeakBriefing = () => {
    if (!('speechSynthesis' in window)) return;

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    const textToRead = `${verdict.title}. ${verdict.subtitle}. ${deciders.map(d => `${d.title}: ${d.answer}`).join('. ')}`;
    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = summaryLang === 'hi' ? 'hi-IN' : summaryLang === 'mr' ? 'mr-IN' : 'en-US';
    utterance.rate = 0.95;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
  };

  const handleSelectLanguage = (code: string) => {
    setSummaryLang(code);
    setIsLangModalOpen(false);
    if (onLanguageChange) {
      onLanguageChange(code);
    }
  };

  return (
    <motion.div 
      id="weather-simple-summary-box"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-slate-900/90 via-[#0a1b38]/85 to-[#061228]/95 border border-white/[0.13] p-4 sm:p-5 shadow-[0_8px_32px_rgba(0,0,0,0.45)] backdrop-blur-md my-3 sm:my-4 transition-all"
    >
      {/* Top Animated Glowing Accent Line */}
      <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-sky-400/80 to-transparent overflow-hidden z-20">
        <div className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-amber-300 to-transparent anim-beam" />
      </div>

      {/* Top Center Glow Flare */}
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-48 h-12 bg-sky-400/25 blur-xl rounded-full pointer-events-none anim-pulse-glow" />

      {/* Subtle Background Lighting Accent (CSS, zero lag) */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header Bar */}
      <div className="flex items-center justify-between gap-2.5 pb-3 border-b border-white/[0.08] relative z-10">
        <div className="flex items-center gap-2.5">
          {/* Animated subtle sparkling icon */}
          <div className="relative flex items-center justify-center">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500/20 to-amber-400/20 border border-sky-400/30 flex items-center justify-center text-amber-300 shadow-sm">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-bold text-white tracking-tight">
                {locale.headerTitle || "Today's Briefing"}
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-sky-400/15 text-sky-200 text-[10px] font-semibold border border-sky-400/25 tracking-wide">
                {verdict.badge}
              </span>
            </div>
            <p className="text-[11px] text-sky-200/60">
              Personalized overview for {weather.location.name}
            </p>
          </div>
        </div>

        {/* Action Controls: Audio Readout & Language Pill */}
        <div className="flex items-center gap-1.5">
          {/* Audio Speech Button */}
          {'speechSynthesis' in window && (
            <button
              type="button"
              onClick={handleSpeakBriefing}
              className={`p-2 rounded-xl border text-xs transition-all active:scale-95 flex items-center gap-1 ${
                isSpeaking 
                  ? 'bg-amber-400/20 border-amber-400/50 text-amber-300 animate-pulse' 
                  : 'bg-white/[0.06] hover:bg-white/[0.12] border-white/10 text-white/70 hover:text-white'
              }`}
              title={isSpeaking ? "Stop listening" : "Listen to weather summary"}
            >
              {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline text-[11px] font-medium">
                {isSpeaking ? "Stop" : "Listen"}
              </span>
            </button>
          )}

          {/* Language Selector Pill */}
          <button
            type="button"
            onClick={() => setIsLangModalOpen(true)}
            className="px-2.5 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-xs font-medium text-sky-200 hover:text-white transition-all flex items-center gap-1.5 active:scale-95 shadow-sm"
            title="Change language"
          >
            <Globe className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-[11px] font-semibold">
              {currentLangInfo.nativeName}
            </span>
          </button>
        </div>
      </div>

      {/* Main Verdict Card */}
      <div className="mt-3 p-3.5 rounded-2xl bg-white/[0.04] border border-white/[0.08] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
        <div className="space-y-1">
          <h4 className="text-sm sm:text-base font-bold text-amber-300 tracking-tight flex items-center gap-2">
            <span>{verdict.title}</span>
          </h4>
          <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
            {verdict.subtitle}
          </p>
        </div>

        <div className="shrink-0 px-3 py-1.5 rounded-xl bg-white/[0.06] border border-white/10 text-white text-xs font-semibold flex items-center gap-2 self-start sm:self-auto">
          <span className="text-sky-200">{weather.location.name}</span>
          <span className="text-white/30">•</span>
          <span className="text-amber-300 font-bold">{currentTemp}°C</span>
        </div>
      </div>

      {/* 4 Aesthetic Lifestyle Deciders (Umbrella, Outfit, Outdoors, Air) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 mt-3">
        {deciders.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div 
              key={idx}
              className="p-3 rounded-2xl bg-white/[0.035] hover:bg-white/[0.07] border border-white/[0.08] flex flex-col justify-between transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] group"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10.5px] font-medium text-sky-200/70 group-hover:text-sky-200 transition-colors">
                  {item.title}
                </span>
                <div className={`p-1.5 rounded-lg border ${item.color} transition-colors`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-white leading-snug">
                  {item.answer}
                </p>
                <p className="text-[10px] text-white/50 mt-0.5 truncate font-medium">
                  {item.note}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Temperature & Timing Quick Glance Footer */}
      <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between text-xs text-sky-200/70">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 text-white/80">
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[11px]">
              <strong className="text-white font-semibold">{locale.timing.dayLabel}</strong> {maxTemp}°C
            </span>
          </div>
          <div className="flex items-center gap-1 text-white/80">
            <Moon className="w-3.5 h-3.5 text-sky-400" />
            <span className="text-[11px]">
              <strong className="text-white font-semibold">{locale.timing.nightLabel}</strong> {minTemp}°C
            </span>
          </div>
        </div>

        <span className="text-[10px] text-white/40 font-mono">
          Updated live
        </span>
      </div>

      {/* LANGUAGE SELECTOR MODAL */}
      <AnimatePresence>
        {isLangModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-lg bg-[#0b1c3d]/98 border border-sky-400/25 rounded-3xl p-5 shadow-[0_20px_60px_rgba(2,12,38,0.8)] text-white overflow-hidden max-h-[85vh] flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-sky-400/20 border border-sky-400/30 flex items-center justify-center text-sky-300">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Select Language</h3>
                    <p className="text-xs text-sky-200/60">
                      Choose any regional or international language
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsLangModalOpen(false)}
                  className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Search Bar */}
              <div className="relative mb-3 shrink-0">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search language / भाषा खोजें (e.g. Hindi, French, தமிழ்)..."
                  className="w-full bg-white/[0.07] border border-white/15 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none focus:border-sky-400/50"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Languages List */}
              <div className="overflow-y-auto space-y-1.5 pr-1 max-h-[50vh] no-scrollbar">
                {filteredLanguages.length === 0 ? (
                  <div className="text-center py-8 text-white/50 text-xs">
                    No languages found matching "{searchQuery}"
                  </div>
                ) : (
                  filteredLanguages.map((lang: WorldLanguage) => {
                    const isSelected = summaryLang === lang.code;
                    return (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => handleSelectLanguage(lang.code)}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl border transition-all text-left ${
                          isSelected
                            ? 'bg-sky-500/20 border-sky-400/60 text-white shadow-sm'
                            : 'bg-white/[0.04] border-white/10 hover:bg-white/[0.08] text-white/90'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-lg shrink-0">{lang.flag}</span>
                          <div>
                            <span className="text-xs sm:text-sm font-semibold text-white">
                              {lang.nativeName}
                            </span>
                            <span className="text-[11px] text-sky-200/60 ml-2">
                              ({lang.name})
                            </span>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-sky-400 flex items-center justify-center text-slate-950 shrink-0">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
