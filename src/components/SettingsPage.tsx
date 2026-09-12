import React, { useState } from 'react';
import { 
  Globe, 
  Check, 
  Settings as SettingsIcon, 
  RotateCcw,
  Sun,
  Moon,
  Thermometer,
  Wind,
  Search,
  MapPin,
  Bell,
  Sparkles,
  Info,
  Layers
} from 'lucide-react';
import { motion } from 'motion/react';
import { GlassCard } from './GlassCard';
import { 
  LanguageCode, 
  AVAILABLE_LANGUAGES, 
  TranslationStrings 
} from '../utils/translations';

interface SettingsPageProps {
  currentLanguage: LanguageCode;
  onSelectLanguage: (lang: LanguageCode) => void;
  unit: 'C' | 'F';
  onToggleUnit: (unit: 'C' | 'F') => void;
  skyTheme: 'blue-sky' | 'deep-indigo';
  onToggleTheme: (theme: 'blue-sky' | 'deep-indigo') => void;
  t: TranslationStrings;
  defaultCity?: string;
  onSelectDefaultCity?: (cityName: string) => void;
  onResetAll?: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({
  currentLanguage,
  onSelectLanguage,
  unit,
  onToggleUnit,
  skyTheme,
  onToggleTheme,
  t,
  defaultCity = "New Delhi",
  onSelectDefaultCity,
  onResetAll
}) => {
  const [langSearch, setLangSearch] = useState('');
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [briefingAlert, setBriefingAlert] = useState(true);

  const filteredLanguages = AVAILABLE_LANGUAGES.filter(lang => 
    lang.name.toLowerCase().includes(langSearch.toLowerCase()) ||
    lang.nativeName.toLowerCase().includes(langSearch.toLowerCase()) ||
    lang.code.toLowerCase().includes(langSearch.toLowerCase())
  );

  const isBlueSky = skyTheme === 'blue-sky';

  return (
    <motion.div
      id="settings-page-root"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -14 }}
      transition={{ duration: 0.22 }}
      className="space-y-4 max-w-4xl mx-auto pb-10"
    >
      {/* Page Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-amber-400/20 to-sky-400/20 border border-amber-400/30 flex items-center justify-center text-amber-300 shadow-md">
            <SettingsIcon className="w-4.5 h-4.5" />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              {t.settingsTitle || "Settings & Preferences"}
            </h2>
            <p className="text-xs text-sky-200/60">
              Customize units, themes, languages, and notification preferences
            </p>
          </div>
        </div>

        {onResetAll && (
          <button
            type="button"
            onClick={onResetAll}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/15 text-xs text-amber-300 font-medium transition-colors"
            title="Reset settings to defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Defaults</span>
          </button>
        )}
      </div>

      {/* Grid of Settings Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 sm:gap-4">
        {/* Module 1: Measurement Units */}
        <GlassCard className="space-y-3.5">
          <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2">
            <Thermometer className="w-4 h-4 text-amber-400" />
            <span>Measurement Units</span>
          </div>

