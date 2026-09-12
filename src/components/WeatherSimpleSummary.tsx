import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, 
  Umbrella, 
  ShieldCheck, 
  Coffee, 
  Clock, 
  Compass,
  Globe,
  Search,
  X,
  Check,
  RotateCcw
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
  // State for summary language - starts with active app language
  const [summaryLang, setSummaryLang] = useState<string>(activeLanguage);
  const [isLangModalOpen, setIsLangModalOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Auto-sync whenever user changes app language in the app settings or header
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
  const windKph = Math.round(current.wind_kph);
  const uv = current.uv;
  const conditionText = current.condition.text.toLowerCase();
  const epaIndex = current.air_quality?.["us-epa-index"] ?? 1;

  // Analysis condition flags
  const isRainLikely = rainChance >= 40 || conditionText.includes('rain') || conditionText.includes('drizzle') || conditionText.includes('thunder') || conditionText.includes('storm');
  const isDrizzle = rainChance >= 20 && rainChance < 40;
  const isVeryHot = maxTemp >= 36;
  const isChilly = maxTemp < 20 || minTemp <= 12;
  const isVeryCold = maxTemp <= 14 || minTemp <= 6;
  const isPleasant = maxTemp >= 20 && maxTemp < 28 && minTemp >= 14;
  const isHighUV = uv >= 6;
  const isBadAir = epaIndex >= 4;

  // Retrieve locale data for selected language (or fallback safely)
  const locale = useMemo(() => getSummaryLocale(summaryLang), [summaryLang]);

  // Current active language info
  const currentLangInfo = useMemo(() => {
    return ALL_WORLD_LANGUAGES.find(l => l.code === summaryLang) || {
      code: summaryLang,
      name: summaryLang.toUpperCase(),
      nativeName: summaryLang.toUpperCase(),
      flag: '🌐',
      region: 'World'
    };
  }, [summaryLang]);

  // Filter languages for modal search
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

  // Determine current verdict
  const verdict = useMemo(() => {
    const v = locale.verdicts;
    if (isRainLikely) return v.rain;
    if (isVeryHot) return v.hot;
    if (isVeryCold) return v.cold;
    if (isChilly) return v.cool;
    if (isPleasant) return v.pleasant;
    return v.normal;
  }, [locale, isRainLikely, isVeryHot, isVeryCold, isChilly, isPleasant]);

  // Determine 4 practical deciders
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
        color: isRainLikely ? "text-amber-400 bg-amber-400/15 border-amber-400/30" : "text-emerald-400 bg-emerald-400/15 border-emerald-400/30",
        title: d.umbrella.title,
        answer: umbrellaAnswer,
        note: umbrellaNote
      },
      {
        icon: Coffee,
        color: "text-sky-400 bg-sky-400/15 border-sky-400/30",
        title: d.clothes.title,
        answer: clothesAnswer,
        note: clothesNote
      },
      {
        icon: Compass,
        color: "text-amber-300 bg-amber-400/15 border-amber-400/30",
        title: d.outside.title,
        answer: outsideAnswer,
        note: outsideNote
      },
      {
        icon: ShieldCheck,
        color: isBadAir ? "text-rose-400 bg-rose-400/15 border-rose-400/30" : "text-emerald-400 bg-emerald-400/15 border-emerald-400/30",
        title: d.air.title,
        answer: airAnswer,
        note: airNote
      }
    ];
  }, [locale, isRainLikely, isDrizzle, isVeryHot, isVeryCold, isChilly, isBadAir, isHighUV, rainChance, minTemp, maxTemp, epaIndex]);

  const appLangInfo = useMemo(() => {
    return ALL_WORLD_LANGUAGES.find(l => l.code === activeLanguage) || {
      code: activeLanguage,
      name: activeLanguage.toUpperCase(),
      nativeName: activeLanguage.toUpperCase(),
      flag: '🌐',
      region: 'World'
    };
  }, [activeLanguage]);

  const isAuto = summaryLang === activeLanguage;

  const handleSelectLanguage = (code: string) => {
    setSummaryLang(code);
    setIsLangModalOpen(false);
    if (onLanguageChange) {
      onLanguageChange(code);
    }
  };

  const handleResetToAppLang = () => {
    setSummaryLang(activeLanguage);
  };

  return (
    <div 
      id="weather-simple-summary-box"
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c2a55]/95 via-[#0e2448]/90 to-[#071733]/95 border-2 border-amber-400/40 p-5 sm:p-6 shadow-[0_10px_35px_rgba(251,191,36,0.18),0_0_20px_rgba(56,189,248,0.15)] backdrop-blur-2xl transition-all my-4"
    >
      {/* Decorative top amber glow bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_12px_#fbbf24]" />

      {/* Header with Title and Global Language Switcher */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 pb-3.5 border-b border-white/[0.12]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shadow-md shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                {locale.headerTitle}
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider border border-amber-400/30">
                {verdict.badge}
              </span>
            </div>
            <p className="text-[11px] text-sky-200/70">
              {locale.headerSubtitle}
            </p>
          </div>
        </div>

        {/* Language Controls: Auto (App Language) + All Languages Button ONLY */}
        <div className="flex items-center gap-1.5 self-start md:self-auto bg-black/30 p-1 rounded-xl border border-white/10 shrink-0">
          {/* 1. Auto Language Button (Auto-syncs with user app language) */}
          <button
            type="button"
            onClick={handleResetToAppLang}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
              isAuto
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-sm font-extrabold'
                : 'text-sky-200/80 hover:text-white bg-white/5 border-white/10 hover:bg-white/10'
            }`}
            title={`Auto syncs with app language (${appLangInfo.name})`}
          >
            <span className="text-[11px]">⚡</span>
            <span>Auto ({appLangInfo.nativeName})</span>
          </button>

          {/* 2. All Languages Button (Opens modal to choose any world language) */}
          <button
            type="button"
            onClick={() => setIsLangModalOpen(true)}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 border ${
              !isAuto
                ? 'bg-amber-400 text-slate-950 border-amber-300 shadow-sm font-extrabold'
                : 'text-amber-300 hover:text-amber-200 bg-amber-400/10 border-amber-400/30 hover:bg-amber-400/20'
            }`}
            title="Browse all world languages"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>
              {!isAuto ? `${currentLangInfo.flag} ${currentLangInfo.nativeName}` : 'All Languages 🌍'}
            </span>
          </button>
        </div>
      </div>

      {/* Auto-Sync status indicator if different from app language */}
      {summaryLang !== activeLanguage && (
        <div className="mt-2 flex items-center justify-between text-[11px] text-sky-200/60 bg-white/[0.03] px-3 py-1.5 rounded-xl border border-white/5">
          <span>
            Viewing in <strong>{currentLangInfo.name} ({currentLangInfo.nativeName})</strong> • App language is <strong>{activeLanguage.toUpperCase()}</strong>
          </span>
          <button
            type="button"
            onClick={handleResetToAppLang}
            className="text-amber-300 hover:text-amber-200 flex items-center gap-1 font-medium transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset to App Language</span>
          </button>
        </div>
      )}

      {/* Main Headline Verdict Card */}
      <div className="mt-3.5 p-4 rounded-2xl bg-white/[0.06] border border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <h4 className="text-base sm:text-lg font-bold text-amber-300 leading-snug">
            {verdict.title}
          </h4>
          <p className="text-xs sm:text-sm text-white/90 leading-relaxed max-w-2xl">
            {verdict.subtitle}
          </p>
        </div>
        <div className="shrink-0 px-3.5 py-2 rounded-xl bg-amber-400/15 border border-amber-400/30 text-amber-300 text-xs font-semibold flex items-center gap-2 shadow-sm">
          <span>{weather.location.name}</span>
          <span className="text-white/40">•</span>
          <span>{currentTemp}°C</span>
        </div>
      </div>

      {/* 4 Practical Daily Deciders (Umbrella, Clothes, Outside, Air) */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mt-3.5">
        {deciders.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div 
              key={idx}
              className="p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 flex flex-col justify-between transition-colors"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] font-medium text-sky-200/70">{item.title}</span>
                <div className={`p-1.5 rounded-lg border ${item.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-white leading-snug">
                  {item.answer}
                </p>
                <p className="text-[10px] text-white/50 mt-0.5 truncate">
                  {item.note}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Day & Evening Quick Timing Tip */}
      <div className="mt-3.5 pt-3 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-sky-200/80">
        <div className="flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>
            <strong className="text-white">{locale.timing.dayLabel}</strong> {maxTemp}°C •{' '}
            <strong className="text-white">{locale.timing.nightLabel}</strong> {minTemp}°C
          </span>
        </div>
        <span className="text-[10px] text-white/40 self-end sm:self-auto font-mono">
          {locale.timing.engineNote}
        </span>
      </div>

      {/* ALL WORLD LANGUAGES MODAL */}
      <AnimatePresence>
        {isLangModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-lg bg-[#0b1c3d]/98 border-2 border-amber-400/40 rounded-3xl p-5 shadow-[0_25px_70px_rgba(251,191,36,0.25)] text-white overflow-hidden max-h-[85vh] flex flex-col"
            >
              {/* Modal Glows */}
              <div className="absolute -top-16 -right-16 w-36 h-36 bg-amber-400/15 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-sky-400/15 rounded-full blur-2xl pointer-events-none" />

              {/* Modal Header */}
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10 shrink-0">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">Select Any Language (दुनिया की भाषाएं)</h3>
                    <p className="text-xs text-sky-200/70">
                      Choose any language for instant easy-to-understand weather analysis
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsLangModalOpen(false)}
                  className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
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
                  className="w-full bg-white/[0.07] border border-white/15 rounded-2xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-white/40 focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/40"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Languages List */}
              <div className="overflow-y-auto space-y-1.5 pr-1 max-h-[50vh] custom-scrollbar">
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
                        className={`w-full flex items-center justify-between p-3 rounded-2xl border transition-all text-left ${
                          isSelected
                            ? 'bg-amber-400/20 border-amber-400/60 text-white shadow-sm'
                            : 'bg-white/[0.04] border-white/10 hover:bg-white/[0.08] hover:border-white/20 text-white/90'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl shrink-0">{lang.flag}</span>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-xs sm:text-sm font-semibold text-white">
                                {lang.nativeName}
                              </span>
                              <span className="text-[11px] text-sky-200/60">
                                ({lang.name})
                              </span>
                            </div>
                            <p className="text-[10px] text-white/40">{lang.region}</p>
                          </div>
                        </div>

                        {isSelected ? (
                          <div className="w-6 h-6 rounded-full bg-amber-400 flex items-center justify-center text-slate-950 shrink-0 shadow">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        ) : (
                          <span className="text-[10px] text-white/30 uppercase font-mono">
                            {lang.code}
                          </span>
                        )}
                      </button>
                    );
                  })
                )}
              </div>

              {/* Modal Footer */}
              <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-sky-200/60 shrink-0">
                <span>{filteredLanguages.length} world languages supported</span>
                <button
                  type="button"
                  onClick={() => handleSelectLanguage(activeLanguage)}
                  className="text-amber-300 hover:text-amber-200 font-medium"
                >
                  Use App Default ({activeLanguage.toUpperCase()})
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