          <div className="space-y-3">
            {/* Temperature Unit */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-semibold text-white">Temperature Unit</p>
                <p className="text-[11px] text-sky-200/60">Choose between Celsius or Fahrenheit</p>
              </div>
              <div className="flex items-center bg-black/40 p-1 rounded-xl border border-white/10">
                <button
                  type="button"
                  onClick={() => onToggleUnit('C')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    unit === 'C'
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  °C
                </button>
                <button
                  type="button"
                  onClick={() => onToggleUnit('F')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    unit === 'F'
                      ? 'bg-amber-400 text-slate-950 shadow-sm'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  °F
                </button>
              </div>
            </div>

            {/* Wind speed display preview */}
            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <div>
                <p className="text-xs sm:text-sm font-semibold text-white">Wind Speed</p>
                <p className="text-[11px] text-sky-200/60">Metric km/h standard</p>
              </div>
              <span className="text-xs font-mono text-amber-300 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
                km/h
              </span>
            </div>
          </div>
        </GlassCard>

        {/* Module 2: Visual Theme */}
        <GlassCard className="space-y-3.5">
          <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2">
            <PaletteIcon className="w-4 h-4 text-sky-400" />
            <span>Atmosphere & Theme</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {/* Blue Sky / Morning Theme Card */}
            <button
              type="button"
              onClick={() => onToggleTheme('blue-sky')}
              className={`p-3 rounded-2xl border text-left transition-all active:scale-95 flex flex-col justify-between min-h-[95px] ${
                isBlueSky
                  ? 'bg-amber-400/20 border-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.3)] ring-1 ring-amber-300/50'
                  : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="w-7 h-7 rounded-xl bg-amber-400/25 border border-amber-400/40 flex items-center justify-center text-amber-300">
                  <Sun className="w-3.5 h-3.5" />
                </div>
                {isBlueSky && <Check className="w-4 h-4 text-amber-300" />}
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-white">Morning Sky</p>
                <p className="text-[10px] text-amber-200/70">Sunlit Blue & Fluffy Clouds</p>
              </div>
            </button>

            {/* Dark Neon Theme Card */}
            <button
              type="button"
              onClick={() => onToggleTheme('deep-indigo')}
              className={`p-3 rounded-2xl border text-left transition-all active:scale-95 flex flex-col justify-between min-h-[95px] ${
                !isBlueSky
                  ? 'bg-cyan-500/20 border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.35)] ring-1 ring-cyan-400/50'
                  : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="w-7 h-7 rounded-xl bg-cyan-400/25 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                  <Moon className="w-3.5 h-3.5" />
                </div>
                {!isBlueSky && <Check className="w-4 h-4 text-cyan-300" />}
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-white">Dark Neon</p>
                <p className="text-[10px] text-cyan-200/70">Midnight Obsidian & Cyber Neon</p>
              </div>
            </button>
          </div>
        </GlassCard>

        {/* Module 3: Notifications & Forecast Briefing */}
        <GlassCard className="space-y-3.5">
          <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2">
            <Bell className="w-4 h-4 text-amber-400" />
            <span>Alerts & Notifications</span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm font-semibold text-white">Severe Weather Alerts</p>
                <p className="text-[11px] text-sky-200/60">High wind, storm and heat warnings</p>
              </div>
              <button
                type="button"
                onClick={() => setAlertsEnabled(!alertsEnabled)}
                className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                  alertsEnabled ? 'bg-emerald-400' : 'bg-white/20'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-slate-950 transition-transform ${
                  alertsEnabled ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <div>
                <p className="text-xs sm:text-sm font-semibold text-white">Daily Morning Summary</p>
                <p className="text-[11px] text-sky-200/60">Quick briefing on outfit & rain probability</p>
              </div>
              <button
                type="button"
                onClick={() => setBriefingAlert(!briefingAlert)}
                className={`w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 ${
                  briefingAlert ? 'bg-emerald-400' : 'bg-white/20'
                }`}
              >
                <div className={`w-5 h-5 rounded-full bg-slate-950 transition-transform ${
                  briefingAlert ? 'translate-x-5' : 'translate-x-0'
                }`} />
              </button>
            </div>
          </div>
        </GlassCard>

        {/* Module 4: Default Location */}
        <GlassCard className="space-y-3.5">
          <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider border-b border-white/10 pb-2">
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>Default Starting Location</span>
          </div>

          <p className="text-xs text-sky-200/70">
            Current startup city: <strong className="text-white">{defaultCity}</strong>
          </p>

          <div className="grid grid-cols-2 gap-2">
            {['New Delhi', 'Mumbai', 'Bengaluru', 'London'].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => onSelectDefaultCity && onSelectDefaultCity(c)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold text-left border transition-all ${
                  defaultCity.toLowerCase() === c.toLowerCase()
                    ? 'bg-amber-400/20 border-amber-400/50 text-amber-300'
                    : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </GlassCard>
      </div>

      {/* Module 5: Application Language Selector */}
      <GlassCard className="space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2.5">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-sky-400" />
            <div>
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                {t.languageLabel || "Application Language"}
              </span>
              <span className="text-[11px] text-sky-200/60">
                Select your preferred language (भारतीय भाषाएं & Global)
              </span>
            </div>
          </div>

          {/* Language Search */}
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40" />
            <input
              type="text"
              placeholder="Search language / भाषा खोजें..."
              value={langSearch}
              onChange={(e) => setLangSearch(e.target.value)}
              className="w-full bg-white/[0.07] border border-white/15 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-white/40 focus:outline-none focus:border-amber-400/50"
            />
          </div>
        </div>

        {/* Language Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-72 overflow-y-auto pr-1 no-scrollbar">
          {filteredLanguages.map((lang) => {
            const isSelected = currentLanguage === lang.code;
            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => onSelectLanguage(lang.code)}
                className={`p-2.5 rounded-xl border text-left transition-all active:scale-95 flex items-center justify-between group ${
                  isSelected
                    ? 'bg-amber-400/20 border-amber-400/50 shadow-[0_0_12px_rgba(251,191,36,0.2)] text-amber-300'
                    : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 text-white'
                }`}
              >
                <div className="min-w-0">
                  <p className="font-bold text-xs truncate group-hover:text-amber-300 transition-colors">
                    {lang.nativeName}
                  </p>
                  <p className="text-[10px] text-sky-200/50 truncate">
                    {lang.name}
                  </p>
                </div>
                {isSelected && (
                  <Check className="w-4 h-4 text-amber-400 shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </GlassCard>

      {/* Module 6: App Info & Credits */}
      <GlassCard className="p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-sky-200/70">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center text-white/80 shrink-0">
            <Info className="w-4 h-4" />
          </div>
          <div>
            <p className="font-semibold text-white">Indra Weather • Version 2.4</p>
            <p className="text-[10px] text-sky-200/50">Universal Micro-City Weather Engine & 60fps Mobile Performance</p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[11px] text-white/50">
          <span>Realtime Weather API</span>
          <span>•</span>
          <span>D3 Climatology</span>
        </div>
      </GlassCard>
    </motion.div>
  );
};

// Helper internal icon
const PaletteIcon: React.FC<{ className?: string }> = ({ className }) => (
  <Layers className={className} />
);
